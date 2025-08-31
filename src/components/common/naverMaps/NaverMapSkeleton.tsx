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
  console.log('🔄 [SUSPENSE] NaverMapSkeleton 렌더링 - 지도 데이터 로딩 중');

  return (
    <div
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* 지도 배경 패턴 */}
      <div className='absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200' />

      {/* 스켈레톤 애니메이션 */}
      <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse' />

      {/* 가짜 지도 컨트롤 버튼들 */}
      <div className='absolute top-4 right-4 space-y-2'>
        <div className='w-8 h-8 bg-white rounded shadow-sm animate-pulse' />
        <div className='w-8 h-8 bg-white rounded shadow-sm animate-pulse' />
      </div>

      {/* 가짜 마커 위치 */}
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='w-6 h-8 bg-red-400 rounded-t-full rounded-b-none animate-pulse' />
      </div>

      {/* 로딩 텍스트 */}
      <div className='absolute bottom-4 left-4'>
        <div className='bg-white px-3 py-2 rounded shadow-sm'>
          <div className='flex items-center space-x-2'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600' />
            <span className='text-sm text-gray-600'>지도를 로드하는 중...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
