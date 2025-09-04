import { useEffect } from 'react';

/**
 * 스크롤 위치를 sessionStorage에 저장하고 복원하는 훅
 *
 * @param scrollKey - 스크롤 위치를 식별하는 키
 * @param enabled - 스크롤 위치 저장 활성화 여부 (기본값: true)
 */
export function useScrollPosition(scrollKey: string, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const key = `scroll-pos:${scrollKey}`;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          sessionStorage.setItem(key, String(window.scrollY));
          ticking = false;
        });
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 컴포넌트 언마운트 시 정리
    return () => {
      window.removeEventListener('scroll', handleScroll);
      // 마지막 위치 저장
      sessionStorage.setItem(key, String(window.scrollY));
    };
  }, [scrollKey, enabled]);

  /**
   * 저장된 스크롤 위치로 복원
   */
  const restoreScrollPosition = () => {
    if (!enabled || typeof window === 'undefined') return;

    const key = `scroll-pos:${scrollKey}`;
    const savedScrollTop = sessionStorage.getItem(key);

    if (savedScrollTop) {
      const scrollTop = parseInt(savedScrollTop, 10);
      if (scrollTop > 0) {
        // DOM 업데이트 후 스크롤 복원
        setTimeout(() => {
          window.scrollTo({ top: scrollTop, behavior: 'instant' });
        }, 100);
      }
    }
  };

  /**
   * 저장된 스크롤 위치 삭제
   */
  const clearScrollPosition = () => {
    if (!enabled || typeof window === 'undefined') return;

    const key = `scroll-pos:${scrollKey}`;
    sessionStorage.removeItem(key);
  };

  return {
    restoreScrollPosition,
    clearScrollPosition,
  };
}
