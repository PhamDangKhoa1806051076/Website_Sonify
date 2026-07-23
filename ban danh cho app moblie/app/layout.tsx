import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import SonifyMobileHeader from '@/components/mobile/SonifyMobileHeader';
import SonifyMobileNav from '@/components/mobile/SonifyMobileNav';
import SonifyMobileMiniPlayer from '@/components/mobile/SonifyMobileMiniPlayer';

export const metadata: Metadata = {
  title: 'Sonify Mobile | Trải Nghiệm Âm Nhạc Đỉnh Cao Trên Di Động',
  description: 'Nghe nhạc trực tuyến, khám phá các bảng xếp hạng hot nhất, tạo playlist cá nhân mượt mà trên ứng dụng di động Sonify.',
};

export default function MobileRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-full bg-zinc-950 text-white font-sans antialiased pb-28 selection:bg-indigo-500/30 selection:text-indigo-300">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <PlayerProvider>
                <div className="mobile-app-shell min-h-screen flex flex-col max-w-md mx-auto relative border-x border-white/5 bg-zinc-950 shadow-2xl">
                  <SonifyMobileHeader />
                  <main className="flex-1 px-4 py-4">{children}</main>
                  <SonifyMobileMiniPlayer />
                  <SonifyMobileNav />
                </div>
              </PlayerProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
