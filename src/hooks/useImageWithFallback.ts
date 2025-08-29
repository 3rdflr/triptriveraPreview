'use client';

import { useState, useCallback } from 'react';

interface UseImageWithFallbackReturn {
  src: string;
  isError: boolean;
  onError: () => void;
  onLoad: () => void;
  retry: () => void;
}

/**
 * 이미지 로드 실패 시 대체 이미지를 사용하는 커스텀 훅
 *
 * @param originalSrc - 원본 이미지 URL
 * @param fallbackSrc - 대체 이미지 URL (기본: placeholder 이미지)
 * @returns 이미지 상태 및 핸들러들
 */
export function useImageWithFallback(
  originalSrc: string,
  fallbackSrc: string = '/images/placeholder.svg',
): UseImageWithFallbackReturn {
  const [src, setSrc] = useState(originalSrc);
  const [isError, setIsError] = useState(false);

  const onError = useCallback(() => {
    console.log('🖼️ Image load failed, switching to fallback:', originalSrc);
    setIsError(true);
    setSrc(fallbackSrc);
  }, [originalSrc, fallbackSrc]);

  const onLoad = useCallback(() => {
    // console.log('🖼️ Image loaded successfully:', src);
    // 이미 에러 상태가 아닌 경우에만 성공 처리
    if (src === originalSrc) {
      setIsError(false);
    }
  }, [src, originalSrc]);

  const retry = useCallback(() => {
    console.log('🔄 Retrying original image:', originalSrc);
    setIsError(false);
    setSrc(originalSrc);
  }, [originalSrc]);

  return {
    src,
    isError,
    onError,
    onLoad,
    retry,
  };
}

export default useImageWithFallback;
