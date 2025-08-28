import { useState } from 'react';
import { format } from 'date-fns';

const useDateInput = () => {
  const [value, setValue] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [month, setMonth] = useState<Date | undefined>(date);
  const [error, setError] = useState<string | null>(null);
  const [isDateValid, setDateValid] = useState(false);

  function formatDate(date: Date | undefined) {
    if (!(date instanceof Date) || isNaN(date.getTime())) return '';
    return format(date, 'yy/MM/dd');
  }

  return {
    value,
    date,
    error,
    month,
    isDateValid,
    setMonth,
    setDate,
    setDateValid,
    setValue,
    setError,
    formatDate,
  };
};

export default useDateInput;
