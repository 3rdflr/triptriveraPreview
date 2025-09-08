'use client';

import { Button } from '@/components/ui/button';

interface BookingErrorProps {
  resetError: () => void;
}

export default function BookingError({ resetError }: BookingErrorProps) {
  return (
    <div className='bg-white border rounded-lg p-6 shadow-sm'>
      <div className='text-center'>
        <div className='text-red-600 mb-4'>
          <h3 className='text-lg font-semibold mb-2'>예약 시스템에 문제가 발생했습니다</h3>
          <p className='text-sm text-gray-600'>
            잠시 후 다시 시도해 주세요. 문제가 계속되면 고객센터로 문의해 주세요.
          </p>
        </div>

        <Button
          onClick={resetError}
          className='mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          다시 시도
        </Button>
      </div>
    </div>
  );
}
