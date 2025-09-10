'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { useGeocoding } from '@/hooks/useGeocoding';
import { useMarkers } from '@/hooks/useMarkers';
import Script from 'next/script';
import { useNaverMapScriptReady } from '@/hooks/useNaverMapScriptReady';
import NaverMapSkeleton from './NaverMapSkeleton';
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
  mapId: string;
}

export default function NaverMapCore({
  address,
  className = '',
  width = '100%',
  height = '256px',
  zoom = 15,
  children,
  mapId,
}: NaverMapCoreProps) {
  const NCP_CLIENT_ID = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  if (!NCP_CLIENT_ID) {
    throw new Error('네이버 지도 클라이언트 ID가 설정되지 않았습니다.');
  }
  const mapRef = useRef<naver.maps.Map | null>(null);

  const scriptReady = useNaverMapScriptReady();
  // 지오코딩 데이터 가져오기
  const { data: coordinates } = useGeocoding({ address, isScriptReady: scriptReady });
  useMarkers({
    map: mapRef.current,
    children,
    isReady: Boolean(mapRef.current) && scriptReady,
  });

  // 지도 초기화
  const initMap = () => {
    const initLocation = new naver.maps.LatLng(37.5665, 126.978);
    const mapOptions = {
      center: initLocation,
      zoom: zoom,
    };
    const map = new naver.maps.Map(mapId, mapOptions);
    mapRef.current = map;
  };

  // 지오코딩 결과로 지도 중심점 업데이트
  useEffect(() => {
    if (mapRef.current && coordinates && scriptReady) {
      console.log('🎯3. [MAP] 지도 중심점 업데이트', coordinates);
      const location = new naver.maps.LatLng(coordinates.y, coordinates.x);
      mapRef.current.setCenter(location);
    }
  }, [coordinates, scriptReady, mapRef]);

  // 지도 렌더링
  return (
    <div className={`w-full relative ${className}`} style={{ width, height }}>
      <Script
        id='naver-maps-sdk'
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NCP_CLIENT_ID}&submodules=geocoder&callback=__naverInit`}
        strategy='afterInteractive'
        onReady={initMap}
        onError={() => {
          console.error('❌ [SCRIPT] 네이버 지도 스크립트 로드 실패');
        }}
      />
      {!scriptReady && <NaverMapSkeleton width={width} height={height} className={className} />}
      <div id={mapId} className='w-full h-full rounded-3xl overflow-hidden' />
    </div>
  );
}
