import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MyActivitySchema } from '@/lib/utils/myActivitySchema';
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
import { ActivityDetail } from '@/types/activities.type';
import { errorToast, successToast } from '@/lib/utils/toastUtils';

const useMyActivityForm = () => {
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
      successToast.run('등록이 완료되었습니다.');
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
      successToast.run('수정이 완료되었습니다.');
    },
    onError: (error) => {
      console.log('업로드 실패', error);
    },
  });

  return {
    methods,
    errors,
    control,
    formState,
    scheduleFields,
    register,
    setValue,
    watch,
    trigger,
    update,
    append,
    remove,
    getDetailMutation,
    uploadImageMutation,
    registerMutation,
    updateMutation,
    successToast,
    errorToast,
  };
};

export default useMyActivityForm;
