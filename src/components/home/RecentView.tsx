'use client';

import { useRecentViewedStore } from '@/store/recentlyWatched';
import { useUserStore } from '@/store/userStore';
import { ChevronLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { wsrvLoader } from '../common/wsrvLoader';
import Image from 'next/image';
import ActivityCard from './ActivityCard';

export default function RecentView() {
  const [mounted, setMounted] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const router = useRouter();

  const grouped = useRecentViewedStore((s) => s.grouped);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (Object.keys(grouped).length === 0)
    return (
      <div className='flex flex-col gap-7 mt-25 mb-40 px-[24px] lg:px-[86px] '>
        <div className='flex items-center justify-start my-10'>
          <button onClick={() => router.back()} className='cursor-pointer mb-20'>
            <ChevronLeft strokeWidth={1.5} height={32} width={32} />
          </button>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <Image
            loader={wsrvLoader}
            loading='lazy'
            src={'/images/icons/Logo_top.svg'}
            alt='빈 체험 로고'
            width={234}
            height={337}
            className='animate-bounce w-[234px] h-auto'
          />
          <Image
            loader={wsrvLoader}
            loading='lazy'
            src={'/images/icons/Logo_bottom.svg'}
            alt='빈 체험 로고'
            width={45}
            height={16}
            className='w-[45px] h-auto'
          />
        </div>
        <span className='text-18-regular text-grayscale-300 text-center'>
          존재하는 체험이 없어요!
        </span>
      </div>
    );

  return (
    <div className='px-[24px] lg:px-[86px] my-5'>
      <div className='flex items-center justify-between my-10'>
        <button onClick={() => router.back()} className='cursor-pointer'>
          <ChevronLeft strokeWidth={1.5} height={32} width={32} />
        </button>
        <button className='underline' onClick={() => setIsDelete((prev) => !prev)}>
          {isDelete ? '완료' : '수정'}
        </button>
      </div>
      <h1 className='text-32-regular text-title my-5'>최근 조회</h1>
      {Object.entries(grouped).map(([label, activities]) => (
        <div key={label} className='mb-6'>
          <h2 className='text-18-regular text-title mb-2'>{label}</h2>
          <div className='xl:grid-cols-4 md:grid-cols-3 grid-cols-2 grid gap-[16px] overflow-x-auto scrollbar-hide '>
            {activities.map((a) => (
              <ActivityCard key={a.id} activity={a} userId={user?.id} isDelete={isDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
