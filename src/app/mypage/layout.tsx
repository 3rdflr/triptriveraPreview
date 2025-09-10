'use client';
import Spinner from '@/components/common/Spinner';
import SideMenu from '@/components/pages/myPage/SideMenu';
import { useScreenSize } from '@/hooks/useScreenSize';
import clsx from 'clsx';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useLayoutEffect, useState, useTransition } from 'react';

interface MyPageCommonLayoutProps {
  children: ReactNode;
}

const MyPageCommonLayout = ({ children }: MyPageCommonLayoutProps) => {
  const { isMobile } = useScreenSize();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname() as string;
  const isMobileMenuPage = pathname === '/mypage';
  const isUserPage = pathname === '/mypage/user';

  const MyPageContent = () => {
    return (
      <>
        <div className={clsx(isMobileMenuPage ? 'block' : 'hidden tablet:block')}>
          <SideMenu />
        </div>

        <div
          className={clsx(
            'pt-2.5 flex-1 min-w-0 min-h-70 tablet:block',
            isMobileMenuPage && 'mobile:hidden',
          )}
        >
          {isPending ? <Spinner /> : children}
        </div>
      </>
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (mounted && !isMobile && isMobileMenuPage && !isUserPage) {
      startTransition(() => {
        router.push('/mypage/user');
      });
    }
  }, [isMobile, isMobileMenuPage, isUserPage, router, mounted, pathname]);

  return (
    <div
      className={clsx(
        'justify-center mx-auto pb-9 px-6 tablet:px-0 pt-4 tablet:pt-13 max-w-[500px] tablet:max-w-[684px] pc:max-w-[980px]',
      )}
    >
      <div className={clsx('flex justify-center gap-7.5 pc:gap-12.5')}>
        <MyPageContent />
      </div>
    </div>
  );
};

export default MyPageCommonLayout;
