import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Stovinčioji banga',
  description: 'Stovinčioji banga',
  generator: 'Stovinčioji banga',
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
