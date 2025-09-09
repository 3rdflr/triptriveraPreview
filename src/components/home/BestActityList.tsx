// BestActivity.tsx (서버 컴포넌트)
import { getActivitiesList } from '@/app/api/activities';
import BestActivityClient from './BestActivityClient';

export default async function BestActivity() {
  const data = await getActivitiesList({
    method: 'cursor',
    size: 10,
    sort: 'most_reviewed',
  });

  return <BestActivityClient activities={data.activities} />;
}
