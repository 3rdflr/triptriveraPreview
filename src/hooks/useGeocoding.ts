'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { geocodeAddress } from '@/app/api/geocoding';
import { GEOCODING_QUERY_KEYS } from '@/types/geocoding.types';

interface UseGeocodingProps {
  address?: string;
  enabled?: boolean;
}

export function useGeocoding({ address, enabled = true }: UseGeocodingProps) {
  const queryOptions = {
    queryKey: GEOCODING_QUERY_KEYS.geocode(address || ''),
    queryFn: () => geocodeAddress(address!),
    enabled: Boolean(address) && enabled && typeof window !== 'undefined',
    retry: (failureCount: number, error: Error) => {
      // 네이버 API 로딩 실패시에만 재시도
      if (error.message.includes('네이버 지도 API가 로드되지 않았습니다')) {
        return failureCount < 3;
      }
      // 다른 오류는 재시도하지 않음
      return false;
    },
    retryDelay: 1000,
  };

  return useSuspenseQuery(queryOptions);
}
