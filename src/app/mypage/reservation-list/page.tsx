'use client';
import { getMyReservationsList, updateReservation } from '@/app/api/myReservations';
import MyExperienceCardSkeleton from '@/components/pages/myPage/MyExperienceSkeleton';
import ReservationListCard from '@/components/pages/myPage/ReservationListCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Label } from '@/components/ui/label';
import { reservationStatusAll } from '@/lib/constants/reservation';
import {
  MyReservationUpdateRequest,
  MyReservationUpdateResponse,
} from '@/types/myReservation.type';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ReservationListPage = () => {
  const [selectedStatus, setSelectedStatus] = useState('');

  const queryClient = useQueryClient();

  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ['reservation-list'],
    queryFn: () => getMyReservationsList({}),
    refetchOnMount: 'always',
  });

  const updateReservationMutation = useMutation<
    MyReservationUpdateResponse,
    AxiosError,
    { reservationId: number; data: MyReservationUpdateRequest }
  >({
    mutationFn: ({ reservationId, data }) => updateReservation(reservationId, data),
    retry: 1,
    retryDelay: 300,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservation-list'] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: updateReservationState } = updateReservationMutation;

  const onClickConfirm = (id: number) => {
    updateReservationState({ reservationId: id, data: { status: 'confirmed' } });
  };

  const onClickCancel = (id: number) => {
    updateReservationState({ reservationId: id, data: { status: 'canceled' } });
  };

  const onClickReview = (id: number) => {
    console.log(`id:${id},` + '후기 작성 버튼 클릭 시 리뷰 모달 호출');
  };

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
            onCancel={onClickCancel}
            onConfirm={onClickConfirm}
            onReview={onClickReview}
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
              Object.entries(reservationStatusAll)
                .filter(([value]) => value !== 'declined')
                .map(([value, label]) => (
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
