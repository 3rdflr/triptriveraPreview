/* eslint-disable @next/next/no-img-element */
import { ImagePlus } from 'lucide-react';
import { useRef } from 'react';
import RoundButton from './RoundButton';
import clsx from 'clsx';

interface ImageUploaderProps {
  maxImages?: number;
  files?: File[];
  onChange?: (file: File[]) => void;
}

const ImageUploader = ({ maxImages = 4, files = [], onChange }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);

    const newImages = [...files, ...fileList].slice(0, maxImages);
    onChange?.(newImages);
    e.target.value = '';
  };

  const handleUploadClick = () => {
    if (files.length >= 4) {
      alert('이미지는 4개까지만 등록이 가능합니다.');
      return;
    }
    inputRef.current?.click();
  };

  const deleteFile = (index: number) => {
    const deleteImage = files[index];
    URL.revokeObjectURL(deleteImage as unknown as string);
    const newImages = files.filter((_, i) => i !== index);
    onChange?.(newImages);
  };

  return (
    <div className='flex gap-3'>
      <button
        className={clsx(
          'w-20 h-20 sm:w-31.5 sm:h-31.5 border border-grayscale-100  rounded-2xl gap-0.5 flex flex-col items-center justify-center focus:outline-none focus-visible:border-[var(--primary-200)] focus-visible:ring-[var(--primary-200)]/30 focus-visible:ring-[3px]',
          {
            'bg-grayscale-25': files.length === maxImages,
            'bg-white cursor-pointer': files.length !== maxImages,
          },
        )}
        onClick={handleUploadClick}
      >
        <div className='w-6 h-6 sm:w-10 sm:h-10'>
          <ImagePlus className='w-full h-full text-grayscale-300' strokeWidth={1.5} />
        </div>
        <div className='text-grayscale-600 text-13-medium'>
          {files.length} / {maxImages}
        </div>
      </button>
      {files.map((file, index) => {
        return (
          <div
            key={index}
            className='relative w-20 h-20 sm:w-31.5 sm:h-31.5 border border-grayscale-100 bg-white rounded-2xl'
          >
            <img
              src={URL.createObjectURL(file)}
              alt='업로드 이미지'
              className='w-full h-full object-cover rounded-2xl'
            />
            <RoundButton
              className='absolute -right-2 -top-2 z-10'
              onClick={() => deleteFile(index)}
            />
          </div>
        );
      })}
      <input
        ref={inputRef}
        type='file'
        accept='image/*'
        multiple
        className='hidden'
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;
