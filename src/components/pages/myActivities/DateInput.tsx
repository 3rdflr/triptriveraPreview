'use client';

import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import useDateInput from '@/hooks/useDateInput';
import { startOfToday, addMonths, isValid, parse } from 'date-fns';
import { BasicCalendar } from '@/components/common/BasicCalendar';

interface DateInputProps {
  showLabel?: boolean;
  value?: string;
  onChange?: (val: string) => void;
}

export function DateInput({ showLabel = false, value = '', onChange }: DateInputProps) {
  const { date, error, month, setMonth, setDateValid, setDate, setError, formatDate } =
    useDateInput();
  const [open, setOpen] = useState(false);

  const handleSelectDate = (selectedDate: Date | undefined) => {
    const formatted = formatDate(selectedDate);
    if (!selectedDate) return;
    setDate(selectedDate);
    onChange?.(formatted);
    setOpen(false);
    setDateValid(true);
    setError(null);
  };

  return (
    <div className='flex items-start'>
      <div className='flex flex-col'>
        {showLabel && (
          <Label htmlFor='date' className='px-1 mb-2.5'>
            날짜
          </Label>
        )}
        <div className='relative'>
          <Input
            id='date'
            value={value}
            placeholder='yy/mm/dd'
            className='bg-background pr-10 min-w-[327px] h-[3.375rem]'
            onChange={(e) => {
              const val = e.target.value;
              onChange?.(val);

              if (/^\d{2}\/\d{2}\/\d{2}$/.test(val)) {
                const parsedDate = parse(val, 'yy/MM/dd', new Date());
                if (isValid(parsedDate) && val.length === 8) {
                  setDate(parsedDate);
                  setMonth(parsedDate);
                  setError(null);
                  setDateValid(true);
                } else if (val.length === 8) {
                  setError('유효한 날짜를 입력해주세요');
                  setDateValid(false);
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
              }
            }}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id='date-picker'
                variant='ghost'
                className='absolute top-1/2 right-2 size-6 -translate-y-1/2'
              >
                <CalendarIcon className='size-3.5' />
                <span className='sr-only'>Select date</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className='w-auto overflow-hidden p-0'
              align='end'
              alignOffset={-8}
              sideOffset={20}
            >
              <BasicCalendar
                mode='single'
                selected={date}
                captionLayout='label'
                required={false}
                month={month}
                onMonthChange={setMonth}
                onSelect={handleSelectDate}
                disabled={{ before: startOfToday(), after: addMonths(new Date(), 12) }}
              />
            </PopoverContent>
          </Popover>
        </div>
        {error && <span className='text-secondary-red-500 text-xs px-1'>{error}</span>}
      </div>
    </div>
  );
}

export default DateInput;
