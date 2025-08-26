'use client';

import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SubImage } from '@/types/activities.type';
import { Skeleton } from '@/components/ui/skeleton';

interface ImageGalleryModalProps {
  isOpen: boolean;
  close: () => void;
  bannerImageUrl: string;
  subImages: SubImage[];
  title: string;
  initialIndex?: number;
  onFLIPReady?: (lastRect: DOMRect) => void;
  onModalClose?: () => void;
}

export default function ImageGalleryModal({
  isOpen,
  close,
  bannerImageUrl,
  subImages,
  title,
  initialIndex = 0,
  onFLIPReady,
  onModalClose,
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoadStates, setImageLoadStates] = useState<Record<string | number, boolean>>({});
  const [isClosing, setIsClosing] = useState(false);
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const [shouldHideInitialImage, setShouldHideInitialImage] = useState(true);

  // 메인 이미지 컨테이너 ref (FLIP 타겟)
  const mainImageRef = useRef<HTMLDivElement>(null);

  // 전체 이미지 배열 (배너 + 서브 이미지들)
  const allImages = [{ id: 0, imageUrl: bannerImageUrl }, ...subImages];

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  const handleImageLoad = useCallback((index: string | number) => {
    setImageLoadStates((prev) => ({ ...prev, [index]: true }));
  }, []);

  // FLIP 애니메이션을 위해 기존 애니메이션 스타일 제거

  // 성능 최적화된 모달 닫기 함수
  const handleClose = useCallback(() => {
    if (isClosing) return;

    setIsClosing(true);
    onModalClose?.();

    // 애니메이션 완료 후 모달 제거
    setTimeout(() => {
      close();
    }, 400);
  }, [isClosing, close, onModalClose]);

  // 🎭 FLIP Step 2: Modal 렌더링 완료 후 Last 위치 계산 (useLayoutEffect)
  useLayoutEffect(() => {
    if (isOpen && mainImageRef.current && onFLIPReady) {
      console.log('📱 Modal: useLayoutEffect triggered - DOM layout complete');
      console.log('🎯 Modal: Setting initial index and hiding scroll');

      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';

      // FLIP 콜백 즉시 호출 (레이아웃 완료 후)
      const lastRect = mainImageRef.current.getBoundingClientRect();
      console.log('📐 Modal: Last position calculated, calling onFLIPReady');
      console.log('📍 Modal target rect:', {
        x: lastRect.left,
        y: lastRect.top,
        width: lastRect.width,
        height: lastRect.height,
      });

      onFLIPReady(lastRect);

      // FLIP 애니메이션 완료 후 모달 UI 및 이미지 표시
      console.log('⏱️ Modal: Setting 450ms timer for UI reveal');
      const timer = setTimeout(() => {
        console.log('🎭 Modal: Timer fired - showing modal UI and images');
        setShouldHideInitialImage(false);
        setIsAnimationReady(true);
      }, 450);

      return () => {
        console.log('🧹 Modal: Cleanup timer on unmount');
        clearTimeout(timer);
      };
    }
  }, [isOpen, initialIndex, onFLIPReady]);

  // 🔄 모달 닫을 때 정리 작업
  useEffect(() => {
    if (!isOpen) {
      console.log('📱 Modal: Closed - cleaning up states and restoring scroll');
      document.body.style.overflow = 'unset';
      setIsAnimationReady(false);
      setShouldHideInitialImage(true);
    }

    return () => {
      console.log('📱 Modal: Component unmount - restoring scroll');
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

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-40 flex items-center justify-center'>
      {/* 배경 오버레이 */}
      <div
        className='absolute inset-0 bg-black transition-opacity duration-400 ease-out'
        style={{
          opacity: isAnimationReady && !isClosing ? 0.9 : 0,
        }}
        onClick={handleClose}
      />

      {/* 모달 컨텐츠 */}
      <div className='relative w-full h-full max-w-6xl mx-4 flex flex-col'>
        {/* 헤더 */}
        <div
          className='flex items-center justify-between p-4 text-white transition-opacity duration-400 delay-100'
          style={{
            opacity: isAnimationReady && !isClosing ? 1 : 0,
          }}
        >
          <div>
            <h2 className='text-lg font-semibold truncate'>{title}</h2>
            <p className='text-sm text-gray-300'>
              {currentIndex + 1} / {allImages.length}
            </p>
          </div>
          <button
            onClick={handleClose}
            className='p-2 hover:bg-white/20 rounded-full transition-colors'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        {/* 메인 이미지 */}
        <div className='flex-1 flex items-center justify-center relative'>
          {/* 🖼️ 모달 메인 이미지 컨테이너 (z-index: 40 - FLIP 이미지 아래) */}
          <div
            ref={mainImageRef}
            className='relative w-full h-full max-h-[70vh]'
            style={{
              // 🔍 애니메이션 준비 완료 후에만 표시
              visibility: isAnimationReady ? 'visible' : 'hidden',
              // 🎭 FLIP 애니메이션 중에는 숨김, 완료 후 페이드인
              opacity: shouldHideInitialImage ? 0 : 1,
              transition: shouldHideInitialImage ? 'none' : 'opacity 200ms ease-out',
            }}
          >
            {/* 🔄 이미지 로딩 스켈레톤 */}
            {!shouldHideInitialImage && !imageLoadStates[currentIndex] && (
              <Skeleton className='absolute inset-0 z-10' />
            )}
            {/* 📸 실제 모달 이미지 (FLIP 완료 후 표시) */}
            {!shouldHideInitialImage && (
              <Image
                src={allImages[currentIndex].imageUrl}
                alt={`${title} - ${currentIndex + 1}`}
                fill
                className='object-contain'
                onLoad={() => {
                  console.log('📸 Modal image loaded:', currentIndex);
                  handleImageLoad(currentIndex);
                }}
                priority={currentIndex === 0}
              />
            )}
          </div>

          {/* 이전/다음 버튼 */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className='absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors'
              >
                <ChevronLeft className='w-6 h-6' />
              </button>
              <button
                onClick={handleNext}
                className='absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors'
              >
                <ChevronRight className='w-6 h-6' />
              </button>
            </>
          )}
        </div>

        {/* 썸네일 목록 */}
        {allImages.length > 1 && (
          <div
            className='p-4 bg-black/30 transition-opacity duration-400 delay-100'
            style={{
              opacity: isAnimationReady && !isClosing ? 1 : 0,
            }}
          >
            <div className='flex gap-2 justify-center overflow-x-auto max-w-full'>
              {allImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
                    ${
                      currentIndex === index
                        ? 'border-blue-500 scale-110'
                        : 'border-white/30 hover:border-white/60'
                    }
                  `}
                >
                  {!imageLoadStates[`thumb-${index}`] && (
                    <Skeleton className='absolute inset-0 z-10 rounded-lg' />
                  )}
                  <Image
                    src={image.imageUrl}
                    alt={`썸네일 ${index + 1}`}
                    fill
                    className='object-cover'
                    onLoad={() => handleImageLoad(`thumb-${index}`)}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
