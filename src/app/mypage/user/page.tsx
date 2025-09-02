'use client';
import { FormProvider } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import FormInput from '@/components/common/FormInput';
import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { userFormSchema } from '@/lib/utils/userSchema';

type UserFormValues = {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const UserPage = () => {
  const methods = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nickname: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  const { register, handleSubmit, getValues, formState, trigger } = methods;
  const { isSubmitted, isSubmitting, isValid, errors } = formState;

  const onSubmit = async (data: UserFormValues) => {
    console.log('폼 유효성 통과', data);
  };

  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex flex-col w-full items-start gap-4 md:gap-16'>
        <div className='flex flex-col gap-2.5'>
          <Label className='text-[18px] font-bold'>내 정보</Label>
          <span className='text-14-medium text-grayscale-500'>
            닉네임과 비밀번호를 수정하실 수 있습니다.
          </span>
        </div>
        <div className='flex flex-col w-full'>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-6'>
                {/* 제목 */}
                <FormInput
                  type='text'
                  id='nickname'
                  label='닉네임'
                  placeholder='닉네임을 입력해 주세요'
                  aria-invalid={isSubmitted ? (errors.nickname ? 'true' : 'false') : undefined}
                  error={errors.nickname?.message}
                  {...register('nickname')}
                />
                {/* 이메일 */}
                <FormInput
                  type='text'
                  id='email'
                  label='이메일'
                  placeholder='이메일을 입력해 주세요'
                  aria-invalid={isSubmitted ? (errors.email ? 'true' : 'false') : undefined}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <FormInput
                  type='password'
                  id='password'
                  label='비밀번호'
                  placeholder='8자 이상 입력해 주세요'
                  aria-invalid={isSubmitted ? (errors.password ? 'true' : 'false') : undefined}
                  error={errors.password?.message}
                  onInput={() => {
                    if (getValues('confirmPassword')) {
                      trigger('confirmPassword');
                    }
                  }}
                  {...register('password')}
                />
                <FormInput
                  type='password'
                  id='confirmPassword'
                  label='비밀번호 확인'
                  placeholder='비밀번호를 한 번 더 입력해 주세요'
                  aria-invalid={
                    isSubmitted ? (errors.confirmPassword ? 'true' : 'false') : undefined
                  }
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </div>
              <div className='flex justify-center'>
                <Button size='md' disabled={!isValid}>
                  {isSubmitting ? '저장중...' : '저장하기'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
