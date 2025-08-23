import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getActivityDetail, getActivitiesList } from '@/api/activities';
import ActivityClient from '@/app/activities/[activityId]/activities/ActivityClient';
import ActivitySkeleton from '@/app/activities/[activityId]/activities/ActivitySkeleton';
import { ErrorBoundary, ActivityErrorFallback } from '@/components/common/ErrorBoundary';
import { Suspense } from 'react';

interface ActivityPageProps {
  params: Promise<{
    activityId: string;
  }>;
}

const ActivityPage = async ({ params }: ActivityPageProps) => {
  const { activityId } = await params;

  // 서버에서 데이터 prefetch (SSR/SSG 최적화)
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: Infinity,
      },
    },
  });

  try {
    // 서버에서 데이터를 미리 가져와서 hydration 준비
    await queryClient.prefetchQuery({
      queryKey: ['activity', activityId],
      queryFn: () => getActivityDetail(Number(activityId)),
    });
  } catch (error) {
    // prefetch 실패해도 클라이언트에서 재시도 가능하도록 graceful degradation
    console.warn('Server prefetch failed, will retry on client:', error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<ActivityErrorFallback />}>
        <Suspense fallback={<ActivitySkeleton />}>
          <ActivityClient activityId={activityId} />
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};
export default ActivityPage;

// SSG를 위한 정적 경로 생성
export async function generateStaticParams() {
  try {
    const activities = await getActivitiesList({
      method: 'offset',
      page: 1,
      size: 20,
      sort: 'most_reviewed',
    });

    return activities.activities.map((activity) => ({
      activityId: activity.id.toString(),
    }));
  } catch (error) {
    console.warn('Failed to generate static params:', error);
    return [];
  }
}

export const dynamicParams = true;
export const revalidate = 3600;
