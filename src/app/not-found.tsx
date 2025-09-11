'use client';

import Lottie from 'lottie-react';
import loadingLottie from '@/assets/lottie/404 Error - Doodle animation.json';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen text-title overflow-hidden'>
      <div className='w-100 h-100'>
        <Lottie animationData={loadingLottie} />
      </div>
      <div className='flex mt-8 text-24-regular text-subtitle'>페이지를 찾을 수 없습니다.</div>
      <p className='mt-4 text-16-regular text-subtitle'>주소가 올바른지 확인해 주세요.</p>
      <Link
        href='/'
        className='text-primary-green-200 m-10 border border-primary-green-200 rounded-2xl py-1 px-6 hover:scale-110 transition-all duration-300'
      >
        홈으로
      </Link>
    </div>
  );
}
