import { useInfiniteQuery } from '@tanstack/react-query';
import { getActivityReviews } from '@/app/api/activities';
import { Review } from '@/types/reviews.type';

export interface ReviewsPage {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
  currentPage: number;
}

export function useInfiniteReviews(activityId: string, pageSize: number = 10) {
  const queryResult = useInfiniteQuery<ReviewsPage>({
    queryKey: ['reviews', activityId],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await getActivityReviews(Number(activityId), {
        page: Number(pageParam),
        size: pageSize,
      });

      return {
        reviews: data.reviews,
        averageRating: data.averageRating,
        totalCount: data.totalCount,
        currentPage: Number(pageParam),
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.totalCount / pageSize);
      return lastPage.currentPage < totalPages ? lastPage.currentPage + 1 : undefined;
    },
  });

  const allReviews = queryResult.data?.pages.flatMap((page) => page.reviews) || [];
  const averageRating = queryResult.data?.pages[0]?.averageRating || 0;
  const totalCount = queryResult.data?.pages[0]?.totalCount || 0;

  return {
    ...queryResult,
    allReviews,
    averageRating,
    totalCount,
  };
}
