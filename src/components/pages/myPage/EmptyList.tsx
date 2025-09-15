import { wsrvLoader } from '@/components/common/wsrvLoader';
import Image from 'next/image';

interface EmptyListProps {
  text: string;
}

const EmptyList = ({ text }: EmptyListProps) => {
  return (
    <div className='flex flex-col items-center mx-auto'>
      <Image
        loader={wsrvLoader}
        loading='lazy'
        src={'/images/icons/_empty.png'}
        width={182}
        height={182}
        alt='빈 리스트 이미지'
      />
      <span className='text-18-medium text-grayscale-600'>{text}</span>
    </div>
  );
};

export default EmptyList;
