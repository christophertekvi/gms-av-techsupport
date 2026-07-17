import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import './globals.css'

const display = Inter({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
})
const body = Inter({ subsets: ['latin'], variable: '--font-body' })
const mono = Inter({ subsets: ['latin'], variable: '--font-mono' })

export const metadata = {
  title: 'GMS Multimedia — Dokumentasi & Troubleshooting',
  description:
    'Dokumentasi troubleshooting dan tutorial untuk tim multimedia & produksi AV gereja.',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} ${mono.variable}`}>
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
      <body>
        <Navbar />
        {children}
        <footer className="border-t border-border-light dark:border-border-dark mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-xs text-muted-light dark:text-muted-dark flex items-center justify-between">
            <span>GMS Multimedia — dokumentasi internal tim multimedia</span>
            <span className="font-mono">v1.0</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
