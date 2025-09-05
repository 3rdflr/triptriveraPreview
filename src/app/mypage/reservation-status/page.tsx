'use client';
import {
  getMyActivitiesList,
  getReservationDashboard,
  getReservedSchedule,
} from '@/app/api/myActivities';
import Spinner from '@/components/common/Spinner';
import ActivitySelect from '@/components/pages/myPage/ActivitySelect';
import ReservationStatusCalendar from '@/components/pages/myPage/ReservationStatusCalendar';
import { Label } from '@/components/ui/label';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { format } from 'date-fns';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useOverlay } from '@/hooks/useOverlay';

const ReservationStatusPage = () => {
  const overlay = useOverlay();
  const pathname = usePathname();
  const [activityId, setActivityId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data: activityListData, isLoading } = useQuery({
    queryKey: ['my-activities-list', pathname],
    queryFn: () => getMyActivitiesList({}),
  });

  const { data: reservationListData } = useQuery({
    queryKey: ['reservation-list', pathname, activityId, currentDate],
    queryFn: ({ queryKey }) => {
      const [_key, _pathname, activityId, date] = queryKey as [string, string, string, Date];

      if (!activityId || !date) return Promise.resolve(null);

      const year = format(date, 'yyyy');
      const month = format(date, 'MM');

      return getReservationDashboard(Number(activityId), { year, month });
    },
    enabled: activityId !== null && currentDate !== null,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const { refetch: refetchReservedScheduleData } = useQuery({
    queryKey: ['reserved-schedule', pathname, activityId, selectedDate],
    queryFn: ({ queryKey }) => {
      const [_key, _pathname, activityId, selectedDate] = queryKey as [
        string,
        string,
        string,
        string,
      ];

      if (!activityId || !selectedDate) return Promise.resolve(null);

      return getReservedSchedule(Number(activityId), { date: selectedDate });
    },
    enabled: false,
    staleTime: 0,
    refetchOnMount: 'always',
  });

  const events = reservationListData?.flatMap((item) => {
    const date = new Date(item.date);

    return [
      {
        title: `예약 ${item.reservations.pending}`,
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
        title: `완료 ${item.reservations.completed}`,
        start: date,
        end: date,
        allDay: true,
      },
    ];
  });

  const onChangeActivitySelect = (id: string) => {
    setActivityId(id);
    console.log(id, '해당 id로 api 호출');
  };

  const onNavigateCalendar = (date: Date) => {
    setCurrentDate(date);
  };

  const onClickCalendarDay = async (date: string) => {
    setSelectedDate(date);

    const { data: scheduleData } = await refetchReservedScheduleData();

    // 스케쥴 데이터 확인 후 모달 띄움
    console.log(scheduleData);

    overlay.open(({ isOpen, close }) => (
      <ConfirmModal title={`예약:`} isOpen={isOpen} onClose={close} onAction={close} />
    ));
  };

  useEffect(() => {
    if (activityListData && activityListData.activities.length > 0) {
      setActivityId(String(activityListData?.activities[0].id));
    }
  }, [activityListData]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col gap-0.5 sm:gap-5'>
      {/* 헤더 */}
      <div className='px-6 sm:px-0 flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-16'>
          <div className='w-full flex flex-col gap-2.5'>
            <Label className='text-[18px] font-bold'>예약 현황</Label>
            <span className='text-14-medium text-grayscale-500'>
              내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다.
            </span>
          </div>
        </div>
        <ActivitySelect
          value={activityId ?? undefined}
          activityList={activityListData?.activities ?? []}
          onChange={onChangeActivitySelect}
        />
      </div>

      <ReservationStatusCalendar
        date={currentDate}
        events={events ?? []}
        onNavigate={onNavigateCalendar}
        onClickDate={onClickCalendarDay}
      />
    </div>
  );
};

export default ReservationStatusPage;
