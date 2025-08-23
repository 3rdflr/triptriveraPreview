// 체험 카테고리 타입
export type ActivitiesCategoryType = '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';

// 체험 조회시 정렬 타입
export type ActivitiesSortType = 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest';

// 예약 상태 타입
export type ReservationStatus = 'pending' | 'confirmed' | 'declined' | 'canceled' | 'completed';

// 컴포넌트에서 사용할 서브 이미지 인터페이스
export interface SubImage {
  id: number;
  imageUrl: string;
}

// 컴포넌트에서 사용할 스케줄 인터페이스
export interface Schedule {
  id: number;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
}

// 컴포넌트에서 사용할 스케줄 시간 인터페이스
export interface ScheduleTime {
  id: number;
  startTime: string;
  endTime: string;
}

// 컴포넌트에서 사용할 예약 가능한 스케줄 인터페이스
export interface AvailableSchedule {
  date: string;
  times: ScheduleTime[];
}

// 컴포넌트에서 사용할 기본 체험 인터페이스
export interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: ActivitiesCategoryType;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

// 컴포넌트에서 사용할 체험 상세 인터페이스
export interface ActivityDetail extends Activity {
  subImages: SubImage[];
  schedules: Schedule[];
}

// 체험 카드 표시용
export interface ActivityCard {
  id: number;
  title: string;
  category: ActivitiesCategoryType;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
}

// 체험 생성 폼 데이터
export interface ActivityFormData {
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

// 예약 폼 데이터
export interface ReservationFormData {
  scheduleId: number;
  headCount: number;
}

// 예약 정보 표시용 인터페이스
export interface ReservationInfo {
  id: number;
  activityTitle: string;
  status: ReservationStatus;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  reviewSubmitted: boolean;
}
