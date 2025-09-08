import { useState } from 'react';
import { MyReservationCreateRequest } from '@/types/myReservation.type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReservationReview } from '@/app/api/myReservations';
import { Stars } from '@/components/common/Stars';
import { Reservation } from '@/types/myReservation.type';
import { toCardDate } from '@/lib/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Modal } from 'react-simplified-package';
import { successToast, errorToast } from '@/lib/utils/toastUtils';
import clsx from 'clsx';

interface ReviewModalProps {
  data: Reservation;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function ReviewModal({ data, isOpen, onClose, className }: ReviewModalProps) {
  const { id: reservationId, activity, date, startTime, endTime, headCount } = data;
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');

  const isFormValid = rating > 0 && content.trim().length > 0;

  const handleSubmit = () => {
    if (!isFormValid) {
      errorToast.run('리뷰 작성을 완료해주세요.');
      return;
    }
    mutate({ rating, content: content.trim() });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data: MyReservationCreateRequest) => createReservationReview(reservationId, data),
    onSuccess: () => {
      successToast.run('리뷰가 성공적으로 등록되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['reservation-list'] });
      onClose();
    },
    onError: () => {
      errorToast.run('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName={clsx('bg-white !p-7.5 !rounded-3xl', className)}
      buttonClassName='!hidden'
    >
      <div className='flex flex-col w-[300px] lg:w-[400px]'>
        <div className='flex flex-col gap-1'>
          <div className='w-full flex flex-col items-center gap-1'>
            <h2 className='text-lg font-bold'>{activity.title}</h2>
            <div className='flex items-center gap-0.5 pb-0 lg:pb-2 text-gray-500'>
              {toCardDate(date)} / {`${startTime} - ${endTime} (${headCount}명)`}
            </div>
            <Stars initRate={rating} edit={true} onChange={setRating} size='lg' />
          </div>
        </div>

        <div className='mt-6 flex flex-col gap-2'>
          <h3 className='font-bold'> 소중한 경험을 들려주세요</h3>
          <textarea
            className='w-full h-32 p-2 border border-gray-300 shadow-sm rounded-md resize-none'
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder='체험에서 느낀 경험을 공유해주세요...'
          />
        </div>

        <div className='mt-4 flex items-center justify-evenly'>
          <Button variant='ghost' onClick={onClose} className='flex-1'>
            취소
          </Button>
          <Button className='flex-1' disabled={isPending || !isFormValid} onClick={handleSubmit}>
            {isPending ? '등록 중...' : '리뷰 등록'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
