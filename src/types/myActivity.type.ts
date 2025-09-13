import { Activity } from './activities.type';

export interface MyActivitySchedule {
  id?: number | string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface MyActivitiesListRequest {
  cursorId?: number;
  size?: number;
}

export interface MyActivitiesListResponse {
  cursorId: number | null;
  totalCount: number;
  activities: Activity[];
}

export interface ApiResponse {
  message: string;
}
