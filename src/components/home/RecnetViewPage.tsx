'use client';

import { useRecentViewedStore } from '@/store/recentlyWatched';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { wsrvLoader } from '../common/wsrvLoader';
import Image from 'next/image';

export default function RecentViewPage() {
  const [mounted, setMounted] = useState(false);

  const recent = useRecentViewedStore((s) => s.recentViewed || []);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (recent.length === 0) return null;

  // 최근 본 활동 최대 3개
  const displayItems = [...recent]
    .sort((a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime())
    .slice(0, 3);

  const rotateMap = [-6, 5, -4];

  return (
    <div
      className='w-full my-2 pb-2 border-b h-[80px] border-gray-200 flex items-center justify-center gap-5 cursor-pointer'
      onClick={() => router.push('/recent')}
    >
      <p className='text-16-regular text-title'>최근 본 체험 확인하기</p>
      <button className='bg-grayscale-50 h-[24px] w-[24px] flex items-center justify-center rounded-full'>
        <ChevronRight strokeWidth={1.5} width={20} height={20} />
      </button>
      <div className='flex -space-x-13'>
        {displayItems.map((a, i) => {
          const rotateDeg = rotateMap[i] ?? 0;
          return (
            <div
              key={a.id}
              className='relative w-15 h-15 rounded-lg overflow-hidden border border-white shadow-sm'
              style={{
                zIndex: displayItems.length - i,
                transform: `rotate(${rotateDeg}deg)`,
              }}
            >
              <Image
                loader={wsrvLoader}
                loading='lazy'
                src={a.bannerImageUrl || '/fallback.png'}
                alt={a.title}
                fill
                sizes='50'
                className='object-cover'
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
