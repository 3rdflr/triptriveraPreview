'use client';

import React, { useEffect, useState, createContext, useContext, useRef } from 'react';
import { useVirtualizer, VirtualItem, Virtualizer } from '@tanstack/react-virtual';
import { cn } from '@/lib/utils/shadCnUtils';
import { useScrollPosition } from '@/hooks/useScrollPosition';

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
  enableScrollPosition?: boolean;
}

interface InfinityScrollContextType<T> {
  items: T[];
  displayItems: T[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  virtualizer: Virtualizer<HTMLDivElement, Element>;
  virtualItems: VirtualItem[];
}

interface InfinityScrollContentsProps<T> {
  children: (item: T, index: number) => React.ReactNode;
  loadingText?: string; // 로딩시 표시할 텍스트
  itemGap?: number; // 아이템 간격
}

interface InfinityScrollEmptyProps {
  className?: string;
  children: React.ReactNode;
}

interface InfinityScrollSkeletonProps {
  children?: React.ReactNode;
  className?: string;
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
  enableScrollPosition = true,
}: InfinityScrollProps<T>) {
  // 실제 화면에 표시할 아이템
  const [displayItems, setDisplayItems] = useState<T[]>([]);
  const [hasRestoredScroll, setHasRestoredScroll] = useState(false);

  // 컨테이너 ref
  const parentRef = useRef<HTMLDivElement>(null);

  // 스크롤 위치 저장 훅 사용
  const { restoreScrollPosition } = useScrollPosition(scrollKey, enableScrollPosition);

  useEffect(() => {
    // 최대 아이템의 길이가 초과되면 잘라냅니다.(최적화)
    console.log('items.length: ', items.length);
    if (items.length > maxItems) {
      setDisplayItems(items.slice(items.length - maxItems));
    } else {
      setDisplayItems(items);
      console.log('items-update', items);
    }
  }, [items, maxItems]);

  // 최초 데이터 로딩 완료 후에만 스크롤 위치 복원
  useEffect(() => {
    if (displayItems.length > 0 && !isLoading && !hasRestoredScroll) {
      restoreScrollPosition();
      setHasRestoredScroll(true);
    }
  }, [displayItems.length, isLoading, hasRestoredScroll, restoreScrollPosition]);

  // 컨테이너 기반 가상화 설정
  const virtualizer = useVirtualizer({
    count: hasNextPage ? displayItems.length + 1 : displayItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeightEstimate,
    overscan: 5,
  });
  // 가상화된 아이템들
  const virtualItems = virtualizer.getVirtualItems();

  // 디버깅: 가상 아이템 정보 출력
  console.log('🔍 Virtual Items Debug:', {
    displayItemsLength: displayItems.length,
    virtualItemsLength: virtualItems.length,
    totalSize: virtualizer.getTotalSize(),
    virtualItems: virtualItems.map((item) => ({
      index: item.index,
      start: item.start,
      size: item.size,
    })),
  });

  // 무한 스크롤 로직 (컨테이너 기반)
  useEffect(() => {
    if (!parentRef.current || !hasNextPage || isFetchingNextPage) return;

    const handleScroll = () => {
      const container = parentRef.current;
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // 80% 스크롤 시 다음 페이지 로드
      if (scrollPercentage > 0.8) {
        console.log('🔄 무한스크롤 트리거 (컨테이너 기반):', {
          scrollPercentage,
          hasNextPage,
          isFetchingNextPage,
        });
        fetchNextPage();
      }
    };

    const container = parentRef.current;
    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

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
      <div
        ref={parentRef}
        className={cn('infinity-scroll-container w-full', className)}
        style={{
          height: '600px', // 고정 높이 설정
          overflow: 'auto',
        }}
      >
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
function InfinityScrollContents<T>({
  children,
  loadingText = '더 많은 데이터 불러오는 중...',
  itemGap = 16,
}: InfinityScrollContentsProps<T>) {
  const { displayItems, virtualItems, virtualizer, hasNextPage, isFetchingNextPage } =
    useInfinityScrollContext<T>();

  return (
    <>
      {virtualItems.map((virtualItem) => {
        const isLoaderRow = virtualItem.index > displayItems.length - 1;
        console.log('isLoaderRow', isLoaderRow);
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
              {isFetchingNextPage ?? (
                <div className='text-center p-8'>
                  <div className='flex items-center justify-center space-x-3'>
                    <div className='animate-spin rounded-full h-6 w-6 border-2 border-primary-400 border-t-transparent'></div>
                    <span className='text-sm text-gray-600'>{loadingText}</span>
                  </div>
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
              paddingBottom: `${itemGap}px`,
            }}
          >
            {children(displayItems[virtualItem.index], virtualItem.index)}
          </div>
        );
      })}
    </>
  );
}

// Empty 컴포넌트
function InfinityScrollEmpty({ children, className }: InfinityScrollEmptyProps) {
  const { displayItems, isLoading } = useInfinityScrollContext();
  if (isLoading || displayItems.length > 0) return null;
  return (
    <div className={cn('absolute inset-0 flex items-center justify-center', className)}>
      {children}
    </div>
  );
}

// Skeleton 컴포넌트
function InfinityScrollSkeleton({ children, className, count = 3 }: InfinityScrollSkeletonProps) {
  const { isLoading } = useInfinityScrollContext();
  if (!isLoading || !children) return null;

  return (
    <div className={cn('absolute inset-0 flex flex-col gap-4', className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={`skeleton-${index}`}>{children}</div>
      ))}
    </div>
  );
}

// 컴파운드 컴포넌트 패턴
export const InfinityScroll = Object.assign(InfinityScrollRoot, {
  Contents: InfinityScrollContents,
  Empty: InfinityScrollEmpty,
  Skeleton: InfinityScrollSkeleton,
});

// 타입 export
export type {
  InfinityScrollProps,
  InfinityScrollContextType,
  InfinityScrollContentsProps,
  InfinityScrollEmptyProps,
  InfinityScrollSkeletonProps,
};
