import Spinner from '@/components/common/Spinner';

const LoadingOverlay = () => {
  return (
    <div className='flex justify-center items-center z-[9999] fixed inset-0'>
      <Spinner />
    </div>
  );
};

export default LoadingOverlay;
