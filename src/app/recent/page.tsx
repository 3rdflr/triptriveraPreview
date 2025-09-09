import Spinner from '@/components/common/Spinner';
import RecentView from '@/components/home/RecentView';
import { Suspense } from 'react';

export default function Recent() {
  return (
    <div className='h-auto'>
      <Suspense
        fallback={
          <div className='h-full'>
            <Spinner />
          </div>
        }
      >
        <RecentView />
      </Suspense>
    </div>
  );
}
