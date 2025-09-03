'use client';
import SideMenu from '@/components/pages/myPage/SideMenu';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface MyPageCommonLayoutProps {
  children: ReactNode;
}

const MyPageCommonLayout = ({ children }: MyPageCommonLayoutProps) => {
  const pathname = usePathname();
  const mypageMain = pathname === '/mypage';
  const sideMenuClass = mypageMain ? 'xs:block sm:hidden' : 'hidden md:block';

  return (
    <div className='flex justify-center max-w-[327px] md:max-w-[684px] lg:max-w-[980px] mx-auto py-7.5 gap-7.5 lg:gap-12.5'>
      {/* SideMenu가 보일 때만 렌더링 */}
      {mypageMain && (
        <div className='w-full flex justify-center p-4'>
          <SideMenu className={sideMenuClass} />
        </div>
      )}
      {/* children이 보일 때만 렌더링 */}
      {!mypageMain && <div className='flex-1 w-full flex justify-center'>{children}</div>}
    </div>
  );
};

export default MyPageCommonLayout;
