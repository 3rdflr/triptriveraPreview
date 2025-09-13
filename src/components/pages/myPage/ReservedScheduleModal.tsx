import { Modal } from 'react-simplified-package';
import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';
import { format } from 'date-fns';
import ScheduleTab from './ScheduleTab';
import { useScheduleStore } from '@/store/reservedScheduleStore';
import {
  MyReservationUpdateResponse,
  UpdateReservedScheduleBody,
} from '@/types/myReservation.type';
import { getReservedSchedule, updateReservedSchedule } from '@/app/api/myReservations';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useOverlay } from '@/hooks/useOverlay';
import { errorToast, successToast } from '@/lib/utils/toastUtils';
import { useScreenSize } from '@/hooks/useScreenSize';
import BottomSheet from '@/components/common/BottomSheet';
import { useEffect, useState } from 'react';
import useInfiniteScheduleList from '@/hooks/useInfiniteScheduleList';

interface ReservedScheduleModalProps {
  activityId: string;
  date: string;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

const ReservedScheduleModal = ({
  activityId,
  date,
  className,
  isOpen,
  onClose,
}: ReservedScheduleModalProps) => {
  const { isDesktop } = useScreenSize();
  const overlay = useOverlay();
  const queryClient = useQueryClient();
  const [showNoDatatoast, setShowNoDatatoast] = useState(false);
  const {
    status,
    setStatus,
    setActiveSchedule,
    activeScheduleId: _activeScheduleId,
    setScheduleList,
  } = useScheduleStore();

  const { data: reservedScheduleData, isFetched: isReservedScheduleFetched } = useQuery({
    queryKey: ['reserved-schedule', activityId, date],
    queryFn: () => getReservedSchedule(Number(activityId), { date }),
    enabled: !!isOpen && !!activityId && !!date,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { reservationStatusListData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteScheduleList({ initialCursorId: null, activityId, status });

  const { mutate: updateSchedule } = useMutation<
    MyReservationUpdateResponse,
    AxiosError<{ message: string }>,
    { activityId: number; reservationId: number; body: UpdateReservedScheduleBody }
  >({
    mutationFn: ({ activityId, reservationId, body }) =>
      updateReservedSchedule(activityId, reservationId, body),
    retry: 1,
    retryDelay: 300,
    onSuccess: (_data, variables) => {
      const status = variables.body.status;

      if (status === 'declined') {
        setStatus('declined');
        errorToast.run('예약이 거절되었습니다.');
      } else if (status === 'confirmed') {
        setStatus('confirmed');
        successToast.run('예약이 승인되었습니다.');
      }
      queryClient.invalidateQueries({ queryKey: ['reserved-schedule'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-list'] });
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

  const handleScheduleSelect = (value: string, tab: keyof typeof _activeScheduleId) => {
    setActiveSchedule(tab, value);
  };

  const handleConfirmReservation = (activityId: number, reservationId: number) => {
    updateSchedule({
      activityId,
      reservationId,
      body: { status: 'confirmed' },
    });
  };

  const handleDeclineReservation = (activityId: number, reservationId: number) => {
    updateSchedule({
      activityId,
      reservationId,
      body: { status: 'declined' },
    });
  };

  useEffect(() => {
    if (
      isOpen &&
      isReservedScheduleFetched &&
      !showNoDatatoast &&
      (!reservedScheduleData || reservedScheduleData.length === 0)
    ) {
      errorToast.run('확인 가능한 예약 내역이 없습니다.');
      setShowNoDatatoast(true);
    }
  }, [isOpen, isReservedScheduleFetched, reservedScheduleData, showNoDatatoast]);

  useEffect(() => {
    if (!isOpen) setShowNoDatatoast(false);

    // 모달 열릴 때 초기화
    (['pending', 'confirmed', 'declined'] as const).forEach((key) => {
      setScheduleList(key, []);
      setActiveSchedule(key, '');
    });
  }, [isOpen, setScheduleList, setActiveSchedule]);

  useEffect(() => {
    if (!reservedScheduleData || reservedScheduleData.length === 0) return;

    (['pending', 'confirmed', 'declined'] as const).forEach((key) => {
      const filtered = reservedScheduleData.filter((s) => s.count?.[key] && s.count[key] > 0);

      setScheduleList(key, filtered);

      // 첫 번째 scheduleId로 세팅
      setActiveSchedule(key, filtered.length > 0 ? String(filtered[0].scheduleId) : '');
    });
  }, [setScheduleList, setActiveSchedule, reservedScheduleData]);

  if (!reservedScheduleData || reservedScheduleData.length === 0) return null;

  if (isDesktop)
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        modalClassName={clsx('bg-white !py-7.5 !px-6 !rounded-3xl', className)}
        buttonClassName='!hidden'
        containerClassName='bg-transparent'
      >
        <div className='flex flex-col items-center gap-3 w-73'>
          <header className='flex justify-between items-center w-full'>
            <span className='text-18-bold'>
              {date ? format(new Date(date), 'yy년 M월 d일') : ''}
            </span>
            <IoClose size={18} onClick={onClose} />
          </header>
          <ScheduleTab
            reservations={reservationStatusListData ?? []}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            onConfirm={handleConfirmReservation}
            onDecline={handleDeclineReservation}
            onSelectSchedule={handleScheduleSelect}
          />
        </div>
      </Modal>
    );

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={onClose}
      title={date ? format(new Date(date), 'yy년 M월 d일') : ''}
    >
      <ScheduleTab
        reservations={reservationStatusListData ?? []}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        onConfirm={handleConfirmReservation}
        onDecline={handleDeclineReservation}
        onSelectSchedule={handleScheduleSelect}
      />
    </BottomSheet>
  );
};

export default ReservedScheduleModal;
