'use client';

import { useInfiniteReviews } from '@/hooks/useInfiniteReviews';
import { InfinityScroll } from '@/components/common/InfinityScroll';
import { ReviewCard } from './ReviewCard';
import { Review } from '@/types/reviews.type';
import { ReviewHero } from './ReviewHero';

interface ReviewListProps {
  activityId: string;
  rating: number;
}

export default function ReviewList({ activityId }: ReviewListProps) {
  console.log('🎬 ReviewList 렌더링 시작:', { activityId });

  const reviewData = useInfiniteReviews(activityId, 10);

  console.log('📋 ReviewList 데이터 상태:', {
    allReviewsLength: reviewData.allReviews.length,
    averageRating: reviewData.averageRating,
    totalCount: reviewData.totalCount,
    isLoading: reviewData.isLoading,
    isError: reviewData.isError,
    hasNextPage: reviewData.hasNextPage,
  });

  // 첫 몇 개 리뷰 데이터 확인
  if (reviewData.allReviews.length > 0) {
    console.log(
      '📝 첫 3개 리뷰 샘플:',
      reviewData.allReviews.slice(0, 3).map((review) => ({
        id: review.id,
        nickname: review.user.nickname,
        rating: review.rating,
        contentPreview: review.content.substring(0, 50) + '...',
      })),
    );
  }

  return (
    <div className='flex flex-col items-center gap-[30px]'>
      {/* ReviewHero 영역 */}
      <ReviewHero reviewCount={reviewData.totalCount} rating={reviewData.averageRating} />
      {/* 댓글 스크롤 영역 */}
      <InfinityScroll
        items={reviewData.allReviews}
        hasNextPage={reviewData.hasNextPage}
        fetchNextPage={reviewData.fetchNextPage}
        isLoading={reviewData.isLoading}
        isFetchingNextPage={reviewData.isFetchingNextPage}
        itemHeightEstimate={140}
        scrollKey={`reviews-${activityId}`}
        maxItems={0}
        className='bg-gray-50 rounded-3xl'
      >
        {/* 초기 로딩 스켈레톤 */}
        <InfinityScroll.Skeleton count={3}>
          <div className='animate-pulse bg-white rounded-lg p-4 shadow-sm mx-4'>
            <div className='flex items-center space-x-4 mb-3'>
              <div className='rounded-full bg-gray-200 h-10 w-10'></div>
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-gray-200 rounded w-1/4'></div>
                <div className='h-3 bg-gray-200 rounded w-20'></div>
              </div>
              <div className='h-3 bg-gray-200 rounded w-16'></div>
            </div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-200 rounded'></div>
              <div className='h-4 bg-gray-200 rounded w-5/6'></div>
            </div>
          </div>
        </InfinityScroll.Skeleton>
        <InfinityScroll.Contents>
          {(review: Review, _index: number) => <ReviewCard key={review.id} review={review} />}
        </InfinityScroll.Contents>

        <InfinityScroll.Empty>
          <div className='flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-lg shadow-sm mx-4 my-8'>
            <p className='text-xl font-medium mb-2'>아직 리뷰가 없습니다</p>
            <p className='text-sm text-gray-400'>첫 번째 리뷰를 남겨보세요!</p>
          </div>
        </InfinityScroll.Empty>
      </InfinityScroll>
    </div>
  );
}
