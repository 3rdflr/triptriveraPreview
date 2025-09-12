import { getMyReservationsList } from '@/app/api/myReservations';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ReservationStatusWithAll } from '@/lib/constants/reservation';
import { MyReservationListResponse } from '@/types/myReservation.type';
import { useMemo } from 'react';

const useInfiniteReservationList = (
  initialCursorId: number | null,
  status: ReservationStatusWithAll,
) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<MyReservationListResponse>({
    queryKey: ['reservation-list', status],
    queryFn: async ({ pageParam }): Promise<MyReservationListResponse> => {
      const response = await getMyReservationsList({
        status: status === 'all' ? undefined : status,
        ...(pageParam ? { cursorId: Number(pageParam) } : {}),
        size: 3,
      });

      return response;
    },
    initialPageParam: initialCursorId,
    getNextPageParam: (lastPage) => {
      if (!lastPage.reservations || lastPage.reservations.length === 0) {
        return undefined;
      }

      return lastPage.cursorId;
    },
    // refetchOnMount: true,
  });

  const reservationListData = useMemo(() => {
    return data?.pages.flatMap((page) => page.reservations) ?? [];
  }, [data?.pages]);

  return {
    reservationListData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    isError,
    error,
    fetchNextPage,
    refetch,
  };
};

export default useInfiniteReservationList;
