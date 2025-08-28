import MyActivityForm from '@/components/pages/myActivities/MyActivityForm';

interface ActivityEditPageProps {
  params: Promise<{ activityId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ActivityEditPage = async ({ params }: ActivityEditPageProps) => {
  const { activityId } = await params;
  console.log(activityId);
  return (
    <div className='flex justify-center items-center max-w-[327px] md:max-w-[627px] mx-auto p-16'>
      {/* 수정 페이지 + 공통 폼 */}
      <MyActivityForm mode='EDIT' activityId={activityId} />
    </div>
  );
};

export default ActivityEditPage;
