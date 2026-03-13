import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    const upload = await cloudinary.uploader.upload(image, { folder: 'news_portal' });
    return NextResponse.json({ url: upload.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}