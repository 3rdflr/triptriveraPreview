'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Activity } from '@/types/activities.type';
import Image from 'next/image';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface MyExperienceCardProps {
  data: Activity;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const MyExperienceCard = ({ data, onEdit, onDelete }: MyExperienceCardProps) => {
  const { id, title, rating, reviewCount, price, bannerImageUrl } = data;
  const [isError, setIsError] = useState(false);
  const baseImageUrl = '/images/icons/_empty.png';
  const image = isError ? baseImageUrl : bannerImageUrl;

  return (
    <Card className='shadow-xl'>
      <div className='flex items-start justify-between gap-4'>
        {/* 체험 내용 */}
        <div className='flex-1 min-w-0 flex flex-col gap-2'>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              <div className='flex items-center gap-0.5'>
                <FaStar width={16} height={16} className='text-yellow-400' />
                <span className='mt-0.5'>
                  {rating} {reviewCount ? `(${reviewCount})` : ''}
                </span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-18-bold'>
              ₩{price.toLocaleString()}
              <span className='text-16-medium text-grayscale-400'> / 인</span>
            </p>
          </CardContent>
          <CardFooter className='flex gap-2'>
            <Button variant='secondary' size='xs' onClick={() => onEdit(id)}>
              수정하기
            </Button>
            <Button size='xs' onClick={() => onDelete(id)}>
              삭제하기
            </Button>
          </CardFooter>
        </div>

        {/* 체험 이미지 */}
        <div className='pt-9 mr-6 lg:mr-7.5 flex-shrink-0'>
          <div className='relative lg:w-[142px] lg:h-[142px] w-[82px] h-[82px] flex-shrink-0'>
            <Image
              src={image}
              alt='체험 관리 썸네일'
              fill
              priority
              className='lg:rounded-4xl rounded-2xl bg-grayscale-50 object-cover'
              sizes='(max-width: 1024px) 82px, 142px'
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

export default MyExperienceCard;
