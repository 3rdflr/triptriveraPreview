'use client';

import BookingTimeSlot from './BookingTimeSlot';
import { ScheduleTime } from '@/types/activities.type';
import { Clock } from 'lucide-react';
interface BookingTimeListProps {
  selectedDate?: Date; // 선택된 날짜
  selectedScheduleId?: number; // 선택된 스케줄 ID
  selectedSchedule?: ScheduleTime[]; // 선택된 날짜의 스케줄들
  onTimeSlotSelect: (scheduleId: number) => void; // 스케줄 선택 핸들러
}

export default function BookingTimeList({
  selectedDate,
  selectedScheduleId,
  selectedSchedule,
  onTimeSlotSelect,
}: BookingTimeListProps) {
  // 선택된 날짜의 스케줄들을 표시합니다.

  return (
    <div>
      {/* Time Slots */}
      <div className='text-sm font-medium mb-3 flex items-center gap-2'>
        <Clock className='w-4 h-4' />
        예약 시간
      </div>
      {!selectedDate && (
        <div className='mb-6 p-4 text-center text-gray-500 border rounded-md'>
          날짜를 선택해주세요
        </div>
      )}
      {!selectedSchedule ? (
        <div className='mb-6 p-4 text-center text-gray-500 border rounded-md'>
          예약 가능한 시간이 없습니다
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          {selectedSchedule.map((schedule) => (
            <BookingTimeSlot
              key={schedule.id}
              scheduleTime={schedule}
              selectedScheduleId={selectedScheduleId}
              onTimeSlotSelect={onTimeSlotSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
