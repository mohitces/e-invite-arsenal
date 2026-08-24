import nodemailer from 'nodemailer';
import { emailTemplates } from './emailTemplates';

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

const getFromAddress = () => {
  const fromEnv = process.env.SMTP_FROM || process.env.SMTP_USER || 'events@aipl.com';
  
  // Parse format like "Display Name <email@domain.com>" or "email@domain.com"
  const match = fromEnv.match(/^(?:"?([^<"]*)"?\s*)?<?([^>]+@[^>]+)>?$/);
  if (match) {
    const rawName = match[1] || 'Arsenal and Cisco Events';
    // Remove invalid characters like '&' which MailerSend rejects
    const cleanName = rawName.replace(/&/g, 'and').replace(/[^a-zA-Z0-9\s\-_.]/g, '').trim();
    const address = match[2].trim();
    return { name: cleanName || 'Arsenal and Cisco Events', address };
  }

  return {
    name: 'Arsenal and Cisco Events',
    address: fromEnv.trim(),
  };
};

export const sendApprovalEmail = async (to: string, name: string, department: string = 'IT & Enterprise') => {
  const template = emailTemplates.find(t => t.id === 'clay-bento') || emailTemplates[0];
  const html = template.generateHtml({ name, email: to, department });
  const subject = template.subject;

  if (!isSmtpConfigured()) {
    console.log("-----------------------------------------");
    console.log(`[DEV MODE] Mock VIP Pass Email Sent To: ${to} (${name})`);
    console.log("Subject:", subject);
    console.log("-----------------------------------------");
    return true; 
  }

  const info = await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
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

  const info = await transporter.sendMail({
    from: getFromAddress(),
    to,
    subject,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[TEST INBOX] Live Email Preview URL: ${previewUrl}`);
  }

  return { success: true, info, previewUrl: previewUrl || undefined };
};
