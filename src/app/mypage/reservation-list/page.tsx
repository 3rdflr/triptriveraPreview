'use client';
import ReservationList from '@/components/pages/myPage/ReservationList';
import { Badge } from '@/components/ui/badge';

import { Label } from '@/components/ui/label';
import { reservationStatusAll, ReservationStatusWithAll } from '@/lib/constants/reservation';
import { useState } from 'react';

const ReservationListPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<ReservationStatusWithAll>('all');

  return (
    <div className='flex flex-col gap-7.5'>
      {/* 헤더 */}
      <div className='flex flex-col md:flex-row w-full justify-between items-start md:items-center gap-4 md:gap-16'>
        <div className='flex flex-col gap-2.5 flex-1 min-w-0 max-w-full px-4'>
          <Label className='text-[18px] font-bold'>예약내역</Label>
          <span className='text-14-medium text-grayscale-500'>
            예약내역을 변경 및 취소할 수 있습니다.
          </span>
          <div className='flex pt-3.5 gap-2 overflow-x-auto whitespace-nowrap scrollbar-hide'>
            {(Object.entries(reservationStatusAll) as [ReservationStatusWithAll, string][])
              .filter(([value]) => value !== 'declined')
              .map(([value, label]) => (
                <Badge
                  key={value}
                  variant='outline'
                  selected={selectedStatus === value}
                  onClick={() => setSelectedStatus(value)}
                >
                  {label}
                </Badge>
              ))}
          </div>
        </div>
      </div>

      {/* 예약 내역 카드 목록 */}
      <div className='flex flex-col gap-6 items-center'>
        <ReservationList initialCursorId={null} status={selectedStatus} />
      </div>
    </div>
  );
};

export default ReservationListPage;
