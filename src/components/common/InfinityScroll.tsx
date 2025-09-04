'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { useWindowVirtualizer, VirtualItem } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils/shadCnUtils';

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
  loadingContent?: React.ReactNode;
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
  const [loadingContent, setLoadingContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (maxItems > 0 && items.length > maxItems) {
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
  // 가화된 아이템들
  const virtualItems = virtualizer.getVirtualItems();

  // 무한 스크롤 로직
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];
    if (!lastItem) return;
    // 마지막 아이템이 화면에 보이는 경우 다음 페이지를 불러옵니다.
    if (lastItem.index >= displayItems.length - 1 && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, displayItems.length, isLoading, virtualItems]);

  // children에서 Loading 컴포넌트 찾기
  useEffect(() => {
    const findLoadingComponent = (children: React.ReactNode): React.ReactNode => {
      let foundLoading = null;
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === InfinityScrollLoading) {
          foundLoading = child.props.children;
        }
      });
      return foundLoading;
    };

    const loading = findLoadingComponent(children);
    setLoadingContent(loading);
  }, [children]);

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
    loadingContent,
  };

  return (
    <InfinityScrollContext.Provider value={contextValue}>
      <div className={cn('infinity-scroll-container w-full', className)}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
          className='infinity-scroll'
        >
          {children}
        </div>
      </div>
    </InfinityScrollContext.Provider>
  );
}

// Contents 컴포넌트
function InfinityScrollContents<T>({ children }: InfinityScrollContentsProps<T>) {
  const {
    displayItems,
    virtualItems,
    virtualizer,
    hasNextPage,
    isFetchingNextPage,
    loadingContent,
  } = useInfinityScrollContext<T>();

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
              }}
            >
              {isFetchingNextPage && loadingContent ? (
                loadingContent
              ) : (
                <div className='text-center p-8'>
                  {isFetchingNextPage ? '로딩 중...' : '더 불러오기'}
                </div>
              )}
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
            }}
          >
            {children(displayItems[virtualItem.index], virtualItem.index)}
          </div>
        );
      })}
    </>
  );
}

// Loading 컴포넌트
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
