import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ReservedSchedule } from '@/types/myActivity.type';
import clsx from 'clsx';

interface ScheduleSelectProps {
  value?: string | undefined;
  scheduleList?: ReservedSchedule[];
  className?: string;
  onChange?: (val: string) => void;
}

const ScheduleSelect = ({ value, scheduleList, className, onChange }: ScheduleSelectProps) => {
  return (
    <Select value={value} onValueChange={(newVal) => onChange?.(newVal)}>
      <SelectTrigger className={clsx('w-full', className)}>
        <SelectValue placeholder='예약 시간을 선택해 주세요' />
      </SelectTrigger>
      <SelectContent position='popper'>
        <SelectGroup>
          {scheduleList?.map((schedule) => (
            <SelectItem key={`${schedule.scheduleId}`} value={String(schedule.scheduleId)}>
              {`${schedule.startTime}-${schedule.endTime}`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ScheduleSelect;
