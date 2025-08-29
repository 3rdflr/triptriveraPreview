// src/components/CategoryButton.tsx

'use client';

import { useRouter } from 'next/navigation';
import { motion, MotionValue } from 'framer-motion';

interface NavbarCategoryProps {
  category: '모두' | '문화 · 예술' | '음식' | '스포츠' | '투어' | '관광' | '웰빙';
  icon: React.ReactNode;
  value: '' | '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';
  isSelected: boolean;

  buttonScale?: MotionValue<number>;
  buttonOpacity?: MotionValue<number>;
}

export default function CategoryButton({
  category,
  icon,
  value,
  isSelected,
  buttonScale,
  buttonOpacity,
}: NavbarCategoryProps) {
  const router = useRouter();

  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const queryString = params.toString();
    const newPath = queryString ? `/?${queryString}` : '/';
    router.push(newPath);
  };

  return (
    <motion.button
      className={`${isSelected ? 'text-gray-800 border-b-2 border-gray-800 ' : 'text-gray-500'} flex flex-col items-center gap-[4px] min-w-[50px] lg:min-w-[80px] h-full pt-[20px] cursor-pointer pb-[8px] rounded-t-[8px] hover:bg-gray-100 transition-soft z-50`}
      onClick={() => {
        updateQuery('category', value);
      }}
      aria-label={category}
      style={{
        scale: buttonScale,
        opacity: buttonOpacity,
      }}
    >
      {icon}
      <span className='text-12-medium'>{category}</span>
    </motion.button>
  );
}
