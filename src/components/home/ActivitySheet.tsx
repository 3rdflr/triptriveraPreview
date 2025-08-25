'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { FaMapMarkedAlt as MapIcon } from 'react-icons/fa';

export default function ActivitySheet({ children }: { children?: React.ReactNode }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const CLOSED_HEIGHT = 120;

  const y = useMotionValue(0);
  const [fullHeight, setFullHeight] = useState(0);
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  useEffect(() => {
    const height = window.innerHeight * 0.9;
    setFullHeight(height);
    y.set(height - CLOSED_HEIGHT);
  }, [y]);

  const handleDragEnd = (_: Event, info: { velocity: { y: number } }) => {
    if (!fullHeight) return;

    const currentY = y.get();
    if (info.velocity.y > 500 || currentY > CLOSED_HEIGHT + 100) {
      animate(y, fullHeight - CLOSED_HEIGHT, { type: 'spring', stiffness: 200, damping: 35 });
      setIsFullyOpen(false);
    } else {
      animate(y, 0, { type: 'spring', stiffness: 200, damping: 35 });
      setIsFullyOpen(true);
    }
  };

  if (!fullHeight) return null;

  return (
    <div className='flex items-center justify-center'>
      <motion.div
        ref={sheetRef}
        className='fixed left-0 right-0 bottom-0 bg-white rounded-t-2xl shadow-lg'
        style={{ height: fullHeight, y }}
        drag='y'
        dragConstraints={{ top: 0, bottom: fullHeight - CLOSED_HEIGHT }}
        onDragEnd={handleDragEnd}
        dragElastic={0.2}
      >
        <div className='p-5 flex justify-center cursor-grab'>
          <div className='w-12 h-1 bg-gray-300 rounded' />
        </div>

        <article
          className='px-4 pt-2 pb-8 h-[calc(100%-40px)] overflow-y-auto overscroll-contain'
          ref={contentRef}
          style={{
            pointerEvents: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <h2 className='text-[15px] text-center mb-6'>지도 표시 지역의 체험 00개</h2>
          <div className='space-y-4'>
            {children}
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className='p-4 bg-gray-100 rounded-lg shadow-sm'>
                아이템 {i + 1}
              </div>
            ))}
          </div>
        </article>
      </motion.div>
      <AnimatePresence>
        {isFullyOpen && (
          <motion.button
            key='map-button'
            className='fixed bottom-28 bg-title text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            onClick={() => {
              animate(y, fullHeight - CLOSED_HEIGHT, {
                type: 'spring',
                stiffness: 200,
                damping: 35,
              });
              contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              setIsFullyOpen(false);
            }}
          >
            지도 <MapIcon className='w-4 h-4' />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
