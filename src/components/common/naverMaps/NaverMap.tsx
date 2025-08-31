'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import NaverMapSkeleton from './NaverMapSkeleton';
import NaverMapError from './NaverMapError';
import NaverMapCore from './NaverMapCore';

/**
 * NaverMap 컴포넌트
 * - 네이버 지도 API를 사용한 지도 렌더링 컴포넌트
 * - react-error-boundary를 사용한 에러 처리
 * - Suspense를 사용한 로딩 상태 처리
 * - useSuspenseQuery를 통해 선언적 데이터 로딩
 * - SSR 호환을 위한 hydration 안전성 보장
 */

interface NaverMapProps {
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
  /** 에러 재시도 콜백 함수 (선택적) */
  onRetry?: () => void;
}

export default function NaverMap({
  address,
  className = '',
  width = '100%',
  height = '256px',
  zoom = 15,
  showInfoWindow = false,
  infoContent,
  onRetry,
}: NaverMapProps) {
  console.log('🛡️ [BOUNDARY] NaverMap 렌더링 시작', {
    address,
    width,
    height,
    showInfoWindow,
  });

  return (
    <ErrorBoundary
      fallback={
        <NaverMapError width={width} height={height} className={className} onRetry={onRetry} />
      }
    >
      <Suspense fallback={<NaverMapSkeleton width={width} height={height} className={className} />}>
        <NaverMapCore
          address={address}
          width={width}
          height={height}
          className={className}
          zoom={zoom}
          showInfoWindow={showInfoWindow}
          infoContent={infoContent}
        />
      </Suspense>
    </ErrorBoundary>
  );
}
