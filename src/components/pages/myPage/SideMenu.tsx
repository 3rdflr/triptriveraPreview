import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { FaUser, FaCommentDots, FaCog, FaCalendarAlt, FaHeart } from 'react-icons/fa';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileImageUploader from './ProfileImageUploader';
import { useScreenSize } from '@/hooks/useScreenSize';

interface SideMenuProps {
  className?: string;
}

export default function SideMenu({ className }: SideMenuProps) {
  const { isMobile, isTablet, isDesktop } = useScreenSize();
  const pathname = usePathname();

  const menuItems = [
    { href: '/mypage/user', label: '내 정보', icon: FaUser },
    { href: '/mypage/reservation-list', label: '예약내역', icon: FaCommentDots },
    { href: '/mypage/my-experience', label: '내 체험 관리', icon: FaCog },
    { href: '/mypage/reservation-status', label: '예약 현황', icon: FaCalendarAlt },
    { href: '/mypage/wishlist', label: '위시리스트', icon: FaHeart },
  ];

  const onLogout = () => {
    console.log('TODO: 로그아웃 처리');
  };

  return (
    <Card
      className={clsx(
        'shadow-lg',
        {
          'w-80 px-4 py-6 h-auto': isMobile,
          'w-44 h-[400px] px-3.5 py-2': isTablet,
          'w-72 h-[500px] px-4 py-6': isDesktop,
        },
        className,
      )}
    >
      <div
        className={clsx('flex flex-col', {
          'gap-6': isMobile || isDesktop,
          'gap-3': isTablet,
        })}
      >
        {/* 프로필 영역 */}
        <ProfileImageUploader />

        {/* 메뉴 리스트 */}
        <nav className={clsx('flex flex-col gap-2.5')}>
          {menuItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;

            return (
              <Button
                key={href}
                asChild
                variant='ghost'
                className={clsx(
                  'group justify-start gap-2 py-6.5 text-base',
                  isActive
                    ? 'bg-primary-100 text-primary-600 hover:bg-primary-100'
                    : 'text-grayscale-600 hover:bg-[#FFF9FB]',
                  {
                    'py-6.5': isDesktop,
                    'py-6': isMobile || isTablet,
                  },
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
              'group hover:bg-primary-100 justify-start gap-2 py-6.5 text-grayscale-600 text-base',
              {
                hidden: !isMobile,
              },
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
