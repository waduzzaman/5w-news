import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Ad } from '@/models/Schema';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    
    const deleted = await Ad.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ad:', error);
    return NextResponse.json({ error: 'Failed to delete ad' }, { status: 500 });
  }
}
