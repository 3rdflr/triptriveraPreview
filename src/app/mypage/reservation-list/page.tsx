'use client';
// import { deleteActivity, getMyActivitiesList } from '@/app/api/myActivities';
import { getMyReservationsList } from '@/app/api/myReservations';
import MyExperienceCardSkeleton from '@/components/pages/myPage/MyExperienceSkeleton';
import ReservationListCard from '@/components/pages/myPage/ReservationListCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { reservationStatus } from '@/lib/constants/reservation';
// import { ReservationStatus } from '@/types/activities.type';
// import { ApiResponse } from '@/types/myActivity.type';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ReservationListPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('');

  // const queryClient = useQueryClient();

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['reservation-list'],
    queryFn: () => getMyReservationsList({}),
  });

  const onClickEdit = () => {
    console.log('수정 버튼 클릭');
    // router.push(`/my-activities/activity/${id}`);
  };
  const onClickDelete = () => {
    console.log('삭제 버튼 클릭');
    // deleteMyActivityMutation.mutate(id);
  };

  // const deleteMyActivityMutation = useMutation<ApiResponse, Error, number>({
  //   mutationFn: (activityId) => deleteActivity(activityId),
  //   retry: 1,
  //   retryDelay: 300,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['my-activities-list'] });
  //   },
  // });

  const MyReservationList = () => {
    if (isLoading) {
      return (
        <div className='flex flex-col gap-6'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <MyExperienceCardSkeleton key={idx} />
          ))}
        </div>
      );
    }

    if (!data?.reservations?.length) {
      return (
        <div className='flex flex-col mx-auto gap-7.5'>
          <div>
            <Image
              src={'/images/icons/_empty.png'}
              width={182}
              height={182}
              priority
              alt='체험 관리 디폴트 이미지'
            />
            <span className='text-18-medium text-grayscale-600'>아직 예약한 체험이 없어요</span>
          </div>
          <Button size='lg' onClick={() => router.push('/')}>
            둘러보기
          </Button>
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-6'>
        {data?.reservations.map((reservation) => (
          <ReservationListCard
            key={reservation.id}
            data={reservation}
            onEdit={(id) => onClickEdit()}
            onDelete={(id) => onClickDelete()}
          />
        ))}
      </div>
    );
  };

  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-16'>
        <div className='flex flex-col gap-2.5'>
          <Label className='text-[18px] font-bold'>예약내역</Label>
          <span className='text-14-medium text-grayscale-500'>
            예약내역을 변경 및 취소할 수 있습니다.
          </span>
          <div className='flex pt-3.5 gap-2'>
            {!!data?.reservations?.length &&
              Object.entries(reservationStatus).map(([value, label]) => (
                <Badge
                  key={value}
                  variant='outline'
                  selected={selectedStatus === value}
                  onClick={() => setSelectedStatus(value)}
                >
                  {label}
                </Badge>
              ))}
          </div>
        </div>
      </div>

      {/* 예약 내역 카드 목록 */}
      <MyReservationList />
    </div>
  );
};

export default ReservationListPage;
