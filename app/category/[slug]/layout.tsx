import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
  
  return {
    title: `${categoryName} News`,
    description: `Latest news and updates in ${categoryName}. Stay informed with The Daily Chronicle.`,
    openGraph: {
      title: `${categoryName} News | The Daily Chronicle`,
      description: `Latest news and updates in ${categoryName}. Stay informed with The Daily Chronicle.`,
    },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
