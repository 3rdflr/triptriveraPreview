import { ReservationStatus } from '@/types/activities.type';

export interface ReservationActivity {
  bannerImageUrl: string;
  title: string;
  id: number;
}

export interface Reservation {
  id: number;
  teamId: string;
  userId: number;
  activity: ReservationActivity;
  scheduleId: number;
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyReservationListRequest {
  cursorId?: number;
  size?: number;
  status?: ReservationStatus;
}

export interface MyReservationListResponse {
  cursorId: number;
  totalCount: number;
  reservations: Reservation[];
}

export interface MyReservationUpdateRequest {
  status: ReservationStatus;
}

export interface MyReservationUpdateResponse {
  id: number;
  teamId: string;
  userId: number;
  activityId: number;
  scheduleId: number;
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyReservationCreateRequest {
  rating: number;
  content: string;
}

export interface MyReservationCreateResponse {
  updatedAt: string;
  createdAt: string;
  content: string;
  rating: number;
  userId: number;
  activityId: number;
  teamId: string;
  id: number;
}

export interface ReservationBoardParams {
  year: string;
  month: string;
}

export interface ReservationCounts {
  completed: number;
  confirmed: number;
  pending: number;
}

export interface ReservationByDate {
  date: string;
  reservations: ReservationCounts;
}

export type ReservationBoardResponse = ReservationByDate[];

export interface ReservedCounts {
  declined: number;
  confirmed: number;
  pending: number;
}

export interface ReservationSchedule {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: ReservedCounts;
}

export type ReservationScheduleResponse = ReservationSchedule[];

export interface ReservationScheduleParams {
  date: string;
}

export interface ReservedSchedule {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: ReservedCounts;
}

export interface ReservedReservation {
  id: number;
  nickname: string;
  userId: number;
  teamId: string;
  activityId: number;
  scheduleId: number;
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export type ReservationListStatus = Exclude<ReservationStatus, 'canceled' | 'completed'>;
export interface ReservationListParams {
  cursorId?: number;
  size?: number;
  scheduleId: number;
  status: ReservationListStatus;
}

export interface ReservationListResponse {
  cursorId: number;
  totalCount: number;
  reservations: ReservedReservation[];
}

export type UpdateReservedScheduleStatus = Exclude<
  ReservationStatus,
  'pending' | 'canceled' | 'completed'
>;

export interface UpdateReservedScheduleBody {
  status: UpdateReservedScheduleStatus;
}
