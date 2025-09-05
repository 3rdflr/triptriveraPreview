import { Modal } from 'react-simplified-package';
// import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { IoClose } from 'react-icons/io5';
import ScheduleTab from './ScheduleTab';
import { format } from 'date-fns';

interface ReservedScheduleModalProps {
  date?: string;
  exitText?: string;
  actionText?: string;
  buttons?: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onAction?: () => void;
}

const ReservedScheduleModal = ({
  date,
  className,
  isOpen,
  onClose,
}: ReservedScheduleModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      modalClassName={clsx('bg-white !p-7.5 !rounded-3xl', className)}
      buttonClassName='!hidden'
    >
      <div className='flex flex-col items-center gap-3 w-65 sm:w-85'>
        <header className='flex justify-between items-center w-full'>
          <span className='text-18-bold'>{date ? format(new Date(date), 'yy년 M월 d일') : ''}</span>
          <IoClose size={18} onClick={onClose} />
        </header>
        <ScheduleTab />
      </div>
    </Modal>
  );
};

export default ReservedScheduleModal;
