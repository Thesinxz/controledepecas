import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import { OfflineBanner } from '@/app/components/OfflineBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoryAI - Roteiros para Stories com IA',
  description: 'Crie roteiros profissionais para Instagram Stories em segundos com inteligência artificial.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#080810',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-[#080810] text-slate-50 min-h-[100dvh] pb-[env(safe-area-inset-bottom)] flex flex-col`}>
        <Header />
        <OfflineBanner />
        <main className="flex-1 w-full max-w-md mx-auto pt-16 pb-20 px-4 flex flex-col items-center">
          {children}
        </main>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  )
}
