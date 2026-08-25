import nodemailer from 'nodemailer';
import { emailTemplates } from './emailTemplates';
import { generateEventIcs } from './ics';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const isSmtpConfigured = () => {
  return (
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    !process.env.SMTP_USER.includes('your-email') &&
    !process.env.SMTP_PASS.includes('your-app-password')
  );
};

const getFromConfig = () => {
  const raw = (process.env.SMTP_FROM || process.env.SMTP_USER || 'events@aipl.com').trim();
  // Strip outer quotes if pasted with quotes like '"Name <email>"'
  const cleaned = raw.replace(/^["']+|["']+$/g, '').trim();

  // Match email address inside <...> or raw
  const emailMatch = cleaned.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const emailAddress = emailMatch ? emailMatch[1].trim() : (process.env.SMTP_USER || 'events@aipl.com').trim();

  // Extract display name if present
  let displayName = 'Arsenal and Cisco Events';
  const namePart = cleaned.replace(/<[^>]+>/, '').replace(/^["']+|["']+$/g, '').trim();
  if (namePart) {
    displayName = namePart.replace(/&/g, 'and').replace(/[^a-zA-Z0-9\s\-_.]/g, '').trim();
  }

  return {
    name: displayName || 'Arsenal and Cisco Events',
    address: emailAddress,
  };
};

export const sendApprovalEmail = async (to: string, name: string, department: string = 'IT & Enterprise', appUrl?: string) => {
  const template = emailTemplates.find(t => t.id === 'vip-approved') || emailTemplates[0];
  const html = template.generateHtml({ name, email: to, department, registrationUrl: appUrl });
  const subject = template.subject;

  if (!isSmtpConfigured()) {
    console.log("-----------------------------------------");
    console.log(`[DEV MODE] Mock VIP Pass Email Sent To: ${to} (${name})`);
    console.log("Subject:", subject);
    console.log("-----------------------------------------");
    return true; 
  }

  const fromObj = getFromConfig();

  const ics = generateEventIcs({
    uid: `${to.trim().toLowerCase().replace('@', '-at-')}-trusted-ai-2026@aipl.com`,
    summary: 'Trusted AI for a New Digital India',
    description: 'Executive leadership roundtable hosted by Arsenal Infosolutions and Cisco Systems. Please present your VIP delegate pass email at the registration desk upon arrival.',
    location: 'Sovereign 2, Le Meridien Hotel, Windsor Place, Janpath, New Delhi',
    start: new Date('2026-09-18T12:30:00Z'), // 6:00 PM IST
    end: new Date('2026-09-18T14:30:00Z'), // 8:00 PM IST
    organizerEmail: fromObj.address,
    organizerName: fromObj.name,
  });

  const info = await transporter.sendMail({
    from: fromObj,
    envelope: {
      from: fromObj.address,
      to: [to.trim()],
    },
    to: to.trim(),
    subject,
    html,
    icalEvent: {
      filename: 'trusted-ai-2026.ics',
      method: 'PUBLISH',
      content: ics,
    },
  });

  return info;
};

export const sendTemplateEmail = async (
  templateId: string, 
  to: string, 
  data: { name?: string; department?: string; registrationUrl?: string }
) => {
  const template = emailTemplates.find(t => t.id === templateId) || emailTemplates[0];
  const html = template.generateHtml({ 
    name: data.name, 
    email: to, 
    department: data.department,
    registrationUrl: data.registrationUrl 
  });
  const subject = template.subject;

  if (!isSmtpConfigured()) {
    console.log("-----------------------------------------");
    console.log(`[DEV MODE] Mock Email (${template.name}) Sent To: ${to}`);
    console.log("Subject:", subject);
    console.log("-----------------------------------------");
    return { success: true, mode: 'mock', note: 'Mock mode: Configure valid SMTP credentials in .env.local to send live emails.' };
  }

  const fromObj = getFromConfig();

  const info = await transporter.sendMail({
    from: fromObj,
    envelope: {
      from: fromObj.address,
      to: [to.trim()],
    },
    to: to.trim(),
    subject,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[TEST INBOX] Live Email Preview URL: ${previewUrl}`);
  }

  return { success: true, info, previewUrl: previewUrl || undefined };
};
