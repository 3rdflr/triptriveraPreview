import { z } from 'zod';
import { parse, isAfter, isValid } from 'date-fns';

export const MyActivitySchema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  category: z.string().min(1, { message: '카테고리를 선택해주세요.' }),
  description: z.string().min(1, { message: '설명을 입력해주세요.' }),
  price: z
    .string()
    .nonempty('가격을 입력해 주세요')
    .regex(/^\d+$/, '숫자만 입력할 수 있습니다')
    .refine((val) => Number(val) >= 0, '0 이상의 숫자여야 합니다'),
  address: z.string().min(1, { message: '주소를 입력해주세요.' }),
  schedules: z
    .array(
      z.object({
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        _isNewRow: z.boolean().optional(),
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
  bannerImageUrl: z.string(),
  subImages: z.array(z.string()),
});

export type MyActivityFormData = z.infer<typeof MyActivitySchema>;
