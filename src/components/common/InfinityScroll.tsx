'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { useWindowVirtualizer, VirtualItem } from '@tanstack/react-virtual';

// 타입 정의
interface InfinityScrollProps<T> {
  children: React.ReactNode;
  className?: string;
  items: T[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  itemHeightEstimate: number;
  maxItems?: number;
  scrollKey?: string;
}

interface InfinityScrollContextType<T> {
  items: T[];
  displayItems: T[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  virtualizer: ReturnType<typeof useWindowVirtualizer>;
  virtualItems: VirtualItem[];
}

interface InfinityScrollContentsProps<T> {
  children: (item: T, index: number) => React.ReactNode;
}

interface InfinityScrollLoadingProps {
  children: React.ReactNode;
}

interface InfinityScrollEmptyProps {
  children: React.ReactNode;
}

interface InfinityScrollSkeletonProps {
  children?: React.ReactNode;
  count?: number;
}

// Context 생성
const InfinityScrollContext = createContext<InfinityScrollContextType<unknown> | null>(null);

// Context hook
function useInfinityScrollContext<T>(): InfinityScrollContextType<T> {
  const context = useContext(InfinityScrollContext);
  if (!context) {
    throw new Error('InfinityScroll 서브컴포넌트는 InfinityScroll 내부에서만 사용할 수 있습니다.');
  }
  return context as InfinityScrollContextType<T>;
}

// 메인 InfinityScroll 컴포넌트
function InfinityScrollRoot<T>({
  children,
  className,
  items,
  hasNextPage,
  fetchNextPage,
  isLoading,
  isFetchingNextPage,
  itemHeightEstimate,
  maxItems = 1000,
  scrollKey = 'default',
}: InfinityScrollProps<T>) {
  // 실제 화면에 표시할 아이템
  const [displayItems, setDisplayItems] = useState<T[]>([]);

  useEffect(() => {
    if (items.length > maxItems) {
      setDisplayItems(items.slice(-maxItems));
    } else {
      setDisplayItems(items);
    }
  }, [items, maxItems]);

  // 스크롤 위치 저장 (새로고침 시 복원)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const key = `scroll-pos:${scrollKey}`;
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
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollKey]);

  // 가상화 설정
  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? displayItems.length + 1 : displayItems.length,
    estimateSize: () => itemHeightEstimate,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // 무한 스크롤 로직
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;

    if (lastItem.index >= displayItems.length - 1 && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, displayItems.length, isLoading, virtualItems]);

  // Context 값
  const contextValue: InfinityScrollContextType<T> = {
    items,
    displayItems,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    virtualizer,
    virtualItems,
  };

  return (
    <InfinityScrollContext.Provider value={contextValue}>
      <div className={className}>
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          {children}
        </div>
      </div>
    </InfinityScrollContext.Provider>
  );
}

// Contents 컴포넌트
function InfinityScrollContents<T>({ children }: InfinityScrollContentsProps<T>) {
  const { displayItems, virtualItems, virtualizer, hasNextPage, isFetchingNextPage } =
    useInfinityScrollContext<T>();

  return (
    <>
      {virtualItems.map((virtualItem) => {
        const isLoaderRow = virtualItem.index > displayItems.length - 1;

        // 로딩 행 처리
        if (isLoaderRow) {
          return hasNextPage ? (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
                textAlign: 'center',
                padding: '2rem 0',
              }}
            >
              {isFetchingNextPage ? '로딩 중...' : '더 불러오기'}
            </div>
          ) : null;
        }

        // 실제 데이터 아이템 렌더링
        return (
          <div
            key={virtualItem.key}
            ref={virtualizer.measureElement}
            data-index={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
              marginBottom: '16px', // gap-4
            }}
          >
            {children(displayItems[virtualItem.index], virtualItem.index)}
          </div>
        );
      })}
    </>
  );
}

// Loading 컴포넌트 (인라인 로딩은 Contents에서 처리하므로 선택적 사용)
function InfinityScrollLoading({ children }: InfinityScrollLoadingProps) {
  const { isFetchingNextPage } = useInfinityScrollContext();
  if (!isFetchingNextPage) return null;
  return <>{children}</>;
}

// Empty 컴포넌트
function InfinityScrollEmpty({ children }: InfinityScrollEmptyProps) {
  const { displayItems, isLoading } = useInfinityScrollContext();
  if (isLoading || displayItems.length > 0) return null;
  return <>{children}</>;
}

// Skeleton 컴포넌트
function InfinityScrollSkeleton({ children, count = 3 }: InfinityScrollSkeletonProps) {
  const { isLoading } = useInfinityScrollContext();
  if (!isLoading) return null;

  if (children) {
    return (
      <>
        {Array.from({ length: count }, (_, index) => (
          <div key={`skeleton-${index}`}>{children}</div>
        ))}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={`skeleton-${index}`} className='animate-pulse bg-gray-200 rounded h-32 mb-4' />
      ))}
    </>
  );
}

// 컴파운드 컴포넌트 패턴
export const InfinityScroll = Object.assign(InfinityScrollRoot, {
  Contents: InfinityScrollContents,
  Loading: InfinityScrollLoading,
  Empty: InfinityScrollEmpty,
  Skeleton: InfinityScrollSkeleton,
});

// 타입 export
export type {
  InfinityScrollProps,
  InfinityScrollContextType,
  InfinityScrollContentsProps,
  InfinityScrollLoadingProps,
  InfinityScrollEmptyProps,
  InfinityScrollSkeletonProps,
};
