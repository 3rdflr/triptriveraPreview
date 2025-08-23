import DateInput from '@/components/pages/myActivities/DateInput';
import RoundButton from '@/components/pages/myActivities/RoundButton';

export default function ActivityRegisterPage() {
  return (
    <div>
      등록 페이지 + 공통 폼
      <RoundButton />
      <div className='p-4'>
        <DateInput />
      </div>
    </div>
  );
}
