'use client';

import { useEffect, useState } from 'react';

export function useNaverMapScriptReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkReady = () => {
      if (typeof window !== 'undefined' && window.naver?.maps?.Map) {
        setIsReady(true);
        return true;
      }
      return false;
    };

    if (checkReady()) return;

    // 주기적으로 naver.maps.Map이 사용 가능한지 체크
    const intervalId = setInterval(() => {
      if (checkReady()) {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      }
    }, 100);

    // 10초 후 타임아웃
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      console.warn('⚠️ [NAVER MAP] Script loading timeout');
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  return isReady;
}
