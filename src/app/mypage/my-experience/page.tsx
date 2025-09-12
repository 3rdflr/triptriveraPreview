'use client';
import MyExperienceList from '@/components/pages/myPage/MyExperienceList';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useInfiniteMyExperienceList from '@/hooks/useInfiniteMyExperienceList';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const MyExperiencePage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const pathname = usePathname();

  const {
    myExperienceListData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteMyExperienceList(null);

  useEffect(() => {
    refetch();
  }, [pathname, queryClient, refetch]);

  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-16 px-4'>
        <div className='flex flex-col gap-2.5'>
          <Label className='text-[18px] font-bold'>내 체험 관리</Label>
          <span className='text-14-medium text-grayscale-500'>
            체험을 등록하거나 수정 및 삭제가 가능합니다.
          </span>
        </div>
        <Button size='md' onClick={() => router.push('/my-activities/activity')}>
          체험 등록하기
        </Button>
      </div>

      {/* 체험 관리 카드 목록 */}
      <MyExperienceList
        experienceList={myExperienceListData}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MyExperiencePage;
