'use client';

import { Review } from '@/types/reviews.type';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className='border-b border-gray-200 p-4'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center'>
          {review.user.nickname.charAt(0)}
        </div>
        <div>
          <p className='font-medium text-sm'>{review.user.nickname}</p>
          <div className='flex items-center gap-1'>
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <span className='text-xs text-gray-500 ml-auto'>
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className='text-gray-700 text-sm leading-relaxed'>{review.content}</p>
    </div>
  );
}
