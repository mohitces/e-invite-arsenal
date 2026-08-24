import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Registration from '@/models/Registration';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { name, phone, email, department, description } = body;

    if (!name?.trim() || !phone?.trim() || !email?.trim() || !department?.trim()) {
      return NextResponse.json({ error: 'All required fields must be filled.' }, { status: 400 });
    }

    // Phone validation: 10 to 15 digits
    const phoneDigits = phone.replace(/[^0-9]/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return NextResponse.json({ error: 'Phone number must be between 10 and 15 digits.' }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Please provide a valid official email address.' }, { status: 400 });
    }

    const existingRegistration = await Registration.findOne({ email: email.trim().toLowerCase() });
    if (existingRegistration) {
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
    }

    const newRegistration = await Registration.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      description: description?.trim() || '',
    });

    return NextResponse.json({ success: true, data: newRegistration }, { status: 201 });
  } catch (error: any) {
    console.error('Error during registration:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error',
      details: process.env.NODE_ENV !== 'production' ? error.stack : undefined 
    }, { status: 500 });
  }
}
