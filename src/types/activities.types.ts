export type Category = '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';

export interface Activities {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: Category;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Activity extends Activities {
  subImages: SubImage[];
  schedules: Schedule[];
}

export interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

export interface SubImage {
  id: number;
  imageUrl: string;
}

export interface ActivityFormData {
  title: string;
  description: string;
  category: Category;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating?: number;
  reviewCount?: number;
  subImageUrls: string[];
  schedules?: Omit<Schedule, 'id'>[];
}

export interface PopularActivitiesResponse {
  activities: Activity[];
}
