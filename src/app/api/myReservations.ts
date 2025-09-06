import {
  MyReservationCreateRequest,
  MyReservationCreateResponse,
  MyReservationListRequest,
  MyReservationListResponse,
  MyReservationUpdateRequest,
  MyReservationUpdateResponse,
  ReservationBoardParams,
  ReservationBoardResponse,
  ReservationListParams,
  ReservationListResponse,
  ReservationScheduleParams,
  ReservationScheduleResponse,
  UpdateReservedScheduleBody,
} from '@/types/myReservation.type';
import axiosInstance from '@/app/api/axiosInstance';

/**
 * 내 예약 리스트
 */
export const getMyReservationsList = async (
  params: MyReservationListRequest,
): Promise<MyReservationListResponse> => {
  const response = await axiosInstance.get(`/my-reservations`, { params });
  return response.data;
};

/**
 * 내 예약 수정(취소)
 */
export const updateReservation = async (
  reservationId: number,
  data: MyReservationUpdateRequest,
): Promise<MyReservationUpdateResponse> => {
  const response = await axiosInstance.patch(`/my-reservations/${reservationId}`, data);
  return response.data;
};

/**
 * 내 예약 리뷰 작성
 */
export const createReservationReview = async (
  reservationId: number,
  data: MyReservationCreateRequest,
): Promise<MyReservationCreateResponse> => {
  const response = await axiosInstance.post(`/my-reservations/${reservationId}/reviews`, data);
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

/**
 * 내 체험 날짜별 예약 정보(신청, 승인, 거절)가 있는 스케줄 조회
 */
export const getReservedSchedule = async (
  activityId: number,
  params: ReservationScheduleParams,
): Promise<ReservationScheduleResponse> => {
  const response = await axiosInstance.get(`/my-activities/${activityId}/reserved-schedule`, {
    params,
  });
  return response.data;
};

/**
 * 내 체험 예약 시간대별 예약 내역 조회
 */
export const getReservationsList = async (
  activityId: number,
  params: ReservationListParams,
): Promise<ReservationListResponse> => {
  const response = await axiosInstance.get(`/my-activities/${activityId}/reservations`, {
    params,
  });
  return response.data;
};

/**
 * 내 체험 예약 상태 (승인, 거절) 업데이트
 */
export const updateReservedSchedule = async (
  activityId: number,
  reservationId: number,
  body: UpdateReservedScheduleBody,
): Promise<MyReservationUpdateResponse> => {
  const response = await axiosInstance.patch(
    `/my-activities/${activityId}/reservations/${reservationId}`,
    body,
  );
  return response.data;
};
