'use client';

import { Stars } from '@/components/common/Stars';
import { Review } from '@/types/reviews.type';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className='w-full p-5 min-h-[140px] flex flex-col gap-3 rounded-3xl bg-white shadow-sm'>
      <div className='flex flex-col gap-1'>
        {/* 이름 및 날짜 */}
        <div className='flex-1 flex items-center gap-2'>
          <span className='font-bold text-[14px] md:text-base'>{review.user.nickname}</span>
          <span className='text-xs md:text-[14px] text-gray-400'>
            {(() => {
              const date = new Date(review.createdAt);
              return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
            })()}
          </span>
        </div>
        <Stars initRate={review.rating} size='sm' className='flex-shrink-0' />
      </div>
      <p className='text-gray-800 text-sm leading-relaxed line-clamp-4'>{review.content}</p>
    </div>
  );
}
