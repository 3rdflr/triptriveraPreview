import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMyActivitiesList } from '@/app/api/myActivities';
import { MyActivitiesListResponse } from '@/types/myActivity.type';

const useInfiniteMyExperienceList = (initialCursorId: number | null) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<MyActivitiesListResponse>({
    queryKey: ['my-activities-list'],
    queryFn: async ({ pageParam }): Promise<MyActivitiesListResponse> => {
      const response = await getMyActivitiesList({
        ...(pageParam ? { cursorId: Number(pageParam) } : {}),
        size: 3,
      });

      return response;
    },
    initialPageParam: initialCursorId,
    getNextPageParam: (lastPage) => {
      if (!lastPage.activities || lastPage.activities.length === 0) {
        return undefined;
      }

      return lastPage.cursorId;
    },
  });

  const myExperienceListData = useMemo(() => {
    return data?.pages?.flatMap((page) => page.activities) ?? [];
  }, [data?.pages]);

  return {
    myExperienceListData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    fetchNextPage,
    refetch,
  };
};

export default useInfiniteMyExperienceList;
