import { NextResponse } from 'next/server';
import { sendTemplateEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, to, name, department, registrationUrl } = body;

    if (!templateId || !to) {
      return NextResponse.json({ error: 'Missing template ID or recipient email' }, { status: 400 });
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const autoUrl = registrationUrl || `${proto}://${host}/e-invite`;

    const result = await sendTemplateEmail(templateId, to, {
      name: name || 'Test Delegate',
      department: department || 'IT Leadership',
      registrationUrl: autoUrl,
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ error: error.message || 'Failed to send test email' }, { status: 500 });
  }
}
