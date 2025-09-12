'use client';

import { motion } from 'framer-motion';

/**
 * NaverMapSkeleton 컴포넌트
 * - 네이버 지도 로딩 중 표시되는 스켈레톤 UI
 * - Suspense fallback으로 사용
 * - lottie 애니메이션 적용
 */

interface NaverMapSkeletonProps {
  /** 컨테이너 너비 (기본값: 100%) */
  width?: string;
  /** 컨테이너 높이 (기본값: 256px) */
  height?: string;
  /** 추가 CSS 클래스 */
  className?: string;
}

export default function NaverMapSkeleton({
  width = '100%',
  height = '256px',
  className = '',
}: NaverMapSkeletonProps) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`w-full h-full relative bg-gray-100 flex justify-center items-center rounded-3xl ${className}`}
        style={{ width, height }}
      ></motion.div>
    </div>
  );
}
