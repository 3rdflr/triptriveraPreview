'use client';

import { Button } from '@/components/ui/button';
import BookingCalendar from './BookingCalendar';
import BookingTimeList from './BookingTimeList';
import BookingMember from './BookingMember';
import { SchedulesByDate } from '@/types/activities.type';
import clsx from 'clsx';
import { format } from 'date-fns';
import { filterAvailableScheduleTimes } from '@/utils/schedule.utils';

interface BookingCardDesktopProps {
  price: number;
  schedulesByDate: SchedulesByDate;
  isLoading: boolean;
  selectedDate?: Date;
  selectedScheduleId?: number;
  memberCount: number;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (scheduleId: number) => void;
  onMemberCountChange: (count: number) => void;
  onBooking: () => void;
}

export default function BookingCardDesktop({
  price,
  schedulesByDate,
  selectedDate,
  selectedScheduleId,
  memberCount,
  onDateSelect,
  onTimeSlotSelect,
  onMemberCountChange,
  onBooking,
}: BookingCardDesktopProps) {
  const totalPrice = price * memberCount;

  const selectedSchedule = selectedDate
    ? filterAvailableScheduleTimes(
        schedulesByDate[format(selectedDate, 'yyyy-MM-dd')],
        selectedDate,
      )
    : undefined;

  return (
    <div
      className={clsx(
        'bg-white border border-card-border rounded-3xl p-[20px] xl:p-[30px] shadow-sm',
        'flex flex-col gap-6',
      )}
    >
      {/* 가격 */}
      <div className='flex items-center gap-1'>
        <span className='text-md font-bold'>₩{price.toLocaleString()}</span>
        <span className='text-md text-gray-500'> / 인</span>
      </div>

      {/* Calendar */}
      <div className='text-sm flex flex-col items-center gap-2'>
        <div className='w-full flex items-start text-sm font-bold'>날짜</div>
        <BookingCalendar
          schedulesByDate={schedulesByDate}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </div>

      <BookingTimeList
        selectedDate={selectedDate}
        selectedScheduleId={selectedScheduleId}
        selectedSchedule={selectedSchedule}
        onTimeSlotSelect={onTimeSlotSelect}
      />

      <BookingMember memberCount={memberCount} onMemberCountChange={onMemberCountChange} />

      {/* Total Price & Booking Button */}
      <hr className='border-t border-gray-100' />
      <div className='flex items-center py-5'>
        <span className='text-md font-bold'>총 금액</span>
        <span className='text-md font-bold'>₩{totalPrice.toLocaleString()}</span>
        <Button
          variant='primary'
          className='ml-auto'
          onClick={onBooking}
          disabled={!selectedScheduleId}
        >
          예약하기
        </Button>
      </div>
    </div>
  );
}
