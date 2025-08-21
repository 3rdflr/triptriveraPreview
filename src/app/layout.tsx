import type { Metadata } from 'next';
import ToastProvider from '@/components/common/ToastProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Trivera',
  description: '여행, 체험, 그리고 더 많은 것을 위한 플랫폼',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <ToastProvider />
      <body>{children}</body>
    </html>
  );
}
