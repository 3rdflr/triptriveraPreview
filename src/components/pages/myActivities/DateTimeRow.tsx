import DateInput from './DateInput';
import StartEndTimeSelect from './StartEndTimeSelect';
import RoundButton from './RoundButton';
import { MyActivitySchedule } from '@/types/myActivity.type';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
interface DateTimeRowProps {
  data: Omit<MyActivitySchedule, 'id'>;
  errors?: Merge<FieldError, FieldErrorsImpl<Omit<MyActivitySchedule, 'id'>>>;
  isFirstRow?: boolean;
  onChange: (newData: Omit<MyActivitySchedule, 'id'>) => void;
  onBlur: () => void;
  onRemove?: () => void;
}

const DateTimeRow = ({ data, errors, onChange, onBlur, onRemove }: DateTimeRowProps) => {
  const handleDateInputChange = (value: string): void => {
    let currentDate = value;
    currentDate = currentDate.replace(/\D/g, '');
    if (currentDate.length > 2 && currentDate.length <= 4) {
      currentDate = currentDate.slice(0, 2) + '/' + currentDate.slice(2);
    } else if (currentDate.length > 4) {
      currentDate =
        currentDate.slice(0, 2) + '/' + currentDate.slice(2, 4) + '/' + currentDate.slice(4, 6);
    }
    onChange({ ...data, date: currentDate });
  };

  return (
    <div className='flex flex-col tablet:flex-row items-start tablet:gap-3.5 gap-0 w-full'>
      <div className='flex-col flex flex-1 w-full tablet:max-w-[344px] pc:max-w-[360px]'>
        <DateInput
          value={data.date}
          showLabel={false}
          onChange={handleDateInputChange}
          onBlur={onBlur}
        />
        <small className='text-12-medium ml-2 text-[var(--secondary-red-500)] mt-[6px] leading-[12px] min-h-[20px]'>
          {errors?.date?.message}
        </small>
      </div>

      <div className='w-full flex flex-row items-end gap-3.5 flex-1'>
        <StartEndTimeSelect
          value={{ start: data.startTime, end: data.endTime }}
          showLabel={false}
          onChange={(newVal) => {
            onChange({ ...data, startTime: newVal.start, endTime: newVal.end });
          }}
        />
        <div className='flex flex-col justify-center h-[3.375rem]'>
          <RoundButton mode={'minus'} onClick={onRemove} />
        </div>
      </div>
    </div>
  );
};

export default DateTimeRow;
