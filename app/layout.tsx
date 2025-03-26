import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stovinčiųjų Bangų Simuliacija',
  description: 'Stovinčiųjų Bangų Simuliacija - Fizika PBL',
  generator: 'Stovinčiųjų Bangų Simuliacija',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="lt">
      <body>{children}</body>
    </html>
  )
}
