'use client';
import { getMyActivitiesList, getReservationDashboard } from '@/app/api/myActivities';
import Spinner from '@/components/common/Spinner';
import ActivitySelect from '@/components/pages/myPage/ActivitySelect';
import ReservationStatusCalendar from '@/components/pages/myPage/ReservationStatusCalendar';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';

const ReservationStatusPage = () => {
  const pathname = usePathname();
  const [activitySelectVal, setActivitySelectVal] = useState<string | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: activityListData, isLoading } = useQuery({
    queryKey: ['my-activities-list', pathname],
    queryFn: () => getMyActivitiesList({}),
  });

  const { data: reservationListData } = useQuery({
    queryKey: ['reservation-list', pathname, activitySelectVal, currentDate],
    queryFn: ({ queryKey }) => {
      const [_key, _pathname, activitySelectVal, date] = queryKey as [string, string, string, Date];
      const year = format(date, 'yyyy');
      const month = format(date, 'MM');

      return getReservationDashboard(Number(activitySelectVal), { year, month });
    },
    enabled: !!activitySelectVal,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const events = reservationListData?.flatMap((item) => {
    const date = new Date(item.date);

    return [
      {
        title: `완료 ${item.reservations.completed}`,
        start: date,
        end: date,
        allDay: true,
      },
      {
        title: `승인 ${item.reservations.confirmed}`,
        start: date,
        end: date,
        allDay: true,
      },
      {
        title: `예약 ${item.reservations.pending}`,
        start: date,
        end: date,
        allDay: true,
      },
    ];
  });

  const onChangeActivitySelect = (id: string) => {
    // select의 value를 바꿈
    setActivitySelectVal(id);
    console.log(id, '해당 id로 api 호출');
  };

  const onNavigateCalendar = (date: Date) => {
    setCurrentDate(date);
  };

  useEffect(() => {
    if (activityListData) {
      setActivitySelectVal(String(activityListData?.activities[0].id));
    }
  }, [activityListData]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-16'>
        <div className='w-full flex flex-col gap-2.5'>
          <Label className='text-[18px] font-bold'>예약 현황</Label>
          <span className='text-14-medium text-grayscale-500'>
            내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
          </span>
        </div>
      </div>
      <ActivitySelect
        value={activitySelectVal}
        activityList={activityListData?.activities ?? []}
        className='mt-1.5'
        onChange={onChangeActivitySelect}
      />
      <ReservationStatusCalendar
        date={currentDate}
        events={events ?? []}
        onNavigate={onNavigateCalendar}
      />
    </div>
  );
};

export default ReservationStatusPage;
