import { Skeleton } from '@/components/ui/skeleton';

/**
 * 선언형 스켈레톤 로딩 컴포넌트
 * Suspense fallback으로 사용
 */
export default function ActivitySkeleton() {
  return (
    <div className='mx-auto px-4 py-8'>
      <div className='max-w-[1200px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <div className='flex flex-col gap-5 md:gap-6 lg:gap-10'>
              {/* 이미지 영역 스켈레톤 */}
              <div className='w-full grid grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-61 md:h-100'>
                <Skeleton className='col-span-2 row-span-2 w-full h-full rounded-lg rounded-s-3xl' />
                <Skeleton className='col-span-2 rounded-tr-3xl' />
                <Skeleton className='col-span-2 rounded-br-3xl' />
              </div>
              {/* 제목 및 기본 정보 스켈레톤 */}
              <div className='w-full flex flex-col gap-2 justify-self-start'>
                <Skeleton className='h-4 w-24 rounded' />
                <Skeleton className='h-8 w-3/4 rounded' />
                <Skeleton className='h-5 w-1/2 rounded' />
              </div>
              <br />
              {/* 설명 스켈레톤 */}
              <div className='flex flex-col gap-3'>
                <Skeleton className='h-6 w-32 rounded' />
                <Skeleton className='h-50 w-full rounded' />
              </div>
              {/* 지도 스켈레톤 */}
              <div className='flex flex-col gap-3'>
                <Skeleton className='h-6 w-32 rounded' />
                <Skeleton className='h-6 w-50 rounded' />
                <Skeleton className='h-65 w-full rounded-3xl' />
              </div>
              <br />
              {/* 리뷰 스켈레톤 */}
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-6 w-32 rounded' />
                <div className='w-full flex flex-col items-center gap-2'>
                  <Skeleton className='h-10 w-20 rounded-3xl' />
                  <Skeleton className='h-15 w-80 rounded-3xl' />
                  <Skeleton className='h-6 w-30 rounded-3xl' />
                  <Skeleton className='h-4 w-20 rounded-3xl' />
                </div>
                {/* 리뷰 리스트 스켈레톤 */}
                <div className='flex w-full flex-col gap-4 pt-[30px]'>
                  {Array.from({ length: 3 }, (_, i) => (
                    <Skeleton key={i + `-review-skel`} className='h-[140px] w-full rounded-3xl' />
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 사이드바 스켈레톤 */}
          <div className='hidden lg:block lg:col-span-1 '>
            <div className='flex flex-col gap-6 border border-card-border rounded-3xl p-4 shadow-sm'>
              <Skeleton className='h-10 w-full rounded-3xl' />
              <Skeleton className='h-18 w-full rounded-3xl' />
              <Skeleton className='h-30 w-full rounded-3xl' />
              <div className='flex items-center justify-between'>
                <Skeleton className='h-10 w-30 rounded-full' />
                <Skeleton className='h-10 w-40 rounded-full' />
              </div>
              <Skeleton className='h-12 w-full rounded-3xl' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
