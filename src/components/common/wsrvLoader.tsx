export const wsrvLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  // WebP 포맷과 적응형 크기 지원으로 이미지 최적화
  const actualQuality = quality || 75;

  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${actualQuality}&output=webp&af`;
};
