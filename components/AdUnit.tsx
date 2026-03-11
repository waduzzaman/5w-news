'use client';

import { useEffect, useState } from 'react';

interface Ad {
  _id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  placement: string;
}

export default function AdUnit({ type, placement, className }: { type: 'google' | 'custom', placement?: string, className?: string }) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    if (type === 'custom') {
      fetch('/api/ads')
        .then(res => res.json())
        .then((data: Ad[]) => {
          if (Array.isArray(data) && data.length > 0) {
            // Filter by placement if provided, otherwise pick a random one
            const applicableAds = placement ? data.filter(a => a.placement === placement) : data;
            if (applicableAds.length > 0) {
              // Pick a random ad from the applicable ones
              const randomAd = applicableAds[Math.floor(Math.random() * applicableAds.length)];
              setAd(randomAd);
            }
          }
        })
        .catch(err => console.error('Failed to fetch ads', err));
    }
  }, [type, placement]);

  if (type === 'custom' && ad) {
    const adContent = (
      <div className={`relative overflow-hidden group ${className}`}>
        <div className="absolute top-0 left-0 bg-black/50 text-white text-[10px] uppercase tracking-widest px-2 py-1 z-10">
          Sponsored
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      </div>
    );

    if (ad.linkUrl) {
      return (
        <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block">
          {adContent}
        </a>
      );
    }

    return adContent;
  }

  // Fallback / Google Ad Placeholder
  return (
    <div className={`bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 text-sm font-mono p-4 ${className}`}>
      <span className="uppercase tracking-widest text-xs mb-1 text-slate-500">
        {type === 'google' ? 'Advertisement (Google Ads)' : 'Advertisement (Sponsored)'}
      </span>
      <span className="text-slate-300">Ad Space</span>
    </div>
  );
}
