interface ActivityEditPageProps {
  params: Promise<{ activityId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ActivityEditPage = async ({ params }: ActivityEditPageProps) => {
  const { activityId } = await params;
  console.log(activityId);
  return <div>수정 페이지 + 공통 폼</div>;
};

export default ActivityEditPage;
