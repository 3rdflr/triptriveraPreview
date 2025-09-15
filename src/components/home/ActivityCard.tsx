'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar as StarIcon } from 'react-icons/fa';
import { BASE_IMG_URL } from '@/components/home/Constants';
import { Activity } from '@/types/activities.type';
import { useRecentViewedStore } from '@/store/recentlyWatched';
import { successToast } from '@/lib/utils/toastUtils';
import { wsrvLoader } from '../common/wsrvLoader';
import { X } from 'lucide-react';
import Image from 'next/image';
import ActivityLike from './ActivityLike';

export default function ActivityCard({
  activity,
  userId,
  isDelete,
  onMouseEnter = () => {},
}: {
  activity: Activity;
  userId?: number;
  isDelete?: boolean;
  onMouseEnter?: (address: string) => void;
}) {
  const router = useRouter();
  const [isError, setIsError] = useState(false);

  const removeViewed = useRecentViewedStore((s) => s.removeViewed);

  const bannerImg = isError ? BASE_IMG_URL : activity.bannerImageUrl;

  return (
    <article>
      {/* 이미지 영역 */}
      <div className='relative'>
        {/* 배너 이미지 (에러 시 기본 이미지 fallback) */}
        <div className='relative w-full aspect-square rounded-[20px] overflow-hidden bg-grayscale-25'>
          <Image
            loader={wsrvLoader}
            src={bannerImg}
            alt={activity.title}
            fill
            sizes={'375'}
            className='object-cover cursor-pointer hover:scale-105 transition-soft duration-500'
            onClick={() => router.push(`/activities/${activity.id}`)}
            onError={() => setIsError(true)}
            onMouseEnter={() => onMouseEnter?.(activity.address!)}
            blurDataURL={BASE_IMG_URL}
          />
        </div>
        {/* 평점 배지 */}
        <div className='absolute top-[16px] left-[16px] flex items-center text-grayscale-500'>
          <div className='flex items-center justify-center gap-[4px] bg-white rounded-full w-[58px] h-[24px]'>
            {activity.rating > 0 ? (
              <>
                <StarIcon size={14} className='text-yellow-300' />
                <span className='text-gray-900 text-11-bold'>{activity.rating.toFixed(1)}</span>
              </>
            ) : (
              <span className='text-grayscale-500 text-11-medium'>평점 없음</span>
            )}
          </div>
        </div>

        {/* 좋아요 버튼 (로그인 사용자만 표시) */}
        {userId && <ActivityLike activity={activity} userId={userId} />}
        {isDelete && (
          <button
            className='absolute top-[12px] right-[16px] w-[28px] h-[28px]
            flex justify-center items-center cursor-pointer bg-grayscale-25 rounded-full z-10 shadow-md'
            onClick={() => {
              removeViewed(activity.id);
              successToast.run('삭제가 완료 되었습니다.');
            }}
          >
            <X strokeWidth={2} size={18} />
          </button>
        )}
      </div>
      {/* 카드 텍스트 영역 */}
      <div className='p-[8px] gap-[6px] flex flex-col'>
        {/* 제목 */}
        <header>
          <h2 className='leading-[1.4] text-sm font-semibold text-gray-800 w-auto flex-nowrap line-clamp-1 scrollbar-hide'>
            {activity.title || '새로운 체험'}
          </h2>
        </header>

        {/* 주소 */}
        <section>
          <address className='text-xs leading-[1.4] text-gray-500 not-italic flex-nowrap line-clamp-1 scrollbar-hide'>
            {activity.address || '대한민국'}
          </address>
        </section>
        {/* 가격 + 후기 수 */}
        <footer className='leading-none flex justify-between items-center w-full text-11-regular text-gray-500'>
          <span>
            {activity.price ? `1인당 ${activity.price.toLocaleString()}원 부터` : '가격 문의'}
          </span>
          <span>{activity.reviewCount > 0 ? `${activity.reviewCount}개의 후기` : '후기 없음'}</span>
        </footer>
      </div>
    </article>
  );
}
