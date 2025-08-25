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
    <div className='flex items-end'>
      <div>
        {showLabel && <Label className='px-1 mb-2.5 block'>시작 시간</Label>}
        <Select value={value.start} onValueChange={(start) => onChange({ ...value, start })}>
          <SelectTrigger className='w-[122px]'>
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
      <span className='flex items-center p-2 h-[3.375rem]'>-</span>
      <div>
        {showLabel && <Label className='px-1 mb-2.5 block'>종료 시간</Label>}
        <Select value={value.end} onValueChange={(end) => onChange({ ...value, end })}>
          <SelectTrigger className='w-[122px]'>
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
