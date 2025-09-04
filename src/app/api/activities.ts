import axiosInstance from './axiosInstance';
import {
  ActivitiesCategoryType,
  ActivitiesSortType,
  Activity,
  ActivityDetail,
  SubImage,
  ScheduleTime,
  AvailableSchedule,
  ReservationStatus,
} from '@/types/activities.type';
import { Review } from '@/types/reviews.type';

// API 전용 타입들
export type MethodType = 'offset' | 'cursor';

// API 요청/응답 타입들
export interface ActivityCreateRequest {
  title: string;
  category: ActivitiesCategoryType;
  description: string;
  address: string;
  price: number;
  schedules: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
  bannerImageUrl: string;
  subImageUrls: string[];
}

export interface ActivityCreateResponse extends Activity {
  subImages: SubImage[];
  schedules: {
    date: string;
    times: ScheduleTime[];
  }[];
}

export interface ActivityUpdateRequest {
  title: string;
  category: ActivitiesCategoryType;
  description: string;
  address: string;
  price: number;
  bannerImageUrl: string;
  subImageIdsToRemove: number[];
  subImageUrlsToAdd: string[];
  scheduleIdsToRemove: number[];
  schedulesToAdd: {
    date: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface ActivityUpdateResponse extends Activity {
  subImages: SubImage[];
  schedules: {
    date: string;
    times: ScheduleTime[];
  }[];
}

// API 리스트 타입
export interface ActivitiesListRequest {
  method: MethodType;
  cursorId?: number;
  category?: ActivitiesCategoryType;
  keyword?: string;
  sort?: ActivitiesSortType;
  page?: number;
  size?: number;
}

export interface ActivitiesListResponse {
  cursorId: number;
  totalCount: number;
  activities: Activity[];
}

// API 리뷰 타입
export interface ReviewsRequest {
  page?: number;
  size?: number;
}

export interface ReviewsResponse {
  averageRating: number;
  totalCount: number;
  reviews: Review[];
}

// API 예약 타입
export interface ReservationRequest {
  scheduleId: number;
  headCount: number;
}

export interface ReservationResponse {
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

// API 이미지 업로드 타입
export interface ImageUploadResponse {
  activityImageUrl: string;
}

// API 예약 가능 스케줄 타입
export interface AvailableScheduleRequest {
  year: string; // YYYY format
  month: string; // MM format
}

// API Functions
/**
 * 체험 리스트 조회
 */
export const getActivitiesList = async (
  params: ActivitiesListRequest,
): Promise<ActivitiesListResponse> => {
  // // 목업 데이터 사용 (개발 단계)
  // const { mockActivitiesList } = await import('@/mocks/activities.mock');

  // // 실제 API 호출 시뮬레이션을 위한 지연
  // await new Promise((resolve) => setTimeout(resolve, 300));

  // return {
  //   cursorId: 0,
  //   totalCount: mockActivitiesList.length,
  //   activities: mockActivitiesList.slice(0, params.size || 20),
  // };

  // 실제 API 호출 (추후 활성화)
  const response = await axiosInstance.get('/activities', { params });
  return response.data;
};

/**
 * 체험 등록
 */
export const createActivity = async (
  data: ActivityCreateRequest,
): Promise<ActivityCreateResponse> => {
  console.log('🔗 createActivity API 호출:', { title: data.title });

  // Mock 데이터 생성 (테스트용)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const mockActivity: ActivityCreateResponse = {
    id: Math.floor(Math.random() * 1000) + 100,
    userId: 1,
    title: data.title,
    description: data.description,
    category: data.category,
    price: data.price,
    address: data.address,
    bannerImageUrl: data.bannerImageUrl,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subImages: data.subImageUrls.map((url, index) => ({
      id: index + 1,
      imageUrl: url,
    })),
    schedules: data.schedules.map((schedule, index) => ({
      date: schedule.date,
      times: [
        {
          id: index + 1,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        },
      ],
    })),
  };

  console.log('✅ createActivity API 응답:', {
    activityId: mockActivity.id,
    title: mockActivity.title,
  });

  return mockActivity;

  // 실제 API 호출 (주석 처리)
  // const response = await axiosInstance.post('/activities', data);
  // return response.data;
};

/**
 * 체험 상세 조회
 */
export const getActivityDetail = async (activityId: number): Promise<ActivityDetail> => {
  console.log('🔗 getActivityDetail API 호출:', { activityId });

  // Mock 데이터 사용 (테스트용)
  const { mockActivityDetail } = await import('@/mocks/activities.mock');

  // 약간의 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log('✅ getActivityDetail API 응답:', {
    activityId,
    title: mockActivityDetail.title,
    reviewCount: mockActivityDetail.reviewCount,
  });

