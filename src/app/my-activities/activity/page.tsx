import ActivityForm from '@/components/pages/myActivities/ActivityForm';

export default function ActivityRegisterPage() {
  return (
    <div className='flex justify-center items-center max-w-[700px] mx-auto'>
      {/* 등록 페이지 + 공통 폼 */}
      <ActivityForm />
    </div>
  );
}
