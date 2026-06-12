import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { memoryDb } from '@/lib/memoryDb';

export async function GET() {
  try {
    const conn = await dbConnect();
    let usersList = [];
    if (conn) {
      const users = await User.find({}, 'name email role avatar');
      usersList = users.map(u => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar
      }));
    } else {
      usersList = memoryDb.getUsers().map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar
      }));
    }
    return NextResponse.json(usersList);
  } catch (err: any) {
    console.error('Fetch users error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
