'use client';

import { Activity } from '@/types/activities.type';
import { useScreenSize } from '@/hooks/useScreenSize';
import ActivitySheet from './ActivitySheet';
import ActivityList from './ActivityList';

export default function SearchResult({
  initialActivities,
  initalCursorId,
  totalCount,
}: {
  initialActivities: Activity[];
  initalCursorId: number;
  totalCount: number;
}) {
  const { isDesktop } = useScreenSize();

  return (
    <>
      <div className='grid grid-cols-1 xl:grid-cols-[3fr_2fr] h-screen'>
        {isDesktop ? (
          <>
            <ActivityList initialActivities={initialActivities} initalCursorId={initalCursorId} />
            <div>여기에 지도가 표시됩니다</div>
          </>
        ) : (
          <>
            <div>여기에 지도가 표시됩니다</div>
            <ActivitySheet totalCount={totalCount}>
              <ActivityList initialActivities={initialActivities} initalCursorId={initalCursorId} />
            </ActivitySheet>
          </>
        )}
      </div>
    </>
  );
}
