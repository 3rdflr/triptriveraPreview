export interface MyActivitySchedule {
  id?: number; // 서버에 있는 경우만
  date: string;
  startTime: string;
  endTime: string;
}

export interface MyActivityBase {
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  bannerImageUrl: string;
}

export interface MyActivityRequest extends MyActivityBase {
  subImageUrls: string[];
  schedules: MyActivitySchedule[];
}

export interface MyActivityDetail extends MyActivityBase {
  id: number;
  userId: number;
  subImages: { id: number; imageUrl: string }[];
  schedules: MyActivitySchedule[];
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface MyActivityUpdateRequest extends MyActivityBase {
  subImageIdsToRemove: number[];
  subImageUrlsToAdd: string[];
  scheduleIdsToRemove: number[];
  schedulesToAdd: { date: string; startTime: string; endTime: string }[];
}
