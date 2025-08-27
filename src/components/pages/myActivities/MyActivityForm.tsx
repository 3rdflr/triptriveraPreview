'use client';
import DateTimeRow from './DateTimeRow';
import {
  Controller,
  FieldError,
  FieldErrors,
  FieldErrorsImpl,
  FormProvider,
  Merge,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import ImageUploader from '@/components/pages/myActivities/ImageUploader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CategorySelect from './CategorySelect';
import Script from 'next/script';
import { MyActivityFormData, MyActivitySchema } from '@/types/myActivitySchema';
import FormInput from '@/components/common/FormInput';
import clsx from 'clsx';
import { MyActivitySchedule } from '@/types/myActivity.types';
import { useMutation } from '@tanstack/react-query';
import {
  ActivityCreateRequest,
  ActivityCreateResponse,
  createActivity,
  ImageUploadResponse,
  uploadActivityImage,
} from '@/app/api/activities';
import { ActivitiesCategoryType } from '@/types/activities.type';

interface MyActivityFormProps {
  mode?: 'EDIT' | 'REGISTER';
}

const MyActivityForm = ({ mode = 'REGISTER' }: MyActivityFormProps) => {
  const methods = useForm({
    resolver: zodResolver(MyActivitySchema),
    defaultValues: {
      title: '',
      category: undefined,
      description: '',
      price: '',
      address: '',
      bannerImageUrl: '',
      subImageUrls: [] as string[],
      bannerFiles: [],
      subFiles: [],
      schedules: [{ date: '', startTime: '', endTime: '' }],
    },
    mode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: false,
  });

  const { register, control, setValue, watch, formState, trigger } = methods;
  const { errors } = formState;

  const {
    fields: scheduleFields,
    update,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'schedules',
  });

  const uploadImageMutation = useMutation<ImageUploadResponse, Error, File>({
    mutationFn: (file: File) => uploadActivityImage(file),
    retry: 1,
    retryDelay: 300,
    onSuccess: (response) => {
      console.log('업로드 성공', response.activityImageUrl);
    },
    onError: (error) => {
      console.log('업로드 실패', error);
    },
  });

  const registerMutation = useMutation<ActivityCreateResponse, Error, ActivityCreateRequest>({
    mutationFn: (data: ActivityCreateRequest) => createActivity(data),
    retry: 1,
    retryDelay: 300,
    onSuccess: (response) => {
      console.log(response);
      console.log('등록 완료 후 페이지 이동 필요');
      // '등록하기' 버튼을 누르면 체험이 등록이 되고 “등록이 완료되었습니다” 모달창이 나타납니다.
    },
    onError: (error) => {
      console.log('업로드 실패', error);
    },
  });

  const uploadImageAndGetUrl = async () => {
    // 메인 이미지 업로드
    const bannerUploadResponse = await uploadImageMutation.mutateAsync(watch('bannerFiles')[0]);
    setValue('bannerImageUrl', bannerUploadResponse.activityImageUrl, {
      shouldValidate: true,
      shouldDirty: true,
    });
    // 서브 이미지 업로드
    const subImagesUploadResponse = await Promise.all(
      watch('subFiles').map((file) => uploadImageMutation.mutateAsync(file)),
    );
    setValue(
      'subImageUrls',
      subImagesUploadResponse.map((response) => response.activityImageUrl),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const handleOpenAddressSearch = () => {
    let addr = '';
    new window.daum.Postcode({
      oncomplete: function (data) {
        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }
        setValue('address', addr, { shouldValidate: true });
      },
    }).open();
  };

  const registerForm = async () => {
    console.log('등록 api 호출');
    await uploadImageAndGetUrl();
    // 2. API 전송용 데이터 변환
    const payload: ActivityCreateRequest = {
      ...methods.getValues(),
      category: methods.getValues('category') as ActivitiesCategoryType,
      price: Number(methods.getValues('price').replace(/,/g, '')),
    };

    registerMutation.mutate(payload);
  };

  const onSubmit = async (data: MyActivityFormData) => {
    console.log('폼 유효성 통과 ✅', data);
    registerForm();
  };

  const onError = (errors: FieldErrors<MyActivityFormData>) => {
    console.log('폼 에러 발생 ❌', errors);
  };

  return (
    <div className='flex flex-col'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit, onError)}>
          <div className='flex flex-col gap-6'>
            <Label className='text-[18px] font-bold'>
              {mode === 'REGISTER' ? '내 체험 등록' : '내 체험 수정'}
            </Label>

            {/* 제목 */}
            <div className='flex flex-col gap-2.5'>
              <FormInput
                type='text'
                id='title'
                label='제목'
                placeholder='제목을 입력해 주세요'
                error={errors.title?.message}
                {...register('title')}
              />
            </div>

            {/* 카테고리 */}
            <div className='flex flex-col gap-2.5'>
              <Label>카테고리</Label>
              <Controller
                name='category'
                control={control}
                rules={{ required: '카테고리를 선택해주세요' }}
                render={({ field, fieldState }) => (
                  <div>
                    <CategorySelect
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={() => {
                        field.onBlur(); // 필드 기본 onBlur 호출
                        trigger('category'); // 선택 안 하면 즉시 validation
                      }}
                    />
                    {fieldState.error && (
                      <small className='text-12-medium ml-2 text-[var(--secondary-red-500)] mt-[6px] leading-[12px]'>
                        {fieldState.error.message}
                      </small>
                    )}
                  </div>
                )}
              />
            </div>

            {/* 설명 */}
            <div className='flex flex-col gap-2.5'>
              <Label>설명</Label>
              <Textarea
                {...register('description')}
                error={errors.description?.message}
                className='min-h-[200px]'
                placeholder='체험에 대한 설명을 입력해 주세요'
              />
            </div>

            {/* 가격 */}
            <div className='flex flex-col gap-2.5'>
              <Controller
                name='price'
                control={methods.control}
                render={({ field }) => (
                  <FormInput
                    label='가격'
                    id='price'
                    placeholder='체험 금액을 입력해주세요'
                    {...field}
                    value={
                      field.value
                        ? new Intl.NumberFormat('ko-KR').format(
                            Number(field.value.replace(/,/g, '')),
                          )
                        : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, '');
                      if (/^\d*$/.test(raw)) field.onChange(raw);
                    }}
                    error={errors.price?.message}
                    maxLength={8}
                  />
                )}
              />
            </div>

            {/* 주소 */}
            <div className='flex flex-col gap-2.5'>
              <div className='flex gap-2 w-full items-end'>
                <FormInput
                  type='text'
                  id='address'
                  label='주소'
                  placeholder='주소를 선택해 주세요'
                  error={errors.address?.message}
                  readOnly
                  className='w-full box-border bg-grayscale-25 text-muted-foreground !placeholder-grayscale-400 cursor-pointer'
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOpenAddressSearch();
                  }}
                  onClick={handleOpenAddressSearch}
                  {...register('address')}
                />
                <Button
                  type='button'
                  size='lg'
                  className='px-4 py-3 text-sm font-bold text-white rounded-[16px] flex-shrink-0'
                  onClick={handleOpenAddressSearch}
                >
                  검색
                </Button>
              </div>
            </div>
          </div>

          {/* 예약 가능한 시간대 */}
          <div className='mt-7.5'>
            <Label>예약 가능한 시간대</Label>
            {scheduleFields.map((scheduleField, index) => (
              <div
                key={index}
                className={clsx(
                  'w-full',
                  errors?.schedules?.[index] ? '' : 'py-2.5',
                  index === 0 ? 'pt-4' : '',
                  index === 0 && scheduleFields.length > 1 ? 'pb-5' : '',
                  index === 1 ? 'pt-5 border-t border-grayscale-100' : '',
                )}
              >
                <DateTimeRow
                  key={index}
                  data={scheduleField}
                  onChange={(val) => {
                    update(index, val);
                    trigger('schedules');
                  }}
                  onBlur={() => {
                    trigger('schedules');
                  }}
                  onAdd={() =>
                    append({
                      date: '',
                      startTime: '',
                      endTime: '',
                    })
                  }
                  onRemove={() => remove(index)}
                  isFirstRow={index === 0}
                  errors={
                    errors?.schedules?.[index] as Merge<
                      FieldError,
                      FieldErrorsImpl<Omit<MyActivitySchedule, 'id'>>
                    >
                  }
                />
              </div>
            ))}
          </div>

          {/* 이미지 등록 */}
          <div className='flex flex-col gap-7.5 mt-5'>
            <div className='flex flex-col'>
              <Label>배너 이미지 등록</Label>
              <span className='text-12-regular text-grayscale-500 py-1'>
                <span className='text-primary-500 mr-0.5'>*</span>배너 이미지는 필수입니다
              </span>
              <Controller
                name='bannerFiles'
                control={control}
                rules={{ required: '배너 이미지를 업로드해주세요' }}
                render={({ field, fieldState }) => (
                  <div>
                    <ImageUploader
                      maxImages={1}
                      files={field.value || []}
                      onChange={(val) => {
                        field.onChange(val);
                        field.onBlur();
                      }}
                    />
                    {fieldState.error && (
                      <small className='text-12-medium ml-2 text-[var(--secondary-red-500)] mt-[6px] leading-[12px]'>
                        {fieldState.error.message}
                      </small>
                    )}
                  </div>
                )}
              />
            </div>

            <div className='flex flex-col'>
              <Label>소개 이미지 등록</Label>
              <span className='text-12-regular text-grayscale-500 py-1'>
                <span className='text-primary-500 mr-0.5'>*</span>소개 이미지는 최소 2개 이상
                등록해주세요
              </span>
              <Controller
                name='subFiles'
                control={control}
                rules={{ required: '배너 이미지를 업로드해주세요' }}
                render={({ field, fieldState }) => (
                  <div>
                    <ImageUploader
                      files={field.value || []}
                      onChange={(val) => field.onChange(val)}
                    />
                    {fieldState.error && (
                      <small className='text-12-medium ml-2 text-[var(--secondary-red-500)] mt-[6px] leading-[12px]'>
                        {fieldState.error.message}
                      </small>
                    )}
                  </div>
                )}
              />
            </div>
            {/* 다음 주소 API 스크립트 */}
            <Script
              src='//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
              strategy='afterInteractive'
            />
          </div>

          <div className='flex justify-center w-full mt-6'>
            <Button type='submit' className='w-30'>
              등록하기
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default MyActivityForm;
