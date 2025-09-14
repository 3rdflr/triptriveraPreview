'use client';
import DateTimeRow from '@/components/pages/myActivities/DateTimeRow';
import { Controller, FormProvider } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CategorySelect from './CategorySelect';
import { MyActivityFormData } from '@/lib/utils/myActivitySchema';
import FormInput from '@/components/common/FormInput';
import clsx from 'clsx';
import { MyActivitySchedule } from '@/types/myActivity.type';
import { useEffect } from 'react';
import { fromISO } from '@/lib/utils/dateUtils';
import useMyActivityForm from '@/hooks/useMyActivityForm';
import ImageUploadSection from './ImageUploadSection';
import Script from 'next/script';
import { isBefore, parse } from 'date-fns';
import RoundButton from './RoundButton';

interface MyActivityFormProps {
  mode?: 'EDIT' | 'REGISTER';
  activityId?: string;
}

const MyActivityForm = ({ mode = 'REGISTER', activityId }: MyActivityFormProps) => {
  const {
    methods,
    errors,
    control,
    scheduleFields,
    register,
    setValue,
    trigger,
    update,
    append,
    remove,
    detailData,
    isDetailLoading,
    isDetailFetching,
    isRegisterLoading,
    isEditLoading,
    uploadImageAndGetUrl,
    registerForm,
    updateForm,
    setOriginalSchedules,
  } = useMyActivityForm({ mode, activityId });

  const handleOpenAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const addr = data.userSelectedType === 'R' ? data.roadAddress : data.jibunAddress;
        setValue('address', addr, { shouldValidate: true, shouldDirty: true });
      },
    }).open();
  };

  const onSubmit = async () => {
    await uploadImageAndGetUrl();
    if (mode === 'REGISTER') {
      registerForm();
    } else {
      updateForm();
    }
  };

  useEffect(() => {
    if (mode === 'EDIT') {
      if (!detailData || isDetailLoading || isDetailFetching) return;

      const now = new Date();

      const detailSchedules = detailData.schedules
        .map((schedule) => ({
          ...schedule,
          date: fromISO(schedule.date),
        }))
        .filter((schedule) => {
          if (!schedule.date || !schedule.startTime) return false;

          const scheduleDateTime = parse(
            `${schedule.date} ${schedule.startTime}`,
            'yy/MM/dd HH:mm',
            new Date(),
          );

          return !isBefore(scheduleDateTime, now);
        });

      setOriginalSchedules(detailSchedules);

      const emptyFirstRow: MyActivitySchedule = {
        id: crypto.randomUUID(),
        date: '',
        startTime: '',
        endTime: '',
      };

      const schedulesToReset = detailSchedules.length > 0 ? [...detailSchedules] : [emptyFirstRow];

      const formData: MyActivityFormData = {
        ...detailData,
        price: String(detailData.price),
        schedules: schedulesToReset,
        subImages: detailData.subImages ?? [],
        bannerImages: [{ imageUrl: detailData.bannerImageUrl }],
        subImageUrls: [] as string[],
        bannerFiles: [],
        subFiles: [],
      };

      methods.reset(formData);
    }
  }, [detailData, isDetailLoading, isDetailFetching, mode, methods, setOriginalSchedules]);

  return (
    <div className='flex-1 flex flex-col'>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                maxLength={20}
                labelClassName='font-bold'
                {...register('title')}
              />
            </div>

            {/* 카테고리 */}
            <div className='flex flex-col gap-2.5'>
              <Label className='font-bold'>카테고리</Label>
              <Controller
                name='category'
                control={control}
                rules={{ required: '카테고리를 선택해주세요' }}
                render={({ field, fieldState }) => (
                  <div>
                    <CategorySelect
                      value={field.value ?? undefined}
                      error={fieldState.error}
                      onChange={field.onChange}
                      onBlur={() => {
                        field.onBlur();
                        trigger('category');
                      }}
                    />
                    <small className='text-12-medium ml-2 text-[var(--secondary-red-500)] mt-[6px] leading-[12px] min-h-[20px]'>
                      {fieldState?.error?.message}
                    </small>
                  </div>
                )}
              />
            </div>

            {/* 설명 */}
            <div className='flex flex-col gap-2.5'>
              <Label className='font-bold'>설명</Label>
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
                        ? Number(field.value.replace(/,/g, '')).toLocaleString('ko-KR')
                        : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value.replace(/,/g, '');
                      if (/^\d*$/.test(raw)) field.onChange(raw);
                    }}
                    error={errors.price?.message}
                    maxLength={8}
                    labelClassName='font-bold'
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
                      onBlur={() => {}}
                      error={fieldState.error?.message}
                      labelClassName='font-bold'
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
            <Label className='font-bold'>예약 가능한 시간대</Label>
            <div className='flex justify-between items-center py-3 mb-6 border-b border-grayscale-100 tablet:max-w-none tablet:w-full'>
              <div className='flex flex-1 tablet:gap-3.5'>
                <div className='w-full tablet:w-[343px] flex-shrink-0'>
                  <Label className='gap-0'>날짜</Label>
                </div>
                <div className='hidden tablet:flex flex-1'>
                  <div className='flex-1 min-w-0'>
                    <Label className='gap-0'>시작시간</Label>
                  </div>
                  <div className='flex-1 min-w-0'>
                    <Label className='gap-0'>종료시간</Label>
                  </div>
                </div>
              </div>

              <div className='flex-shrink-0'>
                <RoundButton
                  mode={'plus'}
                  onClick={() => {
                    append({
                      id: crypto.randomUUID(),
                      date: '',
                      startTime: '',
                      endTime: '',
                    });
                  }}
                />
              </div>
            </div>
            {scheduleFields.map((scheduleField, index) => (
              <div key={scheduleField.id} className={clsx('w-full pb-2.5 tablet:pb-0')}>
                <DateTimeRow
                  key={scheduleField.id}
                  data={scheduleField}
                  onChange={(val) => {
                    update(index, val);
                    trigger(`schedules.${index}`);
                  }}
                  onBlur={() => {
                    trigger(`schedules.${index}`);
                  }}
                  onRemove={() => {
                    remove(index);
                    // 최소 한 행 유지
                    if (scheduleFields.length === 1) {
                      append({ id: crypto.randomUUID(), date: '', startTime: '', endTime: '' });
                    }
                  }}
                  isFirstRow={index === 0}
                  errors={errors?.schedules?.[index]}
                />
              </div>
            ))}
          </div>

          {/* 이미지 등록 */}
          <ImageUploadSection control={control} methods={methods} setValue={setValue} />

          <div className='flex justify-center w-full mt-6'>
            <Button
              type='submit'
              className='w-30'
              disabled={
                isRegisterLoading ||
                isEditLoading ||
                !methods.formState.isDirty ||
                !methods.formState.isValid
              }
            >
              {mode === 'REGISTER'
                ? `등록${isRegisterLoading ? '중' : '하기'}`
                : `수정${isEditLoading ? '중' : '하기'}`}
            </Button>
          </div>
        </form>
      </FormProvider>

      {/* 다음 주소 API 스크립트 */}
      <Script
        src='//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
        strategy='afterInteractive'
      />
    </div>
  );
};

export default MyActivityForm;
