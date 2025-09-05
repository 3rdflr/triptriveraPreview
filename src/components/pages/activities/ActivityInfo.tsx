import { ActivityDetail } from '@/types/activities.type';
import { MapPin, Star, EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

/**
 *
 * 체험 기본 정보 컴포넌트
 * ActivityClient에서 데이터를 받아와서 렌더링
 * 제목, 카테고리, 평점, 리뷰 수, 주소, 가격, 설명 등을 표시
 */
interface ActivityInfoProps {
  activity: ActivityDetail;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function ActivityInfo({ activity, onEdit, onDelete }: ActivityInfoProps) {
  return (
    <div className='flex justify-between'>
      <div className='flex flex-col gap-2'>
        {/* 카테고리 */}
        <p className='text-sm text-gray-950'>{activity.category}</p>
        {/* 제목과 기본 정보 */}
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-bold text-gray-950'>{activity.title}</h1>
          <div className='flex flex-col gap-[10px]'>
            {/* 평점 */}
            <div className='flex items-center gap-[6px]'>
              <Star className='w-4 h-4 text-yellow-400 fill-current' />
              <span className='text-sm text-gray-700'>
                {activity.rating.toFixed(1)} ({activity.reviewCount})
              </span>
            </div>
            {/* 주소 */}
            <div className='flex items-center gap-2 text-gray-600'>
              <MapPin className='w-4 h-4' />
              <span className='text-sm'>{activity.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 케밥 버튼 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0 rounded-full'>
            <EllipsisVertical className='w-5 h-5' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='center'>
          <DropdownMenuItem onClick={onEdit}>수정하기</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>삭제하기</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
