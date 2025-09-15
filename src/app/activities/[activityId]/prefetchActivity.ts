import { QueryClient, dehydrate, type DehydratedState } from '@tanstack/react-query';
import { getActivityDetail } from '@/app/api/activities';
import { getBlurDataURL } from '@/lib/utils/blur';
import { notFound } from 'next/navigation';

/**
 * SSR prefetch용 통합 함수
 * Activity 기본 정보를 서버에서 미리 로드 + 모든 이미지 blur 생성
 */

// NEW: 반환 타입 정의
export interface PrefetchActivityResult {
  dehydratedState: DehydratedState;
  blur?: { banner?: string; sub?: (string | undefined)[] };
}

export async function prefetchActivityData(activityId: string): Promise<PrefetchActivityResult> {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5분 캐싱
        gcTime: 30 * 60 * 1000, // 30분 메모리 보관
        retry: 1, // SSR에서는 1회만 재시도
        retryDelay: 1000,
      },
    },
  });

  try {
    // Activity ID 검증
    const numericId = Number(activityId);
    if (isNaN(numericId) || numericId <= 0) {
      throw new Error(`Invalid activity ID: ${activityId}`);
    }

    // 기본 정보 prefetch
    await queryClient.prefetchQuery({
      queryKey: ['activity-detail', activityId],
      queryFn: () => getActivityDetail(numericId),
    });

    // 캐시된 activity를 꺼내서 모든 이미지의 blur 생성
    const activity = queryClient.getQueryData<{
      bannerImageUrl: string;
      subImages: { id: number | string; imageUrl: string }[];
    }>(['activity-detail', activityId]);

    let blur: PrefetchActivityResult['blur'];

    if (activity) {
      const banner = activity.bannerImageUrl;
      const allSubImages = activity.subImages || [];

      // 배너 + 모든 서브 이미지 블러 병렬 생성
      const [bannerBlur, ...subBlurs] = await Promise.all([
        banner ? getBlurDataURL(banner) : undefined,
        ...allSubImages.map((sub) => (sub.imageUrl ? getBlurDataURL(sub.imageUrl) : undefined)),
      ]);

      blur = {
        banner: bannerBlur,
        sub: subBlurs,
      };

      console.log(`🎨 [SSR] 블러 이미지 생성 완료: 배너 1개 + 서브 ${subBlurs.length}개`);
    } else {
      notFound();
    }

    console.log('✅ [SSR] Activity prefetch 성공', { activityId });

    return { dehydratedState: dehydrate(queryClient), blur };
  } catch (error) {
    console.log('⚠️ [SSR] Activity prefetch 실패, 클라이언트에서 로드', { activityId, error });
    if (error instanceof Error && error.message === 'NEXT_NOT_FOUND') {
      notFound();
    }
    // 에러여도 최소한 dehydratedState는 반환
    return { dehydratedState: dehydrate(queryClient) }; // CHANGED
  }
}
