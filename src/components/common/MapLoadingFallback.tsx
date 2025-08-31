interface MapLoadingFallbackProps {
  width?: string;
  height?: string;
  className?: string;
}

export function MapLoadingFallback({
  width = '100%',
  height = '256px',
  className = '',
}: MapLoadingFallbackProps) {
  return (
    <div
      className={`w-full relative bg-gray-100 flex flex-col justify-center items-center rounded-lg ${className}`}
      style={{ width, height }}
    >
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2'></div>
      <p className='text-sm text-gray-600'>지도를 로드하는 중...</p>
    </div>
  );
}
