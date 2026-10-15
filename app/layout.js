import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import './globals.css'

const display = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
})
const body = Inter({ subsets: ['latin'], variable: '--font-body' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  title: 'GMS Multimedia',
  description:
    'Dokumentasi & panduan untuk Tim Multimedia & Produksi AV GMS',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = stored ? stored === 'dark' : prefersDark;
                if (isDark) document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Navbar />
        {children}
        <footer className="border-t border-border-light dark:border-border-dark mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-xs text-muted-light dark:text-muted-dark flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span>GMS Multimedia — Dokumentasi Internal Tim Multimedia</span>
              <span className="font-mono px-1.5 py-0.5 rounded bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-[10px]">
                v1.0
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <Link href="/privacy" className="hover:text-accent transition-colors">
                Kebijakan Privasi
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-accent transition-colors">
                Ketentuan Layanan
              </Link>
              <span>•</span>
              <Link href="/admin" className="hover:text-accent transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
