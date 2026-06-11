import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Visit from '@/models/Visit';
import { memoryDb } from '@/lib/memoryDb';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!status || !['Approved', 'Declined'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status update request' }, { status: 400 });
    }

    const conn = await dbConnect();
    if (conn) {
      const visit = await Visit.findByIdAndUpdate(id, { status }, { new: true });
      if (!visit) {
        return NextResponse.json({ error: 'Visit record not found' }, { status: 404 });
      }
      return NextResponse.json(visit);
    } else {
      const visit = memoryDb.updateVisitStatus(id, status);
      if (!visit) {
        return NextResponse.json({ error: 'Visit record not found in memory cache' }, { status: 404 });
      }
      return NextResponse.json(visit);
    }
  } catch (err: any) {
    console.error('Update Visit API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 550 });
  }
}
