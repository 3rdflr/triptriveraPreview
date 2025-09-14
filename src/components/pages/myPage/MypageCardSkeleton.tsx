import { Skeleton } from '@/components/ui/skeleton';

const MypageCardSkeleton = () => {
  return (
    <div className='flex justify-between items-start md:px-7.5 md:py-9 px-5 py-9'>
      <div className='space-y-3'>
        <Skeleton className='h-4 w-[150px]' />
        <Skeleton className='h-4 w-[100px]' />
        <div className='pt-2'>
          <Skeleton className='h-4 w-[120px]' />
        </div>
        <div className='flex pt-5 gap-2'>
          <Skeleton className='h-7 w-[68px]' />
          <Skeleton className='h-7 w-[68px]' />
        </div>
      </div>

      <Skeleton className='lg:w-[142px] lg:h-[142px] w-[82px] h-[82px] lg:rounded-4xl rounded-2xl' />
    </div>
  );
};

export default MypageCardSkeleton;
