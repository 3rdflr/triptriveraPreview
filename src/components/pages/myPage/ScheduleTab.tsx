import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { useScheduleStore } from '@/store/reservedScheduleStore';
import { TabsList } from '@radix-ui/react-tabs';
import ScheduleDropdown from './ScheduleDropdown';
import { ReservationListStatus, ReservedReservation } from '@/types/myReservation.type';
import ScheduleReservationCard from './ScheduleReservationCard';
import { useScreenSize } from '@/hooks/useScreenSize';
import { InfinityScroll } from '@/components/common/InfinityScroll';
import MyExperienceCardSkeleton from './MyExperienceSkeleton';
import EmptyList from './EmptyList';

interface ScheduleTabProps {
  reservations: ReservedReservation[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  onConfirm: (activityId: number, reservationId: number) => void;
  onDecline: (activityId: number, reservationId: number) => void;
  onSelectSchedule: (value: string, tab: 'pending' | 'confirmed' | 'declined') => void;
}

const ScheduleTab = ({
  reservations,
  hasNextPage,
  fetchNextPage,
  isLoading,
  isFetchingNextPage,
  onConfirm,
  onDecline,
  onSelectSchedule,
}: ScheduleTabProps) => {
  const { isDesktop, isTablet } = useScreenSize();
  const { status, setStatus, activeScheduleId, scheduleLists } = useScheduleStore();
  return (
    <Tabs
      value={status}
      onValueChange={(val) => setStatus(val as ReservationListStatus)}
      className='w-full'
    >
      <div className='w-full flex justify-start border-b border-b-grayscale-100'>
        <TabsList className='flex w-full'>
          <TabsTrigger
            value='pending'
            className={`flex-1 pc:flex-none${isDesktop ? 'flex-none' : ''}`}
          >
            신청 {scheduleLists.pending.length}
          </TabsTrigger>
          <TabsTrigger
            value='confirmed'
            className={`flex-1 pc:flex-none ${isDesktop ? 'flex-none' : ''}`}
          >
            승인 {scheduleLists.confirmed.length}
          </TabsTrigger>
          <TabsTrigger
            value='declined'
            className={`flex-1 pc:flex-none${isDesktop ? 'flex-none' : ''}`}
          >
            거절 {scheduleLists.declined.length}
          </TabsTrigger>
        </TabsList>
      </div>

      {(['pending', 'confirmed', 'declined'] as const).map((tab) => {
        const schedules = scheduleLists[tab];

        return (
          <TabsContent key={tab} value={tab} className='flex flex-col gap-5'>
            {schedules.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-10 text-gray-500 min-h-75'>
                <p>예약 내역이 없습니다.</p>
              </div>
            ) : (
              <div
                className={`${isTablet ? 'flex-row items-start' : 'flex-col items-center'} flex gap-7.5 min-h-75`}
              >
                <div className={`flex flex-col gap-2.5`}>
                  <Label className='text-lg font-bold'>예약 시간</Label>
                  <div>
                    <ScheduleDropdown
                      value={activeScheduleId[tab]}
                      onChange={(value) => onSelectSchedule(value, tab)}
                      scheduleList={schedules}
                    />
                  </div>
                </div>

                <div
                  className={`${isTablet ? 'flex-1 w-auto' : 'w-auto min-w-[330px]'} mobile:pl-2 pc:w-full pc:min-w-0 pc:p-0 flex flex-col gap-2.5`}
                >
                  <Label className='text-lg font-bold'>예약 내역</Label>
                  <InfinityScroll
                    items={reservations}
                    hasNextPage={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    isLoading={isLoading}
                    isFetchingNextPage={isFetchingNextPage}
                    height={500}
                    itemHeightEstimate={120}
                    enableScrollPosition={false}
                  >
                    {/* 초기 로딩 스켈레톤 */}
                    <InfinityScroll.Skeleton count={3}>
                      <MyExperienceCardSkeleton />
                    </InfinityScroll.Skeleton>
                    <InfinityScroll.Contents loadingText='더 많은 예약내역을 불러오는 중입니다...'>
                      {(reservation: ReservedReservation) => (
                        <ScheduleReservationCard
                          key={reservation.id}
                          reservationData={reservation}
                          onConfirm={onConfirm}
                          onDecline={onDecline}
                        />
                      )}
                    </InfinityScroll.Contents>

                    <InfinityScroll.Empty className='flex flex-col items-center justify-center gap-3 pt-6 text-gray-500'>
                      <EmptyList text='예약내역이 없어요' />
                    </InfinityScroll.Empty>
                  </InfinityScroll>
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
