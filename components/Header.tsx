'use client';

import Link from 'next/link';
import { Search, Menu, UserCircle } from 'lucide-react';

export default function Header() {
  return (
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
  );
}
