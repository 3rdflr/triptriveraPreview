import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Activity } from '@/types/activities.type';
import clsx from 'clsx';

interface ActivitySelectProps {
  value: string | undefined;
  activityList: Activity[];
  className?: string;
  onChange: (val: string) => void;
}

const ActivitySelect = ({ value, activityList, className, onChange }: ActivitySelectProps) => {
  return (
    <Select value={value} onValueChange={(newVal) => onChange(newVal)}>
      <SelectTrigger className={clsx('w-full', className)}>
        <SelectValue placeholder='체험을 선택해 주세요' />
      </SelectTrigger>
      <SelectContent className='max-h-50 overflow-y-auto'>
        <SelectGroup>
          {activityList?.map((activity) => (
            <SelectItem key={`${activity.id}`} value={String(activity.id)}>
              {activity.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ActivitySelect;
