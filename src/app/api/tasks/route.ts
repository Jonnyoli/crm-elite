import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Task from '@/models/Task';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const newTask = await Task.create(data) as any;
    return NextResponse.json({ success: true, data: { ...newTask.toObject(), id: newTask._id?.toString() } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
