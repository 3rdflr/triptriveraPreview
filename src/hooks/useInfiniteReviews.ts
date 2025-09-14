import { useInfiniteQuery } from '@tanstack/react-query';
import { getActivityReviews } from '@/app/api/activities';
import { useMemo } from 'react';

/**
 * 리뷰 무한스크롤을 위한 커스텀 훅
 *
 * @param activityId - 활동 ID
 * @param pageSize - 페이지당 아이템 수 (기본값: 10)
 * @returns 무한스크롤에 필요한 데이터와 함수들
 */
export function useInfiniteReviews(activityId: string, pageSize: number = 10) {
  // React Query의 useInfiniteQuery를 사용하여 페이지 기반 무한스크롤 구현
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['reviews', activityId, pageSize],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getActivityReviews(Number(activityId), {
        page: Number(pageParam),
        size: pageSize,
      });

      const totalPages = Math.ceil(result.totalCount / pageSize);
      const hasMore = Number(pageParam) < totalPages;

      return {
        reviews: result.reviews,
        averageRating: result.averageRating,
        totalCount: result.totalCount,
        currentPage: Number(pageParam),
        totalPages,
        hasMore,
      };
    },
    getNextPageParam: (lastPage) => {
      // 다음 페이지가 있으면 페이지 번호 증가, 없으면 undefined
      return lastPage.hasMore ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    // 5분간 캐시 유지
    staleTime: 5 * 60 * 1000,
    // 네트워크 재연결 시 자동 리패치
    refetchOnReconnect: true,
  });

  // 모든 페이지의 리뷰를 하나의 배열로 결합
  const allReviews = useMemo(() => {
    return data?.pages?.flatMap((page) => page.reviews) || [];
  }, [data?.pages]);

  // 첫 번째 페이지에서 메타데이터 추출
  const firstPage = data?.pages?.[0];
  // 로딩 중일 때는 5점을 기본값으로 표시
  const averageRating = isLoading ? 5 : firstPage?.averageRating || 0;
  const totalCount = firstPage?.totalCount || 0;

  return {
    allReviews, // 모든 리뷰 배열
    averageRating, // 평균 평점
    totalCount, // 총 리뷰 수
    isLoading, // 초기 로딩 상태
    isFetchingNextPage, // 추가 페이지 로딩 상태
    hasNextPage: hasNextPage || false, // 다음 페이지 존재 여부
    isError, // 에러 상태
    error, // 에러 객체
    fetchNextPage, // 다음 페이지 로드 함수
    refetch, // 데이터 리패치 함수
    pages: data?.pages || [],
  };
}
