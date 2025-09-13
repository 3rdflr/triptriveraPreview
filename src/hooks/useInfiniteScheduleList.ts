import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ReservationListResponse, ReservationListStatus } from '@/types/myReservation.type';
import { getReservationsList } from '@/app/api/myReservations';
import { useScheduleStore } from '@/store/reservedScheduleStore';

interface useInfiniteScheduleListProps {
  initialCursorId: number | null;
  activityId: string | null;
  status: ReservationListStatus;
}

const useInfiniteScheduleList = ({
  initialCursorId,
  activityId,
  status,
}: useInfiniteScheduleListProps) => {
  const { activeScheduleId } = useScheduleStore();
  const scheduleId = activeScheduleId[status as keyof typeof activeScheduleId];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<ReservationListResponse>({
    queryKey: ['reservation-schedule-list', activityId, scheduleId, status],
    queryFn: async ({ pageParam }): Promise<ReservationListResponse> => {
      if (!activityId || !scheduleId) {
        return { reservations: [], totalCount: 0, cursorId: 0 };
      }

      const response = await getReservationsList(Number(activityId), {
        scheduleId: Number(scheduleId),
        status,
        cursorId: pageParam ? Number(pageParam) : undefined,
        size: 3,
      });

      return { ...response, reservations: response.reservations ?? [] };
    },
    enabled: !!activityId && !!scheduleId,
    initialPageParam: initialCursorId,
    getNextPageParam: (lastPage) => lastPage.cursorId ?? undefined,
    staleTime: 0,
  });

  const reservationStatusListData = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.reservations ?? []);
  }, [data?.pages]);

  return {
    reservationStatusListData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    fetchNextPage,
    refetch,
  };
};

export default useInfiniteScheduleList;
