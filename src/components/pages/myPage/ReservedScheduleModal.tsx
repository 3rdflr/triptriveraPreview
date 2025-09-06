import { Modal } from 'react-simplified-package';
import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';
import { format } from 'date-fns';
import ScheduleTab from './ScheduleTab';
import { useScheduleStore } from '@/store/reservedScheduleStore';
import {
  MyReservationUpdateResponse,
  ReservationListResponse,
  UpdateReservedScheduleBody,
} from '@/types/myReservation.type';
import { getReservationsList, updateReservedSchedule } from '@/app/api/myReservations';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useOverlay } from '@/hooks/useOverlay';
import { errorToast, successToast } from '@/lib/utils/toastUtils';

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
  const overlay = useOverlay();
  const queryClient = useQueryClient();
  const { status, setStatus, setSelectedSchedule, selectedSchedules } = useScheduleStore();

  const scheduleId = selectedSchedules[status];

  const {
    data: reservationStatusListData,
    refetch: refetchReservationStatusList,
    isLoading,
  } = useQuery<ReservationListResponse, Error>({
    queryKey: ['reservation-schedule-list', activityId, scheduleId, status],
    queryFn: () => {
      if (!activityId || !scheduleId) {
        return Promise.resolve({ reservations: [], totalCount: 0, cursorId: 0 });
      }
      return getReservationsList(Number(activityId), { scheduleId: Number(scheduleId), status });
    },
    enabled: !!activityId && !!scheduleId,
  });

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

  const handleScheduleSelect = (value: string, tab: keyof typeof selectedSchedules) => {
    setSelectedSchedule(tab, value);
    refetchReservationStatusList();
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName={clsx('bg-white !py-7.5 !px-6 !rounded-3xl', className)}
      buttonClassName='!hidden'
    >
      <div className='flex flex-col items-center gap-3 w-73'>
        <header className='flex justify-between items-center w-full'>
          <span className='text-18-bold'>{date ? format(new Date(date), 'yy년 M월 d일') : ''}</span>
          <IoClose size={18} onClick={onClose} />
        </header>
        <ScheduleTab
          reservations={reservationStatusListData?.reservations ?? []}
          isLoading={isLoading}
          onConfirm={handleConfirmReservation}
          onDecline={handleDeclineReservation}
          onSelectSchedule={handleScheduleSelect}
        />
      </div>
    </Modal>
  );
};

export default ReservedScheduleModal;
