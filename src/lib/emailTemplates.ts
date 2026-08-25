export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  designStyle: string;
  subject: string;
  description: string;
  generateHtml: (data: { name?: string; email?: string; department?: string; registrationUrl?: string }) => string;
}

const getRegUrl = (customUrl?: string, email?: string, name?: string, department?: string) => {
  let baseUrl = customUrl;
  if (!baseUrl) {
    if (typeof window !== 'undefined') {
      baseUrl = `${window.location.origin}/e-invite`;
    } else {
      baseUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/e-invite` : 'http://localhost:3000/e-invite';
    }
  }

  const params = new URLSearchParams();
  if (email && email.includes('@') && !email.includes('delegate@enterprise.com')) {
    params.set('email', email.trim());
  }
  if (name && !name.includes('Distinguished') && !name.includes('Test Delegate')) {
    params.set('name', name.trim());
  }
  if (department && !department.includes('Executive Leadership') && !department.includes('IT & Cybersecurity') && !department.includes('Enterprise Technology') && !department.includes('Leadership Team')) {
    params.set('department', department.trim());
  }

  const qs = params.toString();
  if (!qs) return baseUrl;
  return baseUrl.includes('?') ? `${baseUrl}&${qs}` : `${baseUrl}?${qs}`;
};

const getOrigin = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

export const emailTemplates: EmailTemplate[] = [
  // -------------------------------------------------------------
  // TEMPLATE 1: Official Event Invitation (Click to Register)
  // -------------------------------------------------------------
  {
    id: 'invite-register',
    name: 'Executive Invitation (Click to Register)',
    category: 'Campaign & Pre-Event',
    designStyle: 'Interactive Invitation with Registration Link',
    subject: 'Exclusive Invitation: Trusted AI for a New Digital India | 18 September 2026',
    description: 'Pre-event delegate invitation. Features clickable CTA buttons and cards linking directly to the online registration form.',
    generateHtml: ({ 
      name = 'Distinguished Technology Leader', 
      email = 'delegate@enterprise.com', 
      department = 'Executive Leadership',
      registrationUrl
    }) => {
      const regUrl = getRegUrl(registrationUrl, email, name, department);
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Executive Event Invitation</title>
  <style>
    body { margin: 0; padding: 24px 12px; background-color: #f3efe6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.09); border: 1px solid #ede8df; }
    .header { background: linear-gradient(135deg, #03091e 0%, #0b257c 55%, #00bceb 100%); padding: 42px 28px; text-align: center; color: #ffffff; }
    .brand-capsule { display: inline-block; background: #ffffff; padding: 8px 22px; border-radius: 20px; margin-bottom: 18px; box-shadow: 0 6px 18px rgba(0,0,0,0.18); }
    .invite-banner { display: block; background: #faf9f5; border: 2px dashed #00bceb; border-radius: 24px; padding: 24px; margin: 24px 0; text-decoration: none; color: inherit; transition: all 0.2s ease; }
    .btn-register { display: inline-block; background: linear-gradient(135deg, #00bceb 0%, #0b257c 100%); color: #ffffff !important; padding: 16px 38px; border-radius: 35px; text-decoration: none; font-weight: 800; font-size: 14px; margin: 14px 0; box-shadow: 0 12px 26px rgba(0, 188, 235, 0.4); text-transform: uppercase; letter-spacing: 0.5px; }
    .agenda-box { background: #ffffff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 18px; margin: 20px 0; }
    .agenda-row { border-bottom: 1px solid #f8fafc; }
    .agenda-time { width: 120px; color: #0284c7; font-weight: 800; font-size: 11px; text-transform: uppercase; }
    .footer { background: #faf8f5; padding: 24px; text-align: center; font-size: 11px; color: #78716c; border-top: 1px solid #ede8df; }
  </style>
</head>
<body>
  <div class="wrapper">
    
    <!-- Top Branded Header -->
    <div class="header">
      <div class="brand-capsule">
        <strong style="color: #0b257c; font-size: 16px; letter-spacing: -0.5px;">arsenal</strong>
        <span style="color: #cbd5e1; margin: 0 8px;">|</span>
        <strong style="color: #00bceb; font-size: 16px; letter-spacing: -0.5px;">CISCO</strong>
      </div>
      <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.25;">
        Trusted AI for a New Digital India
      </h1>
      <p style="margin: 8px 0 0; font-size: 13px; color: #e0f2fe; font-weight: 500;">
        Exclusive Executive Session • 18 September 2026 • Le Meridien Delhi
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 34px 28px;">
      <p style="font-size: 15px; margin-top: 0; color: #0f172a;">Dear <strong>${name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.65; color: #475569;">
        On behalf of <strong>Arsenal Infosolutions</strong> and <strong>Cisco Systems</strong>, we cordially invite you to an exclusive leadership roundtable exploring how enterprise AI, secure high-speed networking, and autonomous threat defense are shaping India's digital transformation.
      </p>

      <!-- Clickable Interactive Registration Card -->
      <a href="${regUrl}" class="invite-banner" target="_blank">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e8e3d8; padding-bottom: 12px; margin-bottom: 14px;">
          <div>
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0284c7; background: #e0f2fe; padding: 4px 10px; border-radius: 8px; letter-spacing: 0.5px;">
              Delegate Invitation
            </span>
            <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-top: 6px;">
              Reserve Your VIP Delegate Pass
            </div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 11px; font-weight: 800; color: #00bceb;">Click to Register ↗</span>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 6px 0;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8;">📅 DATE</span>
              <div style="color: #0f172a; font-weight: 800; font-size: 13px; margin-top: 2px;">Friday, 18 Sept 2026</div>
            </td>
            <td style="width: 50%; padding: 6px 0;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8;">⏰ TIME</span>
              <div style="color: #0f172a; font-weight: 800; font-size: 13px; margin-top: 2px;">6:00 PM – 8:00 PM IST</div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 8px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8;">📍 VENUE</span>
              <div style="color: #0f172a; font-weight: 800; font-size: 13px; margin-top: 2px;">Sovereign 2, Le Meridien Hotel, Janpath, New Delhi</div>
            </td>
          </tr>
        </table>
      </a>

      <!-- Keynote Highlight -->
      <div style="background: #f0f9ff; border-left: 4px solid #00bceb; border-radius: 14px; padding: 14px 18px; margin: 20px 0;">
        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0284c7;">Keynote Address</span>
        <div style="font-size: 14px; font-weight: 800; color: #0c4a6e; margin-top: 2px;">
          Vinod Patani — CEO, Arsenal Infosolutions
        </div>
        <p style="font-size: 12px; color: #0369a1; margin: 4px 0 0; line-height: 1.4;">
          Setting the strategic context for Trusted AI and India's sovereign digital growth.
        </p>
      </div>

      <!-- Agenda Overview -->
      <h3 style="font-size: 15px; color: #0f172a; margin: 24px 0 8px; font-weight: 800;">
        Executive Schedule & Discussion Topics
      </h3>

      <div class="agenda-box">
        <table style="width: 100%; border-collapse: collapse;">
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:00 – 6:10 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Welcome & Opening Remarks</strong> by Arsenal</td>
          </tr>
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:10 – 6:30 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Cisco AI Mission & Strategies</strong> for New Digital India</td>
          </tr>
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:30 – 6:50 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Secure Networking</strong> in the AI Era</td>
          </tr>
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:50 – 7:10 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Splunk and Modern Autonomous SOC</strong></td>
          </tr>
          <tr>
            <td class="agenda-time" style="padding: 10px 0;">7:10 – 7:30 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Fireside Chat & Networking Dinner</strong></td>
          </tr>
        </table>
      </div>

      <!-- Primary Big CTA Button Linking to Registration Form -->
      <div style="text-align: center; margin: 30px 0 20px;">
        <a href="${regUrl}" class="btn-register" target="_blank">
          Register for Event →
        </a>
        <div style="font-size: 12px; color: #64748b; margin-top: 8px;">
          Seats are strictly limited for invited enterprise leaders.
        </div>
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 20px;">
        Questions or assistance? Contact: <a href="mailto:events@aipl.com" style="color: #0284c7; font-weight: bold; text-decoration: none;">events@aipl.com</a>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2026 Arsenal Infosolutions Pvt Ltd & Cisco Systems Inc. All rights reserved.<br/>
      New Delhi, India • You received this invitation as an enterprise technology leader.
    </div>

  </div>
</body>
</html>
      `;
    }
  },

  // -------------------------------------------------------------
  // TEMPLATE 2: Modern Clay Bento Pass (Confirmation / Pass)
  // -------------------------------------------------------------
  {
    id: 'clay-bento',
    name: 'Modern Clay Bento Pass',
    category: 'Design Style 2',
    designStyle: 'Warm Clay & 3D Bento Aesthetic',
    subject: 'VIP Invitation: Trusted AI for a New Digital India | 18 September 2026 | Le Meridien Delhi',
    description: 'Ultra-clean clay aesthetic with warm studio background, floating bento pass, structured event grid, and gradient action button.',
    generateHtml: ({ 
      name = 'Distinguished Delegate', 
      email = 'delegate@enterprise.com', 
      department = 'IT & Cybersecurity',
      registrationUrl
    }) => {
      const regUrl = getRegUrl(registrationUrl);
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP Delegate Pass</title>
  <style>
    body { margin: 0; padding: 24px 12px; background-color: #f3efe6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.09); border: 1px solid #ede8df; }
    .header { background: linear-gradient(135deg, #03091e 0%, #0b257c 55%, #00bceb 100%); padding: 40px 28px; text-align: center; color: #ffffff; }
    .brand-capsule { display: inline-block; background: #ffffff; padding: 8px 22px; border-radius: 20px; margin-bottom: 18px; box-shadow: 0 6px 18px rgba(0,0,0,0.18); }
    .bento-card { background: #faf9f5; border: 1.5px solid #e8e3d8; border-radius: 24px; padding: 22px; margin: 24px 0; }
    .agenda-box { background: #ffffff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 18px; margin: 18px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
    .agenda-row { border-bottom: 1px solid #f8fafc; }
    .agenda-time { width: 120px; color: #0284c7; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
    .btn-cta { display: inline-block; background: linear-gradient(135deg, #00bceb 0%, #0b257c 100%); color: #ffffff !important; padding: 14px 34px; border-radius: 30px; text-decoration: none; font-weight: 800; font-size: 13px; margin: 10px 0; box-shadow: 0 10px 24px rgba(0, 188, 235, 0.35); }
    .footer { background: #faf8f5; padding: 24px; text-align: center; font-size: 11px; color: #78716c; border-top: 1px solid #ede8df; }
  </style>
</head>
<body>
  <div class="wrapper">
    
    <!-- Top Header -->
    <div class="header">
      <div class="brand-capsule">
        <strong style="color: #0b257c; font-size: 16px; letter-spacing: -0.5px;">arsenal</strong>
        <span style="color: #cbd5e1; margin: 0 8px;">|</span>
        <strong style="color: #00bceb; font-size: 16px; letter-spacing: -0.5px;">CISCO</strong>
      </div>
      <h1 style="margin: 0; font-size: 25px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.25;">
        Trusted AI for a New Digital India
      </h1>
      <p style="margin: 8px 0 0; font-size: 13px; color: #e0f2fe; font-weight: 500;">
        Executive Leadership Roundtable • 18 September 2026 • Le Meridien Delhi
      </p>
    </div>

    <!-- Main Body -->
    <div style="padding: 34px 28px;">
      <p style="font-size: 15px; margin-top: 0; color: #0f172a;">Dear <strong>${name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.65; color: #475569;">
        We are honored to confirm your reserved delegate seat for the exclusive executive session exploring AI-driven infrastructure, sovereign cyber resilience, and next-generation secure networking.
      </p>

      <!-- Bento Delegate Pass Card -->
      <a href="${regUrl}" target="_blank" style="text-decoration: none; color: inherit; display: block;">
        <div class="bento-card">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #d6cfbf; padding-bottom: 14px; margin-bottom: 16px;">
            <div>
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0284c7; background: #e0f2fe; padding: 4px 10px; border-radius: 8px; letter-spacing: 0.5px;">
                VIP Delegate Pass
              </span>
              <div style="font-size: 19px; font-weight: 800; color: #0f172a; margin-top: 6px; letter-spacing: -0.3px;">
                ${name}
              </div>
              <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-top: 2px;">
                ${department} • ${email}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 11px; font-weight: 800; color: #0b257c; background: #ffffff; border: 1px solid #d6cfbf; padding: 5px 12px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.03);">
                #AIPL-2026-AI
              </div>
            </div>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; padding: 8px 6px 8px 0; vertical-align: top;">
                <div style="background: #ffffff; border: 1px solid #e8e3d8; border-radius: 14px; padding: 12px;">
                  <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">📅 DATE</span>
                  <div style="color: #0f172a; font-weight: 800; font-size: 13px; margin-top: 2px;">Friday, 18 Sept 2026</div>
                </div>
              </td>
              <td style="width: 50%; padding: 8px 0 8px 6px; vertical-align: top;">
                <div style="background: #ffffff; border: 1px solid #e8e3d8; border-radius: 14px; padding: 12px;">
                  <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">⏰ TIMING</span>
                  <div style="color: #0f172a; font-weight: 800; font-size: 13px; margin-top: 2px;">6:00 PM – 8:00 PM IST</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top: 4px;">
                <div style="background: #ffffff; border: 1px solid #e8e3d8; border-radius: 14px; padding: 12px;">
                  <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">📍 VENUE & HALL</span>
                  <div style="color: #0f172a; font-weight: 800; font-size: 13px; margin-top: 2px;">Sovereign 2, Le Meridien Hotel, Windsor Place, Janpath, New Delhi</div>
                  <div style="font-size: 11px; color: #0284c7; margin-top: 2px; font-weight: 600;">Complimentary Valet Parking Available</div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </a>

      <!-- Keynote Spotlight -->
      <div style="background: #f0f9ff; border-left: 4px solid #00bceb; border-radius: 14px; padding: 14px 18px; margin: 20px 0;">
        <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0284c7; letter-spacing: 0.5px;">Keynote Address</span>
        <div style="font-size: 14px; font-weight: 800; color: #0c4a6e; margin-top: 2px;">
          Vinod Patani — CEO, Arsenal Infosolutions
        </div>
        <p style="font-size: 12px; color: #0369a1; margin: 4px 0 0; line-height: 1.4;">
          Setting the strategic context for Trusted AI and India's sovereign digital growth.
        </p>
      </div>

      <!-- Agenda Timeline Table -->
      <h3 style="font-size: 15px; color: #0f172a; margin: 24px 0 8px; font-weight: 800;">
        Executive Schedule
      </h3>

      <div class="agenda-box">
        <table style="width: 100%; border-collapse: collapse;">
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:00 – 6:10 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Welcome & Opening Remarks</strong> by Arsenal</td>
          </tr>
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:10 – 6:30 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Cisco AI Mission & Strategies</strong> for New Digital India</td>
          </tr>
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:30 – 6:50 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Secure Networking</strong> in the AI Era</td>
          </tr>
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:50 – 7:10 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Splunk and Modern Autonomous SOC</strong></td>
          </tr>
          <tr>
            <td class="agenda-time" style="padding: 10px 0;">7:10 – 7:30 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Fireside Chat & Networking Dinner</strong></td>
          </tr>
        </table>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 28px 0 16px;">
        <a href="${regUrl}" class="btn-cta" target="_blank">
          Open Registration Form →
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 14px;">
        RSVP & Direct Inquiries: <a href="mailto:events@aipl.com" style="color: #0284c7; font-weight: bold; text-decoration: none;">events@aipl.com</a>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2026 Arsenal Infosolutions Pvt Ltd & Cisco Systems Inc. All rights reserved.<br/>
      New Delhi, India • You received this VIP confirmation because you registered for the executive session.
    </div>

  </div>
</body>
</html>
      `;
    }
  },

  // -------------------------------------------------------------
  // TEMPLATE 3: Executive Cyber Dark (Deep Midnight Navy & Neon Cyan)
  // -------------------------------------------------------------
  {
    id: 'cyber-dark',
    name: 'Executive Cyber Dark',
    category: 'Design Style 3',
    designStyle: 'Deep Navy & Cyber Neon Luxury',
    subject: 'Official VIP Pass: Trusted AI for a New Digital India | Arsenal & Cisco',
    description: 'High-contrast luxury dark theme with midnight slate gradients, glowing cyan accents, digital holographic badge, and sharp tech typography.',
    generateHtml: ({ 
      name = 'Distinguished Delegate', 
      email = 'delegate@enterprise.com', 
      department = 'Enterprise Technology',
      registrationUrl
    }) => {
      const regUrl = getRegUrl(registrationUrl);
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Executive VIP Pass</title>
  <style>
    body { margin: 0; padding: 24px 12px; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #0b132b; border-radius: 28px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.6); border: 1px solid #1e293b; }
    .header { background: radial-gradient(circle at 50% 0%, #00bceb 0%, #0b257c 60%, #03091e 100%); padding: 40px 28px; text-align: center; }
    .brand-pill { display: inline-block; background: #ffffff; padding: 8px 22px; border-radius: 16px; margin-bottom: 16px; box-shadow: 0 0 20px rgba(0, 188, 235, 0.4); }
    .digital-pass { background: #0f172a; border: 1px solid #00bceb; border-radius: 20px; padding: 22px; margin: 24px 0; box-shadow: inset 0 0 20px rgba(0, 188, 235, 0.08); text-decoration: none; color: inherit; display: block; }
    .agenda-row { border-bottom: 1px solid #1e293b; }
    .agenda-time { width: 125px; color: #38bdf8; font-weight: 800; font-size: 12px; }
    .btn-neon { display: inline-block; background: linear-gradient(90deg, #00bceb 0%, #0284c7 100%); color: #ffffff !important; padding: 14px 34px; border-radius: 30px; text-decoration: none; font-weight: 800; font-size: 13px; box-shadow: 0 0 25px rgba(0, 188, 235, 0.45); }
    .footer { background: #030712; padding: 24px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <div class="brand-pill">
        <strong style="color: #0b257c; font-size: 16px;">arsenal</strong>
        <span style="color: #94a3b8; margin: 0 8px;">|</span>
        <strong style="color: #00bceb; font-size: 16px;">CISCO</strong>
      </div>
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
        Trusted AI for a New Digital India
      </h1>
      <p style="margin: 8px 0 0; font-size: 13px; color: #94a3b8;">
        18 September 2026 • Sovereign 2, Le Meridien Delhi
      </p>
    </div>

    <!-- Body Content -->
    <div style="padding: 32px 28px;">
      <p style="font-size: 15px; margin-top: 0; color: #f8fafc;">Greetings <strong>${name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #94a3b8;">
        You are officially confirmed for the executive roundtable on AI governance, sovereign security, and high-performance intelligent networking.
      </p>

      <!-- Digital Pass Box -->
      <a href="${regUrl}" class="digital-pass" target="_blank">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 14px;">
          <div>
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #38bdf8;">DIGITAL ACCESS PASS</span>
            <div style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 4px;">${name}</div>
            <div style="font-size: 12px; color: #94a3b8;">${department}</div>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 11px; font-weight: 800; color: #38bdf8; border: 1px solid #00bceb; padding: 3px 8px; border-radius: 6px;">#AIPL-VIP</span>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 6px 0;">
              <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase;">DATE</span><br/>
              <span style="color: #f8fafc; font-weight: 700; font-size: 13px;">18 Sept 2026</span>
            </td>
            <td style="width: 50%; padding: 6px 0;">
              <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase;">TIME</span><br/>
              <span style="color: #f8fafc; font-weight: 700; font-size: 13px;">6:00 PM Onwards</span>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 10px;">
              <span style="color: #64748b; font-size: 10px; font-weight: 800; text-transform: uppercase;">LOCATION</span><br/>
              <span style="color: #38bdf8; font-weight: 600; font-size: 13px;">Sovereign 2, Le Meridien Hotel, New Delhi</span>
            </td>
          </tr>
        </table>
      </a>

      <!-- Agenda -->
      <h3 style="font-size: 15px; color: #ffffff; margin: 24px 0 6px;">Session Timings</h3>
      <p style="font-size: 13px; color: #94a3b8; margin-top: 0; margin-bottom: 12px;">
        Keynote by <strong>Vinod Patani (CEO, Arsenal)</strong>: Context setting for Trusted AI architecture.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr class="agenda-row"><td class="agenda-time" style="padding: 10px 0;">6:00 – 6:10 PM</td><td style="font-size: 13px; padding: 10px 0; color: #e2e8f0;">Welcome & Opening Remarks</td></tr>
        <tr class="agenda-row"><td class="agenda-time" style="padding: 10px 0;">6:10 – 6:30 PM</td><td style="font-size: 13px; padding: 10px 0; color: #e2e8f0;">Cisco AI Mission & Strategies for India</td></tr>
        <tr class="agenda-row"><td class="agenda-time" style="padding: 10px 0;">6:30 – 6:50 PM</td><td style="font-size: 13px; padding: 10px 0; color: #e2e8f0;">Secure Networking in the AI Era</td></tr>
        <tr class="agenda-row"><td class="agenda-time" style="padding: 10px 0;">6:50 – 7:10 PM</td><td style="font-size: 13px; padding: 10px 0; color: #e2e8f0;">Splunk & Modern Autonomous SOC</td></tr>
        <tr><td class="agenda-time" style="padding: 10px 0;">7:10 – 7:30 PM</td><td style="font-size: 13px; padding: 10px 0; color: #e2e8f0;">Fireside Chat & Networking Dinner</td></tr>
      </table>

      <!-- CTA -->
      <div style="text-align: center; margin: 28px 0;">
        <a href="${regUrl}" class="btn-neon" target="_blank">
          Open Registration Form →
        </a>
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center;">
        Inquiries: <a href="mailto:events@aipl.com" style="color: #38bdf8; text-decoration: none;">events@aipl.com</a>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2026 Arsenal Infosolutions & Cisco Systems • All Rights Reserved
    </div>
  </div>
</body>
</html>
      `;
    }
  },

  // -------------------------------------------------------------
  // TEMPLATE 4: Luxe Editorial & Monogram Seal (Minimalist Luxury)
  // -------------------------------------------------------------
  {
    id: 'luxe-editorial',
    name: 'Luxe Editorial & Monogram',
    category: 'Design Style 4',
    designStyle: 'Ivory Platinum & Serif Corporate Luxury',
    subject: 'Executive Invitation: Trusted AI for a New Digital India • 18 Sept 2026',
    description: 'Clean ivory editorial aesthetic with gold hairline borders, classic corporate serif typography, and an executive seal.',
    generateHtml: ({ 
      name = 'Distinguished Delegate', 
      email = 'delegate@enterprise.com', 
      department = 'Leadership Team',
      registrationUrl
    }) => {
      const regUrl = getRegUrl(registrationUrl);
      const origin = getOrigin();
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Executive Invitation</title>
  <style>
    body { margin: 0; padding: 24px 12px; background-color: #f5f5f4; font-family: 'Georgia', serif; color: #1c1917; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #fdfbf7; border-radius: 12px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.06); border: 1px solid #e7e5e4; }
    .header { padding: 44px 32px 28px; text-align: center; border-bottom: 1px solid #e7e5e4; }
    .logo-badge { border: 1px solid #d6d3d1; border-radius: 30px; background: #ffffff; margin-bottom: 20px; }
    .agenda-table { width: 100%; border-collapse: collapse; margin: 20px 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
    .agenda-table td { padding: 10px 4px; border-bottom: 1px solid #f5f5f4; font-size: 13px; }
    .agenda-time { width: 120px; color: #78716c; font-weight: 700; font-size: 12px; }
    .btn-seal { display: inline-block; background: #0b257c; color: #ffffff !important; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.5px; }
    .footer { background: #f5f5f4; padding: 24px; text-align: center; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; color: #78716c; border-top: 1px solid #e7e5e4; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <table role="presentation" cellpadding="0" cellspacing="0" class="logo-badge" style="margin: 0 auto 20px;">
        <tr>
          <td style="padding: 8px 20px;">
            <img src="${origin}/arsenal-logo.jpg" alt="Arsenal" height="22" style="height: 22px; width: auto; vertical-align: middle; display: inline-block; border: 0;" />
            <span style="display: inline-block; width: 1px; height: 16px; background: #d6d3d1; margin: 0 12px; vertical-align: middle;"></span>
            <img src="${origin}/cisco-logo.png" alt="Cisco" height="22" style="height: 22px; width: auto; vertical-align: middle; display: inline-block; border: 0;" />
          </td>
        </tr>
      </table>
      <h1 style="margin: 0; font-size: 26px; font-weight: normal; letter-spacing: -0.5px; color: #0c0a09; line-height: 1.25;">
        Trusted AI for a New Digital India
      </h1>
      <p style="margin: 10px 0 0; font-size: 13px; color: #78716c; font-family: -apple-system, BlinkMacSystemFont, sans-serif; letter-spacing: 0.5px;">
        18 SEPTEMBER 2026 • LE MERIDIEN NEW DELHI
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 36px 32px;">
      <p style="font-size: 16px; margin-top: 0; color: #0c0a09;">
        Dear <strong>${name}</strong>,
      </p>
      
      <p style="font-size: 14px; line-height: 1.7; color: #44403c; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        Arsenal and Cisco cordially invite you to an exclusive leadership roundtable on architecting secure, resilient, and trusted AI ecosystems for India's digital future.
      </p>

      <!-- Event Details Frame -->
      <a href="${regUrl}" target="_blank" style="text-decoration: none; color: inherit; display: block;">
        <div style="border: 1px solid #e7e5e4; background: #ffffff; padding: 20px; border-radius: 8px; margin: 24px 0; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="width: 50%; padding-bottom: 8px;">
                <span style="font-size: 10px; letter-spacing: 1px; color: #78716c; font-weight: 700;">DATE</span><br/>
                <strong style="color: #0c0a09; font-size: 14px;">Friday, 18 September 2026</strong>
              </td>
              <td style="width: 50%; padding-bottom: 8px;">
                <span style="font-size: 10px; letter-spacing: 1px; color: #78716c; font-weight: 700;">SCHEDULE</span><br/>
                <strong style="color: #0c0a09; font-size: 14px;">6:00 PM – 8:00 PM IST</strong>
              </td>
            </tr>
            <tr>
              <td colspan="2" style="padding-top: 8px; border-top: 1px solid #f5f5f4;">
                <span style="font-size: 10px; letter-spacing: 1px; color: #78716c; font-weight: 700;">VENUE</span><br/>
                <strong style="color: #0c0a09; font-size: 14px;">Sovereign 2, Le Meridien Hotel, Janpath, New Delhi</strong>
              </td>
            </tr>
          </table>
        </div>
      </a>

      <!-- Agenda Table -->
      <h3 style="font-size: 17px; color: #0c0a09; margin: 28px 0 8px; font-weight: normal;">
        Executive Schedule
      </h3>
      <p style="font-size: 13px; color: #78716c; font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin-top: 0;">
        <strong>Opening Keynote:</strong> Vinod Patani, CEO — Arsenal Infosolutions
      </p>

      <table class="agenda-table">
        <tr><td class="agenda-time">6:00 – 6:10 PM</td><td><strong>Welcome & Opening</strong> by Arsenal</td></tr>
        <tr><td class="agenda-time">6:10 – 6:30 PM</td><td><strong>Cisco AI Mission & Strategies</strong> for New Digital India</td></tr>
        <tr><td class="agenda-time">6:30 – 6:50 PM</td><td><strong>Secure Networking</strong> in the AI Era</td></tr>
        <tr><td class="agenda-time">6:50 – 7:10 PM</td><td><strong>Splunk & Modern SOC</strong> Architectures</td></tr>
        <tr><td class="agenda-time">7:10 – 7:30 PM</td><td><strong>Fireside Chat & Networking Dinner</strong></td></tr>
      </table>

      <!-- RSVP Button -->
      <div style="text-align: center; margin: 32px 0 16px;">
        <a href="${regUrl}" class="btn-seal" target="_blank">
          CONFIRM YOUR REGISTRATION
        </a>
      </div>

      <p style="font-size: 12px; color: #78716c; text-align: center; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
        Direct Contact: <a href="mailto:events@aipl.com" style="color: #0b257c; text-decoration: underline;">events@aipl.com</a>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      Arsenal Infosolutions Pvt Ltd & Cisco Systems Inc. • Private & Confidential
    </div>
  </div>
</body>
</html>
      `;
    }
  },
  // -------------------------------------------------------------
  // TEMPLATE 5: VIP Pass Approved
  // -------------------------------------------------------------
  {
    id: 'vip-approved',
    name: 'VIP Pass Approved',
    category: 'Post-Registration Approval',
    designStyle: 'Confirmed Ticket Aesthetic',
    subject: 'VIP Pass Confirmed: Trusted AI for a New Digital India | 18 September 2026',
    description: 'Email sent when an admin approves a registration. Shows a confirmed status without the registration link.',
    generateHtml: ({ 
      name = 'Distinguished Delegate', 
      email = 'delegate@enterprise.com', 
      department = 'IT & Cybersecurity',
    }) => {
      return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VIP Delegate Pass Confirmed</title>
  <style>
    body { margin: 0; padding: 24px 12px; background-color: #f3efe6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.09); border: 1px solid #ede8df; }
    .header { background: linear-gradient(135deg, #03091e 0%, #0b257c 55%, #00bceb 100%); padding: 40px 28px; text-align: center; color: #ffffff; }
    .brand-capsule { display: inline-block; background: #ffffff; padding: 8px 22px; border-radius: 20px; margin-bottom: 18px; box-shadow: 0 6px 18px rgba(0,0,0,0.18); }
    .bento-card { background: #faf9f5; border: 1.5px solid #059669; border-radius: 24px; padding: 22px; margin: 24px 0; box-shadow: 0 10px 25px rgba(5, 150, 105, 0.1); }
    .agenda-box { background: #ffffff; border: 1px solid #f1f5f9; border-radius: 20px; padding: 18px; margin: 18px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
    .agenda-row { border-bottom: 1px solid #f8fafc; }
    .agenda-time { width: 120px; color: #0284c7; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; }
    .footer { background: #faf8f5; padding: 24px; text-align: center; font-size: 11px; color: #78716c; border-top: 1px solid #ede8df; }
  </style>
</head>
<body>
  <div class="wrapper">
    
    <!-- Top Header -->
    <div class="header">
      <div class="brand-capsule">
        <strong style="color: #0b257c; font-size: 16px; letter-spacing: -0.5px;">arsenal</strong>
        <span style="color: #cbd5e1; margin: 0 8px;">|</span>
        <strong style="color: #00bceb; font-size: 16px; letter-spacing: -0.5px;">CISCO</strong>
      </div>
      <h1 style="margin: 0; font-size: 25px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.25;">
        Registration Confirmed
      </h1>
      <p style="margin: 8px 0 0; font-size: 13px; color: #e0f2fe; font-weight: 500;">
        We look forward to hosting you on 18 September 2026.
      </p>
    </div>

    <!-- Main Body -->
    <div style="padding: 34px 28px;">
      <p style="font-size: 15px; margin-top: 0; color: #0f172a;">Dear <strong>${name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.65; color: #475569;">
        Your registration has been <strong>successfully approved</strong>. Below are your VIP Delegate Pass details. Please present this email at the registration desk upon arrival.
      </p>

      <!-- Bento Delegate Pass Card -->
      <div class="bento-card">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #a7f3d0; padding-bottom: 14px; margin-bottom: 16px;">
          <div>
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #065f46; background: #d1fae5; padding: 4px 10px; border-radius: 8px; letter-spacing: 0.5px;">
              ✓ VIP Pass Confirmed
            </span>
            <div style="font-size: 19px; font-weight: 800; color: #0f172a; margin-top: 6px; letter-spacing: -0.3px;">
              ${name}
            </div>
            <div style="font-size: 12px; color: #64748b; font-weight: 500; margin-top: 2px;">
              ${department} • ${email}
            </div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 50%; padding: 8px 6px 8px 0; vertical-align: top;">
              <div style="background: #ffffff; border: 1px solid #e8e3d8; border-radius: 14px; padding: 12px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">📅 DATE</span>
                <div style="color: #0f172a; font-weight: 800; font-size: 13px; margin-top: 2px;">Friday, 18 Sept 2026</div>
              </div>
            </td>
            <td style="width: 50%; padding: 8px 0 8px 6px; vertical-align: top;">
              <div style="background: #ffffff; border: 1px solid #e8e3d8; border-radius: 14px; padding: 12px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">⏰ TIMING</span>
                <div style="color: #0f172a; font-weight: 800; font-size: 13px; margin-top: 2px;">6:00 PM – 8:00 PM IST</div>
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-top: 4px;">
              <div style="background: #ffffff; border: 1px solid #e8e3d8; border-radius: 14px; padding: 12px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.5px;">📍 VENUE & HALL</span>
                <div style="color: #0f172a; font-weight: 800; font-size: 13px; margin-top: 2px;">Sovereign 2, Le Meridien Hotel, Windsor Place, Janpath, New Delhi</div>
                <div style="font-size: 11px; color: #0284c7; margin-top: 2px; font-weight: 600;">Complimentary Valet Parking Available</div>
              </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Agenda Timeline Table -->
      <h3 style="font-size: 15px; color: #0f172a; margin: 24px 0 8px; font-weight: 800;">
        Executive Schedule
      </h3>

      <div class="agenda-box">
        <table style="width: 100%; border-collapse: collapse;">
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:00 – 6:10 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Welcome & Opening Remarks</strong> by Arsenal</td>
          </tr>
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:10 – 6:30 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Cisco AI Mission & Strategies</strong> for New Digital India</td>
          </tr>
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:30 – 6:50 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Secure Networking</strong> in the AI Era</td>
          </tr>
          <tr class="agenda-row">
            <td class="agenda-time" style="padding: 10px 0;">6:50 – 7:10 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Splunk and Modern Autonomous SOC</strong></td>
          </tr>
          <tr>
            <td class="agenda-time" style="padding: 10px 0;">7:10 – 7:30 PM</td>
            <td style="font-size: 13px; padding: 10px 0; color: #1e293b;"><strong>Fireside Chat & Networking Dinner</strong></td>
          </tr>
        </table>
      </div>

      <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 14px;">
        Questions or need to update your RSVP? Contact: <a href="mailto:events@aipl.com" style="color: #0284c7; font-weight: bold; text-decoration: none;">events@aipl.com</a>
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      © 2026 Arsenal Infosolutions Pvt Ltd & Cisco Systems Inc. All rights reserved.<br/>
      New Delhi, India
    </div>
  </div>
</body>
</html>
      `;
    }
  }
];
