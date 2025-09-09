import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ReservedReservation } from '@/types/myReservation.type';
import { badgeStatusColor, reservationStatus } from '@/lib/constants/reservation';
import { useScreenSize } from '@/hooks/useScreenSize';

interface ScheduleReservationCardProps {
  reservationData: ReservedReservation;
  onConfirm: (activityId: number, reservationId: number) => void;
  onDecline: (activityId: number, reservationId: number) => void;
}

const ScheduleReservationCard = ({
  reservationData,
  onConfirm,
  onDecline,
}: ScheduleReservationCardProps) => {
  const { isMobile } = useScreenSize();
  const { id: reservationId, activityId, headCount, nickname, status } = reservationData;
  return (
    <div
      className={`${isMobile ? 'w-[327px]' : 'w-full'} flex justify-between items-center border border-grayscale-100 px-4 py-5 rounded-2xl`}
    >
      <div className='flex gap-2'>
        <div className='flex flex-col text-16-bold text-grayscale-500'>
          <span>닉네임</span>
          <span>인원</span>
        </div>
        <div className='flex flex-col text-16-medium'>
          <span>{nickname}</span>
          <span>{headCount}명</span>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        {/* pending 상태인 경우 승인/거절 버튼 나옴 */}
        {status === 'pending' && (
          <>
            <Button size='xs' onClick={() => onConfirm(activityId, reservationId)}>
              승인하기
            </Button>
            <Button
              size='xs'
              variant='secondary'
              onClick={() => onDecline(activityId, reservationId)}
            >
              거절하기
            </Button>
          </>
        )}

        {/* 예약 승인/예약 거절(confirmed/declined) 상태인 경우 배지 */}
        {status != 'pending' && (
          <Badge size='xs' className={badgeStatusColor[status]}>
            {reservationStatus[status]}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ScheduleReservationCard;
