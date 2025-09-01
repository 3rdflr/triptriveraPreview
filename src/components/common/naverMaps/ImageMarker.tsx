export interface ImageMarkerProps {
  /** 이미지 URL */
  src: string;
  /** 이미지 alt 텍스트 */
  alt?: string;
  /** 마커 크기 */
  size?: number;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * ImageMarker 컴포넌트
 * - Marker의 children으로 사용되는 커스텀 마커 UI
 * - 실제 마커 생성 시 HTML로 변환되어 네이버 지도에 표시됨
 * - renderToString 호환을 위해 일반 img 태그 사용
 */

export interface ImageMarkerProps {
  /** 이미지 URL */
  src: string;
  /** 이미지 alt 텍스트 */
  alt?: string;
  /** 마커 크기 */
  size?: number;
  /** 추가 CSS 클래스 */
  className?: string;
}

export default function ImageMarker({
  src,
  alt = '마커',
  size = 32,
  className = '',
}: ImageMarkerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className='rounded-full border-2 border-white shadow-lg object-cover'
      />
    </div>
  );
}
