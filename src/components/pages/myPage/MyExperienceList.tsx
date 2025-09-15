import { InfinityScroll } from '@/components/common/InfinityScroll';
import MypageCardSkeleton from '@/components/pages/myPage/MypageCardSkeleton';
import EmptyList from '@/components/pages/myPage/EmptyList';
import MyExperienceCard from '@/components/pages/myPage/MyExperienceCard';
import { Activity } from '@/types/activities.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useOverlay } from '@/hooks/useOverlay';
import ConfirmActionModal from '@/components/common/ConfirmActionModal';
import { ApiResponse } from '@/types/myActivity.type';
import { AxiosError } from 'axios';
import { deleteActivity } from '@/app/api/myActivities';
import { successToast } from '@/lib/utils/toastUtils';
import ConfirmModal from '@/components/common/ConfirmModal';

interface MyExperienceListProps {
  experienceList: Activity[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
}

const MyExperienceList = ({
  experienceList,
  hasNextPage,
  fetchNextPage,
  isLoading,
  isFetchingNextPage,
}: MyExperienceListProps) => {
  const overlay = useOverlay();
  const queryClient = useQueryClient();

  const router = useRouter();

  const deleteMyActivityMutation = useMutation<
    ApiResponse,
    AxiosError<{ message: string }>,
    number
  >({
    mutationFn: (activityId) => deleteActivity(activityId),
    retry: 1,
    retryDelay: 300,
    onSuccess: () => {
      successToast.run('체험 삭제가 완료되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['my-activities-list-infinite'] });
    },
    onError: (error) => {
      overlay.open(({ isOpen, close }) => (
        <ConfirmModal
          title={error.response?.data?.message}
          isOpen={isOpen}
          onClose={close}
          onAction={close}
        />
      ));
    },
  });

  const onClickEdit = (id: number) => {
    router.push(`/my-activities/activity/${id}`);
  };

  const onClickShowDeleteModal = (id: number) => {
    overlay.open(({ isOpen, close }) => (
      <ConfirmActionModal
        title='체험을 삭제하시겠어요?'
        actionText='삭제하기'
        isOpen={isOpen}
        onClose={close}
        onAction={() => {
          close();
          onClickDelete(id);
        }}
      />
    ));
  };
  const onClickDelete = (id: number) => {
    deleteMyActivityMutation.mutate(id);
  };

  return (
    <InfinityScroll
      items={experienceList ?? []}
      hasNextPage={hasNextPage}
      fetchNextPage={fetchNextPage}
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      height={680}
      itemHeightEstimate={210}
      scrollKey={`my-activities-list`}
      className='rounded-3xl px-4 scrollbar-hide'
    >
      {/* 초기 로딩 스켈레톤 */}
      <InfinityScroll.Skeleton count={3}>
        <MypageCardSkeleton />
      </InfinityScroll.Skeleton>
      <InfinityScroll.Contents loadingText='더 많은 체험을 불러오는 중입니다...'>
        {(activity: Activity) => (
          <MyExperienceCard
            key={activity.id}
            activity={activity}
            onEdit={onClickEdit}
            onDelete={onClickShowDeleteModal}
          />
        )}
      </InfinityScroll.Contents>

      <InfinityScroll.Empty className='flex flex-col items-center justify-center gap-3 pt-6 text-gray-500'>
        <EmptyList text='아직 등록한 체험이 없어요' />
      </InfinityScroll.Empty>
    </InfinityScroll>
  );
};

export default MyExperienceList;
