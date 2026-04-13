import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newLead = await Lead.create(data) as any;
    return NextResponse.json({ success: true, data: { ...newLead.toObject(), id: newLead._id?.toString() } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
