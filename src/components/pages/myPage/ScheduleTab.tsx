import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { useScheduleStore } from '@/store/reservedScheduleStore';
import { TabsList } from '@radix-ui/react-tabs';
import ScheduleDropdown from './ScheduleDropdown';
import { ReservedReservation } from '@/types/myReservation.type';
import ScheduleReservationCard from './ScheduleReservationCard';
import Spinner from '@/components/common/Spinner';

interface ScheduleTabProps {
  reservations: ReservedReservation[];
  onConfirm: (activityId: number, reservationId: number) => void;
  onDecline: (activityId: number, reservationId: number) => void;
  onSelectSchedule: (value: string, tab: 'pending' | 'confirmed' | 'declined') => void;
  isLoading: boolean;
}

const ScheduleTab = ({
  reservations,
  onConfirm,
  onDecline,
  onSelectSchedule,
  isLoading,
}: ScheduleTabProps) => {
  const { status, setStatus, selectedSchedules, scheduleLists } = useScheduleStore();
  return (
    <Tabs
      value={status}
      onValueChange={(val) => setStatus(val as keyof typeof selectedSchedules)}
      className='w-full'
    >
      <div className='w-full flex justify-start border-b border-b-grayscale-100'>
        <TabsList>
          <TabsTrigger value='pending'>신청 {scheduleLists.pending.length}</TabsTrigger>
          <TabsTrigger value='confirmed'>승인 {scheduleLists.confirmed.length}</TabsTrigger>
          <TabsTrigger value='declined'>거절 {scheduleLists.declined.length}</TabsTrigger>
        </TabsList>
      </div>

      {(['pending', 'confirmed', 'declined'] as const).map((tab) => {
        const schedules = scheduleLists[tab];

        return (
          <TabsContent key={tab} value={tab} className='flex flex-col gap-5'>
            {schedules.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-10 text-gray-500 min-h-64.5'>
                <p>예약 내역이 없습니다.</p>
              </div>
            ) : (
              <div className='flex flex-col gap-7.5 min-h-64.5'>
                <div className='flex flex-col gap-2.5'>
                  <Label className='text-lg font-bold'>예약 시간</Label>
                  <div>
                    <ScheduleDropdown
                      value={selectedSchedules[tab]}
                      onChange={(value) => onSelectSchedule(value, tab)}
                      scheduleList={schedules}
                    />
                  </div>
                </div>

                <div className='flex flex-col gap-2.5'>
                  <Label className='text-lg font-bold'>예약 내역</Label>
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    reservations?.map((reservation: ReservedReservation) => (
                      <ScheduleReservationCard
                        key={reservation.id}
                        reservationData={reservation}
                        onConfirm={onConfirm}
                        onDecline={onDecline}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
};
export default ScheduleTab;
