'use client';

import { useSuspenseQuery, useQuery } from '@tanstack/react-query';
import { getActivityDetail } from '@/app/api/activities';
import ActivityImageViewer from '@/components/pages/activities/ActivityImageViewer';
import ActivityInfo from '@/components/pages/activities/ActivityInfo';
import BookingCard from '@/components/pages/activities/bookingCard/BookingCard';
import { activityQueryKeys } from './queryClients';
import { useEffect } from 'react';
import NaverMap from '@/components/common/naverMaps/NaverMap';
import Marker from '@/components/common/naverMaps/Marker';
import ImageMarker from '@/components/common/naverMaps/ImageMarker';
/**
 * ActivityClient 컴포넌트
 * - CSR로 동작하며, 실시간 가격 및 스케줄 정보를 주기적으로 갱신
 * - Suspense와 ErrorBoundary를 통한 선언적 UI 상태 관리
 */
interface ActivityClientProps {
  activityId: string;
}

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

  return (
    <div className='container mx-auto px-4 py-8 pb-32 xl:pb-8'>
      <div className='max-w-[1200px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* 좌측: 이미지 및 기본 정보 (캐시된 데이터) */}
          <div className='lg:col-span-2'>
            <ActivityImageViewer
              bannerImageUrl={activity.bannerImageUrl}
              subImages={activity.subImages}
              title={activity.title}
            />

            <div className='mt-8'>
              <ActivityInfo activity={activity} />
            </div>
          </div>

          {/* 우측: 실시간 예약 카드 */}
          <div className='xl:col-span-1'>
            <div className='sticky top-4 space-y-4'>
              <BookingCard
                activityId={activityId}
                activityTitle={activity.title}
                price={activity.price}
                baseSchedules={activity.schedules}
              />
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
            <h2 className='text-lg font-semibold mb-4'>체험 후기</h2>
            <div className='h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500'>
              리뷰 컴포넌트 (추후 구현)
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
