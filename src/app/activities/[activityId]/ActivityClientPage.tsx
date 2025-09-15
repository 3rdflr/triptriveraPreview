'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { getActivityDetail } from '@/app/api/activities';
import type { ActivityDetail } from '@/types/activities.type';
import { useRecentViewedStore } from '@/store/recentlyWatched';
import ActivityImageViewer from '@/components/pages/activities/ActivityImageViewer';
import ActivityInfo from '@/components/pages/activities/ActivityInfo';
import BookingCardContainer from '@/components/pages/activities/bookingCard/BookingContainer';
import ReviewList from '@/components/pages/activities/ReviewList';
import NaverMap from '@/components/common/naverMaps/NaverMap';
import Marker from '@/components/common/naverMaps/Marker';
import ImageMarker from '@/components/common/naverMaps/ImageMarker';
import { activityQueryKeys } from './queryKeys';
import { useUserStore } from '@/store/userStore';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { motion } from 'framer-motion';
import { MapPinned } from 'lucide-react';

/**
 * ActivityClient 컴포넌트
 * - CSR로 동작하며, 실시간 가격 및 스케줄 정보를 주기적으로 갱신
 * - Suspense와 ErrorBoundary를 통한 선언적 UI 상태 관리
 */
interface ActivityClientProps {
  activityId: number;
  blurImage?: { banner?: string; sub?: (string | undefined)[] };
}

export default function ActivityClient({ activityId, blurImage }: ActivityClientProps) {
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const { user } = useUserStore();
  const queryClient = useQueryClient();

  const [mapRef, isMapVisible] = useIntersectionObserver({
    rootMargin: '100px',
    triggerOnce: true,
  });

  // 1. 정적 데이터 (이미지, 주소, 제목, 설명) - 긴 캐시
  const { data: staticInfo } = useSuspenseQuery({
    queryKey: [...activityQueryKeys.detail(activityId), 'static'],
    queryFn: () => getActivityDetail(Number(activityId)),
    select: (data) => ({
      id: data.id,
      title: data.title,
      description: data.description,
      address: data.address,
      bannerImageUrl: data.bannerImageUrl,
      subImages: data.subImages,
      category: data.category,
      userId: data.userId,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }),
    staleTime: 30 * 60 * 1000, // 30분 캐시 (정적 정보)
    gcTime: 60 * 60 * 1000, // 1시간 메모리 보관
  });

  // 2. 동적 데이터 (가격, 스케줄, 평점) - 짧은 캐시, 재사용 최적화
  const { data: dynamicInfo } = useSuspenseQuery({
    queryKey: [...activityQueryKeys.detail(activityId), 'dynamic'],
    queryFn: (): Promise<ActivityDetail> => {
      // 캐시된 데이터가 있으면 재사용, 없으면 새로 호출
      const cachedData = queryClient.getQueryData<ActivityDetail>([
        ...activityQueryKeys.detail(activityId),
        'static',
      ]);
      const cachedState = queryClient.getQueryState([
        ...activityQueryKeys.detail(activityId),
        'static',
      ]);

      // static 캐시가 fresh하면 재사용
      if (
        cachedData &&
        cachedState?.dataUpdatedAt &&
        Date.now() - cachedState.dataUpdatedAt < 2 * 60 * 1000
      ) {
        return Promise.resolve(cachedData); // 캐시 재사용
      }
      return getActivityDetail(Number(activityId)); // 새 호출
    },
    select: (data: ActivityDetail) => ({
      price: data.price,
      schedules: data.schedules,
      rating: data.rating,
      reviewCount: data.reviewCount,
    }),
    staleTime: 1 * 60 * 1000, // 1분 캐시 (동적 정보)
    gcTime: 5 * 60 * 1000, // 5분 메모리 보관
    refetchInterval: 2 * 60 * 1000, // 2분마다 자동 갱신
  });

  // 3. 합성된 activity 객체 (useMemo로 불필요한 리렌더링 방지)
  const activity = useMemo(() => ({ ...staticInfo, ...dynamicInfo }), [staticInfo, dynamicInfo]);

  // activity로드 후 최근 본 목록에 추가
  const addViewed = useRecentViewedStore((s) => s.addViewed);

  useEffect(() => {
    if (activity) {
      addViewed(activity);
    }
  }, [activity, addViewed]);

  useEffect(() => {
    if (user?.id === activity.userId) {
      // 활동의 소유자인 경우
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [user, activity]);

  return (
    <div className='mx-auto px-4 py-8'>
      <div className=' max-w-[1200px] mx-auto'>
        {/* 그리드 레이아웃 컨테이너 */}

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 메인 콘텐츠 */}
          <div className='lg:col-span-2'>
            <div className='flex flex-col gap-5 md:gap-6 lg:gap-10'>
              <ActivityImageViewer
                bannerImageUrl={activity.bannerImageUrl}
                subImages={activity.subImages}
                title={activity.title}
                blurImage={blurImage}
              />
              <ActivityInfo activity={activity} isOwner={isOwner} />
              <hr className='border-gray-100' />
              <section className='flex flex-col gap-3'>
                <h2 className='text-lg font-semibold'>체험 설명</h2>
                <p>{activity.description}</p>
              </section>
              <hr className='border-gray-100' />
              {/* 주소 섹션 */}
              <section ref={mapRef} className='flex flex-col gap-2'>
                <h2 className='text-lg font-semibold'>오시는 길</h2>
                <p className='text-sm text-gray-600'>{activity.address}</p>
                {isMapVisible ? (
                  <NaverMap address={activity.address} height='256px' zoom={12}>
                    <Marker address={activity.address} id='image-marker'>
                      <ImageMarker src={activity.bannerImageUrl} alt='주소 마커' size={40} />
                    </Marker>
                  </NaverMap>
                ) : (
                  <div className='h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center'>
                    <motion.div
                      animate={{
                        y: [0, -20, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className='text-gray-400'
                    >
                      <MapPinned size={40} />
                    </motion.div>
                  </div>
                )}
              </section>
              <hr className='border-gray-100' />
              {/* 후기 섹션 */}
              <section className='flex flex-col gap-2'>
                <div className='flex items-center gap-2'>
                  <h2 className='text-lg font-semibold'>체험 후기</h2>
                  <p>{activity.reviewCount}개</p>
                </div>
                <ReviewList activityId={activity.id.toString()} rating={activity.rating} />
              </section>
            </div>
          </div>

          {/* SideBar */}
          <div className='lg:col-span-1 '>
            <div className='flex flex-col gap-10 z-105 sticky top-24'>
              <BookingCardContainer
                activityId={activityId}
                price={activity.price}
                baseSchedules={activity.schedules}
                title={activity.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
