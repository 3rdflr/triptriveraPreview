import DateInput from './DateInput';
import StartEndTimeSelect from './StartEndTimeSelect';
import RoundButton from './RoundButton';
import { RowData } from '@/types/myActivityTypes';

interface DateTimeRowProps {
  data: RowData;
  isFirstRow?: boolean;
  onChange: (newData: RowData) => void;
  onAdd?: () => void;
  onRemove?: () => void;
}

const DateTimeRow = ({ data, isFirstRow = false, onChange, onAdd, onRemove }: DateTimeRowProps) => {
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
    <div className='flex items-end gap-3.5'>
      <DateInput value={data.date} showLabel={isFirstRow} onChange={handleDateInputChange} />
      <StartEndTimeSelect
        value={data.time}
        showLabel={isFirstRow}
        onChange={(newVal) => onChange({ ...data, time: newVal })}
      />
      <div className='flex flex-col justify-center h-[3.375rem]'>
        <RoundButton mode={isFirstRow ? 'plus' : 'minus'} onClick={isFirstRow ? onAdd : onRemove} />
      </div>
    </div>
  );
};

export default DateTimeRow;
