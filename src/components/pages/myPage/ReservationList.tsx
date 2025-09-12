import useInfiniteReservationList from '@/hooks/useInfiniteReservationList';
import { InfinityScroll } from '@/components/common/InfinityScroll';
import { ReservationStatusWithAll } from '@/lib/constants/reservation';
import MyExperienceCardSkeleton from './MyExperienceSkeleton';
import {
  MyReservationUpdateRequest,
  MyReservationUpdateResponse,
  Reservation,
} from '@/types/myReservation.type';
import ReservationListCard from './ReservationListCard';
import ConfirmActionModal from '@/components/common/ConfirmActionModal';
import { useOverlay } from '@/hooks/useOverlay';
import { ReviewModal } from '../myActivities/ReviewModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { updateReservation } from '@/app/api/myReservations';
import ConfirmModal from '@/components/common/ConfirmModal';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ReservationEmptyProps {
  text: string;
}

interface ReservationListProps {
  initialCursorId: number | null;
  status: ReservationStatusWithAll;
}

const ReservationList = ({ initialCursorId, status }: ReservationListProps) => {
  const router = useRouter();
  const overlay = useOverlay();
  const queryClient = useQueryClient();

  const { reservationListData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteReservationList(initialCursorId, status);

  const ReservationEmpty = ({ text }: ReservationEmptyProps) => {
    return (
      <div className='flex flex-col mx-auto items-center'>
        <Image
          src={'/images/icons/_empty.png'}
          width={182}
          height={182}
          priority
          alt='체험 관리 디폴트 이미지'
        />
        <span className='text-18-medium text-grayscale-600'>{text}</span>
      </div>
    );
  };

  const updateReservationMutation = useMutation<
    MyReservationUpdateResponse,
    AxiosError<{ message: string }>,
    { reservationId: number; data: MyReservationUpdateRequest }
  >({
    mutationFn: ({ reservationId, data }) => updateReservation(reservationId, data),
    retry: 1,
    retryDelay: 300,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation-list', status] });
      queryClient.invalidateQueries({ queryKey: ['reservation-list', 'all'] });
    },
    onError: (error) => {
      overlay.open(({ isOpen, close }) => (
        <ConfirmModal
          title={error.response?.data?.message}
          isOpen={isOpen}
          onClose={close}
          onAction={close}
        />
      ));
    },
  });

  const { mutate: updateReservationState } = updateReservationMutation;

  const onClickCancel = (id: number) => {
    updateReservationState({ reservationId: id, data: { status: 'canceled' } });
  };

  const onClickShowCancelModal = (id: number) => {
    overlay.open(({ isOpen, close }) => (
      <ConfirmActionModal
        title='예약을 취소하시겠어요?'
        actionText='취소하기'
        isOpen={isOpen}
        onClose={close}
        onAction={() => {
          close();
          onClickCancel(id);
        }}
      />
    ));
  };

  const onClickReview = (reservation: Reservation) => {
    overlay.open(({ isOpen, close }) => (
      <ReviewModal data={reservation} isOpen={isOpen} onClose={close} />
    ));
  };

  const onClickGoReview = (id: number) => {
    router.push(`/activities/${id}`);
  };

  return (
    <InfinityScroll
      items={reservationListData}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      height={680}
      itemHeightEstimate={210}
      scrollKey={`reservation-list`}
      className='rounded-3xl px-4 scrollbar-hide'
    >
      {/* 초기 로딩 스켈레톤 */}
      <InfinityScroll.Skeleton count={3}>
        <MyExperienceCardSkeleton />
      </InfinityScroll.Skeleton>
      <InfinityScroll.Contents loadingText='더 많은 후기를 불러오는 중입니다...'>
        {(reservation: Reservation) => (
          <ReservationListCard
            key={reservation.id}
            data={reservation}
            onCancel={onClickShowCancelModal}
            onReview={onClickReview}
            onGoReview={onClickGoReview}
          />
        )}
      </InfinityScroll.Contents>

      <InfinityScroll.Empty className='flex flex-col items-center justify-center gap-3 text-gray-500'>
        <ReservationEmpty text='예약내역이 없어요' />
      </InfinityScroll.Empty>
    </InfinityScroll>
  );
};

export default ReservationList;
