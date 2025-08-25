import Spinner from '@/components/common/Spinner';
import ActivitySheet from '@/components/home/ActivitySheet';

export default async function Home() {
  return (
    <div className='bg-black'>
      <div className='h-screen'>
        <Spinner />
      </div>
      <ActivitySheet>여기에 list 들어갈 에정</ActivitySheet>
    </div>
  );
}
