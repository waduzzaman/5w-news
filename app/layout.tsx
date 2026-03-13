import type {Metadata} from 'next';
import './globals.css';
import { Inter, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Search, Menu, UserCircle } from 'lucide-react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});
const playfair = Playfair_Display({subsets:['latin'],variable:'--font-serif'});

export const metadata: Metadata = {
  title: {
    template: '%s | The Daily Chronicle',
    default: 'The Daily Chronicle - Breaking News, Latest News and Videos',
  },
  description: 'Your trusted source for global news, politics, business, technology, science, and arts. Stay informed with breaking news and deep insights.',
  keywords: ['news', 'breaking news', 'world news', 'politics', 'business', 'technology', 'science', 'arts', 'journalism'],
  authors: [{ name: 'The Daily Chronicle Editorial Team' }],
  openGraph: {
    title: 'The Daily Chronicle - Breaking News, Latest News and Videos',
    description: 'Your trusted source for global news, politics, business, technology, science, and arts.',
    url: 'https://the-daily-chronicle.com',
    siteName: 'The Daily Chronicle',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Daily Chronicle',
    description: 'Your trusted source for global news and insights.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable, playfair.variable)}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Header />

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
