'use client';

import { Button } from '@/components/ui/button';
import BookingCalendar from './BookingCalendar';
import BookingDetail from './BookingDetail';
import { AvailableSchedule } from '@/types/activities.type';
import clsx from 'clsx';

interface BookingCardDesktopProps {
  price: number;
  availableSchedules?: AvailableSchedule[];
  isLoading: boolean;
  selectedDate?: Date;
  selectedScheduleId?: number;
  headCount: number;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (scheduleId: number) => void;
  onHeadCountChange: (count: number) => void;
  onBooking: () => void;
}

export default function BookingCardDesktop({
  price,
  availableSchedules,
  selectedDate,
  selectedScheduleId,
  headCount,
  onDateSelect,
  onTimeSlotSelect,
  onHeadCountChange,
  onBooking,
}: BookingCardDesktopProps) {
  const totalPrice = price * headCount;

  const BookingSection = () => {
    if (!selectedScheduleId) return null;

    return (
      <>
        <div className='border-t pt-4 mb-4'>
          <div className='flex items-center justify-between text-lg font-bold'>
            <span>총 합계</span>
            <span className='text-blue-600'>₩{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <Button
          onClick={onBooking}
          className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
        >
          지금 예약하기
        </Button>
      </>
    );
  };

  return (
    <div
      className={clsx(
        'bg-white border border-card-border rounded-3xl p-[20px] xl:p-[30px] shadow-sm',
        'flex flex-col gap-6',
      )}
    >
      {/* Price Display */}
      <div className='flex items-center gap-1'>
        <span className='text-md font-bold'>₩{price.toLocaleString()}</span>
        <span className='text-md text-gray-500'> / 인</span>
      </div>

      {/* Calendar */}
      <div className='text-sm flex flex-col items-center gap-2'>
        <div className='w-full flex items-start text-sm font-bold'>날짜</div>
        <BookingCalendar
          availableSchedules={availableSchedules}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
        />
      </div>

      {/* Booking Details (Time Slots + Member Count) */}
      <BookingDetail
        selectedDate={selectedDate}
        selectedScheduleId={selectedScheduleId}
        headCount={headCount}
        availableSchedules={availableSchedules}
        onTimeSlotSelect={onTimeSlotSelect}
        onHeadCountChange={onHeadCountChange}
      />

      {/* Total Price & Booking Button */}
      <BookingSection />
    </div>
  );
}
