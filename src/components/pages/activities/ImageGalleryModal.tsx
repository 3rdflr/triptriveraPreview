'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SubImage } from '@/types/activities.type';
import { cn } from '@/lib/utils/shadCnUtils';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGalleryModalProps {
  isOpen: boolean; // 모달 열림 상태
  close: () => void;
  bannerImageUrl: string;
  subImages: SubImage[];
  title: string;
  initialIndex?: number;
}

export default function ImageGalleryModal({
  isOpen,
  close,
  bannerImageUrl,
  subImages,
  title,
  initialIndex = 0,
}: ImageGalleryModalProps) {
  /** 상태 관리 */
  // 현재 이미지 인덱스
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  // 이미지 로드 상태
  const [imageLoadStates, setImageLoadStates] = useState<Record<string | number, boolean>>({});

  // 전체 이미지 배열 (배너 + 서브 이미지들)
  const allImages = [{ id: 0, imageUrl: bannerImageUrl }, ...subImages];

  // 이전 이미지로 이동
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);
  // 다음 이미지로 이동
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  // 이미지 로드 완료 핸들러
  const handleImageLoad = useCallback((index: string | number) => {
    setImageLoadStates((prev) => ({ ...prev, [index]: true }));
  }, []);

  // 모달 닫기 핸들러
  const handleClose = useCallback(() => {
    close();
  }, [close]);

  // 스크롤 잠금 처리
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, handleClose, handlePrevious, handleNext]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 z-[55] flex items-center justify-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* 🎨 화이트 배경 오버레이 */}
          <motion.div
            className='absolute inset-0 bg-white'
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className='relative w-full h-full flex flex-col max-w-7xl mx-auto'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 헤더 */}
            <motion.div
              className='w-full flex justify-between items-center p-10'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/*이미지 카운터 */}
              {allImages.length > 1 && (
                <div
                  className={cn(
                    ' px-3 py-1.5 rounded-full',
                    'bg-gray-100 text-gray-600 text-sm font-medium',
                    'border border-gray-200',
                  )}
                >
                  {currentIndex + 1} / {allImages.length}
                </div>
              )}
              {/*닫기 버튼 */}
              <button
                onClick={handleClose}
                className={cn(
                  'text-gray-600',
                  'hover:bg-gray-200 transition-all duration-300',
                  'rounded-full p-2',
                )}
              >
                <X className='w-5 h-5' />
              </button>
            </motion.div>

            {/* 🎯 메인 이미지 영역 */}
            <div className='flex-1 flex items-center justify-center px-16 py-12'>
              <motion.div
                key={currentIndex}
                layoutId={`activity-image-${currentIndex}`}
                className='flex items-center justify-center w-full max-w-4xl max-h-[70vh]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* 🔄 이미지 로딩 상태 */}
                {!imageLoadStates[currentIndex] && (
                  <div className='absolute flex items-center justify-center'>
                    <div className='w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin' />
                  </div>
                )}

                {/* 📸 메인 이미지 */}
                <Image
                  src={allImages[currentIndex].imageUrl}
                  alt={`${title} - ${currentIndex + 1}`}
                  width={600}
                  height={400}
                  className='object-contain rounded-2xl shadow-lg'
                  onLoad={() => {
                    handleImageLoad(currentIndex);
                  }}
                  priority={currentIndex === 0}
                />
              </motion.div>

              {/* 🔄 미니멀 네비게이션 */}
              {allImages.length > 1 && (
                <>
                  <motion.button
                    onClick={handlePrevious}
                    className={cn(
                      'absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full',
                      'bg-gray-100 text-gray-600',
                      'hover:bg-gray-200 transition-all duration-300',
                      'border border-gray-200',
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 0.8, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className='w-6 h-6' />
                  </motion.button>
                  <motion.button
                    onClick={handleNext}
                    className={cn(
                      'absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full',
                      'bg-gray-100 text-gray-600',
                      'hover:bg-gray-200 transition-all duration-300',
                      'border border-gray-200',
                    )}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 0.8, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className='w-6 h-6' />
                  </motion.button>
                </>
              )}
            </div>

            {/* 🎨 썸네일 네비게이션 */}
            {allImages.length > 1 && (
              <motion.div
                className='flex justify-center pb-8 px-8'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className='flex gap-3 p-3 bg-gray-100 rounded-2xl border border-gray-200 overflow-x-auto max-w-full'>
                  {allImages.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        'relative w-16 h-16 rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0',
                        currentIndex === index
                          ? 'ring-2 ring-blue-500 scale-110'
                          : 'hover:scale-105 opacity-70 hover:opacity-100',
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={`${title} thumbnail ${index + 1}`}
                        width={64}
                        height={64}
                        className='w-full h-full object-cover'
                      />
                      {currentIndex === index && (
                        <motion.div
                          className='absolute inset-0 bg-blue-500/20 rounded-xl'
                          layoutId='thumbnail-active'
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
