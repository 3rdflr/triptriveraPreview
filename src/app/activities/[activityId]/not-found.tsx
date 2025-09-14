'use client';

import Lottie from 'lottie-react';
import loadingLottie from '@/assets/lottie/404 Error - Doodle animation.json';
import Link from 'next/link';

export default function ActivityNotFound() {
  return (
    <div className='flex flex-col items-center min-h-screen text-title overflow-hidden'>
      <div className='w-100 h-100'>
        <Lottie animationData={loadingLottie} />
      </div>

      <div className='flex mt-8 text-24-regular text-subtitle'>체험을 찾을 수 없습니다.</div>
      <p className='mt-4 text-16-regular text-subtitle'>
        체험이 존재하지 않거나 삭제되었을 수 있습니다.
      </p>
      <Link
        href='/'
        className='text-primary-green-200 m-10 border border-primary-green-200 rounded-2xl py-1 px-6 hover:scale-110 transition-all duration-300'
      >
        홈으로
      </Link>
    </div>
  );
}
