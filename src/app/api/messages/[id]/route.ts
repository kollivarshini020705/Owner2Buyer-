import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import { memoryDb } from '@/lib/memoryDb';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { text } = await request.json();

    if (!text || !text.startsWith('📜')) {
      return NextResponse.json({ error: 'Invalid message structure' }, { status: 400 });
    }

    const conn = await dbConnect();
    if (conn) {
      const msg = await Message.findByIdAndUpdate(id, { text }, { new: true });
      if (!msg) {
        return NextResponse.json({ error: 'Message not found' }, { status: 404 });
      }
      return NextResponse.json(msg);
    } else {
      const msg = memoryDb.updateMessageText(id, text);
      if (!msg) {
        return NextResponse.json({ error: 'Message not found in memory cache' }, { status: 404 });
      }
      return NextResponse.json(msg);
    }
  } catch (err: any) {
    console.error('Update Message API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 550 });
  }
}
