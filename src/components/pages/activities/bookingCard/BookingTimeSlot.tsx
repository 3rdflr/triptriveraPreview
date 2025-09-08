'use client';

import { Button } from '@/components/ui/button';
import { ScheduleTime } from '@/types/activities.type';

interface BookingTimeSlotProps {
  scheduleTime: ScheduleTime;
  selectedScheduleId?: number;
  onTimeSlotSelect: (scheduleTime: ScheduleTime) => void;
}

export default function BookingTimeSlot({
  scheduleTime,
  selectedScheduleId,
  onTimeSlotSelect,
}: BookingTimeSlotProps) {
  return (
    <Button
      variant={selectedScheduleId === scheduleTime.id ? 'primary' : 'secondary'}
      onClick={() => onTimeSlotSelect(scheduleTime)}
      className='w-full text-sm '
    >
      {scheduleTime.startTime} - {scheduleTime.endTime}
    </Button>
  );
}
