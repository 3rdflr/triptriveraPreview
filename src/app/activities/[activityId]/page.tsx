import { HydrationBoundary } from '@tanstack/react-query';
import { getActivitiesList } from '@/app/api/activities';
import ActivityClient from '@/app/activities/[activityId]/ActivityClientPage';
import ActivitySkeleton from '@/components/pages/activities/ActivitySkeleton';
import { prefetchActivityData } from './prefetchActivity';
import { Suspense } from 'react';

/**
 * 체험 상세 페이지
 * 인기 체험 20개를 먼저 SSG로 생성하고, 그 외 요청은 ISR로 처리합니다.
 * Hydration 이후에, ActivityClient가 CSR로 동작하여 실시간 데이터를 처리합니다.
 *
 * 페이지 전략:
 * - SSG: 인기 체험 20개를 사전 생성
 * - ISR: 그 외는 요청 시 생성 후 1시간 캐시
 * - SSR: ActivityClient는 CSR로 동작
 * - CSR: 클라이언트에서 실시간 가격/스케줄 정보 조회
 */

interface ActivityPageProps {
  params: Promise<{
    activityId: string;
  }>;
}

interface ActivityStaticParams {
  activityId: string;
}

const ActivityPage = async ({ params }: ActivityPageProps) => {
  const startTime = performance.now();

  // params 추출
  const { activityId } = await params;

  // Activity 데이터 prefetch
  const { dehydratedState, blur } = await prefetchActivityData(activityId);

  const duration = performance.now() - startTime;
  console.log(`⏱️ [SSR] ActivityPage 완료: ${duration.toFixed(2)}ms`, { activityId });

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<ActivitySkeleton />}>
        <ActivityClient activityId={Number(activityId)} blurImage={blur} />
      </Suspense>
    </HydrationBoundary>
  );
};
export default ActivityPage;

// SSG를 위한 정적 경로 생성
export async function generateStaticParams(): Promise<ActivityStaticParams[]> {
  const startTime = performance.now();

  try {
    const activities = await getActivitiesList({
      method: 'offset',
      page: 1,
      size: 20,
      sort: 'most_reviewed',
    });

    const staticParams: ActivityStaticParams[] = activities.activities.map((activity) => ({
      activityId: activity.id.toString(),
    }));

    const duration = performance.now() - startTime;
    console.log(`⏱️ [SSG] 인기 체험 20개 선정 완료: ${duration.toFixed(2)}ms`, {
      count: staticParams.length,
      activityIds: staticParams.map((p) => p.activityId),
    });

    return staticParams;
  } catch (error) {
    console.error('❌ [SSG] generateStaticParams 실패 - 빈 배열 반환', error);

    // 빌드 실패를 방지하기 위해 빈 배열 반환 (모든 페이지는 ISR로 처리됨)
    return [];
  }
}

export const dynamicParams = true;
export const revalidate = 3600;
