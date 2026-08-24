import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function GET() {
  try {
    await connectToDatabase();
    // Sort by newest first
    const registrations = await Registration.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: registrations });
  } catch (error: any) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
