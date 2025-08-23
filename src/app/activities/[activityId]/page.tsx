import { HydrationBoundary } from '@tanstack/react-query';
import { getActivitiesList } from '@/api/activities';
import ActivityClient from '@/app/activities/[activityId]/activities/ActivityClient';
import ActivitySkeleton from '@/app/activities/[activityId]/activities/ActivitySkeleton';
import { prefetchActivityData } from './queryClients';
import { Suspense } from 'react';

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
  console.log('🎬 [SSR] ActivityPage 시작');

  // params 추출
  const { activityId } = await params;

  // Activity 데이터 prefetch
  const dehydratedState = await prefetchActivityData(activityId);

  const duration = performance.now() - startTime;
  console.log(`⏱️ [SSR] ActivityPage 완료: ${duration.toFixed(2)}ms`, { activityId });

  return (
    <HydrationBoundary state={dehydratedState}>
      <Suspense fallback={<ActivitySkeleton />}>
        <ActivityClient activityId={activityId} />
      </Suspense>
    </HydrationBoundary>
  );
};
export default ActivityPage;

// SSG를 위한 정적 경로 생성
export async function generateStaticParams(): Promise<ActivityStaticParams[]> {
  const startTime = performance.now();
  console.log('🏗️ [SSG] generateStaticParams 시작 - 인기 체험 20개 선정');

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
  console.log(`⏱️ [SSG] generateStaticParams 완료: ${duration.toFixed(2)}ms`, {
    count: staticParams.length,
    activityIds: staticParams.map((p) => p.activityId),
  });

  return staticParams;
}

export const dynamicParams = true;
export const revalidate = 3600;
