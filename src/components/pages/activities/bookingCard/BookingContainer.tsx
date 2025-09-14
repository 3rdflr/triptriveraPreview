'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import BookingCardDesktop from './BookingCardDesktop';
import BookingCardMobile from './BookingCardMobile';
import BookingError from '@/components/pages/activities/bookingCard/BookingError';
import { ErrorBoundary } from 'react-error-boundary';
import { getAvailableSchedule } from '@/app/api/activities';
import { Schedule, SchedulesByDate, ScheduleTime } from '@/types/activities.type';
import { useSchedulesByDate } from '@/hooks/useSchedulesByDate';
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useOverlay } from '@/hooks/useOverlay';
import BookingConfirmModal from '@/components/pages/activities/bookingCard/BookingConfirm.Modal';

interface BookingContainerProps {
  title: string;
  activityId: number;
  price: number;
  baseSchedules: Schedule[];
}

export interface BookingCardProps {
  price: number;
  totalPrice: number;
  schedulesByDate: SchedulesByDate;
  isLoading: boolean;
  selectedDate?: Date;
  selectedScheduleId?: number;
  memberCount: number;
  onDateSelect: (date: Date | undefined) => void;
  onTimeSlotSelect: (scheduleTime: ScheduleTime) => void;
  onMemberCountChange: (count: number) => void;
  onBooking: () => void;
  onClose?: () => void;
}

// Error boundary로 래핑된 메인 컴포넌트
export default function BookingContainer({
  title,
  activityId,
  price,
  baseSchedules,
}: BookingContainerProps) {
  // 선택한 날짜
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  // 선택한 스케줄
  const [selectedScheduleTime, setSelectedScheduleTime] = useState<ScheduleTime | undefined>();
  // 선택한 인원 수
  const [memberCount, setMemberCount] = useState(1);
  // 기본 스케줄을 날짜별 객체로 변환하여 상태로 관리
  const initialSchedulesByDate = useSchedulesByDate(baseSchedules);
  const [schedulesByDate, setSchedulesByDate] = useState<SchedulesByDate>(initialSchedulesByDate);
  // 모바일 바텀시트 오픈 상태
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const overlay = useOverlay();

  // 선택된 날짜의 상세 스케줄 조회
  const {
    data: scheduleByDate,
    isSuccess,
    isLoading: isLoadingDetailed,
  } = useQuery({
    queryKey: ['scheduleByDate', activityId, selectedDate],
    queryFn: async () => {
      if (!selectedDate) return null;
      const year = format(selectedDate, 'yyyy');
      const month = format(selectedDate, 'MM');
      return getAvailableSchedule(activityId, { year, month });
    },
    staleTime: 0,
    gcTime: 0,
    enabled: !!selectedDate, // 날짜가 선택된 경우에만 실행
  });
  const totalPrice = price * memberCount;

  // API 응답 성공시 해당 날짜의 스케줄을 상세 데이터로 업데이트
  useEffect(() => {
    if (isSuccess && scheduleByDate && selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const newSchedule = scheduleByDate.find((schedule) => schedule.date === dateStr);

      if (newSchedule && newSchedule.times) {
        setSchedulesByDate((prev) => ({
          ...prev,
          [dateStr]: newSchedule.times,
        }));
      }
    }
  }, [scheduleByDate, isSuccess, selectedDate]);

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // 날짜 변경 시 시간 선택 초기화
    setSelectedScheduleTime(undefined);
  };

  // 시간 슬롯 선택 핸들러
  const handleTimeSlotSelect = (scheduleTime: ScheduleTime) => {
    setSelectedScheduleTime(scheduleTime);
  };

  // 인원 수 변경 핸들러
  const handleMemberCountChange = (count: number) => {
    setMemberCount(count);
  };

  const handleBooking = () => {
    if (!selectedScheduleTime) return;

    overlay.open(({ isOpen, close }) => (
      <BookingConfirmModal
        isOpen={isOpen}
        onClose={close}
        activityId={activityId}
        selectedDate={selectedDate!}
        selectedScheduleTime={selectedScheduleTime}
        memberCount={memberCount}
        totalPrice={totalPrice}
        title={title}
      />
    ));
  };

  const handleClose = () => {
    setIsBottomSheetOpen(false);
  };

  const bookingCardProps: BookingCardProps = {
    price,
    totalPrice,
    schedulesByDate,
    isLoading: isLoadingDetailed,
    selectedDate,
    selectedScheduleId: selectedScheduleTime?.id,
    memberCount,
    onDateSelect: handleDateSelect,
    onTimeSlotSelect: handleTimeSlotSelect,
    onMemberCountChange: handleMemberCountChange,
    onBooking: handleBooking,
    onClose: handleClose,
  };
  return (
    <ErrorBoundary
      fallbackRender={({ resetErrorBoundary }) => <BookingError resetError={resetErrorBoundary} />}
    >
      {/* Desktop version */}
      <div className='hidden lg:block'>
        <BookingCardDesktop {...bookingCardProps} />
      </div>

      {/* Mobile/Tablet version */}
      <div className='block lg:hidden'>
        <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg'>
          <div className='flex flex-col w-full px-6 py-4 gap-3'>
            <div className='flex justify-between items-center'>
              <div className='flex items-center gap-1'>
                <span className='text-lg font-bold'>₩{price.toLocaleString()}</span>
                <span className='text-gray-500'>/ 1명</span>
              </div>
              <span
                onClick={() => setIsBottomSheetOpen(true)}
                className='text-sm text-primary-500 cursor-pointer font-bold underline'
              >
                {selectedScheduleTime && selectedDate
                  ? `${format(selectedDate, 'MM월 dd일')} ${selectedScheduleTime.startTime} - ${selectedScheduleTime.endTime}`
                  : '날짜 선택하기'}
              </span>
            </div>

            <Button className='' onClick={handleBooking} disabled={!selectedScheduleTime}>
              예약하기
            </Button>
          </div>
        </div>

        <Drawer
          open={isBottomSheetOpen}
          onOpenChange={setIsBottomSheetOpen}
          autoFocus={isBottomSheetOpen}
        >
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
          <DrawerContent aria-describedby='예약 바텀시트'>
            <BookingCardMobile {...bookingCardProps} />
          </DrawerContent>
        </Drawer>
      </div>
    </ErrorBoundary>
  );
}
