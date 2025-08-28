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
  ActivityUpdateRequest,
  ActivityUpdateResponse,
  createActivity,
  getActivityDetail,
  ImageUploadResponse,
  updateActivity,
  uploadActivityImage,
} from '@/app/api/activities';
import { ActivitiesCategoryType, ActivityDetail } from '@/types/activities.type';
import { useEffect, useState } from 'react';
import { toApiDate, toInputDate } from '@/lib/utils/dateUtils';
import { SubImage } from '@/types/activities.types';
import { createToast } from 'react-simplified-package';
import { FaCheckCircle } from 'react-icons/fa';

interface MyActivityFormProps {
  mode?: 'EDIT' | 'REGISTER';
  activityId?: string;
}

const MyActivityForm = ({ mode = 'REGISTER', activityId }: MyActivityFormProps) => {
  // 성공 토스트 전용 인스턴스 (스타일을 JSX에 직접 적용)
  const successToast = createToast(
    () => (
      <div className='flex items-center  text-green-500 border border-green-500 p-4 rounded-lg bg-white shadow-md'>
        <FaCheckCircle className='mr-1' />
        <span className='text-xs'>{mode === 'REGISTER' ? '등록' : '수정'}이 완료되었습니다.</span>
      </div>
    ),
    { duration: 3000 },
  );

  const [originalSchedules, setOriginalSchedules] = useState<MyActivityFormData['schedules']>([]);
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
      subImages: [],
      bannerImages: [], // 상세조회한 배너 이미지를 보여주기 위해 추가
      subFiles: [],
      schedules: [{ date: '', startTime: '', endTime: '' }],
      subImageUrlsToAdd: [],
      subImageIdsToRemove: [],
      schedulesToAdd: [],
      scheduleIdsToRemove: [],
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

  const getDetailMutation = useMutation<ActivityDetail, Error, number>({
    mutationFn: (activityId) => getActivityDetail(activityId),
    retry: 1,
    retryDelay: 300,
    onSuccess: (response) => {
      console.log('상세 조회 성공', response);
    },
    onError: (error) => {
      console.log('상세 조회 실패', error);
    },
  });

  const uploadImageMutation = useMutation<ImageUploadResponse, Error, File>({
    mutationFn: (file: File) => uploadActivityImage(file),
    retry: 1,
    retryDelay: 300,
    onSuccess: (response) => {
      console.log('이미지 업로드 성공', response.activityImageUrl);
    },
    onError: (error) => {
      console.log('이미지 업로드 실패', error);
    },
  });

  const registerMutation = useMutation<ActivityCreateResponse, Error, ActivityCreateRequest>({
    mutationFn: (data: ActivityCreateRequest) => createActivity(data),
    retry: 1,
    retryDelay: 300,
    onSuccess: () => {
      successToast.run();
    },
    onError: (error) => {
      console.log('업로드 실패', error);
    },
  });

  const updateMutation = useMutation<
    ActivityUpdateResponse,
    Error,
    { activityId: number; data: ActivityUpdateRequest }
  >({
    mutationFn: ({ activityId, data }) => updateActivity(activityId, data),
    retry: 1,
    retryDelay: 300,
    onSuccess: () => {
      successToast.run();
    },
    onError: (error) => {
      console.log('업로드 실패', error);
    },
  });

  const uploadImageAndGetUrl = async () => {
    const bannerFiles = watch('bannerFiles') ?? [];
    const subFiles = watch('subFiles') ?? [];

    if (bannerFiles.length > 0) {
      const bannerUploadResponse = await uploadImageMutation.mutateAsync(bannerFiles[0]);
      setValue('bannerImageUrl', bannerUploadResponse.activityImageUrl, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    if (subFiles.length > 0) {
      const subImagesUploadResponse = await Promise.all(
        subFiles.map((file) => uploadImageMutation.mutateAsync(file)),
      );

      const subImageUrls = subImagesUploadResponse.map((res) => res.activityImageUrl);

      if (mode === 'EDIT') {
        setValue('subImageUrlsToAdd', subImageUrls, { shouldValidate: true, shouldDirty: true });
      } else {
        setValue('subImageUrls', subImageUrls, { shouldValidate: true, shouldDirty: true });
      }
    }
  };

  const handleOpenAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setValue('address', addr, { shouldValidate: true });
      },
    }).open();
  };

  const registerForm = async () => {
    const values = methods.getValues();

    const params: ActivityCreateRequest = {
      ...values,
      category: values.category as ActivitiesCategoryType,
      price: Number(values.price.replace(/,/g, '')),
      subImageUrls: values.subImageUrls ?? [],
      schedules: values.schedules.map(({ date, startTime, endTime }) => ({
        date: toApiDate(date),
        startTime,
        endTime,
      })),
    };

    registerMutation.mutate(params);
  };

  const updateForm = async () => {
    const values = methods.getValues();

    // 삭제된 스케줄
    const scheduleIdsToRemove: number[] = originalSchedules
      .filter((s) => {
        const current = values.schedules.find((v) => v.id === s.id);
        if (!current) return true;

        return (
          current.date !== s.date ||
          current.startTime !== s.startTime ||
          current.endTime !== s.endTime
        );
      })
      .map((s) => Number(s.id));

    // 새로 추가된 스케줄
    const schedulesToAdd = values.schedules
      .filter((s) => {
        if (!s.id) return true;

        const original = originalSchedules.find((v) => v.id === s.id);
        if (!original) return true;

        return (
          original.date !== s.date ||
          original.startTime !== s.startTime ||
          original.endTime !== s.endTime
        );
      })
      .map(({ date, startTime, endTime }) => ({
        date: toApiDate(date),
        startTime,
        endTime,
      }));

    const params: ActivityUpdateRequest = {
      ...values,
      category: values.category as ActivitiesCategoryType,
      price: Number(values.price.replace(/,/g, '')),
      scheduleIdsToRemove,
      schedulesToAdd,
      subImageIdsToRemove: values.subImageIdsToRemove ?? [],
      subImageUrlsToAdd: values.subImageUrlsToAdd ?? [],
    };

    updateMutation.mutate({ activityId: Number(activityId), data: params });
  };

  const onSubmit = async (data: MyActivityFormData) => {
    console.log('폼 유효성 통과', data);
    await uploadImageAndGetUrl();
    if (mode === 'REGISTER') {
      registerForm();
    } else {
      console.log(data);
      updateForm();
    }
  };

  const onError = (errors: FieldErrors<MyActivityFormData>) => {
    console.log('폼 에러 발생', errors);
  };

  useEffect(() => {
    if (mode === 'EDIT') {
      getDetailMutation.mutate(Number(activityId), {
        onSuccess: (activity) => {
          const detailSchedules = activity.schedules.map((schedule) => ({
            ...schedule,
            date: toInputDate(schedule.date),
          }));

          setOriginalSchedules(detailSchedules);
          const formData: MyActivityFormData = {
            ...activity,
            price: String(activity.price),
            schedules: detailSchedules,
            subImages: activity.subImages ?? [],
            bannerImages: [{ imageUrl: activity.bannerImageUrl }],
            subImageUrls: [] as string[],
            bannerFiles: [],
            subFiles: [],
          };

          methods.reset(formData);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                        field.onBlur();
                        trigger('category');
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
              <div className='flex gap-2 w-full items-center'>
                <Controller
                  name='address'
                  control={control}
                  rules={{ required: '주소를 선택해 주세요' }}
                  render={({ field, fieldState }) => (
                    <FormInput
                      type='text'
                      id='address'
                      label='주소'
                      placeholder='주소를 선택해 주세요'
                      {...field}
                      readOnly
                      className='w-full box-border bg-grayscale-25 text-muted-foreground !placeholder-grayscale-400 cursor-pointer'
                      onClick={handleOpenAddressSearch}
                      onBlur={() => {}} // onBlur 비워서 validation 안 발생
                      error={fieldState.error?.message}
                    />
                  )}
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
                      fetchedImages={
                        methods.getValues('bannerImages')?.length
                          ? methods.getValues('bannerImages')
                          : []
                      }
                      onChange={(val) => {
                        field.onChange(val);
                        field.onBlur();
                      }}
                      onDeleteFetched={() => {
                        setValue('bannerImageUrl', '', {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        methods.setValue('bannerImages', [], {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                        field.onChange([]);
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
                      fetchedImages={methods.getValues('subImages')}
                      onChange={(val) => field.onChange(val)}
                      onDeleteFetched={(id) => {
                        if (id !== undefined) {
                          const prev = methods.getValues('subImageIdsToRemove') || [];
                          methods.setValue('subImageIdsToRemove', [...prev, id], {
                            shouldDirty: true,
                            shouldValidate: true,
                          });

                          // subImages 배열에서 삭제
                          const prevImages = (methods.getValues('subImages') as SubImage[]) || [];
                          const newImages = prevImages.filter((img) => img.id !== id);
                          methods.setValue('subImages', newImages, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });

                          field.onChange([]);
                        }
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
            {/* 다음 주소 API 스크립트 */}
            <Script
              src='//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
              strategy='afterInteractive'
            />
          </div>

          <div className='flex justify-center w-full mt-6'>
            <Button
              type='submit'
              className='w-30'
              disabled={!methods.formState.isDirty || !methods.formState.isValid}
            >
              {mode === 'REGISTER' ? '등록' : '수정'}하기
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default MyActivityForm;
