'use client';

import * as React from 'react';
import { DayPicker, getDefaultClassNames } from 'react-day-picker';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import 'react-day-picker/style.css';
function BasicCalendar({
  showOutsideDays = true,
  formatters,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();
  console.log('defaultClassNames', defaultClassNames);
  return (
    <DayPicker
      className='p-1'
      showOutsideDays={showOutsideDays}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: `${defaultClassNames.root} w-full`,
        day: `${defaultClassNames.day} text-center`,
        day_button: `${defaultClassNames.day_button} lg:!w-6 lg:!h-6 flex items-center justify-center`,
      }}
      modifiersClassNames={{
        selected: 'bg-primary-500 text-white font-bold rounded-full text-center',
        today: 'bg-primary-100 text-primary-500 font-bold rounded-full',
      }}
      components={{
        Chevron: (props) =>
          props.orientation === 'left' ? (
            <ChevronLeftIcon className='w-5 h-5 text-gray-950' />
          ) : (
            <ChevronRightIcon className='w-5 h-5 text-gray-950' />
          ),
      }}
      {...props}
    />
  );
}

export { BasicCalendar };
