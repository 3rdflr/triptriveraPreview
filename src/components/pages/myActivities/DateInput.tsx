'use client';

import React, { useState } from 'react';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { startOfToday, addMonths } from 'date-fns';
import { BasicCalendar } from '@/components/common/BasicCalendar';
import { ko } from 'date-fns/locale';
import { formatDate, parseDate } from '@/lib/utils/dateUtils';
import clsx from 'clsx';

interface DateInputProps {
  showLabel?: boolean;
  value?: string;
  error?: string;
  onChange?: (val: string) => void;
  onBlur?: () => void;
}

export function DateInput({
  showLabel = false,
  value = '',
  error,
  onChange,
  onBlur,
}: DateInputProps) {
  const [open, setOpen] = useState(false);

  const handleSelectDate = (selectedDate: Date | undefined) => {
    const formatted = formatDate(selectedDate);
    if (!selectedDate) return;
    onChange?.(formatted);
  };

  return (
    <div className='flex items-start w-full'>
      <div className='flex flex-col flex-1 w-full'>
        {showLabel && (
          <Label htmlFor='date' className='mb-2.5'>
            날짜
          </Label>
        )}
        <div className='w-full relative'>
          <Input
            id='date'
            value={value}
            placeholder='yy/mm/dd'
            className={clsx(
              'bg-background pr-10 w-full',
              error &&
                'border-destructive/20 bg-destructive/10 dark:bg-destructive/20 placeholder:text-destructive/50',
            )}
            onChange={(e) => {
              const val = e.target.value;
              onChange?.(val);
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
                className='absolute top-1/2 right-2 size-6 -translate-y-1/2 border border-transparent focus:outline-none focus-visible:border-[var(--primary-500)] focus-visible:ring-[var(--primary-300)]/30 focus-visible:ring-[3px] hover:bg-[var(--primary-200)]'
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
                isDateInput={true}
                mode='single'
                selected={parseDate(value)}
                captionLayout='label'
                required={false}
                onSelect={handleSelectDate}
                disabled={{ before: startOfToday(), after: addMonths(new Date(), 12) }}
                locale={ko}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

export default DateInput;
