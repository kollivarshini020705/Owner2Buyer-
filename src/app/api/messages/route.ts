import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import { memoryDb } from '@/lib/memoryDb';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const senderId = url.searchParams.get('senderId');
    const receiverId = url.searchParams.get('receiverId');

    const conn = await dbConnect();
    if (conn) {
      let query: any = {};
      if (senderId && receiverId) {
        query.$or = [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ];
      }
      const list = await Message.find(query).sort({ timestamp: 1 });
      
      // Seed messages if database is empty
      if (list.length === 0 && !senderId) {
        const seedData = memoryDb.getMessages();
        await Message.insertMany(seedData.map((m: any) => ({
          senderId: m.senderId,
          receiverId: m.receiverId,
          text: m.text,
          timestamp: new Date(m.timestamp)
        })));
        const seededList = await Message.find({}).sort({ timestamp: 1 });
        return NextResponse.json(seededList);
      }

      return NextResponse.json(list);
    } else {
      // Memory fallback conversations
      let list = memoryDb.getMessages();
      if (senderId && receiverId) {
        list = list.filter((m: any) => 
          (m.senderId === senderId && m.receiverId === receiverId) || 
          (m.senderId === receiverId && m.receiverId === senderId)
        );
      }
      return NextResponse.json(list);
    }
  } catch (err: any) {
    console.error('Get Messages API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { senderId, receiverId, text } = await request.json();

    if (!senderId || !receiverId || !text) {
      return NextResponse.json({ error: 'Missing required message parameters' }, { status: 400 });
    }

    const conn = await dbConnect();
    if (conn) {
      const newMsg = await Message.create({
        senderId,
        receiverId,
        text
      });
      return NextResponse.json(newMsg);
    } else {
      const mockMsg = memoryDb.addMessage({
        id: `msg_${Date.now()}`,
        senderId,
        receiverId,
        text,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json(mockMsg);
    }
  } catch (err: any) {
    console.error('Post Message API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
