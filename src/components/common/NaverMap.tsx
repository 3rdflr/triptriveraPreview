'use client';

import { useRef, useState } from 'react';

interface NaverMapProps {
  address?: string;
  lat?: number;
  lng?: number;
  width?: string;
  height?: string;
  className?: string;
  showInfoWindow?: boolean;
  infoContent?: string;
}

export default function NaverMap({
  address,
  lat,
  lng,
  width = '100%',
  height = '400px',
  className = '',
  showInfoWindow = false,
  infoContent,
}: NaverMapProps) {
  const mapInstance = useRef<NaverMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);

  // 주소를 좌표로 변환하는 지오코딩 함수
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    console.log('🌍 지오코딩 시작:', address);

    return new Promise((resolve) => {
      try {
        console.log('📡 네이버 지오코딩 API 호출');
        window.naver.maps.Service.geocode(
          { query: address },
          (status: string, response: GeocodeResponse) => {
            console.log('📡 지오코딩 응답:', { status, response });

            if (status === 'OK' && response.v2.addresses.length > 0) {
              const result = response.v2.addresses[0];
              const coords = {
                lat: parseFloat(result.y),
                lng: parseFloat(result.x),
              };
              console.log('✅ 지오코딩 성공:', { address, coords, result });
              resolve(coords);
            } else {
              console.error('❌ 지오코딩 실패:', { address, status, response });
              resolve(null);
            }
          },
        );
      } catch (err) {
        console.error('❌ 지오코딩 호출 중 오류:', err);
        resolve(null);
      }
    });
  };

  // callback ref를 사용하여 DOM 요소가 마운트될 때 자동으로 지도 초기화
  const handleMapRef = (element: HTMLDivElement | null) => {
    console.log('🗺️ 지도 컨테이너 ref 콜백', { element: !!element });

    if (element && !mapContainer) {
      setMapContainer(element);
      initializeMap(element);
    } else if (!element && mapContainer) {
      // 컴포넌트 언마운트 시 cleanup
      if (mapInstance.current) {
        mapInstance.current.destroy();
        mapInstance.current = null;
      }
      setMapContainer(null);
    }
  };

  const checkNaverMapsLoaded = () => {
    const hasWindow = typeof window !== 'undefined';
    const hasNaver = hasWindow && window.naver;
    const hasMaps = hasNaver && window.naver.maps;
    const hasMap = hasMaps && window.naver.maps.Map;

    console.log('🔍 네이버 맵 API 체크:', {
      hasWindow,
      hasNaver,
      hasMaps,
      hasMap,
    });

    return hasMap;
  };

  const waitForNaverMapsAndInitialize = (element: HTMLDivElement) => {
    if (checkNaverMapsLoaded()) {
      console.log('✅ 네이버 맵 API 이미 로드됨');
      initializeMapWithElement(element);
    } else {
      console.log('🔄 네이버 맵 API 로드 대기 중...');
      // 100ms마다 체크하여 최대 10초 대기
      const maxAttempts = 100;
      let attempts = 0;

      const interval = setInterval(() => {
        attempts++;
        console.log(`🔄 네이버 맵 API 체크 ${attempts}/${maxAttempts}`);

        if (checkNaverMapsLoaded()) {
          clearInterval(interval);
          console.log('✅ 네이버 맵 API 로드 완료');
          initializeMapWithElement(element);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          console.error('❌ 네이버 맵 API 로드 시간 초과');
          setError('네이버 맵 API 로드 시간이 초과되었습니다.');
          setIsLoading(false);
        }
      }, 100);
    }
  };

  const initializeMap = (element: HTMLDivElement) => {
    console.log('🚀 지도 초기화 트리거', { element: !!element });
    waitForNaverMapsAndInitialize(element);
  };

  const initializeMapWithElement = async (element: HTMLDivElement) => {
    console.log('🚀 지도 초기화 시작');

    try {
      let coordinates = { lat: 37.5665, lng: 126.978 }; // 기본값: 서울시청
      console.log('📍 기본 좌표 설정:', coordinates);

      // 주소가 있으면 좌표 변환
      if (address) {
        console.log('🔍 주소 변환 시작:', address);
        const coords = await geocodeAddress(address);
        if (coords) {
          coordinates = coords;
          console.log('✅ 주소 변환 성공:', coordinates);
        } else {
          console.error('❌ 주소 변환 실패:', address);
          setError('주소를 찾을 수 없습니다.');
          setIsLoading(false);
          return;
        }
      } else if (lat && lng) {
        // 직접 좌표가 제공된 경우
        coordinates = { lat, lng };
        console.log('📍 직접 좌표 사용:', coordinates);
      }

      console.log('🗺️ 지도 생성 시작', {
        element: !!element,
        coordinates,
        naverMaps: !!window.naver.maps,
        naverMapsMap: !!window.naver.maps.Map,
        naverMapsLatLng: !!window.naver.maps.LatLng,
      });

      // 지도 생성
      const map = new window.naver.maps.Map(element, {
        center: new window.naver.maps.LatLng(coordinates.lat, coordinates.lng),
        zoom: 15,
        mapTypeControl: true,
      });
      console.log('✅ 지도 생성 완료:', map);

      // 마커 생성
      console.log('📌 마커 생성 시작');
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(coordinates.lat, coordinates.lng),
        map: map,
      });
      console.log('✅ 마커 생성 완료:', marker);

      // 정보창 생성 및 이벤트 처리
      if (showInfoWindow) {
        console.log('💬 정보창 생성 시작');
        const content =
          infoContent || address || `위도: ${coordinates.lat}, 경도: ${coordinates.lng}`;
        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="padding: 10px; min-width: 200px;">${content}</div>`,
        });
        console.log('✅ 정보창 생성 완료:', { content });

        // 마커 클릭시 정보창 토글
        window.naver.maps.Event.addListener(marker, 'click', () => {
          console.log('🖱️ 마커 클릭됨');
          if (infoWindow.getMap()) {
            infoWindow.close();
            console.log('💬 정보창 닫힘');
          } else {
            infoWindow.open(map, marker);
            console.log('💬 정보창 열림');
          }
        });
      }

      mapInstance.current = map;
      setIsLoading(false);
      console.log('🎉 지도 초기화 완료');
    } catch (err) {
      console.error('❌ 지도 초기화 중 오류:', err);
      console.error('오류 상세:', {
        message: err instanceof Error ? err.message : '알 수 없는 오류',
        stack: err instanceof Error ? err.stack : undefined,
        windowNaver: !!window.naver,
        naverMaps: !!window.naver?.maps,
        element: !!element,
      });
      setError('지도 초기화 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <div className='text-gray-500'>지도를 로드하는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${className}`}
        style={{ width, height }}
      >
        <div className='text-red-500'>{error}</div>
      </div>
    );
  }

  return <div ref={handleMapRef} className={className} style={{ width, height }} />;
}
