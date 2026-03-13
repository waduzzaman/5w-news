import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Ad } from '@/models/Schema';

export async function GET() {
  await connectDB();
  const ads = await Ad.find({ active: true }).sort({ createdAt: -1 });
  return NextResponse.json(ads);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const newAd = await Ad.create(body);
  return NextResponse.json(newAd, { status: 201 });
}