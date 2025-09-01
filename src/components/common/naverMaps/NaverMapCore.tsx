'use client';

import { useRef, useEffect, useState, ReactNode, Children, isValidElement } from 'react';
import { renderToString } from 'react-dom/server';
import { useGeocoding } from '@/hooks/useGeocoding';
import { geocodeAddress } from '@/app/api/geocoding';
import { MarkerProps } from './Marker';

/**
 * NaverMapCore 컴포넌트
 * - 지도 렌더링
 * - Suspense 내부에서 실행되는 핵심 컴포넌트
 *
 */

interface NaverMapCoreProps {
  /** 지도 중심점 주소 (선택적) */
  address?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 컨테이너 너비 (기본값: 100%) */
  width?: string;
  /** 컨테이너 높이 (기본값: 256px) */
  height?: string;
  /** 지도 줌 레벨 (기본값: 15) */
  zoom?: number;
  /** 커스텀 마커들 */
  children?: ReactNode;
}

export default function NaverMapCore({
  address,
  className = '',
  width = '100%',
  height = '256px',
  zoom = 15,
  children,
}: NaverMapCoreProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // children에서 Marker 컴포넌트들 추출
  const markers = Children.toArray(children).filter((child) => {
    if (!isValidElement(child) || !child.type || typeof child.type !== 'function') {
      return false;
    }
    const component = child.type as { displayName?: string };
    return component.displayName === 'Marker';
  }) as React.ReactElement<MarkerProps>[];

  // 지오코딩 데이터 가져오기 (주소 기반 중심점)
  const { data: coordinates } = useGeocoding({
    address,
    enabled: Boolean(address) && isMounted,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!mapRef.current || typeof naver === 'undefined' || !naver?.maps || !isMounted) {
      return;
    }

    const location: naver.maps.LatLng = new naver.maps.LatLng(coordinates.y, coordinates.x);
    const mapOptions = {
      center: location,
      zoom,
    };
    const map: naver.maps.Map = new naver.maps.Map(mapRef.current, mapOptions);
    const naverMarkers: naver.maps.Marker[] = [];

    // 커스텀 마커들 생성 (병렬 지오코딩으로 성능 최적화)
    const createMarkers = async () => {
      // 1단계: 주소 기반 마커들의 지오코딩을 병렬로 처리
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

      //모든 마커들(좌표 기반 + 지오코딩 성공한 주소 기반) 생성
      for (const [index, markerElement] of markers.entries()) {
        const {
          position,
          address: markerAddress,
          onClick,
          children: markerChildren,
          id,
        } = markerElement.props;

        let markerPosition: naver.maps.LatLng;
        let finalPosition: { lat: number; lng: number };

        if (position) {
          // 직접 좌표가 제공된 경우
          markerPosition = new naver.maps.LatLng(position.lat, position.lng);
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
            console.warn('⚠️ [MARKER] 주소 지오코딩 실패로 마커 생성 스킵', { markerAddress, id });
            continue;
          }

          markerPosition = new naver.maps.LatLng(
            geocodedResult.position.lat,
            geocodedResult.position.lng,
          );
          finalPosition = geocodedResult.position;
        } else {
          console.warn('⚠️ [MARKER] 마커 위치 정보 없음 - position 또는 address 필요');
          continue;
        }

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
    };

    // 마커 생성 실행 (useEffect에서 안전한 비동기 패턴)
    let cancelled = false;

    createMarkers().catch((error) => {
      if (!cancelled) {
        console.error('❌ [MAP] 마커 생성 중 에러 발생', error);
      }
    });

    // 클린업 시 취소 플래그 설정
    return () => {
      cancelled = true;
      console.log('🧹 [MAP] 지도 인스턴스 정리');

      // 모든 마커들 정리
      naverMarkers.forEach((marker) => {
        marker.setMap(null);
      });

      if (map) {
        map.destroy();
      }
    };
  }, [coordinates, zoom, address, isMounted, markers]);

  // SSR 호환성을 위한 초기 렌더링
  if (!isMounted) {
    return (
      <div
        className={`w-full relative bg-gray-100 rounded-lg ${className}`}
        style={{ width, height }}
      />
    );
  }

  // Suspense가 coordinates를 보장하므로 바로 지도 렌더링
  return (
    <div className={`w-full relative ${className}`} style={{ width, height }}>
      <div ref={mapRef} className='w-full h-full rounded-lg overflow-hidden' />
    </div>
  );
}
