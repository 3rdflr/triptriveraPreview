'use client';

import { ko } from 'date-fns/locale';
import { parseISO } from 'date-fns';
import { AvailableSchedule } from '@/types/activities.type';
import { BasicCalendar } from '@/components/common/BasicCalendar';

interface BookingCalendarProps {
  availableSchedules?: AvailableSchedule[];
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export default function BookingCalendar({
  availableSchedules,
  selectedDate,
  onDateSelect,
}: BookingCalendarProps) {
  // 사용 가능한 날짜 가져오기(ISO 형태를 Date 객체로 파싱)
  const availableDates = availableSchedules?.map((schedule) => parseISO(schedule.date)) || [];

  // 비활성화할 날짜 판단 로직
  const disabledDates = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      date < today || // 과거 날짜
      !availableDates.some((d) => d.toDateString() === date.toDateString()) // 예약 불가능한 날짜
    );
  };

  return (
    <div className='w-full'>
      <BasicCalendar
        mode='single'
        selected={selectedDate}
        onSelect={onDateSelect}
        disabled={disabledDates}
        locale={ko}
      />
    </div>
  );
}
