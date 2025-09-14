export const wsrvLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  return `https://wsrv.nl/?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
};
