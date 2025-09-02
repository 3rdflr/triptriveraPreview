import { useInfiniteQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { getActivitiesList } from '@/app/api/activities';
import { Activity, ActivitiesCategoryType } from '@/types/activities.type';

export interface ActivitiesPage {
  activities: Activity[];
  cursorId: number;
}

export function useInfiniteList(initialActivities: Activity[], initalCursorId: number) {
  const searchParams = useSearchParams();

  const queryResult = useInfiniteQuery<ActivitiesPage>({
    queryKey: ['activities', searchParams.toString()],
    queryFn: async ({ pageParam }) => {
      if (!pageParam) {
        return {
          activities: initialActivities,
          cursorId: Number(initalCursorId),
        };
      }

      const category = searchParams.get('category') as ActivitiesCategoryType | undefined;
      const keyword = searchParams.get('keyword') || undefined;
      const minPrice = Number(searchParams.get('min-price') || 0);
      const maxPrice = Number(searchParams.get('max-price') || Infinity);
      const address = searchParams.get('address') || '';

      const data = await getActivitiesList({
        method: 'cursor',
        cursorId: Number(pageParam),
        size: 28,
        ...(category && { category }),
        ...(keyword && { keyword }),
      });

      const filteredActivities = data.activities.filter(
        (item: Activity) =>
          item.price >= minPrice && item.price <= maxPrice && item.address.includes(address),
      );

      return { activities: filteredActivities, cursorId: data.cursorId };
    },

    initialPageParam: initalCursorId ? Number(initalCursorId) : undefined,
    getNextPageParam: (lastPage) => (lastPage.cursorId !== 0 ? lastPage.cursorId : undefined),
  });

  const allActivities = queryResult.data?.pages.flatMap((page) => page.activities) || [];

  return {
    ...queryResult,
    allActivities,
    searchParams,
  };
}
