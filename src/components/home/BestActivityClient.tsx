'use client';

import { useUserStore } from '@/store/userStore';
import { Activity } from '@/types/activities.type';
import { ChevronRight } from 'lucide-react';
import ActivityCard from './ActivityCard';

export default function BestActivityClient({ activities }: { activities: Activity[] }) {
  const user = useUserStore((state) => state.user);

  if (!activities.length) return null;

  return (
    <div className='px-[24px] lg:px-[86px] my-5'>
      <h1 className='flex items-center justify-start text-20-medium text-title mb-2'>
        최근 인기있는 체험 <ChevronRight strokeWidth={2} />
      </h1>
      <div
        className='grid grid-flow-col gap-[16px] overflow-x-auto scrollbar-hide
        [grid-auto-columns:calc((100%-16px*(var(--visible-items)-1))/var(--visible-items))]'
      >
        {activities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} userId={user?.id} />
        ))}
      </div>
    </div>
  );
}
