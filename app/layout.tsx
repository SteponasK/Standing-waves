import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Standing wave',
  description: 'Standing wave',
  generator: 'Standing wave',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
