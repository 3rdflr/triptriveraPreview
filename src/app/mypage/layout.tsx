'use client';
import Spinner from '@/components/common/Spinner';
import SideMenu from '@/components/pages/myPage/SideMenu';
import { useScreenSize } from '@/hooks/useScreenSize';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useLayoutEffect, useState } from 'react';

interface MyPageCommonLayoutProps {
  children: ReactNode;
}

const MyPageCommonLayout = ({ children }: MyPageCommonLayoutProps) => {
  const { isDesktop, isTablet, isMobile } = useScreenSize();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isMobileMenuPage = pathname === '/mypage';
  const showSideMenu = isMobileMenuPage || !isMobile;

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (mounted && !isMobile && isMobileMenuPage) {
      router.push('/mypage/user');
    }
  }, [isMobile, isMobileMenuPage, router, mounted]);

  return (
    <div
      className={clsx('justify-center mx-auto pb-9', {
        'max-w-[500px] px-6 pt-4': isMobile,
        'max-w-[684px] pt-13': isTablet,
        'max-w-[980px] pt-13': isDesktop,
      })}
    >
      <div
        className={clsx('flex justify-center', {
          'gap-7.5': isMobile || isTablet,
          'gap-12.5': isDesktop,
        })}
      >
        {showSideMenu && <SideMenu />}
        <div className='pt-2.5 flex-1 min-w-0 min-h-70'>
          {!mounted || (isMobile && isMobileMenuPage) ? (
            <div className='flex justify-center items-center w-full h-full'>
              <Spinner />
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPageCommonLayout;
