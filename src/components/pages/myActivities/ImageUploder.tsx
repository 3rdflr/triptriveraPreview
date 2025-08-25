/* eslint-disable @next/next/no-img-element */
import { ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import RoundButton from './RoundButton';

interface ImageUploaderProps {
  maxImages?: number;
  onUpload?: (file: File[]) => void;
}

const ImageUploder = ({ maxImages = 4, onUpload }: ImageUploaderProps) => {
  const [images, setImages] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);

    const newImages = [...images, ...fileList].slice(0, maxImages);
    setImages(newImages);
    onUpload?.(newImages);
    e.target.value = '';
  };

  const handleUploadClick = () => {
    if (images.length >= 4) {
      alert('이미지는 4개까지만 등록이 가능합니다.');
      return;
    }
    inputRef.current?.click();
  };

  const deleteFile = (index: number) => {
    const deleteImage = images[index];
    URL.revokeObjectURL(deleteImage as unknown as string);
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpload?.(newImages);
  };

  return (
    <div className='flex gap-3.5'>
      <div
        className='cursor-pointer w-32 h-32 border border-grayscale-100 bg-grayscale-25 rounded-2xl gap-0.5 flex flex-col items-center justify-center'
        onClick={handleUploadClick}
      >
        <ImagePlus size={38} className='text-grayscale-300' strokeWidth={1.5} />
        <div className='text-grayscale-600 text-14-medium'>
          {images.length} / {maxImages}
        </div>
      </div>
      {images.map((image, index) => {
        return (
          <div
            key={index}
            className='relative w-32 h-32 border border-grayscale-100 bg-grayscale-25 rounded-2xl'
          >
            <img
              src={URL.createObjectURL(image)}
              alt={'업로드 이미지'}
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

export default ImageUploder;
