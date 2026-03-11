'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Share2, Bookmark, MessageCircle } from 'lucide-react';
import AdUnit from '@/components/AdUnit';

interface News {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  category?: string;
  createdAt: string;
}

export default function NewsArticle() {
  const params = useParams();
  const router = useRouter();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/news/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch news', err);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return <div className="text-center py-24 font-serif text-xl text-muted-foreground">Loading article...</div>;
  }

  if (!news) {
    return (
      <div className="text-center py-24">
        <h2 className="text-3xl font-serif font-bold mb-6">Article not found</h2>
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 border border-black hover:bg-black hover:text-white transition-colors font-medium uppercase tracking-wider text-sm">
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white">
      {/* Article Header */}
      <header className="container mx-auto px-4 max-w-4xl pt-12 pb-8">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to News
          </Link>
          {news.category && (
            <span className="text-xs font-bold uppercase tracking-widest text-black border border-black px-3 py-1">
              {news.category}
            </span>
          )}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight mb-6">
          {news.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-slate-200 py-4 mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-serif font-bold text-xl text-slate-600">
              {news.author.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-sm uppercase tracking-wider">{news.author}</div>
              <div className="text-sm text-slate-500">{format(new Date(news.createdAt), 'MMMM d, yyyy • h:mm a')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-slate-500">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Save">
              <Bookmark className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors" aria-label="Comment">
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {news.imageUrl && (
        <div className="container mx-auto px-4 max-w-5xl mb-12">
          <div className="w-full aspect-video md:aspect-[21/9] bg-slate-100 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={news.imageUrl} 
              alt={news.title} 
              className="object-contain w-full h-full" 
            />
          </div>
          <div className="text-right text-xs text-slate-500 mt-2 uppercase tracking-wider">
            Image via Source
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 max-w-5xl pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 font-serif text-xl md:text-2xl leading-relaxed text-slate-800 space-y-8">
          {news.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>
              {index === 0 ? (
                <span className="float-left text-6xl md:text-7xl font-bold leading-none pr-3 pt-2 text-black">
                  {paragraph.charAt(0)}
                </span>
              ) : null}
              {index === 0 ? paragraph.substring(1) : paragraph}
            </p>
          ))}
          
          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-center">
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 bg-black text-white hover:bg-slate-800 transition-colors font-bold uppercase tracking-widest text-sm">
              Read More Stories
            </Link>
          </div>
        </div>

        {/* Sidebar for Ads */}
        <div className="lg:col-span-4 space-y-8">
          <AdUnit type="google" className="w-full h-[250px]" />
          <AdUnit type="custom" placement="sidebar" className="w-full h-[600px]" />
        </div>
      </div>
    </article>
  );
}
