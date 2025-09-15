import type { Metadata } from 'next';
import { Suspense } from 'react';
import { pretendard } from '@/lib/fonts';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ClientLayout from '@/components/common/ClientLayout';
import './globals.css';

const nextOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'https://triptrivera.vercel.app/';

export const metadata: Metadata = {
  title: 'Trivera',
  description: '여행, 체험, 그리고 더 많은 것을 위한 플랫폼',
  applicationName: 'Trivera',
  generator: 'Next.js',
  category: '웹 애플리케이션',
  keywords: ['여행', '체험', '공유', 'Trivera'],
  authors: [{ name: '파트4 2팀', url: nextOrigin }],
  creator: '파트4 2팀',
  publisher: 'Trivera',
  icons: {
    icon: '/images/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL(nextOrigin),
  alternates: {
    canonical: nextOrigin,
  },
  openGraph: {
    title: 'Trivera',
    description: '여행, 체험, 그리고 더 많은 것을 위한 플랫폼',
    url: nextOrigin,
    siteName: 'Trivera',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: `${nextOrigin}/images/image_opengraph_wide.png`,
        width: 1200,
        height: 630,
        alt: 'Trivera 오픈 그래프 이미지',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trivera',
    description: '여행, 체험, 그리고 더 많은 것을 위한 플랫폼',
    images: [`${nextOrigin}/images/image_opengraph_wide.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' className={`${pretendard.variable}`}>
      <body suppressHydrationWarning={true}>
        <Suspense>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
        <SpeedInsights />
      </body>
    </html>
  );
}
