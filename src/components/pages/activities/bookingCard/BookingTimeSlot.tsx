'use client';

import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

interface BookingTimeSlotProps {
  timeSlots: TimeSlot[];
  selectedScheduleId?: number;
  onTimeSlotSelect: (scheduleId: number) => void;
  showTitle?: boolean;
}

export default function BookingTimeSlot({
  timeSlots,
  selectedScheduleId,
  onTimeSlotSelect,
  showTitle = true,
}: BookingTimeSlotProps) {
  if (timeSlots.length === 0) {
    return null;
  }

  return (
    <div className='mb-6'>
      {showTitle && (
        <div className='text-sm font-medium mb-3 flex items-center gap-2'>
          <Clock className='w-4 h-4' />
          예약 시간
        </div>
      )}
      <div className='grid grid-cols-1 gap-2'>
        {timeSlots.map((slot) => (
          <Button
            key={slot.id}
            variant={selectedScheduleId === slot.id ? 'primary' : 'secondary'}
            onClick={() => onTimeSlotSelect(slot.id)}
            className='justify-start text-sm py-2'
          >
            {slot.startTime} - {slot.endTime}
          </Button>
        ))}
      </div>
    </div>
  );
}
