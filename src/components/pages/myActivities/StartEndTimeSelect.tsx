import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import clsx from 'clsx';

const startHours = Array.from({ length: 23 }, (_, i) => `${i}:00`);
const endHours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

interface TimeRange {
  start: string;
  end: string;
}

interface TimeSelectProps {
  value: TimeRange;
  showLabel: boolean;
  startTimeError?: string;
  endTimeError?: string;
  onChange: (val: TimeRange) => void;
}

const errorClass =
  'data-[placeholder]:text-destructive/50 border-destructive/20 bg-destructive/10 dark:bg-destructive/20';

const StartEndTimeSelect = ({
  value,
  showLabel = false,
  startTimeError,
  endTimeError,
  onChange,
}: TimeSelectProps) => {
  return (
    <div className='flex items-end w-full'>
      <div className='flex-1 min-w-0'>
        {showLabel && <Label className='mb-2.5 hidden sm:block'>시작 시간</Label>}
        <Select
          value={value.start === '' ? undefined : value.start}
          onValueChange={(start) => onChange({ ...value, start })}
        >
          <SelectTrigger className={clsx('w-full', startTimeError && errorClass)}>
            <SelectValue
              placeholder='0:00'
              className={clsx(startTimeError && 'placeholder:text-destructive/50')}
            />
          </SelectTrigger>
          <SelectContent className='max-h-50'>
            <SelectGroup>
              {startHours.map((hour, index) => (
                <SelectItem key={`${hour}-${index}`} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <span className='flex items-center px-[10.5px] h-[3.375rem]'>-</span>
      <div className='flex-1 min-w-0'>
        {showLabel && <Label className='px-1 mb-2.5 hidden sm:block'>종료 시간</Label>}
        <Select
          value={value.end === '' ? undefined : value.end}
          onValueChange={(end) => onChange({ ...value, end })}
        >
          <SelectTrigger className={clsx('w-full', endTimeError && errorClass)}>
            <SelectValue
              placeholder='0:00'
              className={clsx(endTimeError && 'placeholder:text-destructive/50')}
            />
          </SelectTrigger>
          <SelectContent className='max-h-50'>
            <SelectGroup>
              {endHours.map((hour, index) => (
                <SelectItem key={`${hour}-${index}`} value={hour}>
                  {hour}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default StartEndTimeSelect;
