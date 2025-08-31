import { GeocodeResult } from '@/types/geocoding.types';
/**
 *
 * @param address
 * @returns
 */
export function geocodeAddress(address: string): Promise<GeocodeResult> {
  return new Promise((resolve, reject) => {
    if (!naver?.maps?.Service) {
      reject(new Error('네이버 지도 API가 로드되지 않았습니다.'));
      return;
    }

    naver.maps.Service.geocode({ query: address }, (status: number, response) => {
      if (status !== 200) {
        if (status === 400) {
          reject(new Error('잘못된 요청입니다.'));
        } else if (status === 500) {
          reject(new Error('서버 오류가 발생했습니다.'));
        } else {
          reject(new Error(`지오코딩 실패: ${status}`));
        }
        return;
      }

      if (!response.v2?.addresses || response.v2.addresses.length === 0) {
        reject(new Error('주소를 찾을 수 없습니다.'));
        return;
      }
      console.log('📍 [GEOCODE] 지오코딩 성공', { response });
      const { x, y } = response.v2.addresses[0];
      resolve({
        x: Number(x),
        y: Number(y),
      });
    });
  });
}
