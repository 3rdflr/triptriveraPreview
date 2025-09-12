'use client';

import { Button } from '@/components/ui/button';
import { EllipsisVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
interface EditDropDownProps {
  activityId: number;
  isOwner: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}
export function EditDropDown({ activityId, isOwner, open, setOpen }: EditDropDownProps) {
  const router = useRouter();

  const handleDelete = () => {
    //삭제 모달 추가
    console.log('삭제 시도: ', { activityId });
    router.push('/my-activities');
  };

  const handleEdit = () => {
    console.log('수정 시도: ', { activityId });
    router.push(`/my-activities/activity/${activityId}`);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0 rounded-full'>
          <EllipsisVertical className='w-8 h-8' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='center'
        className='bg-white border shadow-lg'
        disablePortal={true}
      >
        <DropdownMenuItem onClick={handleEdit} disabled={!isOwner}>
          수정하기
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDelete} disabled={!isOwner}>
          삭제하기
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
