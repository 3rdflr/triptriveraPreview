import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const hours = Array.from({ length: 25 }, (_, i) => `${i}:00`);

interface TimeRange {
  start: string;
  end: string;
}

interface TimeSelectProps {
  value: TimeRange;
  showLabel: boolean;
  onChange: (val: TimeRange) => void;
}

const StartEndTimeSelect = ({ value, showLabel = false, onChange }: TimeSelectProps) => {
  return (
    <div className='flex items-end w-full'>
      <div className='flex-1 min-w-0'>
        {showLabel && <Label className='mb-2.5 hidden sm:block'>시작 시간</Label>}
        <Select
          value={value.start === '' ? undefined : value.start}
          onValueChange={(start) => onChange({ ...value, start })}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='0:00' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {hours.map((hour, index) => (
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
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='0:00' />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {hours.map((hour, index) => (
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
