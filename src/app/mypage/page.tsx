'use client';

import { useMypageRedirect } from '@/hooks/useMypageRedirect';

const MyPage = () => {
  // 마이페이지 미로그인 리디렉트
  useMypageRedirect();
};

export default MyPage;
