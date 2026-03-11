'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';

interface News {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  category?: string;
  createdAt: string;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  // Capitalize the first letter for the display name
  const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : '';

  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    let isMounted = true;
    
    fetch(`/api/news?category=${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        if (Array.isArray(data)) {
          setNews(data);
        } else {
          setNews([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Failed to fetch news', err);
        setNews([]);
        setLoading(false);
      });
      
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="text-center py-32 text-slate-500 font-serif text-xl">Loading {categoryName} news...</div>;
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="border-b-[3px] border-black pb-6 mb-12">
        <h1 className="text-5xl md:text-7xl font-black font-serif tracking-tighter uppercase text-center">
          {categoryName}
        </h1>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-24 text-slate-500 font-serif text-xl">
          No articles found in the {categoryName} category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {news.map((item) => (
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
                {item.category || 'News'}
              </div>
              <h4 className="text-xl font-bold font-serif leading-snug mb-2 group-hover:text-slate-700 transition-colors">
                {item.title}
              </h4>
              <p className="text-sm text-slate-600 line-clamp-3 mb-4 flex-grow font-serif">
                {item.content}
              </p>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-auto">
                By {item.author} • {format(new Date(item.createdAt), 'MMM d, yyyy')}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
