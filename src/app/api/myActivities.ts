import { ActivityUpdateRequest, ActivityUpdateResponse } from './activities';
import axiosInstance from './axiosInstance';
import {
  ApiResponse,
  MyActivitiesListRequest,
  MyActivitiesListResponse,
  ReservationBoardParams,
  ReservationBoardResponse,
} from '@/types/myActivity.type';

/**
 * 내 체험 리스트 조회
 */
export const getMyActivitiesList = async (
  params: MyActivitiesListRequest,
): Promise<MyActivitiesListResponse> => {
  const response = await axiosInstance.get(`/my-activities`, { params });
  return response.data;
};

/**
 * 내 체험 수정
 */
export const updateActivity = async (
  activityId: number,
  data: ActivityUpdateRequest,
): Promise<ActivityUpdateResponse> => {
  const response = await axiosInstance.patch(`/my-activities/${activityId}`, data);
  return response.data;
};

/**
 * 내 체험 삭제
 */
export const deleteActivity = async (activityId: number): Promise<ApiResponse> => {
  const response = await axiosInstance.delete(`/my-activities/${activityId}`);
  return response.data;
};

/**
 * 내 체험 월별 예약 현황 조회
 */
export const getReservationDashboard = async (
  activityId: number,
  params: ReservationBoardParams,
): Promise<ReservationBoardResponse> => {
  const response = await axiosInstance.get(`/my-activities/${activityId}/reservation-dashboard`, {
    params,
  });
  return response.data;
};
