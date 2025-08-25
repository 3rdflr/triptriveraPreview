import { ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';

import { FaPlus, FaMinus, FaTimes } from 'react-icons/fa';

interface RoundButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: 'plus' | 'minus' | 'close';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const RoundButton = ({ mode = 'close', children, className, onClick }: RoundButtonProps) => {
  const baseClass = 'rounded-full flex items-center justify-center';

  const getModeClass = (): string => {
    const modeClassMap: Record<string, string> = {
      plus: 'w-[42px] h-[42px] bg-primary-500',
      minus: 'w-[42px] h-[42px] bg-grayscale-50',
      close: 'w-[26px] h-[26px] bg-grayscale-950',
    };
    return modeClassMap[mode];
  };

  return (
    <button className={clsx(baseClass, getModeClass(), className)} onClick={onClick}>
      {mode === 'plus' && <FaPlus size={12} className='text-white' />}
      {mode === 'minus' && <FaMinus size={12} className='text-black' />}
      {mode === 'close' && <FaTimes size={10} className='text-white' />}
      {children}
    </button>
  );
};

export default RoundButton;
