import { z } from 'zod';

/**
 * 기존 validations 기반 Zod 스키마
 */
export const userFormSchema = z
  .object({
    nickname: z
      .string()
      .min(1, '닉네임을 입력해주세요.')
      .max(10, '열 자 이하로 작성해주세요.')
      .refine((val) => !/\s/.test(val), '공백 없이 입력해주세요.'),
    email: z
      .string()
      .min(1, '이메일은 필수 입력입니다.')
      .email('이메일 형식으로 작성해 주세요.')
      .refine((val) => !/\s/.test(val), '공백 없이 입력해주세요.'),
    password: z
      .string()
      .min(8, '8자 이상 입력해주세요.')
      .refine((val) => !/\s/.test(val), '공백 없이 입력해주세요.'),
    confirmPassword: z.string().min(1, '비밀번호 확인은 필수 입력입니다.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export type UserFormValues = z.infer<typeof userFormSchema>;
