import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowLeft, Share2, Bookmark, MessageCircle } from 'lucide-react';
import AdUnit from '@/components/AdUnit';
import { connectDB } from '@/lib/db';
import { News } from '@/models/Schema';

interface Props {
  params: Promise<{ id: string }>;
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    await connectDB();
    const article = await News.findById(id);
    
    if (!article) {
      return {
        title: 'Article Not Found | The Daily Chronicle',
      };
    }

    return {
      title: `${article.title} | The Daily Chronicle`,
      description: article.content.substring(0, 160),
      openGraph: {
        title: article.title,
        description: article.content.substring(0, 160),
        type: 'article',
        publishedTime: article.createdAt,
        authors: [article.author],
        section: article.category,
        tags: [article.category],
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.content.substring(0, 160),
      },
    };
  } catch (error) {
    return {
      title: 'The Daily Chronicle',
    };
  }
}

export default async function NewsArticle({ params }: Props) {
  const { id } = await params;
  
  await connectDB();
  const article = await News.findById(id);
  
  if (!article) {
    notFound();
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
          {article.category && (
            <Link 
              href={`/category/${article.category.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-widest text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
            >
              {article.category}
            </Link>
          )}
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight mb-6">
          {article.title}
        </h1>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-b border-slate-200 py-4 mb-8">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-serif font-bold text-xl text-slate-600">
              {article.author.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-sm uppercase tracking-wider">{article.author}</div>
              <div className="text-sm text-slate-500">{format(new Date(article.createdAt), 'MMMM d, yyyy • h:mm a')}</div>
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
      {article.imageUrl && (
        <div className="container mx-auto px-4 max-w-5xl mb-12">
          <div className="w-full aspect-video md:aspect-[21/9] bg-slate-100 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={article.imageUrl} 
              alt={article.title} 
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
          {article.content.split('\n\n').map((paragraph: string, index: number) => (
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
