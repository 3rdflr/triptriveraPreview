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
  onBlur?: () => void;
}

export function DateInput({ showLabel = false, value = '', onChange, onBlur }: DateInputProps) {
  const { date, month, setMonth, setDate, setError, formatDate } = useDateInput();
  const [open, setOpen] = useState(false);

  const handleSelectDate = (selectedDate: Date | undefined) => {
    const formatted = formatDate(selectedDate);
    if (!selectedDate) return;
    setDate(selectedDate);
    onChange?.(formatted);
    setOpen(false);
    setError(null);
  };

  return (
    <div className='flex items-start'>
      <div className='flex flex-col'>
        {showLabel && (
          <Label htmlFor='date' className='mb-2.5'>
            날짜
          </Label>
        )}
        <div className='relative'>
          <Input
            id='date'
            value={value}
            placeholder='yy/mm/dd'
            className='bg-background pr-10 min-w-[327px]'
            onChange={(e) => {
              const val = e.target.value;
              onChange?.(val);

              if (/^\d{2}\/\d{2}\/\d{2}$/.test(val)) {
                const parsedDate = parse(val, 'yy/MM/dd', new Date());
                if (isValid(parsedDate) && val.length === 8) {
                  setDate(parsedDate);
                  setMonth(parsedDate);
                }
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setOpen(true);
              }
            }}
            onBlur={() => {
              onBlur?.();
            }}
          />
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id='date-picker'
                variant='ghost'
                className='absolute top-1/2 right-2 size-6 -translate-y-1/2 border border-transparent focus:outline-none focus-visible:border-[var(--primary-200)] focus-visible:ring-[var(--primary-200)]/30 focus-visible:ring-[3px]'
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
      </div>
    </div>
  );
}

export default DateInput;
