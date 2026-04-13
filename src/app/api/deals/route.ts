import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Deal from '@/models/Deal';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newDeal = await Deal.create(data) as any;
    return NextResponse.json({ success: true, data: { ...newDeal.toObject(), id: newDeal._id?.toString() } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
