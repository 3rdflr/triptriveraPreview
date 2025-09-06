'use client';

import { parseISO } from 'date-fns';
import BookingMember from './BookingMember';
import BookingTimeSlot from './BookingTimeSlot';
import { AvailableSchedule } from '@/types/activities.type';

interface BookingDetailProps {
  selectedDate?: Date;
  selectedScheduleId?: number;
  headCount: number;
  availableSchedules?: AvailableSchedule[];
  onTimeSlotSelect: (scheduleId: number) => void;
  onHeadCountChange: (count: number) => void;
}

export default function BookingDetail({
  selectedDate,
  selectedScheduleId,
  headCount,
  availableSchedules,
  onTimeSlotSelect,
  onHeadCountChange,
}: BookingDetailProps) {
  // Get time slots for selected date
  const selectedDateSlots = selectedDate
    ? availableSchedules?.find(
        (schedule) => parseISO(schedule.date).toDateString() === selectedDate.toDateString(),
      )?.times || []
    : [];

  // Show message when no date is selected
  if (!selectedDate) {
    return (
      <div className='mb-6 p-4 text-center text-gray-500 border rounded-md'>
        날짜를 선택해주세요
      </div>
    );
  }

  // Show message when no time slots are available
  if (selectedDateSlots.length === 0) {
    return (
      <div className='mb-6 p-4 text-center text-gray-500 border rounded-md'>
        예약 가능한 시간이 없습니다
      </div>
    );
  }

  return (
    <>
      {/* Time Slots */}
      <BookingTimeSlot
        timeSlots={selectedDateSlots}
        selectedScheduleId={selectedScheduleId}
        onTimeSlotSelect={onTimeSlotSelect}
      />

      {/* Member Count - only show when time slot is selected */}
      {selectedScheduleId && (
        <BookingMember headCount={headCount} onHeadCountChange={onHeadCountChange} />
      )}
    </>
  );
}
