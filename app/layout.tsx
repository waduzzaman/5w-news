import type {Metadata} from 'next';
import './globals.css';
import { Inter, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Search, Menu, UserCircle } from 'lucide-react';
import Footer from '@/components/Footer';

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
        {/* Global Header */}
        <header className="border-b border-border bg-background sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="p-2 -ml-2 hover:bg-muted rounded-md md:hidden">
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
                The Chronicle
              </Link>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/login" className="p-2 hover:bg-muted rounded-full transition-colors">
                <UserCircle className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
