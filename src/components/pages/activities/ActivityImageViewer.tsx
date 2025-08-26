'use client';

import { SubImage } from '@/types/activities.type';
import Image from 'next/image';
import { useState, useRef, useCallback, useLayoutEffect } from 'react';
import { Expand, ImageIcon } from 'lucide-react';
import ImageGalleryModal from '@/components/pages/activities/ImageGalleryModal';
import { Skeleton } from '@/components/ui/skeleton';
import { useOverlay } from '@/hooks/useOverlay';
import clsx from 'clsx';

/**
 * ActivityImageViewer 컴포넌트
 * - 배너 이미지는 왼쪽에, 서브 이미지 2개는 오른쪽에 배치
 * - 서브 이미지가 2개보다 많으면, 두 번째 이미지에 남은 개수 표시
 *
 * 🎭 FLIP 애니메이션 렌더링 순서:
 *
 * 1️⃣ FIRST: 사용자가 이미지 클릭
 *    - getBoundingClientRect()로 시작 위치/크기 기록
 *    - flipState 설정 (animationPhase: 'first')
 *    - FLIP 이미지 오버레이 생성 (visibility: hidden)
 *    - Modal 오픈
 *
 * 2️⃣ LAST: Modal 렌더링 완료 (useLayoutEffect)
 *    - Modal DOM 레이아웃 완료 후 실행
 *    - 타겟 위치/크기 계산 (getBoundingClientRect())
 *    - onFLIPReady 콜백으로 performFLIPAnimation 호출
 *
 * 3️⃣ INVERT: 역변환 계산
 *    - deltaX, deltaY, deltaW, deltaH 계산
 *    - borderRadius 초기값 설정
 *    - FLIP 이미지를 시작 위치로 즉시 변환
 *
 * 4️⃣ PLAY: Web Animations API 실행
 *    - 400ms 동안 부드러운 확대/이동 애니메이션
 *    - borderRadius 동시 보간 (둥근 모서리 → 직각)
 *    - onfinish 이벤트로 완료 감지
 *
 * 5️⃣ FADE-OUT: FLIP 이미지 페이드아웃
 *    - Modal 이미지 로드 완료 확인
 *    - 200ms 페이드아웃 애니메이션
 *    - Modal 이미지가 자연스럽게 나타남
 *
 * 6️⃣ CLEANUP: 상태 정리
 *    - flipState 리셋
 *    - FLIP 오버레이 제거
 *    - Modal UI 완전 표시
 *
 * 📊 Z-Index 레이어링:
 *    - z-50: FLIP 이미지 오버레이 (최상단)
 *    - z-40: Modal 배경 및 UI
 *    - z-30: Modal 이미지 (FLIP 완료 후 표시)
 */
interface ActivityImageViewerProps {
  bannerImageUrl: string;
  subImages: SubImage[];
  title: string;
}

