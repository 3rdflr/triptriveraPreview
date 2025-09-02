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
  const sideMenuClass = mypageMain ? 'sm:block md:hidden' : 'hidden md:block';
  // const share = pathname.startsWith('/activities');

  return (
    <div className='flex justify-center max-w-[327px] md:max-w-[684px] lg:max-w-[980px] mx-auto py-7.5 gap-7.5 lg:gap-12.5'>
      <SideMenu className={sideMenuClass} />
      <div className='flex-1'>{children}</div>
    </div>
  );
};

export default MyPageCommonLayout;
