import { Outfit } from 'next/font/google';
import './globals.css';
import Providers from './Providers';
import { SITE_URL } from '@/lib/schema';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Maria Physiotherapy',
    template: '%s | Maria Physiotherapy',
  },
  description:
    'Practical physiotherapy advice on pain, movement, and recovery, written by a practising physiotherapist.',
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
