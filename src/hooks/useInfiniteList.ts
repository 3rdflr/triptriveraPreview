'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { getActivitiesList } from '@/app/api/activities';
import { Activity, ActivitiesCategoryType } from '@/types/activities.type';

export interface ActivitiesPage {
  activities: Activity[];
  cursorId: number | null;
}

export function useInfiniteList(initialActivities: Activity[], initalCursorId: number | null) {
  const searchParams = useSearchParams();

  const queryKey = ['activities', searchParams.toString()];

  const queryResult = useInfiniteQuery<ActivitiesPage>({
    queryKey,
    queryFn: async ({ pageParam }) => {
      const category = searchParams.get('category') as ActivitiesCategoryType | undefined;
      const keyword = searchParams.get('keyword') || undefined;
      const minPrice = Number(searchParams.get('min-price') || 0);
      const maxPrice = Number(searchParams.get('max-price') || Infinity);
      const place = searchParams.get('place') || '';

      const data = await getActivitiesList({
        method: 'cursor',
        ...(pageParam ? { cursorId: Number(pageParam) } : {}),
        size: 14,
        ...(category && { category }),
        ...(keyword && { keyword }),
      });

      const filteredActivities = data.activities.filter((item: Activity) => {
        const priceOk = item.price >= minPrice && item.price <= maxPrice;
        const placeOk = place ? item.address.includes(place) : true;
        return priceOk && placeOk;
      });

      return { activities: filteredActivities, cursorId: data.cursorId ?? null };
    },

    // initialPageParam은 그냥 초기 cursorId
    initialPageParam: initalCursorId ?? undefined,

    // cursorId가 null 또는 undefined이면 더이상 없음
    getNextPageParam: (lastPage) => lastPage.cursorId ?? undefined,

    // SSR에서 받은 initialActivities를 초기에 표시하도록 seed
    initialData: {
      pages: [{ activities: initialActivities, cursorId: initalCursorId ?? null }],
      pageParams: [undefined],
    },

    // (옵션) 검색 시 즉시 새로고침을 강제하고 싶으면:
    // refetchOnWindowFocus: false,
    // refetchOnMount: true,
  });

  const allActivities = queryResult.data?.pages.flatMap((page) => page.activities) || [];

  return {
    ...queryResult,
    allActivities,
    searchParams,
  };
}
