import { ReactNode } from 'react';

/**
 * Marker 컴포넌트
 * - NaverMap의 children으로 사용
 * - position 또는 address로 위치 지정 가능
 * - 실제 렌더링은 NaverMapCore에서 처리
 * - 이 컴포넌트 자체는 렌더링되지 않음 (props 전달용)
 * - 해당 컴포넌트 안의 children은 renderToString을 사용하여 HTML로 변환됩니다.
 */

export interface MarkerPosition {
  lat: number;
  lng: number;
}
export interface MarkerProps {
  /** 마커 위치 (위도, 경도) - position과 address 중 하나 필수 */
  position?: MarkerPosition;
  /** 지오코딩할 주소 - position과 address 중 하나 필수 */
  address?: string;
  /** 마커 클릭 시 실행될 콜백 */
  onClick?: (position: MarkerPosition) => void;
  /** 커스텀 마커 UI */
  children?: ReactNode;
  /** 마커 ID (다중 마커 구분용) */
  id?: string;
}

export default function Marker({
  position: _position,
  address: _address,
  onClick: _onclick,
  children: _children,
  id: _id,
}: MarkerProps) {
  // 이 컴포넌트는 실제로 렌더링되지 않음
  // NaverMapCore에서 React.Children.map으로 props를 추출해서 사용
  return null;
}

// Marker 컴포넌트 타입 확인을 위한 displayName
Marker.displayName = 'Marker';
