import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';
import { sendApprovalEmail } from '@/lib/email';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { status } = body;
    const { id } = await params;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const registration = await Registration.findById(id);
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    registration.status = status;
    await registration.save();

    // If approved, send the email
    if (status === 'Approved') {
      try {
        await sendApprovalEmail(registration.email, registration.name);
      } catch (emailError) {
        console.error('Failed to send approval email:', emailError);
        // We still return success but maybe warn about email failure
      }
    }

    return NextResponse.json({ success: true, data: registration });
  } catch (error: any) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
