'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { OverlayProvider } from '@/providers/OverlayProvider';
import ToastProvider from '@/components/common/ToastProvider';
import QueryProvider from '@/providers/QueryProvider';
import Nav from '@/components/common/Nav';
import Footer from '@/components/common/Footer';
import BottomNav from '@/components/home/BottomNav';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <QueryProvider>
      <ToastProvider />
      <OverlayProvider>
        <Nav />
        {children}
        <Footer />
        <BottomNav />
      </OverlayProvider>
    </QueryProvider>
  );
}
