import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Property from '@/models/Property';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newProperty = await Property.create(data) as any;
    return NextResponse.json({ success: true, data: { ...newProperty.toObject(), id: newProperty._id?.toString() } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
