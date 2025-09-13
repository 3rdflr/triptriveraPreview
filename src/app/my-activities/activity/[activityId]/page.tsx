import MyActivityForm from '@/components/pages/myActivities/MyActivityForm';

interface ActivityEditPageProps {
  params: Promise<{ activityId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ActivityEditPage = async ({ params }: ActivityEditPageProps) => {
  const { activityId } = await params;
  return (
    <div className='w-full flex justify-center items-center max-w-[327px] tablet:max-w-[684px] pc:max-w-[700px] mx-auto py-7.5 tablet:py-16'>
      {/* 수정 페이지 + 공통 폼 */}
      <MyActivityForm mode='EDIT' activityId={activityId} />
    </div>
  );
};

export default ActivityEditPage;
