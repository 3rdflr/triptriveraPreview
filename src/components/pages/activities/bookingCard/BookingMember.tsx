'use client';

import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';

interface BookingMemberProps {
  headCount: number;
  onHeadCountChange: (count: number) => void;
  showTitle?: boolean;
}

export default function BookingMember({
  headCount,
  onHeadCountChange,
  showTitle = true,
}: BookingMemberProps) {
  return (
    <div className='mb-6'>
      {showTitle && (
        <div className='text-sm font-medium mb-3 flex items-center gap-2'>
          <Users className='w-4 h-4' />
          참여 인원
        </div>
      )}
      <div className='flex items-center gap-3'>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => onHeadCountChange(Math.max(1, headCount - 1))}
          disabled={headCount <= 1}
        >
          -
        </Button>
        <span className='font-medium text-lg px-4'>{headCount}</span>
        <Button variant='secondary' size='sm' onClick={() => onHeadCountChange(headCount + 1)}>
          +
        </Button>
      </div>
    </div>
  );
}
