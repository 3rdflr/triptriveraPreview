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
    <div className='flex justify-center px-6 lg:px-0 md:max-w-[684px] lg:max-w-[980px] mx-auto pt-4 md:pt-13 pb-9 gap-7.5 lg:gap-12.5'>
      <div className={sideMenuClass}>
        <SideMenu />
      </div>
      <div className={`pt-2.5 min-w-0 ${mypageMain ? 'hidden md:flex-1' : 'flex-1'}`}>
        {children}
      </div>
    </div>
  );
};

export default MyPageCommonLayout;
