'use client';

import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import CategoryList from '../home/CategoryList';
import SearchFilters from '../home/SearchFilters';
import { useState } from 'react';
import { useScreenSize } from '@/hooks/useScreenSize';
import LoginSection from '../home/LoginSection';

const CATEGORY_H = 80; // 카테고리 영역 높이
const SEARCH_H = 96; // 검색창 높이
const GAP = 5; // 카테고리와 검색창 사이 간격

export default function Nav() {
  const { scrollY } = useScroll();
  const { isTablet } = useScreenSize();
  const [isSearching, setIsSearching] = useState(false);

  // 🔹 raw transform 값
  const rawStackHeight = useTransform(
    scrollY,
    [0, 40, 80],
    [CATEGORY_H + GAP + SEARCH_H, SEARCH_H, SEARCH_H],
  );
  const rawCategoryY = useTransform(scrollY, [0, 40, 80], [0, -CATEGORY_H, -CATEGORY_H]);
  const rawCategoryOpacity = useTransform(scrollY, [0, 40, 80], [1, 0, 0]);
  const rawSearchY = useTransform(scrollY, [0, 30, 80], [90, 10, 25]);

  // 🔹 스프링으로 착 붙는 느낌
  const springConfig = { stiffness: 300, damping: 35, mass: 0.5 };
  const stackHeight = useSpring(rawStackHeight, springConfig);
  const categoryY = useSpring(rawCategoryY, springConfig);
  const categoryOpacity = useSpring(rawCategoryOpacity, springConfig);
  const searchY = useSpring(rawSearchY, springConfig);

  // 🔹 검색 중에는 기본 상태로 freeze
  const frozenStackHeight = CATEGORY_H + GAP + SEARCH_H;
  const frozenCategoryY = 0;
  const frozenCategoryOpacity = 1;
  const frozenSearchY = 87;

  return (
    <>
      <div className='sticky top-0 left-0 w-full bg-gradient-to-b from-white to-gray-50 items-center border-b z-50'>
        {/* 상단 로고 + 로그인 */}
        <div className='absolute top-[15px] w-full flex items-center justify-between h-[64px] px-10 z-50'>
          <Link href='/'>
            {isTablet ? (
              <Image src={'/images/icons/small_logo.svg'} alt='Logo' width={40} height={40} />
            ) : (
              <Image src={'/images/icons/logo.svg'} alt='Logo' width={105} height={26} />
            )}
          </Link>
          <div className='flex items-center gap-2'>
            <LoginSection />
          </div>
        </div>

        {/* 2단 스택: CategoryList 위 / SearchFilters 아래 */}
        <motion.div
          style={{ height: isSearching ? frozenStackHeight : stackHeight }}
          className='relative w-full flex justify-center px-6'
        >
          {/* 카테고리 (위) */}
          <motion.div
            style={{
              y: isSearching ? frozenCategoryY : categoryY,
              opacity: isSearching ? frozenCategoryOpacity : categoryOpacity,
            }}
            className='absolute top-0 left-0 w-full flex justify-center cursor-pointer'
          >
            <CategoryList scrollY={scrollY} freeze={isSearching} />
          </motion.div>

          {/* 검색창 (아래 → 위로 슬라이드) */}
          <motion.div
            style={{ y: isSearching ? frozenSearchY : searchY }}
            className='absolute left-1/2 -translate-x-1/2 w-full flex justify-center z-50 px-10'
          >
            <SearchFilters
              scrollY={scrollY}
              isSearching={isSearching}
              setIsSearching={setIsSearching}
            />
          </motion.div>
        </motion.div>
      </div>
      {isSearching && (
        <div
          className='opacity-20 fixed top-0 left-0 w-screen h-screen bg-black z-40'
          onClick={() => {
            setIsSearching(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </>
  );
}
