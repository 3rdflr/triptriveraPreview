import { useLayoutEffect, useState, useMemo, useCallback } from 'react';

// 브레이크포인트 상수
const BREAKPOINTS = {
  mobile: 744,
  tablet: 1024,
} as const;

// 화면 크기 타입 정의
type ScreenType = 'mobile' | 'tablet' | 'desktop';

// 화면 타입 계산 함수
function getScreenType(width: number): ScreenType {
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  return 'desktop';
}

export function useScreenSize() {
  const [screenType, setScreenType] = useState<ScreenType>('desktop'); // 초기값을 데스크탑으로 설정

  // resize handler - screenType이 변경될 때만 상태 업데이트
  const handleResize = useCallback(() => {
    const newWidth = window.innerWidth;
    const newScreenType = getScreenType(newWidth);

    setScreenType((prevScreenType) => {
      if (prevScreenType !== newScreenType) {
        return newScreenType;
      }
      return prevScreenType;
    });
  }, []);

  useLayoutEffect(() => {
    // 초기 설정
    handleResize();

    // 직접 resize listener - 조건부 상태 업데이트로 이미 최적화됨
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // 메모이제이션된 반환값 - screenType이 변경될 때만 재계산
  const memoizedValues = useMemo(
    () => ({
      isMobile: screenType === 'mobile',
      isTablet: screenType === 'tablet',
      isDesktop: screenType === 'desktop',
      width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    }),
    [screenType],
  );

  return memoizedValues;
}
