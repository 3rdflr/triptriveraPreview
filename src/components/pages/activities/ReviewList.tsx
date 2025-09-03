'use client';

import { useInfiniteReviews } from '@/hooks/useInfiniteReviews';
import { InfinityScroll } from '@/components/common/InfinityScroll';
import { ScrollFallback } from '@/components/common/ScrollFallback';
import { ReviewCard } from './ReviewCard';
import { Review } from '@/types/reviews.type';

interface ReviewListProps {
  activityId: string;
  rating: number;
}

export default function ReviewList({ activityId }: ReviewListProps) {
  const {
    allReviews,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage,
    averageRating,
    totalCount,
  } = useInfiniteReviews(activityId, 10);

  if (isLoading) {
    return (
      <div className='p-4'>
        <ScrollFallback />
      </div>
    );
  }

  return (
    <div>
      {/* ReviewHero 영역 - 나중에 구현 */}
      <div className='p-4 border-b'>
        <h2 className='text-lg font-semibold mb-2'>리뷰 ({totalCount})</h2>
        <div className='flex items-center gap-2'>
          <span className='text-2xl font-bold'>{averageRating.toFixed(1)}</span>
          <div className='flex'>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      <InfinityScroll
        items={allReviews}
        renderItem={(review: Review) => <ReviewCard key={review.id} review={review} />}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        itemHeightEstimate={120}
        scrollKey={`reviews-${activityId}`}
        LoadingComponent={ScrollFallback}
      />
    </div>
  );
}
