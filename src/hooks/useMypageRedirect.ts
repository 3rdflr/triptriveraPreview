import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useLayoutEffect } from 'react';
import { errorToast } from '@/lib/utils/toastUtils';

export const useMypageRedirect = (redirectTo = '/login') => {
  const router = useRouter();
  const { user } = useUserStore();

  useLayoutEffect(() => {
    if (user === null) {
      router.replace(redirectTo);
      errorToast.run('로그인 세션이 만료되었습니다.');
    }
  }, [user, router, redirectTo]);
};
