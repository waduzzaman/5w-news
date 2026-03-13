import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { News } from '@/models/Schema';

export async function GET() {
  try {
    await connectDB();
    const news = await News.find().sort({ createdAt: -1 });
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, content, imageUrl, author, category } = body;
    
    if (!title || !content || !author) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newNews = await News.create({
      title,
      content,
      imageUrl: imageUrl || '',
      author,
      category: category || 'General',
    });
    
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
  }
}
