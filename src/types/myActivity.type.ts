import { Activity } from './activities.type';

export interface MyActivitySchedule {
  id?: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface MyActivitiesListRequest {
  cursorId?: number;
  size?: number;
}

export interface MyActivitiesListResponse {
  cursorId: number;
  totalCount: number;
  activities: Activity[];
}

export interface ApiResponse {
  message: string;
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

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: 'completed' | 'confirmed' | 'pending';
}
