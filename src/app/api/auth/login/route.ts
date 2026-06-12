import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { memoryDb } from '@/lib/memoryDb';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_owner2buyer_encryption_signing_key_secret_code';

export async function POST(request: Request) {
  try {
    const { email, password, isQuickLogin } = await request.json();

    if (!email || (!password && !isQuickLogin)) {
      return NextResponse.json({ error: 'Please provide email and password' }, { status: 400 });
    }

    const conn = await dbConnect();
    if (conn) {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
      }

      if (!isQuickLogin) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    } else {
      // Fallback mock authentication
      const user = memoryDb.getUsers().find((u: any) => u.email === email);
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
      }

      if (!isQuickLogin) {
        // In mock mode, support plain matching or password123
        const isMatch = password === user.password || password === 'password123';
        if (!isMatch) {
          return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      });
    }
  } catch (err: any) {
    console.error('Login API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
