'use client';

import { useState, cloneElement, isValidElement, ReactElement } from 'react';
import Image from 'next/image';
import { wsrvLoader } from './wsrvLoader';

interface LoadErrorFallbackProps {
  children: ReactElement<{ onError?: (e: Event) => void }>;
  fallback?: React.ReactNode;
}

function DefaultImageFallback() {
  return (
    <Image
      loader={wsrvLoader}
      loading='lazy'
      src='/images/placeholder.svg'
      alt='이미지를 불러올 수 없습니다'
      width={200}
      height={200}
      className='object-cover'
    />
  );
}

export function LoadErrorFallback({
  children,
  fallback = <DefaultImageFallback />,
}: LoadErrorFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (!isValidElement(children)) {
    console.error('ImageFallback: children must be a valid React element');
    return <>{children}</>;
  }

  if (hasError) {
    return <>{fallback}</>;
  }

  return cloneElement(children, {
    ...children.props,
    onError: (e: Event) => {
      setHasError(true);

      const originalOnError = children.props?.onError;
      if (originalOnError) {
        originalOnError(e);
      }
    },
  });
}
