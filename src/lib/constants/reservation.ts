import { ReservationStatus, ReservationStatusText } from '@/types/activities.type';

export const reservationStatus: Record<ReservationStatus, ReservationStatusText> = {
  pending: '예약 신청',
  confirmed: '예약 승인',
  canceled: '예약 취소',
  declined: '예약 거절',
  completed: '체험 완료',
};
