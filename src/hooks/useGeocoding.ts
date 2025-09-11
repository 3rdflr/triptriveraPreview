'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { geocodeAddress } from '@/app/api/geocoding';
import { GEOCODING_QUERY_KEYS } from '@/types/geocoding.types';

interface UseGeocodingProps {
  address?: string;
  isScriptReady?: boolean;
}

export function useGeocoding({ address, isScriptReady }: UseGeocodingProps) {
  const { data } = useSuspenseQuery({
    queryKey: [...GEOCODING_QUERY_KEYS.geocode(address || ''), isScriptReady],
    queryFn: async () => {
      if (!address || !isScriptReady) {
        return null;
      }
      try {
        const result = await geocodeAddress(address);
        return result;
      } catch (error) {
        console.error('❌ [GEOCODING] geocodeAddress 실패', error);
        throw error;
      }
    },
    retry: (failureCount: number, error: Error) => {
      // 네이버 API 로딩 실패시에만 재시도
      if (error.message.includes('네이버 지도 API가 로드되지 않았습니다')) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: 1000,
  });
  return { data };
}
