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

      const normalize = (s: string) => {
        if (!s) return '';

        return s
          .replace(/(특별자치도|특별자치시|광역시|특별)$/g, '')
          .replace(/(전라남도)$/g, '전남')
          .trim()
          .toLowerCase();
      };

      const filteredActivities = data.activities.filter((item: Activity) => {
        const normalizedSearch = normalize(place);

        if (place) {
          const words = item.address.split(' '); // 주소 단어별 분리
          const firstWord = normalize(words[0]);
          if (!firstWord.includes(normalizedSearch)) return false; // 첫 단어와 비교
        }

        const priceOk = item.price >= minPrice && item.price <= maxPrice;
        return priceOk;
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

    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const allActivities = queryResult.data?.pages.flatMap((page) => page.activities) || [];

  return {
    ...queryResult,
    allActivities,
    searchParams,
  };
}
