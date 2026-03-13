import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { News } from '@/models/Schema';

// Helper to check if string is a valid MongoDB ObjectId
function isValidObjectId(id: string) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  
  let article;
  
  // Check if id is a valid ObjectId or a slug
  if (isValidObjectId(id)) {
    article = await News.findById(id);
  } else {
    // Treat as slug
    article = await News.findOne({ slug: id });
  }
  
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  
  // Generate new slug if title is being updated
  if (body.title) {
    body.slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  let updated;
  if (isValidObjectId(id)) {
    updated = await News.findByIdAndUpdate(id, body, { new: true });
  } else {
    updated = await News.findOneAndUpdate({ slug: id }, body, { new: true });
  }
  
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;
  
  if (isValidObjectId(id)) {
    await News.findByIdAndDelete(id);
  } else {
    await News.findOneAndDelete({ slug: id });
  }
  
  return NextResponse.json({ success: true });
}
