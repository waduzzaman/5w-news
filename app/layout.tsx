import type {Metadata} from 'next';
import './globals.css';
import { Inter, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Search, Menu, UserCircle } from 'lucide-react';

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

        {/* Global Footer */}
        <footer className="bg-slate-950 text-slate-300 py-12 mt-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="font-serif text-2xl font-bold text-white mb-4 block">
                The Chronicle
              </Link>
              <p className="text-sm text-slate-400 max-w-sm">
                Delivering independent, high-quality journalism to millions of readers around the globe. Stay informed with our daily updates.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Sections</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/category/world" className="hover:text-white transition-colors">World News</Link></li>
                <li><Link href="/category/politics" className="hover:text-white transition-colors">U.S. Politics</Link></li>
                <li><Link href="/category/business" className="hover:text-white transition-colors">Business</Link></li>
                <li><Link href="/category/technology" className="hover:text-white transition-colors">Technology</Link></li>
                <li><Link href="/category/science" className="hover:text-white transition-colors">Science & Health</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Editor Login</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} The Chronicle Media. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="/" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
