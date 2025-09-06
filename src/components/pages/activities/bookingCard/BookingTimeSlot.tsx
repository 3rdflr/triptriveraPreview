'use client';

import { Button } from '@/components/ui/button';
import { ScheduleTime } from '@/types/activities.type';

interface BookingTimeSlotProps {
  scheduleTime: ScheduleTime;
  selectedScheduleId?: number;
  onTimeSlotSelect: (scheduleId: number) => void;
}

export default function BookingTimeSlot({
  scheduleTime,
  selectedScheduleId,
  onTimeSlotSelect,
}: BookingTimeSlotProps) {
  return (
    <Button
      variant={selectedScheduleId === scheduleTime.id ? 'primary' : 'secondary'}
      onClick={() => onTimeSlotSelect(scheduleTime.id)}
      className='w-full text-sm '
    >
      {scheduleTime.startTime} - {scheduleTime.endTime}
    </Button>
  );
}
