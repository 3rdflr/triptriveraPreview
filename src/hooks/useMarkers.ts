'use client';

import { useEffect, useCallback, Children, isValidElement } from 'react';
import { renderToString } from 'react-dom/server';
import { geocodeAddress } from '@/app/api/geocoding';
import { MarkerProps } from '@/components/common/naverMaps/Marker';

interface UseMarkersProps {
  map: naver.maps.Map | null;
  children?: React.ReactNode;
  isReady?: boolean; // 지도와 스크립트 준비 상태
}

/**
 * 마커 생성 및 관리를 담당하는 커스텀 훅
 * - children에서 Marker 컴포넌트들을 추출
 * - 지오코딩을 통한 주소 기반 마커 생성
 * - 마커 이벤트 처리 및 정리
 */
export function useMarkers({ map, children, isReady = false }: UseMarkersProps) {
  console.log('🗺️ [MARKERS] useMarkers 호출', { map, isReady });
  // children에서 Marker 컴포넌트들 추출 (기존 로직 유지)
  const extractMarkers = useCallback(() => {
    if (!children) return [];

    return Children.toArray(children).filter((child) => {
      if (!isValidElement(child) || typeof child.type !== 'function') {
        return false;
      }
      const component = child.type as { displayName?: string };
      return component.displayName === 'Marker';
    }) as React.ReactElement<MarkerProps>[];
  }, [children]);

  // 마커 생성 및 관리
  useEffect(() => {
    if (!map || !isReady) {
      return;
    }

    const markers = extractMarkers();
    if (markers.length === 0) {
      return;
    }

    console.log('📍 [MARKERS] 마커 생성 시작', { count: markers.length });
    const naverMarkers: naver.maps.Marker[] = [];

    // 마커 생성 함수
    const createMarkers = async () => {
      try {
        // 주소 기반 마커들의 지오코딩을 병렬로 처리
        const addressMarkers = markers
          .map((markerElement, index) => ({ markerElement, index }))
          .filter(({ markerElement }) => markerElement.props.address);

        const geocodingPromises = addressMarkers.map(async ({ markerElement, index }) => {
          const { address: markerAddress } = markerElement.props;
          try {
            const coords = await geocodeAddress(markerAddress!);
            return {
              index,
              markerElement,
              position: { lat: coords.y, lng: coords.x },
              success: true,
            };
          } catch (error) {
            console.error('❌ [MARKER] 주소 지오코딩 실패', { markerAddress, error });
            return {
              index,
              markerElement,
              position: null,
              success: false,
            };
          }
        });

        // 모든 지오코딩 완료 대기
        const geocodedResults = await Promise.allSettled(geocodingPromises);

        // 모든 마커들(좌표 기반 + 지오코딩 성공한 주소 기반) 생성
        for (const [index, markerElement] of markers.entries()) {
          const {
            position,
            address: markerAddress,
            onClick,
            children: markerChildren,
            id,
          } = markerElement.props;

          let finalPosition: { lat: number; lng: number };

          if (position) {
            // 직접 좌표가 제공된 경우
            finalPosition = position;
          } else if (markerAddress) {
            // 주소 기반인 경우 - 지오코딩 결과 찾기
            type GeocodingResult = {
              index: number;
              markerElement: React.ReactElement<MarkerProps>;
              position: { lat: number; lng: number } | null;
              success: boolean;
            };

            const geocodedResult = geocodedResults
              .filter(
                (result): result is PromiseFulfilledResult<GeocodingResult> =>
                  result.status === 'fulfilled',
              )
              .map((result) => result.value)
              .find((result) => result.index === index);

            if (!geocodedResult || !geocodedResult.success || !geocodedResult.position) {
              console.warn('⚠️ [MARKER] 주소 지오코딩 실패로 마커 생성 스킵', {
                markerAddress,
                id,
              });
              continue;
            }

            finalPosition = geocodedResult.position;
          } else {
            console.warn('⚠️ [MARKER] 마커 위치 정보 없음 - position 또는 address 필요');
            continue;
          }

          // 마커 생성
          const markerPosition = new naver.maps.LatLng(finalPosition.lat, finalPosition.lng);
          let customMarker: naver.maps.Marker;

          if (markerChildren) {
            // 커스텀 UI가 있는 경우 HTML 마커로 생성
            const markerHtml = renderToString(markerChildren as React.ReactElement);
            customMarker = new naver.maps.Marker({
              position: markerPosition,
              map,
              icon: {
                content: markerHtml,
                anchor: new naver.maps.Point(16, 32), // 마커 앵커 포인트
              },
            });
          } else {
            // 기본 마커
            customMarker = new naver.maps.Marker({
              position: markerPosition,
              map,
            });
          }

          naverMarkers.push(customMarker);

          // 마커 클릭 이벤트 처리
          if (onClick) {
            naver.maps.Event.addListener(customMarker, 'click', () => {
              onClick(finalPosition);
            });
          }
        }

        console.log('✅ [MARKERS] 마커 생성 완료', { count: naverMarkers.length });
      } catch (error) {
        console.error('❌ [MARKERS] 마커 생성 중 에러 발생', error);
      }
    };

    // 마커 생성 실행
    createMarkers();

    // 클린업: 마커들 제거
    return () => {
      naverMarkers.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, [map, isReady, extractMarkers]);

  // 마커 데이터 반환 (필요한 경우 추가 기능을 위해)
  return {
    markers: extractMarkers(),
  };
}
