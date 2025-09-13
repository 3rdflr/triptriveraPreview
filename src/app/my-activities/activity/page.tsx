import MyActivityForm from '@/components/pages/myActivities/MyActivityForm';

const ActivityRegisterPage = () => {
  return (
    <div className='w-full flex justify-center items-center max-w-[327px] tablet:max-w-[684px] pc:max-w-[700px] mx-auto py-7.5 tablet:py-16'>
      {/* 등록 페이지 + 공통 폼 */}
      <MyActivityForm />
    </div>
  );
};

export default ActivityRegisterPage;
