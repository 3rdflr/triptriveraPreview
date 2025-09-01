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
import { ReservationStatus } from '@/types/activities.type';
import { Reservation } from '@/types/myReservation.type';
import Image from 'next/image';
import { useState } from 'react';

interface MyExperienceCardProps {
  data: Reservation;
  onCancel: (id: number) => void;
  onReview: (id: number) => void;
}

const ReservationListCard = ({ data, onCancel, onReview }: MyExperienceCardProps) => {
  const { id, activity, status, totalPrice, headCount, date, startTime, endTime } = data;

  const { bannerImageUrl, title } = activity;
  const [isError, setIsError] = useState(false);
  const baseImageUrl = '/images/icons/_empty.png';
  const image = isError ? baseImageUrl : bannerImageUrl;

  const badgeStatusColor: Record<ReservationStatus, string> = {
    pending: 'bg-primary-100 text-primary-500',
    confirmed: 'bg-[var(--badge-green-light)] text-[var(--badge-green-dark)]',
    declined: 'bg-[var(--badge-coral-light)] text-[var(--badge-coral-dark)]',
    canceled: 'bg-gray-100 text-gray-600',
    completed: 'bg-[var(--badge-blue-light)] text-bg-[var(--badge-blue-dark)]',
  };

  return (
    <Card className='shadow-xl'>
      <div className='flex items-start justify-between'>
        {/* 예약 내역 내용 */}
        <div>
          <CardHeader>
            <Badge size='xs' className={badgeStatusColor[status]}>
              {reservationStatus[status]}
            </Badge>
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
            {status === 'completed' ? (
              <Button size='xs' onClick={() => onReview(id)}>
                후기 작성
              </Button>
            ) : (
              <Button variant='secondary' size='xs' onClick={() => onCancel(id)}>
                예약 취소
              </Button>
            )}
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
