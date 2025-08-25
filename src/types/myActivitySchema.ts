import { z } from 'zod';

export const MyActivitySchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  category: z.string().min(1, { message: '카테고리를 선택해주세요.' }),
  description: z.string().min(1, { message: '설명을 입력해주세요.' }),
  price: z.number().min(0, { message: '가격을 입력해주세요.' }),
  address: z.string().min(1, { message: '주소를 입력해주세요.' }),
  schedules: z.array(
    z.object({
      date: z.string().min(1, { message: '날짜를 입력해주세요.' }),
      startTime: z.string().min(1, { message: '시작 시간을 입력해주세요.' }),
      endTime: z.string().min(1, { message: '종료 시간을 입력해주세요.' }),
    }),
  ),
  bannerImageUrl: z.string().min(1, { message: '배너 이미지를 등록해주세요.' }),
  subImageUrls: z
    .array(z.string())
    .min(2, { message: '소개 이미지는 최소 2개 이상 등록해주세요.' }),
});

export type MyActivityFormData = z.infer<typeof MyActivitySchema>;
