// src/components/pages/activities/ImageGalleryModal.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import ImageGalleryModal from '@/components/pages/activities/ImageGalleryModal';
import ActivityImageViewer from '@/components/pages/activities/ActivityImageViewer';
import type { SubImage } from '@/types/activities.type';

const meta: Meta<typeof ImageGalleryModal> = {
  title: 'Components/ImageGalleryModal',
  component: ImageGalleryModal,
  parameters: {
    layout: 'fullscreen',
    // App Router 사용 시 권장(Storybook 7 + @storybook/nextjs)
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          '이미지 갤러리 모달 컴포넌트입니다. 이미지들을 전체 화면으로 볼 수 있으며, 네비게이션과 썸네일 기능을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean', description: '모달 열림 상태' },
    bannerImageUrl: { control: 'text', description: '메인 배너 이미지 URL' },
    title: { control: 'text', description: '액티비티 제목' },
    initialIndex: { control: 'number', description: '초기 이미지 인덱스' },
    subImages: { control: 'object', description: '서브 이미지 배열' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const ModalWrapper = ({
  bannerImageUrl,
  subImages,
  title,
}: {
  bannerImageUrl: string;
  subImages: SubImage[];
  title: string;
}) => {
  return (
    <>
      <div className='container mx-auto p-4'>
        <ActivityImageViewer bannerImageUrl={bannerImageUrl} subImages={subImages} title={title} />
      </div>
    </>
  );
};

export const Default: Story = {
  render: () => (
    <ModalWrapper
      bannerImageUrl='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'
      title='다양한 이미지가 있는 액티비티'
      subImages={[
        { id: 1, imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80' },
        {
          id: 2,
          imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba17286?w=600&q=80',
        },
        {
          id: 3,
          imageUrl: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&q=80',
        },
        {
          id: 4,
          imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
        },
        { id: 5, imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80' },
      ]}
    />
  ),
};

export const SingleImage: Story = {
  render: () => (
    <ModalWrapper
      bannerImageUrl='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'
      title='단일 이미지 액티비티'
      subImages={[]}
    />
  ),
};

export const StartFromSubImage: Story = {
  render: () => (
    <ModalWrapper
      bannerImageUrl='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'
      title='서브 이미지부터 시작'
      subImages={[
        { id: 1, imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80' },
        {
          id: 2,
          imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba17286?w=600&q=80',
        },
        {
          id: 3,
          imageUrl: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&q=80',
        },
      ]}
    />
  ),
};

export const WithBrokenImages: Story = {
  render: () => (
    <ModalWrapper
      bannerImageUrl='https://nonexistent-url.com/broken-main-image.jpg'
      title='이미지 로드 오류 테스트'
      subImages={[
        { id: 1, imageUrl: 'https://broken-image-url.com/image1.jpg' },
        { id: 2, imageUrl: 'https://broken-image-url.com/image2.jpg' },
        {
          id: 3,
          imageUrl: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&q=80',
        },
      ]}
    />
  ),
};

export const WithLongTitle: Story = {
  render: () => (
    <ModalWrapper
      bannerImageUrl='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'
      title='매우 긴 제목을 가진 액티비티입니다. 제목이 길어질 때 모달에서 어떻게 표시되는지 확인해보세요. 제목이 너무 길면 어떻게 처리될까요?'
      subImages={[
        { id: 1, imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&q=80' },
        {
          id: 2,
          imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba17286?w=600&q=80',
        },
      ]}
    />
  ),
};
