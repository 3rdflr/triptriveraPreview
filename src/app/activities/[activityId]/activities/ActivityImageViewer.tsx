'use client';

import { SubImage } from '@/types/activities.type';
import Image from 'next/image';
import { useState } from 'react';

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 배너 이미지를 첫 번째로, 서브 이미지들을 그 다음으로 배치
  const allImages = [{ id: 0, imageUrl: bannerImageUrl }, ...subImages];

  const selectedImage = allImages[selectedImageIndex];

  return (
    <div className='w-full'>
      {/* 메인 이미지 */}
      <div className='relative w-full h-96 mb-4 rounded-lg overflow-hidden bg-gray-100'>
        <Image src={selectedImage.imageUrl} alt={title} fill className='object-cover' priority />
      </div>

      {/* 썸네일 이미지들 */}
      <div className='flex gap-2 overflow-x-auto pb-2'>
        {allImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedImageIndex(index)}
            className={`
              relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all
              ${
                selectedImageIndex === index
                  ? 'border-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <Image
              src={image.imageUrl}
              alt={`${title} 이미지 ${index + 1}`}
              fill
              className='object-cover'
            />
          </button>
        ))}
      </div>
    </div>
  );
}
