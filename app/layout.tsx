import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'VibeKanban - Project Management',
  description: 'A beautiful kanban board for managing your projects with vibes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg-primary">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
