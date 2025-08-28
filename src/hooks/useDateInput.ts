import { useState } from 'react';
import { format } from 'date-fns';

const useDateInput = () => {
  const [value, setValue] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date | undefined>(date);

  function formatDate(date: Date | undefined) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return format(date, 'yy/MM/dd');
  }

  return {
    value,
    date,
    month,
    setMonth,
    setDate,
    setValue,
    formatDate,
  };
};

export default useDateInput;
