'use client';

import { Slider } from '@/components/ui/slider';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';

type Props = {
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
};

export default function PriceFilter({ priceRange, setPriceRange }: Props) {
  const initialMinPrice = 0;
  const initialMaxPrice = 300_000;
  const step = 1000;

  // 데이터 생성
  const rawData = useMemo(() => {
    return Array.from({ length: Math.floor(initialMaxPrice / step) + 1 }, (_, i) => {
      const price = i * step;
      const base = Math.sin(i / 50) * 300;
      const secondary = Math.cos(i / 20) * 150;
      const search = Math.max(50, Math.round(base + secondary + 400));
      return { price, search };
    });
  }, []);

  const chartDomainMin = initialMinPrice;
  const chartDomainMax = initialMaxPrice;

  const getTooltipPosition = (value: number) => {
    const ratio = (value - chartDomainMin) / (chartDomainMax - chartDomainMin);
    return `${ratio * 100}%`;
  };

  return (
    <div className='flex flex-col gap-3 w-full relative'>
      <span className='text-sm text-gray-500 mb-5'>가격대</span>

      {/* 차트 */}
      <div className='h-24 w-full relative'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={rawData}>
            <XAxis dataKey='price' hide domain={[chartDomainMin, chartDomainMax]} />
            <YAxis hide />

            {/* 선택 범위 강조용 gradient */}
            <defs>
              <linearGradient id='colorRange' x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0%' stopColor='#cbd5e1' stopOpacity={0.3} />
                <stop
                  offset={`${(priceRange[0] / chartDomainMax) * 100}%`}
                  stopColor='#cbd5e1'
                  stopOpacity={0.3}
                />
                <stop
                  offset={`${(priceRange[0] / chartDomainMax) * 100}%`}
                  stopColor='var(--primary-500)'
                  stopOpacity={0.5}
                />
                <stop
                  offset={`${(priceRange[1] / chartDomainMax) * 100}%`}
                  stopColor='var(--primary-500)'
                  stopOpacity={0.5}
                />
                <stop
                  offset={`${(priceRange[1] / chartDomainMax) * 100}%`}
                  stopColor='#cbd5e1'
                  stopOpacity={0.3}
                />
                <stop offset='100%' stopColor='#cbd5e1' stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <Area
              type='monotone'
              dataKey='search'
              stroke='var(#colorRange)'
              fill='url(#colorRange)'
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* 툴팁 */}
        <div className='absolute top-0 left-0 w-full h-full pointer-events-none flex justify-between items-start'>
          <div
            className='bg-white px-2 py-1 rounded shadow text-xs text-gray-700'
            style={{
              position: 'absolute',
              left: getTooltipPosition(priceRange[0]),
              transform: 'translateX(-50%)',
              top: -24,
            }}
          >
            ₩{priceRange[0].toLocaleString()}
          </div>
          <div
            className='bg-white px-2 py-1 rounded shadow text-xs text-gray-700'
            style={{
              position: 'absolute',
              left: getTooltipPosition(priceRange[1]),
              transform: 'translateX(-50%)',
              top: -24,
            }}
          >
            ₩{priceRange[1].toLocaleString()}
          </div>
        </div>
      </div>

      {/* 가격 슬라이더 */}
      <Slider
        value={priceRange}
        onValueChange={(value) => setPriceRange(value as [number, number])}
        min={chartDomainMin}
        max={chartDomainMax}
        step={step}
        className='bg-gray-200 h-2 rounded-full'
      />

      {/* 선택 범위 텍스트 */}
      <div className='flex justify-between text-xs text-gray-600'>
        <span>{priceRange[0].toLocaleString()}원~</span>
        <span>{priceRange[1].toLocaleString()}원</span>
      </div>
    </div>
  );
}
