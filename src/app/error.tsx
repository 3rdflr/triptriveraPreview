'use client';

import Lottie from 'lottie-react';
import loadingLottie from '@/assets/lottie/T-rex.json';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='flex flex-col items-center justify-center h-screen -m-10 overflow-hidden'>
      <div className='w-100 h-100'>
        <Lottie animationData={loadingLottie} />
      </div>
      <div className='flex mt-8 text-24-regular text-subtitle gap-5'>뭔가 잘못되었습니다.</div>
      <span className='text-12-regular text-red-500 m-4'>{error.message}</span>
      <p className='mt-4 text-16-regular text-subtitle'>
        다른 페이지에 접속하거나, 재 로그인 후 다시 시도해주세요.
      </p>
      <div className='flex gap-8'>
        <button
          className='text-red-500 my-10 border-2 border-red-500 rounded-xl py-2 px-4 text-14-regular hover:text-gray-50 hover:bg-red-500'
          onClick={() => reset()}
        >
          메인 페이지로 이동
        </button>
        <Link
          href='https://github.com/3rdflr/part4-team2/issues'
          target='_blank'
          className='text-red-500 my-10 border-2 border-red-500 rounded-xl py-2 px-6 text-14-regular hover:text-gray-50 hover:bg-red-500'
        >
          깃허브에 이슈 남기기
        </Link>
      </div>
    </div>
  );
}
