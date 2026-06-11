import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Visit from '@/models/Visit';
import { memoryDb } from '@/lib/memoryDb';

export async function GET() {
  try {
    const conn = await dbConnect();
    if (conn) {
      const list = await Visit.find({}).sort({ createdAt: -1 });
      return NextResponse.json(list);
    } else {
      return NextResponse.json(memoryDb.getVisits());
    }
  } catch (err: any) {
    console.error('Get Visits API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { propertyId, buyerId, buyerName, date } = await request.json();

    if (!propertyId || !buyerId || !buyerName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const conn = await dbConnect();
    if (conn) {
      const newVisit = await Visit.create({
        propertyId,
        buyerId,
        buyerName,
        date: date || 'June 15, 2026 at 11:00 AM',
        status: 'Pending Approval'
      });
      return NextResponse.json(newVisit);
    } else {
      const mockVisit = memoryDb.addVisit({
        id: `visit_${Date.now()}`,
        propertyId,
        buyerId,
        buyerName,
        date: date || 'June 15, 2026 at 11:00 AM',
        status: 'Pending Approval'
      });
      return NextResponse.json(mockVisit);
    }
  } catch (err: any) {
    console.error('Post Visit API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
