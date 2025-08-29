import MyActivityForm from '@/components/pages/myActivities/MyActivityForm';

const ActivityRegisterPage = () => {
  return (
    <div className='flex justify-center items-center max-w-[327px] md:max-w-[627px] mx-auto p-16'>
      {/* 등록 페이지 + 공통 폼 */}
      <MyActivityForm />
    </div>
  );
};

export default ActivityRegisterPage;
