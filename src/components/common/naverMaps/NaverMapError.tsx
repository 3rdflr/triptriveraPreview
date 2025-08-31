/**
 * NaverMapError 컴포넌트
 * - 네이버 지도 로딩 실패 시 표시되는 에러 UI
 * - ErrorBoundary fallback으로 사용
 * - 사용자에게 명확한 에러 정보와 재시도 옵션 제공
 */

interface NaverMapErrorProps {
  /** 컨테이너 너비 (기본값: 100%) */
  width?: string;
  /** 컨테이너 높이 (기본값: 256px) */
  height?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 에러 메시지 (선택적) */
  error?: Error;
  /** 재시도 콜백 함수 (선택적) */
  onRetry?: () => void;
}

export default function NaverMapError({
  width = '100%',
  height = '256px',
  className = '',
  error,
  onRetry,
}: NaverMapErrorProps) {
  console.log('❌ [ERROR_BOUNDARY] NaverMapError 렌더링 - 지도 로딩 실패', { error });

  const handleRetry = () => {
    console.log('🔄 [ERROR_BOUNDARY] 지도 재시도 버튼 클릭');
    if (onRetry) {
      onRetry();
    } else {
      // 기본 재시도: 페이지 새로고침
      window.location.reload();
    }
  };

  return (
    <div
      className={`relative bg-red-50 border border-red-200 rounded-lg flex flex-col items-center justify-center p-6 ${className}`}
      style={{ width, height }}
    >
      {/* 에러 아이콘 */}
      <div className='mb-4'>
        <svg
          className='w-12 h-12 text-red-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z'
          />
        </svg>
      </div>

      {/* 에러 메시지 */}
      <div className='text-center mb-4'>
        <h3 className='text-lg font-medium text-red-800 mb-2'>지도를 불러올 수 없습니다</h3>
        <p className='text-sm text-red-600 max-w-sm'>
          {error?.message || '네트워크 연결 상태를 확인하거나 잠시 후 다시 시도해주세요.'}
        </p>
      </div>

      {/* 재시도 버튼 */}
      <button
        onClick={handleRetry}
        className='px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
      >
        다시 시도
      </button>

      {/* 개발 환경에서만 상세 에러 정보 표시 */}
      {process.env.NODE_ENV === 'development' && error && (
        <details className='mt-4 w-full'>
          <summary className='text-xs text-red-500 cursor-pointer hover:text-red-700'>
            개발자 정보 (상세 에러)
          </summary>
          <pre className='mt-2 text-xs text-red-600 bg-red-100 p-2 rounded border overflow-auto max-h-20'>
            {error.stack || error.message}
          </pre>
        </details>
      )}
    </div>
  );
}
