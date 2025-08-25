export type RowData = {
  date: string;
  time: {
    start: string;
    end: string;
  };
};

export interface ActivityBase {
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  bannerImageUrl: string;
}

export interface ActivityDetail extends ActivityBase {
  id: number;
  userId: number;
  subImages: { id: number; imageUrl: string }[];
  schedules: { id: number; date: string; startTime: string; endTime: string }[];
  reviewCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityUpdateRequest extends ActivityBase {
  subImageIdsToRemove: number[];
  subImageUrlsToAdd: string[];
  scheduleIdsToRemove: number[];
  schedulesToAdd: { date: string; startTime: string; endTime: string }[];
}
