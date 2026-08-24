import { NextResponse } from 'next/server';
import { emailTemplates } from '@/lib/emailTemplates';

export async function GET() {
  try {
    const templates = emailTemplates.map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
      subject: t.subject,
      description: t.description,
      previewHtml: t.generateHtml({
        name: 'Vinay Malhotra',
        email: 'v.malhotra@tcs-enterprise.com',
        department: 'Chief Information Security Officer (CISO)',
      }),
    }));

    return NextResponse.json({ success: true, templates });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
