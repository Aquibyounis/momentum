import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ModeProvider } from '@/context/ModeContext';
import { ToastProvider } from '@/components/ui/Toast';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import MobileNav from '@/components/layout/MobileNav';
import LockScreen from '@/components/ui/LockScreen';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Momentum — Blueprint Tracker',
  description: 'Your ultimate daily transformation tracker.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-[#0d0f12] text-text-primary min-h-screen">
        <ModeProvider>
          <ToastProvider>
            <LockScreen />
            <Sidebar />
            <TopBar />
            <main className="lg:ml-[220px] pt-14 lg:pt-0 pb-20 lg:pb-6 px-4 md:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto w-full">
                {children}
              </div>
            </main>
            <MobileNav />
          </ToastProvider>
        </ModeProvider>
      </body>
    </html>
  );
}
