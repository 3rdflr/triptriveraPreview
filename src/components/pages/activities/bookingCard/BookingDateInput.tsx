'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parse, isValid } from 'date-fns';
import { cn } from '@/lib/utils/shadCnUtils';
import { BookingDateModal } from './BookingDate.Modal';
import { SchedulesByDate } from '@/types/activities.type';

interface BookingDateInputProps {
  selectedDate?: Date;
  onDateSelect: (date: Date | undefined) => void;
  schedulesByDate: SchedulesByDate;
}

export function BookingDateInput({
  selectedDate,
  onDateSelect,
  schedulesByDate,
}: BookingDateInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [inputRect, setInputRect] = useState<DOMRect | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // 개별 입력 필드 state
  const [yearValue, setYearValue] = useState('');
  const [monthValue, setMonthValue] = useState('');
  const [dayValue, setDayValue] = useState('');

  // selectedDate가 변경될 때 각 input value 업데이트
  useEffect(() => {
    if (selectedDate) {
      setYearValue(format(selectedDate, 'yyyy'));
      setMonthValue(format(selectedDate, 'MM'));
      setDayValue(format(selectedDate, 'dd'));
    } else {
      setYearValue('');
      setMonthValue('');
      setDayValue('');
    }
  }, [selectedDate]);

  // 입력값이 변경될 때 날짜 조합하여 선택
  const updateDate = (year: string, month: string, day: string) => {
    if (year && month && day) {
      const dateString = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const parsedDate = parse(dateString, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        onDateSelect(parsedDate);
        return;
      }
    }
    onDateSelect(undefined);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearValue(value);
    updateDate(value, monthValue, dayValue);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMonthValue(value);
    updateDate(yearValue, value, dayValue);
  };

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDayValue(value);
    updateDate(yearValue, monthValue, value);
  };

  const handleCalendarClick = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setInputRect(rect);
    }
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setInputRect(null);
  };

  const handleDateModalSelect = (date: Date | undefined) => {
    onDateSelect(date);
    // 모달은 X 버튼으로만 닫히도록 변경
  };

  const handleMouseEnter = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setInputRect(rect);
    }
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // 모달 표시 조건: 클릭해서 열린 상태이거나 호버 중일 때
  const shouldShowModal = isModalOpen || isHovering;

  return (
    <div className='relative w-full'>
      {/* [년][월][일] 형태의 미니멀한 날짜 input */}
      <motion.div
        ref={inputRef}
        className={cn(
          'w-full p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer',
          'bg-white',
          isHovering || shouldShowModal
            ? 'border-primary-400 bg-primary-50 shadow-lg scale-[1.02]'
            : 'border-gray-200 hover:border-gray-300 hover:shadow-md',
          'flex items-center gap-2 text-gray-900 font-medium',
        )}
        onClick={handleCalendarClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* 년 입력 */}
        <motion.input
          type='number'
          value={yearValue}
          onChange={handleYearChange}
          placeholder='2025'
          min='2020'
          max='2030'
          className={cn(
            'w-16 text-center bg-transparent border-b-2 border-primary-200',
            'focus:outline-none focus:border-primary-500 transition-colors',
            'text-lg font-semibold',
          )}
          onClick={(e) => e.stopPropagation()}
          whileFocus={{ scale: 1.05 }}
        />
        <span className='text-gray-500 font-medium'>년</span>

        {/* 월 입력 */}
        <motion.input
          type='number'
          value={monthValue}
          onChange={handleMonthChange}
          placeholder='09'
          min='1'
          max='12'
          className={cn(
            'w-12 text-center bg-transparent border-b-2 border-primary-200',
            'focus:outline-none focus:border-primary-500 transition-colors',
            'text-lg font-semibold',
          )}
          onClick={(e) => e.stopPropagation()}
          whileFocus={{ scale: 1.05 }}
        />
        <span className='text-gray-500 font-medium'>월</span>

        {/* 일 입력 */}
        <motion.input
          type='number'
          value={dayValue}
          onChange={handleDayChange}
          placeholder='16'
          min='1'
          max='31'
          className={cn(
            'w-12 text-center bg-transparent border-b-2 border-primary-200',
            'focus:outline-none focus:border-primary-500 transition-colors',
            'text-lg font-semibold',
          )}
          onClick={(e) => e.stopPropagation()}
          whileFocus={{ scale: 1.05 }}
        />
        <span className='text-gray-500 font-medium'>일</span>

        {/* 캘린더 아이콘 */}
        <motion.div
          className='ml-auto p-2 rounded-xl hover:bg-white/80 transition-colors pointer-events-none'
          animate={{
            scale: selectedDate ? 1.1 : 1,
            rotate: shouldShowModal ? 10 : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <Calendar
            className={cn(
              'w-5 h-5 transition-colors duration-200',
              selectedDate ? 'text-primary-500' : 'text-gray-400',
            )}
          />
        </motion.div>
      </motion.div>

      {/* 모달 */}
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <BookingDateModal
          isOpen={shouldShowModal}
          onClose={handleModalClose}
          schedulesByDate={schedulesByDate}
          selectedDate={selectedDate}
          onSelectDate={handleDateModalSelect}
          inputRect={inputRect}
        />
      </div>
    </div>
  );
}
