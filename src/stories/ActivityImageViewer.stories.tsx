import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ActivityImageViewer from '@/components/pages/activities/ActivityImageViewer';

const meta: Meta<typeof ActivityImageViewer> = {
  title: 'Components/ActivityImageViewer',
  component: ActivityImageViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          '액티비티 이미지 뷰어 컴포넌트입니다. 메인 배너 이미지와 서브 이미지들을 표시하며, 클릭 시 모달로 확대됩니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    bannerImageUrl: {
      control: 'text',
      description: '메인 배너 이미지 URL',
    },
    title: {
      control: 'text',
      description: '액티비티 제목',
    },
    subImages: {
      control: 'object',
      description: '서브 이미지 배열 (SubImage[])',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  args: {
    bannerImageUrl: 'https://placehold.co/600x400',
    title: '제목',
    subImages: [
      {
        id: 1,
        imageUrl: 'https://placehold.co/600x400',
      },
      {
        id: 2,
        imageUrl: 'https://placehold.co/600x400',
      },
    ],
  },
};

// 단일 이미지만 있는 경우
export const SingleImage: Story = {
  args: {
    bannerImageUrl: 'https://placehold.co/600x400',
    title: '단일 이미지 액티비티',
    subImages: [],
  },
};

// 많은 이미지가 있는 경우 (남은 개수 표시)
export const WithManyImages: Story = {
  args: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    title: '많은 이미지가 있는 액티비티',
    subImages: [
      {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=300&q=80',
      },
      {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba17286?w=300&q=80',
      },
      {
        id: 3,
        imageUrl: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=300&q=80',
      },
      {
        id: 4,
        imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&q=80',
      },
      {
        id: 5,
        imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=300&q=80',
      },
    ],
  },
};

// 이미지 1개만 있는 경우
export const WithOneSubImage: Story = {
  args: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    title: '서브 이미지 1개만 있는 액티비티',
    subImages: [
      {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=300&q=80',
      },
    ],
  },
};

// 404 오류 이미지 테스트 (Fallback 테스트)
export const WithBrokenImages: Story = {
  args: {
    bannerImageUrl: 'https://nonexistent-url.com/broken-image.jpg',
    title: '이미지 로드 오류 테스트',
    subImages: [
      {
        id: 1,
        imageUrl: 'https://broken-image-url.com/image1.jpg',
      },
      {
        id: 2,
        imageUrl: 'https://broken-image-url.com/image2.jpg',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '이미지 로드 실패 시 placeholder 이미지로 대체되는 것을 확인할 수 있습니다.',
      },
    },
  },
};

// 긴 제목 테스트
export const WithLongTitle: Story = {
  args: {
    bannerImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    title: '매우 긴 제목을 가진 액티비티입니다. 제목이 길어질 때 어떻게 표시되는지 확인해보세요.',
    subImages: [
      {
        id: 1,
        imageUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?w=300&q=80',
      },
      {
        id: 2,
        imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba17286?w=300&q=80',
      },
    ],
  },
};
