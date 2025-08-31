'use client';

import { useRef, useEffect, useState } from 'react';
import { useGeocoding } from '@/hooks/useGeocoding';

/**
 * NaverMapCore 컴포넌트
 * - 지도 렌더링
 * - Suspense 내부에서 실행되는 핵심 컴포넌트
 *
 */

interface NaverMapCoreProps {
  /** 지오코딩할 주소 */
  address?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 컨테이너 너비 (기본값: 100%) */
  width?: string;
  /** 컨테이너 높이 (기본값: 256px) */
  height?: string;
  /** 지도 줌 레벨 (기본값: 15) */
  zoom?: number;
  /** 정보창 표시 여부 (기본값: false) */
  showInfoWindow?: boolean;
  /** 정보창에 표시할 내용 */
  infoContent?: string;
}

export default function NaverMapCore({
  address,
  className = '',
  width = '100%',
  height = '256px',
  zoom = 15,
  showInfoWindow = false,
  infoContent,
}: NaverMapCoreProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Suspense 모드로 지오코딩 데이터 가져오기 (에러는 ErrorBoundary가 처리)
  console.log('🗺️ [SUSPENSE] NaverMapCore 렌더링 시작', { address });
  const { data: coordinates } = useGeocoding({
    address,
    enabled: Boolean(address) && isMounted,
  });

  console.log('📍 [SUSPENSE] 좌표 데이터 획득 완료', { coordinates });

  useEffect(() => {
    console.log('💧 [HYDRATION] NaverMapCore 클라이언트 마운트');
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!mapRef.current || !coordinates || !window.naver?.maps || !isMounted) {
      return;
    }

    console.log('🗺️ [MAP] 지도 인스턴스 생성 시작', { coordinates });

    const location = new window.naver.maps.LatLng(coordinates.y, coordinates.x);
    const mapOptions = {
      center: location,
      zoom,
      mapTypeControl: true,
    };

    const map = new window.naver.maps.Map(mapRef.current, mapOptions);
    const marker = new window.naver.maps.Marker({
      position: location,
      map,
    });

    console.log('📍 [MAP] 지도 렌더링 완료', {
      center: `${coordinates.y}, ${coordinates.x}`,
      zoom,
    });

    // 정보창 표시
    if (showInfoWindow) {
      const content = infoContent || address || `위도: ${coordinates.y}, 경도: ${coordinates.x}`;
      const infoWindow = new window.naver.maps.InfoWindow({
        content: `<div style="padding: 10px; min-width: 200px;">${content}</div>`,
      });

      // 마커 클릭시 정보창 토글
      window.naver.maps.Event.addListener(marker, 'click', () => {
        console.log('🖱️ [MAP] 마커 클릭 - 정보창 토글');
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(map, marker);
        }
      });

      console.log('💬 [MAP] 정보창 설정 완료', { content });
    }

    // 클린업 함수
    return () => {
      console.log('🧹 [MAP] 지도 인스턴스 정리');
      if (map) {
        map.destroy();
      }
    };
  }, [coordinates, zoom, showInfoWindow, infoContent, address, isMounted]);

  // SSR 호환성을 위한 초기 렌더링
  if (!isMounted) {
    return (
      <div
        className={`w-full relative bg-gray-100 rounded-lg ${className}`}
        style={{ width, height }}
      />
    );
  }

  // coordinates가 존재하면 지도 렌더링 (Suspense가 보장)
  if (coordinates) {
    return (
      <div className={`w-full relative ${className}`} style={{ width, height }}>
        <div ref={mapRef} className='w-full h-full rounded-lg overflow-hidden' />
      </div>
    );
  }

  // 주소가 없는 경우
  return (
    <div
      className={`w-full relative bg-slate-200 flex justify-center items-center rounded-lg ${className}`}
      style={{ width, height }}
    >
      <p className='text-sm text-gray-600'>주소를 입력해주세요.</p>
    </div>
  );
}
