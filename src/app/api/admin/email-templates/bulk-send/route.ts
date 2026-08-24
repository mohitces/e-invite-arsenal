import { NextResponse } from 'next/server';
import { sendTemplateEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { templateId, recipients, name, department, registrationUrl } = body;

    if (!templateId || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: 'Missing template ID or recipient list' }, { status: 400 });
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
    const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    const autoUrl = registrationUrl || `${proto}://${host}/e-invite`;

    // Clean and validate email list
    const validEmails = recipients
      .map((e: string) => e.trim().toLowerCase())
      .filter((e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

    if (validEmails.length === 0) {
      return NextResponse.json({ error: 'No valid email addresses found' }, { status: 400 });
    }

    const results = [];
    let successCount = 0;
    let failCount = 0;

    for (const email of validEmails) {
      try {
        const res = await sendTemplateEmail(templateId, email, {
          name: name || 'Distinguished Leader',
          department: department || 'Executive Technology',
          registrationUrl: autoUrl,
        } as any);

        results.push({ email, status: 'sent', res });
        successCount++;
      } catch (err: any) {
        console.error(`Failed to send to ${email}:`, err);
        results.push({ email, status: 'failed', error: err.message });
        failCount++;
      }
    }

    return NextResponse.json({
      success: true,
      total: validEmails.length,
      successCount,
      failCount,
      results,
    });
  } catch (error: any) {
    console.error('Error during bulk email dispatch:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
