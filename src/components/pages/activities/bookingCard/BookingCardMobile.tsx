'use client';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import BookingCalendar from './BookingCalendar';
import BookingDetail from './BookingDetail';
import { parseISO } from 'date-fns';
import { AvailableSchedule } from '@/types/activities.type';

interface BookingCardMobileProps {
  activityTitle: string;
  price: number;
  availableSchedules?: AvailableSchedule[];
  selectedDate?: Date;
  selectedScheduleId?: number;
  headCount: number;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (scheduleId: number) => void;
  onHeadCountChange: (count: number) => void;
  onBooking: () => void;
}

export default function BookingCardMobile({
  activityTitle,
  price,
  availableSchedules,
  selectedDate,
  selectedScheduleId,
  headCount,
  onDateSelect,
  onTimeSlotSelect,
  onHeadCountChange,
  onBooking,
}: BookingCardMobileProps) {
  // Get time slots for selected date
  const selectedDateSlots = selectedDate
    ? availableSchedules?.find(
        (schedule) => parseISO(schedule.date).toDateString() === selectedDate.toDateString(),
      )?.times || []
    : [];

  const getSelectedTimeSlot = () => {
    if (!selectedScheduleId) return null;
    return selectedDateSlots.find((slot) => slot.id === selectedScheduleId);
  };

  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '/')
      .replace('.', '');
  };

  const totalPrice = price * headCount;
  const selectedTimeSlot = getSelectedTimeSlot();

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
          className='w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
        >
          지금 예약하기
        </Button>
      </>
    );
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <span className='text-lg font-bold text-blue-600'>₩{price.toLocaleString()}</span>
          <span className='text-sm text-gray-500'>/ 인</span>
        </div>
      </div>

      <div className='flex items-center justify-between mb-3'>
        <div className='text-sm text-gray-600'>
          {selectedDate && selectedTimeSlot
            ? `${formatDate(selectedDate)} ${selectedTimeSlot.startTime}-${selectedTimeSlot.endTime}`
            : '예약 가능한 시간'}
        </div>
      </div>

      <Drawer>
        <DrawerTrigger asChild>
          <Button className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'>
            예약하기
          </Button>
        </DrawerTrigger>

        <DrawerContent className='max-h-[80vh]'>
          <DrawerHeader>
            <DrawerTitle>{activityTitle} 예약</DrawerTitle>
          </DrawerHeader>

          <div className='px-6 pb-6 overflow-y-auto'>
            {/* Calendar */}
            <BookingCalendar
              availableSchedules={availableSchedules}
              selectedDate={selectedDate}
              onDateSelect={onDateSelect}
            />

            {/* Booking Details */}
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
        </DrawerContent>
      </Drawer>
    </div>
  );
}