export default function ActivityImageViewer({
  bannerImageUrl,
  subImages,
  title,
}: ActivityImageViewerProps) {
  const [imageLoadStates, setImageLoadStates] = useState<Record<string, boolean>>({});
  const [flipState, setFlipState] = useState<{
    isAnimating: boolean;
    clickedIndex: number;
    firstRect: DOMRect;
    imageUrl: string;
    animationPhase: 'first' | 'last' | 'play' | 'fadeout';
    isImageLoaded: boolean;
  } | null>(null);

  // 이미지 요소 참조 (FLIP 애니메이션용)
  const imageContainerRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const flipImageRef = useRef<HTMLDivElement | null>(null);
  const flipAnimationRef = useRef<Animation | null>(null);

  const overlay = useOverlay();

  // 이미지 컨테이너 ref 설정 함수
  const setImageContainerRef = useCallback((index: number) => {
    return (ref: HTMLDivElement | null) => {
      imageContainerRefs.current[index] = ref;
    };
  }, []);

  // 배너 이미지를 첫 번째로, 서브 이미지들을 그 다음으로 배치
  const allImages = [{ id: 0, imageUrl: bannerImageUrl }, ...subImages];

  // 남은 이미지 개수 = 전체 - 표시된 3개
  const remainingCount = Math.max(0, allImages.length - 3);

  // 모든 이미지가 로드되었는지 확인
  const requiredImages = ['main', 'sub-0', 'sub-1'].filter((_, index) => {
    if (index === 0) return true; // 메인 이미지는 항상 필요
    return subImages[index - 1]; // 서브 이미지는 존재할 때만
  });
  const allImagesLoaded = requiredImages.every((key) => imageLoadStates[key]);

  const handleImageLoad = (key: string) => {
    setImageLoadStates((prev) => ({ ...prev, [key]: true }));
  };

  // FLIP 단계 6: 페이드아웃 애니메이션 (FLIP 이미지 → 모달 이미지 전환)
  const startFadeOutAnimation = useCallback(() => {
    console.log('🎭 FLIP Step 6: Starting fade-out animation');
    if (!flipImageRef.current) return;

    const fadeOutAnimation = flipImageRef.current.animate([{ opacity: '1' }, { opacity: '0' }], {
      duration: 200,
      easing: 'ease-out',
      fill: 'both',
    });

    fadeOutAnimation.onfinish = () => {
      console.log('🎭 FLIP Step 7: Fade-out completed, cleaning up FLIP state');
      // 애니메이션 완전 종료 및 정리
      flipAnimationRef.current = null;
      setFlipState(null);
    };
  }, []);

  // FLIP 단계 3-4: Invert & Play (Web Animations API 기반)
  const performFLIPAnimation = useCallback(
    (firstRect: DOMRect, lastRect: DOMRect) => {
      console.log('🎭 FLIP Step 3: Calculating invert transformations');
      console.log('📐 First rect (source):', {
        x: firstRect.left,
        y: firstRect.top,
        width: firstRect.width,
        height: firstRect.height,
      });
      console.log('📐 Last rect (target):', {
        x: lastRect.left,
        y: lastRect.top,
        width: lastRect.width,
        height: lastRect.height,
      });

      if (!flipImageRef.current || flipAnimationRef.current) return;

      // BorderRadius 계산 (클릭한 이미지에 따라)
      const getBorderRadius = (index: number) => {
        switch (index) {
          case 0:
            return '1.5rem 0 0 1.5rem'; // 메인 이미지
          case 1:
            return '0 1.5rem 0 0'; // 첫 번째 서브
          case 2:
            return '0 0 1.5rem 0'; // 두 번째 서브
          default:
            return '0';
        }
      };

      const initialBorderRadius = getBorderRadius(flipState?.clickedIndex || 0);
      console.log('🔄 Border radius transition:', `${initialBorderRadius} → 0px`);

      // FLIP - Invert: 차이값 계산
      const deltaX = firstRect.left - lastRect.left;
      const deltaY = firstRect.top - lastRect.top;
      const deltaW = firstRect.width / lastRect.width;
      const deltaH = firstRect.height / lastRect.height;

      console.log('📏 Transform deltas:', {
        translateX: deltaX,
        translateY: deltaY,
        scaleX: deltaW,
        scaleY: deltaH,
      });

      // Web Animations API 키프레임 정의
      const keyframes = [
        {
          transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`,
          borderRadius: initialBorderRadius,
          opacity: '1',
        },
        {
          transform: 'translate(0px, 0px) scale(1, 1)',
          borderRadius: '0px',
          opacity: '1',
        },
      ];

      const options: KeyframeAnimationOptions = {
        duration: 400,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'both',
      };

      console.log('🎭 FLIP Step 4: Starting Play animation (Web Animations API)');
      console.log('⏱️ Animation options:', options);

      // Web Animations API 애니메이션 시작
      flipAnimationRef.current = flipImageRef.current.animate(keyframes, options);

      setFlipState((prev) => (prev ? { ...prev, animationPhase: 'play' } : null));

      // onfinish 이벤트로 완료 처리
      flipAnimationRef.current.onfinish = () => {
        console.log('🎭 FLIP Step 5: Play animation finished');
        console.log('🖼️ Modal image loaded:', flipState?.isImageLoaded);

        // 모달 이미지 로드 완료까지 대기
        if (flipState?.isImageLoaded) {
          console.log('✅ Modal image ready, starting immediate fade-out');
          startFadeOutAnimation();
        } else {
          console.log('⏳ Modal image still loading, waiting for onLoad');
          setFlipState((prev) => (prev ? { ...prev, animationPhase: 'fadeout' } : null));
        }
      };
    },
    [flipState, startFadeOutAnimation],
  );

  // FLIP 단계 1: First (클릭 이벤트 처리 및 시작 위치 기록)
  const handleImageClick = useCallback(
    (index: number) => {
      console.log('🎭 FLIP Step 1: Image clicked, recording First position');
      console.log('🎯 Clicked image index:', index);

      const clickedContainer = imageContainerRefs.current[index];
      if (!clickedContainer || flipState?.isAnimating) {
        console.log('❌ Animation blocked: container missing or already animating');
        return;
      }

      const imageUrl = index === 0 ? bannerImageUrl : subImages[index - 1]?.imageUrl;
      if (!imageUrl) {
        console.log('❌ Animation blocked: image URL not found');
        return;
      }

      // FLIP - First: 시작 위치 기록
      const firstRect = clickedContainer.getBoundingClientRect();
      console.log('📍 First position recorded:', {
        x: firstRect.left,
        y: firstRect.top,
        width: firstRect.width,
        height: firstRect.height,
      });

      setFlipState({
        isAnimating: true,
        clickedIndex: index,
        firstRect,
        imageUrl,
        animationPhase: 'first',
        isImageLoaded: false,
      });

      console.log('🚀 Opening modal with FLIP image overlay');

      // 모달 열기
      overlay.open(({ isOpen, close }) => (
        <ImageGalleryModal
          isOpen={isOpen}
          close={close}
          bannerImageUrl={bannerImageUrl}
          subImages={subImages}
          title={title}
          initialIndex={index}
          onFLIPReady={(lastRect) => {
            console.log('🎭 FLIP Step 2: Modal rendered, received Last position callback');
            // FLIP - Last & Invert & Play
            performFLIPAnimation(firstRect, lastRect);
          }}
          onModalClose={() => {
            console.log('🔄 Modal closing, resetting FLIP state');
            // 모달 닫기 시 FLIP 상태 리셋
            setFlipState(null);
          }}
        />
      ));
    },
    [overlay, bannerImageUrl, subImages, title, flipState, performFLIPAnimation],
  );

  // 모달 이미지 로드 완료 시 페이드아웃 트리거 (useLayoutEffect로 동기화)
  useLayoutEffect(() => {
    if (flipState?.animationPhase === 'fadeout' && flipState.isImageLoaded) {
      console.log(
        '🔄 useLayoutEffect: Modal image loaded during fadeout phase, triggering fade-out',
      );
      startFadeOutAnimation();
    }
  }, [flipState?.animationPhase, flipState?.isImageLoaded, startFadeOutAnimation]);

  return (
    <div className='w-full relative'>
      {/* 🎭 FLIP 애니메이션용 이미지 오버레이 (z-index: 50 - 최상단) */}
      {flipState && (
        <div className='fixed inset-0 z-50 pointer-events-none'>
          {/* 🎯 FLIP 타겟 이미지 컨테이너 (모달 중앙 위치에 미리 배치) */}
          <div
            ref={flipImageRef}
            className='absolute left-1/2 top-1/2 w-[80vw] h-[60vh] -ml-[40vw] -mt-[30vh] overflow-hidden'
            style={{
              willChange: 'transform, border-radius, opacity',
              // 🚫 'first' 단계에서는 숨김 (모달 렌더 대기)
              visibility: flipState.animationPhase === 'first' ? 'hidden' : 'visible',
              transformOrigin: 'top left', // 🔄 변환 기준점
              borderRadius:
                flipState.clickedIndex === 0
                  ? '1.5rem 0 0 1.5rem' // 메인 이미지
                  : flipState.clickedIndex === 1
                    ? '0 1.5rem 0 0' // 첫 번째 서브
                    : '0 0 1.5rem 0', // 두 번째 서브
            }}
          >
            <Image
              src={flipState.imageUrl}
              alt={title}
              fill
              className='object-cover'
              priority
              onLoad={() => {
                console.log('🖼️ FLIP image loaded, updating state');
                // 이미지 로드 완료 표시
                setFlipState((prev) => (prev ? { ...prev, isImageLoaded: true } : null));
              }}
            />
          </div>
        </div>
      )}

      {/* 배너 + 서브 2개만 표시 */}
      <div className='grid grid-cols-4 grid-rows-2 gap-2 md:gap-3 h-61 md:h-100'>
        {/* 메인 배너 이미지 (좌측 2x2) */}
        <div
          ref={setImageContainerRef(0)}
          className='col-span-2 row-span-2 relative rounded-s-3xl overflow-hidden bg-gray-100 group cursor-pointer'
        >
          <div className='relative h-full w-full transition-transform duration-300 ease-out transform-gpu group-hover:scale-105'>
            {!allImagesLoaded && !imageLoadStates['main'] && (
              <Skeleton className='absolute inset-0 z-10' />
            )}
            <Image
              src={bannerImageUrl}
              alt={title}
              fill
              className='object-cover cursor-pointer'
              onClick={() => handleImageClick(0)}
              onLoad={() => handleImageLoad('main')}
              priority
            />
            {/* 호버 시 확대 아이콘 */}
            <div
              className={clsx(
                'absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors ',
                'flex items-center justify-center pointer-events-none',
              )}
            >
              <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-3'>
                <Expand className='w-6 h-6 text-white' />
              </div>
            </div>
          </div>
        </div>
        {/* 첫 번째 서브 이미지 (상단) */}
        {subImages[0] && (
          <div
            ref={setImageContainerRef(1)}
            className='col-span-2 relative rounded-tr-3xl overflow-hidden bg-gray-100 group cursor-pointer'
          >
            <div className='relative h-full w-full transition-transform duration-300 ease-out transform-gpu group-hover:scale-105'>
              {!allImagesLoaded && !imageLoadStates['sub-0'] && (
                <Skeleton className='absolute inset-0 z-10' />
              )}
              <Image
                src={subImages[0].imageUrl}
                alt={`${title} 서브 이미지 1`}
                fill
                className='object-cover cursor-pointer'
                onClick={() => handleImageClick(1)}
                onLoad={() => handleImageLoad('sub-0')}
              />
              {/* 호버 효과 */}
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none'>
                <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-2'>
                  <Expand className='w-5 h-5 text-white' />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 두 번째 서브 이미지 (하단) */}
        {subImages[1] && (
          <div
            ref={setImageContainerRef(2)}
            className='col-span-2 relative rounded-br-3xl overflow-hidden bg-gray-100 group cursor-pointer'
          >
            <div className='relative h-full w-full transition-transform duration-300 ease-out transform-gpu group-hover:scale-105'>
              {!allImagesLoaded && !imageLoadStates['sub-1'] && (
                <Skeleton className='absolute inset-0 z-10' />
              )}
              <Image
                src={subImages[1].imageUrl}
                alt={`${title} 서브 이미지 2`}
                fill
                className='object-cover cursor-pointer'
                onClick={() => handleImageClick(2)}
                onLoad={() => handleImageLoad('sub-1')}
              />

              {/* 남은 개수 표시 */}
              {remainingCount > 0 && (
                <div className='absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none'>
                  <div className='text-white text-center flex items-center gap-1'>
                    <ImageIcon className='w-6 h-6 mx-auto' />
                    <span className='text-2xl font-semibold'>+{remainingCount}</span>
                  </div>
                </div>
              )}

              {/* 호버 효과 */}
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none'>
                <div className='opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm rounded-full p-2'>
                  <Expand className='w-5 h-5 text-white' />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
