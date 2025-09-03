interface ReviewHeroProps {
  reviewCount: number;
  rating: number;
}
type Level = 0 | 1 | 2 | 3 | 4;
const LABELS = ['개선 필요', '보통', '다소 만족', '만족', '매우 만족'] as const;

export function ReviewHero({ reviewCount, rating }: ReviewHeroProps) {
  const level = Math.max(0, Math.min(4, Math.floor(rating))) as Level;
  const summary = LABELS[level];

  return (
    <div className='flex flex-col items-center gap-[6px]'>
      <h1 className='font-bold text-3xl md:text-3xl'>{rating.toFixed(1)}</h1>
      <p className='font-bold text-md'>{summary}</p>

      <p className='text-sm text-gray-500'>
        <span className='text-yellow-500'>★ </span>
        {reviewCount.toLocaleString()}개 후기
      </p>
    </div>
  );
}
