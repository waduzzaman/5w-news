import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const res = await fetch(`http://localhost:${process.env.PORT || 3000}/api/news/${id}`);
    if (res.ok) {
      const news = await res.json();
      return {
        title: news.title,
        description: news.content.substring(0, 160) + '...',
        openGraph: {
          title: news.title,
          description: news.content.substring(0, 160) + '...',
          images: news.imageUrl ? [news.imageUrl] : [],
          type: 'article',
          publishedTime: news.createdAt,
          authors: [news.author],
        },
        twitter: {
          card: 'summary_large_image',
          title: news.title,
          description: news.content.substring(0, 160) + '...',
          images: news.imageUrl ? [news.imageUrl] : [],
        }
      };
    }
  } catch (error) {
    console.error('Error fetching metadata', error);
  }

  return {
    title: 'Article Not Found',
  };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
