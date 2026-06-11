import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { memoryDb } from '@/lib/memoryDb';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Please provide all details' }, { status: 400 });
    }

    const hasedPassword = await bcrypt.hash(password, 10);
    const avatar = role === 'seller' 
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' 
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150';

    const conn = await dbConnect();
    if (conn) {
      // Check if user exists in MongoDB
      const exists = await User.findOne({ email });
      if (exists) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 });
      }

      const newUser = await User.create({
        name,
        email,
        password: hasedPassword,
        role,
        avatar
      });

      return NextResponse.json({
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      });
    } else {
      // Fallback memory mode
      const exists = memoryDb.getUsers().find((u: any) => u.email === email);
      if (exists) {
        return NextResponse.json({ error: 'User already exists in mock memory' }, { status: 400 });
      }

      const mockUser = memoryDb.addUser({
        id: `user_${Date.now()}`,
        name,
        email,
        password, // stored plain for simplicity in mock
        role,
        avatar
      });

      return NextResponse.json({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        avatar: mockUser.avatar
      });
    }
  } catch (err: any) {
    console.error('Registration API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
