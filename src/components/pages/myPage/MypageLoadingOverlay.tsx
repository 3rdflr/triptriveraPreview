import Spinner from '@/components/common/Spinner';

const MypageLoadingOverlay = () => {
  return (
    <div className='flex justify-center items-center h-80 w-full z-[9999] absolute'>
      <Spinner />
    </div>
  );
};

export default MypageLoadingOverlay;
