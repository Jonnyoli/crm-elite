import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import MarketProperty from '@/models/MarketProperty';

export async function GET() {
  try {
    await connectToDatabase();
    const properties = await MarketProperty.find().sort({ createdAt: -1 }).limit(100);
    
    // Map _id to id
    const results = properties.map(p => ({
      ...p.toObject(),
      id: p._id.toString()
    }));

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