  return mockActivityDetail;

  // 실제 API 호출 (주석 처리)
  // const response = await axiosInstance.get(`/activities/${activityId}`);
  // return response.data;
};

/**
 * 체험 예약 가능일 조회
 */
export const getAvailableSchedule = async (
  activityId: number,
  params: AvailableScheduleRequest,
): Promise<AvailableSchedule[]> => {
  console.log('🔗 getAvailableSchedule API 호출:', { activityId, params });

  // Mock 데이터 생성 (테스트용)
  await new Promise((resolve) => setTimeout(resolve, 200));

  // 간단한 목 데이터 생성 - 현재 월의 몇 개 날짜에 예약 가능
  const mockSchedules: AvailableSchedule[] = [
    {
      date: `${params.year}-${params.month}-05`,
      times: [
        { id: 1, startTime: '09:00', endTime: '10:00' },
        { id: 2, startTime: '14:00', endTime: '15:00' },
      ],
    },
    {
      date: `${params.year}-${params.month}-10`,
      times: [
        { id: 3, startTime: '10:00', endTime: '11:00' },
        { id: 4, startTime: '15:00', endTime: '16:00' },
      ],
    },
    {
      date: `${params.year}-${params.month}-15`,
      times: [{ id: 5, startTime: '11:00', endTime: '12:00' }],
    },
  ];

  console.log('✅ getAvailableSchedule API 응답:', {
    activityId,
    schedulesCount: mockSchedules.length,
  });

  return mockSchedules;

  // 실제 API 호출 (주석 처리)
  // const response = await axiosInstance.get(`/activities/${activityId}/available-schedule`, {
  //   params,
  // });
  // return response.data;
};

/**
 * 체험 리뷰 조회
 */
export const getActivityReviews = async (
  activityId: number,
  params?: ReviewsRequest,
): Promise<ReviewsResponse> => {
  console.log('🔗 getActivityReviews API 호출:', { activityId, params });

  // Mock 데이터 사용 (테스트용)
  const { getMockReviews } = await import('@/mocks/reviews.mock');

  // 약간의 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 500));

  const result = getMockReviews(activityId, params?.page || 1, params?.size || 10);

  console.log('✅ getActivityReviews API 응답:', {
    activityId,
    reviewsCount: result.reviews.length,
    totalCount: result.totalCount,
    averageRating: result.averageRating,
  });

  return result;

  // 실제 API 호출 (주석 처리)
  // const response = await axiosInstance.get(`/activities/${activityId}/reviews`, { params });
  // return response.data;
};

/**
 * 체험 예약 신청
 */
export const createReservation = async (
  activityId: number,
  data: ReservationRequest,
): Promise<ReservationResponse> => {
  console.log('🔗 createReservation API 호출:', { activityId, data });

  // Mock 데이터 생성 (테스트용)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockReservation: ReservationResponse = {
    id: Math.floor(Math.random() * 1000) + 1,
    teamId: 'team-123',
    userId: 1,
    activityId,
    scheduleId: data.scheduleId,
    status: 'pending',
    reviewSubmitted: false,
    totalPrice: data.headCount * 10000, // 가정: 1인당 10,000원
    headCount: data.headCount,
    date: '2024-01-15',
    startTime: '10:00',
    endTime: '11:00',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log('✅ createReservation API 응답:', {
    reservationId: mockReservation.id,
    totalPrice: mockReservation.totalPrice,
  });

  return mockReservation;

  // 실제 API 호출 (주석 처리)
  // const response = await axiosInstance.post(`/activities/${activityId}/reservations`, data);
  // return response.data;
};

/**
 * 체험 이미지 URL 생성
 */
export const uploadActivityImage = async (image: File): Promise<ImageUploadResponse> => {
  console.log('🔗 uploadActivityImage API 호출:', { fileName: image.name });

  // Mock 데이터 생성 (테스트용)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // 랜덤한 Unsplash 이미지 URL 생성
  const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?w=800&q=80`;

  const mockResponse: ImageUploadResponse = {
    activityImageUrl: mockImageUrl,
  };

  console.log('✅ uploadActivityImage API 응답:', {
    imageUrl: mockResponse.activityImageUrl,
  });

  return mockResponse;

  // 실제 API 호출 (주석 처리)
  // const formData = new FormData();
  // formData.append('image', image);
  // const response = await axiosInstance.post('/activities/image', formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // });
  // return response.data;
};
