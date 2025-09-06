import { Dropdown } from 'react-simplified-package';
import { ChevronDownIcon, CheckIcon } from 'lucide-react';
import { ReservedSchedule } from '@/types/myReservation.type';

interface ScheduleDropdownProps {
  value?: string | undefined;
  scheduleList?: ReservedSchedule[];
  onChange?: (val: string) => void;
}

const ScheduleDropdown = ({ value, scheduleList, onChange }: ScheduleDropdownProps) => {
  const selected = scheduleList?.find((s) => String(s.scheduleId) === value);

  const handleSelect = (val: string) => {
    onChange?.(val);
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <div
          className='flex justify-between items-center border border-grayscale-100 px-5 py-4'
          style={{
            width: '292px',
            borderRadius: '16px',
          }}
        >
          <div className=''>
            {selected ? `${selected.startTime}-${selected.endTime}` : '예약 시간을 선택해 주세요'}
          </div>
          <ChevronDownIcon className='size-4 opacity-50' />
        </div>
      </Dropdown.Trigger>

      <Dropdown.Menu
        className='border border-grayscale-100 bg-white w-80 rounded-2xl px-2 py-1.5'
        style={{
          width: '292px',
          borderRadius: '16px',
        }}
      >
        {scheduleList?.map((schedule) => (
          <div
            key={schedule.scheduleId}
            onClick={() => handleSelect(String(schedule.scheduleId))}
            className='hover:bg-primary-100 block rounded-md text-black p-2.5'
          >
            <div className='flex justify-between items-center'>
              {`${schedule.startTime}-${schedule.endTime}`}
              {selected?.scheduleId === schedule.scheduleId && (
                <CheckIcon className='size-4 text-muted-foreground' />
              )}
            </div>
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ScheduleDropdown;
