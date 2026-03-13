import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/Schema';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  try {
    await connectDB();
    
    // Get token from header OR cookies
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.replace('Bearer ', '');
    
    // If no token in header, check cookies
    if (!token) {
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split('; ').map(c => c.split('='))
        );
        token = cookies['token'];
      }
    }
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as { userId: string };
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      
      return NextResponse.json({ user });
    } catch (jwtError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
