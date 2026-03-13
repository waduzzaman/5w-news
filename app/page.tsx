'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import AdUnit from '@/components/AdUnit';
import Image from 'next/image';

interface News {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  category?: string;
  createdAt: string;
}

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/news')
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          setNews([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch news', err);
        setNews([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-32 text-slate-500 font-serif text-xl">Loading latest stories...</div>;
  }

  if (news.length === 0) {
    return <div className="text-center py-32 text-slate-500 font-serif text-xl">No news articles found.</div>;
  }

  const filteredNews = selectedCategory 
    ? news.filter(n => n.category === selectedCategory)
    : news;

  // Categorize news for main layout
  const heroArticle = news[0];
  const topStories = news.slice(1, 4);
  const techNews = news.filter(n => n.category === 'Technology').slice(0, 3);
  const worldNews = news.filter(n => n.category === 'World').slice(0, 4);
  const artsNews = news.filter(n => n.category === 'Arts').slice(0, 2);
  const businessNews = news.filter(n => n.category === 'Business').slice(0, 3);

  // Fallback for grid if categories are empty
  const gridArticles = news.slice(4, 10);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Masthead */}
      <div className="border-b-[3px] border-black pb-4 mb-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-serif tracking-tighter uppercase text-center">
          The Daily Chronicle
        </h1>
        <div className="flex justify-between items-center mt-6 text-xs md:text-sm font-bold uppercase tracking-widest border-t border-b border-black py-2">
          <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
          <span className="hidden md:inline">Global Edition</span>
          <span>Today&apos;s Paper</span>
        </div>
        
        {/* Category Navigation */}
        <div className="flex justify-center gap-4 md:gap-8 mt-6 text-xs md:text-sm font-bold uppercase tracking-widest overflow-x-auto pb-2 no-scrollbar">
          <button onClick={() => setSelectedCategory(null)} className={`${!selectedCategory ? 'text-black border-b-2 border-black' : 'text-slate-500'} hover:text-black whitespace-nowrap pb-1`}>All News</button>
          {['World', 'Technology', 'Business', 'Science', 'Arts', 'Sports'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)} 
              className={`${selectedCategory === cat ? 'text-black border-b-2 border-black' : 'text-slate-500'} hover:text-black whitespace-nowrap pb-1`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory ? (
        /* Category Filtered View */
        <div className="mb-12">
          <h2 className="text-3xl font-black uppercase tracking-widest font-serif mb-8 border-b border-black pb-2">{selectedCategory} News</h2>
          {filteredNews.length === 0 ? (
            <div className="text-center py-16 text-slate-500 font-serif text-lg">No articles found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <Link key={item._id} href={`/news/${item._id}`} className="block group flex flex-col h-full border-b border-slate-200 pb-6">
                  {item.imageUrl && (
                    <div className="w-full aspect-[3/2] bg-slate-100 relative mb-4 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                  )}
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                  </div>
                  <h4 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-slate-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow font-serif">
                    {item.content}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Default Homepage Layout */
        <>
          {/* Section 1: Top Stories */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Left Column: Secondary Stories */}
            <div className="lg:col-span-3 flex flex-col gap-6 order-2 lg:order-1">
              {topStories.slice(0, 2).map((item) => (
                <Link key={item._id} href={`/news/${item._id}`} className="block group border-b border-slate-200 pb-6 last:border-0">
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                    {item.category || 'News'}
                  </div>
                  <h3 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-slate-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-2 font-serif">
                    {item.content}
                  </p>
                  <div className="text-xs text-slate-400 uppercase tracking-wider">
                    {format(new Date(item.createdAt), 'h:mm a')}
                  </div>
                </Link>
              ))}
              
              {/* Custom Ad Placeholder */}
              <AdUnit type="custom" placement="sidebar" className="h-48 mt-4" />
            </div>

            {/* Center Column: Hero Article */}
            <div className="lg:col-span-6 order-1 lg:order-2 border-b lg:border-b-0 lg:border-l lg:border-r border-slate-200 lg:px-8 pb-8 lg:pb-0">
              <Link href={`/news/${heroArticle._id}`} className="block group">
                {heroArticle.imageUrl && (
  <div className="w-full aspect-video bg-slate-100 relative mb-6 overflow-hidden">
    <Image 
      src={heroArticle.imageUrl} 
      alt={heroArticle.title} 
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      className="object-contain transition-transform duration-700 group-hover:scale-105" 
      priority // Add priority to the hero image for better LCP
    />
  </div>
)}
                <h2 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-4 group-hover:text-slate-700 transition-colors text-center">
                  {heroArticle.title}
                </h2>
                <p className="text-lg text-slate-600 line-clamp-4 mb-4 font-serif text-center px-4">
                  {heroArticle.content}
                </p>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                  By {heroArticle.author}
                </div>
              </Link>
            </div>

            {/* Right Column: The Latest */}
            <div className="lg:col-span-3 order-3 flex flex-col gap-6">
              <h3 className="font-bold uppercase tracking-widest text-xs border-b border-black pb-2 mb-2">The Latest</h3>
              {worldNews.length > 0 ? worldNews.map((item) => (
                <Link key={item._id} href={`/news/${item._id}`} className="block group border-b border-slate-100 pb-4 last:border-0">
                  <h4 className="text-base font-bold font-serif leading-snug mb-1 group-hover:text-slate-600 transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {format(new Date(item.createdAt), 'MMM d')}
                  </div>
                </Link>
              )) : gridArticles.slice(0, 4).map((item) => (
                <Link key={item._id} href={`/news/${item._id}`} className="block group border-b border-slate-100 pb-4 last:border-0">
                  <h4 className="text-base font-bold font-serif leading-snug mb-1 group-hover:text-slate-600 transition-colors">
                    {item.title}
                  </h4>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {format(new Date(item.createdAt), 'MMM d')}
                  </div>
                </Link>
              ))}

              {/* Google Ad Placeholder */}
              <AdUnit type="google" className="h-[250px] mt-2" />
            </div>
          </div>

          {/* Horizontal Google Ad */}
          <AdUnit type="google" className="w-full h-24 mb-12" />

          {/* Section 2: Technology & Business */}
          <div className="border-t-[1px] border-black pt-8 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black uppercase tracking-widest text-xl font-serif">Technology & Business</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(techNews.length > 0 ? techNews : gridArticles.slice(0, 3)).map((item) => (
                <Link key={item._id} href={`/news/${item._id}`} className="block group flex flex-col h-full">
                  {item.imageUrl && (
                    <div className="w-full aspect-[3/2] bg-slate-100 relative mb-4 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                  )}
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                    {item.category || 'Tech'}
                  </div>
                  <h4 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-slate-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow font-serif">
                    {item.content}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 3: Arts & Culture */}
          <div className="border-t-[1px] border-slate-300 pt-8 mb-16">
            <h3 className="font-black uppercase tracking-widest text-xl font-serif mb-8 text-center">Arts & Culture</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {artsNews.length > 0 ? (
                <>
                  <Link href={`/news/${artsNews[0]._id}`} className="block group">
                    {artsNews[0].imageUrl && (
                      <div className="w-full aspect-square md:aspect-[4/3] bg-slate-100 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={artsNews[0].imageUrl} 
                          alt={artsNews[0].title} 
                          className="object-contain w-full h-full transition-transform duration-700 group-hover:scale-105" 
                        />
                      </div>
                    )}
                  </Link>
                  <div className="flex flex-col justify-center">
                    <Link href={`/news/${artsNews[0]._id}`} className="block group mb-8">
                      <h4 className="text-3xl md:text-5xl font-bold font-serif leading-tight mb-4 group-hover:text-slate-700 transition-colors">
                        {artsNews[0].title}
                      </h4>
                      <p className="text-lg text-slate-600 line-clamp-4 font-serif">
                        {artsNews[0].content}
                      </p>
                    </Link>
                    
                    {artsNews[1] && (
                      <div className="border-t border-slate-200 pt-6">
                        <Link href={`/news/${artsNews[1]._id}`} className="block group flex gap-4">
                          {artsNews[1].imageUrl && (
                            <div className="w-24 h-24 bg-slate-100 relative overflow-hidden shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={artsNews[1].imageUrl} alt={artsNews[1].title} className="object-contain w-full h-full" />
                            </div>
                          )}
                          <div>
                            <h5 className="text-lg font-bold font-serif leading-snug mb-1 group-hover:text-slate-700 transition-colors">
                              {artsNews[1].title}
                            </h5>
                            <p className="text-sm text-slate-500 line-clamp-2 font-serif">{artsNews[1].content}</p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="col-span-2 text-center text-slate-500 font-serif italic py-12">
                  More stories coming soon...
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Newsletter Section */}
      <div className="bg-slate-50 border border-slate-200 p-8 md:p-12 text-center max-w-3xl mx-auto mb-12">
        <h3 className="text-2xl font-bold font-serif mb-2">The Morning Briefing</h3>
        <p className="text-slate-600 mb-6 font-serif">Start your day with the stories you need to know. Delivered to your inbox daily.</p>
        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow px-4 py-3 border border-slate-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            required
          />
          <button 
            type="submit" 
            className="px-6 py-3 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-slate-800 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>

    </div>
  );
}
