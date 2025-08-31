import { motion } from 'framer-motion';

/**
 * NaverMapSkeleton 컴포넌트
 * - 네이버 지도 로딩 중 표시되는 스켈레톤 UI
 * - Suspense fallback으로 사용
 *
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
    <div
      className={`w-full relative bg-gray-100 flex justify-center items-center rounded-lg ${className}`}
      style={{ width, height }}
    >
      <div className='flex'>
        {'지도를 로드하는 중...'.split('').map((char, index) => (
          <motion.span
            key={index}
            className='text-sm text-gray-600'
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
              ease: 'easeInOut',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
