export default function NavSkeleton() {
  return (
    <div className='w-full h-[165px] mx-auto flex flex-col items-center justify-center bg-grayscale-25 shadow-md animate-pulse'>
      {/* 네비게이션 상단 */}
      <div className='hidden md:flex w-full items-center justify-between px-10 h-[79px]'>
        {/* 로고 */}
        <div className='flex-1 flex items-center justify-start gap-2'>
          <div className='bg-grayscale-100 animate-pulse w-[36px] h-[36px] rounded-full'></div>
          <div className='hidden lg:block lg:bg-grayscale-100 animate-pulse w-[71px] h-[22px] rounded-full'></div>
        </div>
        {/* 카테고리 */}
        <div className='flex-1 flex items-center justify-center gap-10 lg:gap-18 px-2'>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[30px] h-[30px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[30px] h-[30px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[30px] h-[30px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[30px] h-[30px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[30px] h-[30px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[30px] h-[30px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[30px] h-[30px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
        </div>
        {/* 프로필 */}
        <div className='flex-1 flex items-center justify-end gap-2'>
          <div className='hidden lg:block bg-grayscale-100 animate-pulse w-[71px] h-[22px] rounded-full'></div>
          <div className='bg-grayscale-100 animate-pulse w-[36px] h-[36px] rounded-full'></div>
        </div>
        {/* 네비게이션 하단 / 모바일 상단*/}
      </div>
      <div className='relative min-w-[275px] w-11/12 mx-[40px] mt-[20px] md:m-0 md:w-[814px] h-[64px] bg-grayscale-25 animate-pulse flex justify-center md:grid md:grid-cols-[1fr_1fr_1fr] items-center rounded-full shadow-md'>
        <div className='relative flex flex-col items-start mx-7 gap-2'>
          <div className='hidden md:block bg-grayscale-100 animate-pulse w-[42px] h-[12px] rounded-full'></div>
          <div className='hidden md:block bg-grayscale-100 animate-pulse w-[102px] h-[12px] rounded-full'></div>
        </div>
        <div className='relative flex flex-col items-start md:mx-7 gap-2'>
          <div className='hidden md:block bg-grayscale-100 animate-pulse w-[42px] h-[12px] rounded-full'></div>
          <div className='bg-grayscale-100 animate-pulse w-[202px] md:w-[102px] h-[12px] rounded-full'></div>
        </div>
        <div className='relative flex flex-col items-start mx-7 gap-2'>
          <div className='hidden md:block bg-grayscale-100 animate-pulse w-[42px] h-[12px] rounded-full'></div>
          <div className='hidden md:block bg-grayscale-100 animate-pulse w-[102px] h-[12px] rounded-full'></div>
        </div>
      </div>
      {/* 모바일 하단 */}
      <div className='w-full flex items-center justify-center overflow-x-auto scrollbar-hide mt-4 md:hidden'>
        <div className='flex-1 flex items-center justify-center overflow-x-auto gap-14 px-2 scrollbar-hide'>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[20px] h-[20px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[20px] h-[20px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[20px] h-[20px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[20px] h-[20px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[20px] h-[20px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[20px] h-[20px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='bg-grayscale-100 animate-pulse w-[20px] h-[20px] rounded-full'></div>
            <div className='bg-grayscale-100 animate-pulse w-[22px] h-[12px] rounded-full'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
