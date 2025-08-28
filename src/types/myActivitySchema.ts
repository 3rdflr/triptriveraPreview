import { z } from 'zod';
import { parse, isAfter, isValid } from 'date-fns';
import { toApiDate } from '@/lib/utils/dateUtils';

export const MyActivitySchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  category: z.enum(['문화 · 예술', '식음료', '스포츠', '투어', '관광', '웰빙'], {
    message: '카테고리를 선택해주세요.',
  }),
  description: z.string().min(1, { message: '설명을 입력해주세요.' }),
  price: z
    .string()
    .nonempty('가격을 입력해 주세요.')
    .regex(/^\d+$/, '숫자만 입력할 수 있습니다.')
    .refine((val) => Number(val) > 0, '가격은 0 이상이어야 합니다.'),
  address: z.string().min(1, { message: '주소를 입력해주세요.' }),
  schedules: z
    .array(
      z.object({
        id: z.number().optional(),
        date: z
          .string()
          .refine((val) => /^\d{2}\/\d{2}\/\d{2}$/.test(val), 'YY/MM/DD 형식이어야 해요')
          .transform((val) => toApiDate(val)),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .superRefine((schedules, ctx) => {
      const seen = new Set<string>();

      schedules.forEach((s, i) => {
        // 1) 날짜 또는 시간 입력 안됨
        if (!s.date || !s.startTime || !s.endTime) {
          ctx.addIssue({
            code: 'custom',
            path: [i, 'date'],
            message: '날짜와 시간을 입력해주세요.',
          });
          return;
        }

        // 날짜+시간 파싱
        const startDate = parse(`${s.date} ${s.startTime}`, 'yyyy/MM/dd HH:mm', new Date());
        const endDate = parse(`${s.date} ${s.endTime}`, 'yyyy/MM/dd HH:mm', new Date());

        if (!isValid(startDate) || !isValid(endDate)) {
          ctx.addIssue({
            code: 'custom',
            path: [i, 'date'],
            message: '날짜와 시간을 올바르게 입력해주세요.',
          });
          return;
        }

        // 2) 시작 시간이 종료 시간보다 늦은 경우
        if (isAfter(startDate, endDate) || startDate.getTime() === endDate.getTime()) {
          ctx.addIssue({
            code: 'custom',
            path: [i, 'date'],
            message: '시작 시간을 종료 시간보다 앞으로 설정해주세요.',
          });
          return;
        }

        // 3) 예약 시간 중복 체크
        const key = `${s.date}-${s.startTime}-${s.endTime}`;
        if (seen.has(key)) {
          ctx.addIssue({
            code: 'custom',
            path: [i, 'date'],
            message: '예약 시간은 중복될 수 없습니다.',
          });
          return;
        }
        seen.add(key);
      });
    }),
  bannerFiles: z.array(z.instanceof(File)).min(1, '배너 이미지를 업로드해주세요.'),
  subFiles: z.array(z.instanceof(File)).min(2, '소개 이미지를 2개 이상 업로드해주세요.'),
  bannerImageUrl: z.string(),
  subImageUrls: z.array(z.string()).optional(),
  subImages: z.array(
    z.object({
      id: z.number().optional(),
      imageUrl: z.string(),
    }),
  ),
});

export type MyActivityFormData = z.infer<typeof MyActivitySchema>;
