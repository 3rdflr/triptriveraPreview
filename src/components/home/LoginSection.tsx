'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScreenSize } from '@/hooks/useScreenSize';

export default function LoginSection() {
  const { isDesktop } = useScreenSize();
  return (
    <>
      {isDesktop && (
        <Link
          href='/login'
          className='px-4 py-2 hover:border rounded-full hover:bg-grayscale-50 transition-soft text-14-regular text-title'
        >
          로그인 하기
        </Link>
      )}
      <Link href='/login'>
        <Image src='/images/icons/default_profile.svg' alt='Profile' width={30} height={30} />
      </Link>
    </>
  );
}
