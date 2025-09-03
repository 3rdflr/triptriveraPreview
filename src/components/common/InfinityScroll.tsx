'use client';

import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useState, useRef, useCallback } from 'react';

interface InfinityScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  itemHeightEstimate: number;
  maxItems?: number;
  scrollKey?: string;
  LoadingComponent?: React.ComponentType;
}

export function InfinityScroll<T>({
  items,
  renderItem,
  hasNextPage,
  fetchNextPage,
  isLoading,
  isFetchingNextPage,
  itemHeightEstimate,
  maxItems = 1000,
  scrollKey,
  LoadingComponent,
}: InfinityScrollProps<T>) {
  const [displayItems, setDisplayItems] = useState<T[]>([]);
  const observerRef = useRef<IntersectionObserver>();
  const loadingElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (items.length > maxItems) {
      setDisplayItems(items.slice(items.length - maxItems));
    } else {
      setDisplayItems(items);
    }
  }, [items, maxItems]);

  // 스크롤 위치 저장 및 복원
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const key = `scroll-pos:${scrollKey ?? `${location.pathname}${location.search}`}`;

    // 페이지 로드 시 스크롤 위치 복원
    const savedPosition = sessionStorage.getItem(key);
    if (savedPosition && !isLoading) {
      const position = parseInt(savedPosition, 10);
      setTimeout(() => {
        window.scrollTo(0, position);
      }, 100);
    }

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          sessionStorage.setItem(key, String(window.scrollY));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [scrollKey, isLoading]);

  // Intersection Observer를 활용한 무한 스크롤
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        {
          threshold: 0.1,
          rootMargin: '100px',
        },
      );

      if (node) observerRef.current.observe(node);
    },
    [hasNextPage, fetchNextPage, isFetchingNextPage],
  );

  const rowVirtualizer = useWindowVirtualizer({
    count: displayItems.length,
    estimateSize: () => itemHeightEstimate,
    overscan: 5,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div
      style={{
        height: rowVirtualizer.getTotalSize(),
        width: '100%',
        position: 'relative',
      }}
    >
      {virtualItems.map((virtualItem, index) => {
        const isLast = index === virtualItems.length - 1;

        return (
          <div
            key={virtualItem.key}
            ref={(node) => {
              rowVirtualizer.measureElement(node);
              if (isLast) {
                lastElementRef(node as HTMLDivElement);
              }
            }}
            data-index={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(displayItems[virtualItem.index], virtualItem.index)}
          </div>
        );
      })}

      {/* 로딩 상태 표시 */}
      {(isFetchingNextPage || (hasNextPage && displayItems.length > 0)) && (
        <div
          ref={loadingElementRef}
          style={{
            position: 'absolute',
            top: rowVirtualizer.getTotalSize(),
            left: 0,
            width: '100%',
            padding: '2rem 0',
            textAlign: 'center',
          }}
        >
          {LoadingComponent ? (
            <LoadingComponent />
          ) : (
            <div className='flex justify-center items-center'>
              {isFetchingNextPage ? '로딩 중...' : '더 보기'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
