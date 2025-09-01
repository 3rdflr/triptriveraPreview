'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { reservationStatus } from '@/lib/constants/reservation';
import { Reservation } from '@/types/myReservation.type';
import Image from 'next/image';
import { useState } from 'react';

interface MyExperienceCardProps {
  data: Reservation;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ReservationListCard = ({ data, onEdit, onDelete }: MyExperienceCardProps) => {
  const { id, activity, status, totalPrice, headCount, date, startTime, endTime } = data;

  const { bannerImageUrl, title } = activity;
  const [isError, setIsError] = useState(false);
  const baseImageUrl = '/images/icons/_empty.png';
  const image = isError ? baseImageUrl : bannerImageUrl;

  // const badgeStatusColor: Record<ReservationStatus, string> = {
  //   pending: 'bg-yellow-100 text-yellow-800',
  //   confirmed: 'bg-green-100 text-green-800',
  //   declined: 'bg-red-100 text-red-800',
  //   canceled: 'bg-gray-100 text-gray-600',
  //   completed: 'bg-blue-100 text-blue-800',
  // };

  return (
    <Card className='shadow-xl'>
      <div className='flex items-start justify-between'>
        {/* 예약 내역 내용 */}
        <div>
          <CardHeader>
            <Badge>{reservationStatus[status]}</Badge>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              <div className='flex items-center gap-0.5'>
                {date} {`${startTime} - ${endTime}`}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-18-bold'>
              ₩{totalPrice.toLocaleString()}
              <span className='text-16-medium text-grayscale-400'> /{headCount}명</span>
            </p>
          </CardContent>
          <CardFooter className='flex gap-2'>
            {/* status: completed인 경우 => 이용을 완료한 체험(체험 시간이 지나간)은 '후기 작성' 버튼이 보입니다. */}
            <Button variant='secondary' size='xs' onClick={() => onEdit(id)}>
              예약 변경
            </Button>
            <Button size='xs' onClick={() => onDelete(id)}>
              예약 취소
            </Button>
            {/* status: completed인 경우 => 이용을 완료한 체험(체험 시간이 지나간)은 '후기 작성' 버튼이 보입니다. */}
            <Button size='xs' onClick={() => onDelete(id)}>
              후기 작성
            </Button>
          </CardFooter>
        </div>

        {/* 체험 이미지 */}
        <div className='px-6 lg:px-7.5 pt-9'>
          <div className='relative px-7.5 lg:w-[142px] lg:h-[142px] w-[82px] h-[82px] box-border'>
            <Image
              src={image}
              alt='체험 관리 썸네일'
              layout='fill'
              className='lg:rounded-4xl rounded-2xl bg-grayscale-50 object-cover'
              onError={() => {
                setIsError(true);
              }}
              blurDataURL={baseImageUrl}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReservationListCard;
