'use client';

import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { getActivityDetail } from '@/app/api/activities';
import ActivityImageViewer from '@/components/pages/activities/ActivityImageViewer';
import ActivityInfo from '@/components/pages/activities/ActivityInfo';
import ReviewList from '@/components/pages/activities/ReviewList';
import { activityQueryKeys } from './queryClients';
import { useEffect } from 'react';
import NaverMap from '@/components/common/naverMaps/NaverMap';
import Marker from '@/components/common/naverMaps/Marker';
import ImageMarker from '@/components/common/naverMaps/ImageMarker';

interface ActivityClientProps {
  activityId: string;
}

/**
 * ActivityClient 컴포넌트
 * - CSR로 동작하며, 실시간 가격 및 스케줄 정보를 주기적으로 갱신
 *
 */
/**
 * ActivityClient 컴포넌트
 * - CSR로 동작하며, 실시간 가격 및 스케줄 정보를 주기적으로 갱신
 * - Suspense와 ErrorBoundary를 통한 선언적 UI 상태 관리
 */
export default function ActivityClient({ activityId }: ActivityClientProps) {
  //todo: useTransition을 활용해 필요한 거를 지연 로딩을 시도해보자

  // 기본 체험 정보 조회 (서버에서 prefetch된 데이터 사용)
  const { data: activity } = useSuspenseQuery({
    queryKey: activityQueryKeys.detail(activityId),
    queryFn: () => getActivityDetail(Number(activityId)),
    staleTime: 5 * 60 * 1000, // 5분 캐시 (기본 정보)
    gcTime: 30 * 60 * 1000, // 30분 메모리 보관
  });

  // 실시간 가격 정보 (30초마다 자동 갱신)
  const { data: realtimePrice } = useQuery({
    queryKey: activityQueryKeys.price(activityId),
    queryFn: async () => {
      console.log('💰 [CSR] 실시간 가격 정보 조회', { activityId });

      // 실제로는 별도 가격 API 호출
      // const priceData = await getPriceInfo(activityId);

      // 목업: 기본 가격에서 랜덤 할인 적용
      const basePrice = activity.price;
      const discountRate = Math.floor(Math.random() * 30); // 0-30% 할인
      const currentPrice = Math.floor(basePrice * (1 - discountRate / 100));

      return {
        originalPrice: basePrice,
        currentPrice,
        discountRate,
        lastUpdated: new Date().toISOString(),
      };
    },
    staleTime: 0, // 항상 최신 데이터
    gcTime: 0, // 캐시 안함
    refetchInterval: 30000, // 30초마다 자동 갱신
    refetchOnWindowFocus: true, // 창 포커스시 갱신
    enabled: !!activity, // activity 로드 후 실행
  });

  // 실시간 예약 가능 스케줄 (1분마다 갱신, 콘솔로그만)
  const { data: realtimeSchedule } = useQuery({
    queryKey: activityQueryKeys.schedule(activityId),
    queryFn: async () => {
      console.log('📅 [CSR] 실시간 스케줄 정보 조회', { activityId });

      // 목업: 현재 시점 기준 예약 가능한 날짜들 생성
      const today = new Date();
      const availableDates = [];

      for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const timeSlots = ['10:00-12:00', '14:00-16:00', '18:00-20:00'].filter(
          () => Math.random() > 0.3,
        ); // 30% 확률로 마감

        if (timeSlots.length > 0) {
          availableDates.push({
            date: date.toISOString().split('T')[0],
            availableSlots: timeSlots,
          });
        }
      }

      return availableDates;
    },
    staleTime: 0,
    gcTime: 60000, // 1분간 메모리 보관
    refetchInterval: 60000, // 1분마다 갱신
    enabled: !!activity,
  });

  useEffect(() => {
    if (activity) {
      console.log('✅ [CSR] 기본 체험 정보 로드 완료', { title: activity.title });
      console.log('💧 [HYDRATION] Hydration 완료 - 페이지 인터랙티브');
    }
  }, [activity]);

  useEffect(() => {
    if (realtimePrice) {
      console.log('💰 [CSR] 실시간 가격 업데이트', {
        originalPrice: realtimePrice.originalPrice,
        currentPrice: realtimePrice.currentPrice,
        discountRate: realtimePrice.discountRate,
        savedAmount: realtimePrice.originalPrice - realtimePrice.currentPrice,
      });
    }
  }, [realtimePrice]);

  useEffect(() => {
    if (realtimeSchedule) {
      console.log('📅 [CSR] 실시간 스케줄 업데이트', {
        availableDates: realtimeSchedule.length,
        schedule: realtimeSchedule.map((s) => ({
          date: s.date,
          slots: s.availableSlots,
        })),
      });
    }
  }, [realtimeSchedule]);

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-8'>
          {/* 좌측: 이미지 및 기본 정보 (캐시된 데이터) */}
          <div className='xl:col-span-2'>
            <ActivityImageViewer
              bannerImageUrl={activity.bannerImageUrl}
              subImages={activity.subImages}
              title={activity.title}
            />

            <div className='mt-8'>
              <ActivityInfo activity={activity} />
            </div>
          </div>

          {/* 우측: 실시간 가격 정보 */}
          <div className='xl:col-span-1'>
            <div className='sticky top-4 space-y-4'>
              {/* 실시간 가격 카드 */}
              <div className='bg-white border rounded-lg p-6 shadow-sm'>
                <h3 className='text-lg font-semibold mb-4'>예약하기</h3>

                {realtimePrice ? (
                  <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                      <span className='text-2xl font-bold text-blue-600'>
                        ₩{realtimePrice.currentPrice.toLocaleString()}
                      </span>
                      {realtimePrice.discountRate > 0 && (
                        <span className='bg-red-500 text-white text-xs px-2 py-1 rounded'>
                          -{realtimePrice.discountRate}% 할인
                        </span>
                      )}
                    </div>

                    {realtimePrice.discountRate > 0 && (
                      <div className='text-sm text-gray-500 line-through'>
                        ₩{realtimePrice.originalPrice.toLocaleString()}
                      </div>
                    )}

                    <div className='text-xs text-gray-400'>
                      마지막 업데이트: {new Date(realtimePrice.lastUpdated).toLocaleTimeString()}
                    </div>
                  </div>
                ) : (
                  <div className='animate-pulse'>
                    <div className='h-8 bg-gray-200 rounded w-32 mb-2' />
                    <div className='h-4 bg-gray-200 rounded w-24' />
                  </div>
                )}

                <button className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-4'>
                  지금 예약하기
                </button>

                <div className='text-xs text-gray-500 text-center mt-3'>
                  💰 가격은 30초마다 실시간 업데이트
                  <br />
                  📅 예약 스케줄은 콘솔에서 확인 가능
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 지도 섹션 */}
        <div className='mt-12 space-y-8'>
          <section className='border-t pt-8 flex flex-col gap-2'>
            <h2 className='text-lg font-semibold'>오시는 길</h2>
            <p className='text-sm text-gray-600'>{activity.address}</p>

            <NaverMap address={activity.address} height='256px' zoom={12}>
              <Marker position={{ lat: 35.8242, lng: 127.1486 }} id='marker-default'>
                <ImageMarker src={activity.bannerImageUrl} alt='마커 1' size={40} />
              </Marker>

              <Marker
                address={activity.address}
                onClick={(position) => {
                  console.log('주소 기반 마커 클릭!', position);
                  alert(`주소 기반 마커! 위치: ${position.lat}, ${position.lng}`);
                }}
                id='image-marker'
              >
                <ImageMarker src={activity.bannerImageUrl} alt='주소 마커' size={40} />
              </Marker>
            </NaverMap>
          </section>

          <section className='border-t pt-8'>
            <div className='flex items-center  '>
              <h2 className='text-lg font-semibold mb-4'>체험 후기</h2>
              <p>{activity.reviewCount}개</p>
            </div>
            <ReviewList activityId={activity.id.toString()} rating={activity.rating} />
          </section>
        </div>
      </div>
    </div>
  );
}
