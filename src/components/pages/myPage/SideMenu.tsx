import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { FaUser, FaCommentDots, FaCog, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { logout } from '@/lib/utils/logoutUtils';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import ProfileImageUploader from './ProfileImageUploader';

interface SideMenuProps {
  className?: string;
}

export default function SideMenu({ className }: SideMenuProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { href: '/mypage/user', label: '내 정보', icon: FaUser },
    { href: '/mypage/reservation-list', label: '예약내역', icon: FaCommentDots },
    { href: '/mypage/my-experience', label: '내 체험 관리', icon: FaCog },
    { href: '/mypage/reservation-status', label: '예약 현황', icon: FaCalendarAlt },
    { href: '/mypage/wishlist', label: '위시리스트', icon: FaHeart },
  ];

  const onLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logout();
    router.push('/');
  };

  return (
    <Card
      className={clsx(
        'shadow-lg w-80 px-4 py-6 h-auto tablet:w-44 tablet:h-[400px] tablet:px-3.5 tablet:py-2 pc:w-72 pc:h-[500px] pc:px-4 pc:py-6',
        className,
      )}
    >
      <div className={'flex flex-col gap-6 tablet:gap-3 pc:gap-6'}>
        {/* 프로필 영역 */}
        <ProfileImageUploader />

        {/* 메뉴 리스트 */}
        <nav className={'flex flex-col gap-2.5'}>
          {menuItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Button
                key={href}
                asChild
                variant='ghost'
                className={clsx(
                  'group justify-start gap-2 text-base py-6 pc:py-6.5',
                  isActive
                    ? 'bg-primary-100 text-primary-600 hover:bg-primary-100'
                    : 'text-grayscale-600 hover:bg-[#FFF9FB]',
                )}
              >
                <Link href={href}>
                  <Icon
                    className={clsx(
                      'h-4 w-4',
                      isActive ? 'text-primary-500' : 'group-hover:text-primary-500',
                    )}
                  />
                  {label}
                </Link>
              </Button>
            );
          })}
          <Button
            asChild
            variant='ghost'
            className={clsx(
              'group hover:bg-primary-100 justify-start gap-2 py-6.5 text-grayscale-600 text-base tablet:hidden',
            )}
            onClick={onLogout}
          >
            <Link href=''>
              <FaArrowRightFromBracket className='h-4 w-4 group-hover:text-primary-500' />
              로그아웃
            </Link>
          </Button>
        </nav>
      </div>
    </Card>
  );
}
