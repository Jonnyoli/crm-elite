import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Deal from '@/models/Deal';
import Property from '@/models/Property';
import Task from '@/models/Task';

export async function GET() {
  try {
    await connectToDatabase();

    const [leads, deals, properties, tasks] = await Promise.all([
      Lead.find().sort({ createdAt: -1 }),
      Deal.find().sort({ createdAt: -1 }),
      Property.find().sort({ createdAt: -1 }),
      Task.find().sort({ createdAt: -1 }),
    ]);

    // Map _id to id for the frontend
    const mapDoc = (docs: any[]) => docs.map(d => ({ ...d.toObject(), id: d._id.toString() }));

    return NextResponse.json({
      success: true,
      data: {
        leads: mapDoc(leads),
        deals: mapDoc(deals),
        properties: mapDoc(properties),
        tasks: mapDoc(tasks)
      }
    });
  } catch (error: any) {
    console.error('API Init Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
