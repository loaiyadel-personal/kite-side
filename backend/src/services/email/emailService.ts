import nodemailer from 'nodemailer'

function esc(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

const FROM = `"Kite Side Ras Sudr" <${process.env.SMTP_USER}>`

export async function sendContactConfirmation(to: string, name: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: 'We received your message — Kite Side Ras Sudr',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#022b3d;padding:28px 32px">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700">Kite Side Beach Club</h1>
          <p style="color:#1a9fd4;margin:4px 0 0;font-size:13px">Ras Sudr, South Sinai, Egypt</p>
        </div>
        <div style="padding:32px">
          <h2 style="color:#022b3d;margin:0 0 16px;font-size:18px">Hey ${esc(name)}, we got your message!</h2>
          <p style="color:#374151;line-height:1.6;margin:0 0 16px">
            Thanks for reaching out to <strong>Kite Side</strong>. One of our team members will
            get back to you within <strong>24 hours</strong>.
          </p>
          <p style="color:#374151;line-height:1.6;margin:0 0 24px">
            Need a faster answer? WhatsApp us directly:
          </p>
          <a href="https://wa.me/201116407080" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
            WhatsApp +20 11 16407080
          </a>
        </div>
        <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb">
          <p style="color:#6b7280;font-size:12px;margin:0">
            📍 Ras Sudr, South Sinai, Egypt &nbsp;·&nbsp;
            📞 +20 11 16407080 &nbsp;·&nbsp;
            ✉️ Ahmedyehya47@gmail.com
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendAdminNotification(submission: any) {
  await transporter.sendMail({
    from: FROM,
    to: process.env.ADMIN_EMAIL,
    replyTo: submission.email,
    subject: `New contact: ${esc(submission.name)} — ${esc(submission.subject)}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
        <div style="background:#022b3d;padding:20px 28px">
          <h2 style="color:#fff;margin:0;font-size:16px">New Contact Form Submission</h2>
        </div>
        <div style="padding:28px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr style="border-bottom:1px solid #f3f4f6">
              <td style="padding:10px 0;color:#6b7280;font-weight:600;width:120px">Name</td>
              <td style="padding:10px 0;color:#111827">${esc(submission.name)}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6">
              <td style="padding:10px 0;color:#6b7280;font-weight:600">Email</td>
              <td style="padding:10px 0;color:#111827"><a href="mailto:${esc(submission.email)}">${esc(submission.email)}</a></td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6">
              <td style="padding:10px 0;color:#6b7280;font-weight:600">Phone</td>
              <td style="padding:10px 0;color:#111827">${submission.phone ? esc(submission.phone) : '—'}</td>
            </tr>
            <tr style="border-bottom:1px solid #f3f4f6">
              <td style="padding:10px 0;color:#6b7280;font-weight:600">Subject</td>
              <td style="padding:10px 0;color:#111827">${esc(submission.subject)}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#6b7280;font-weight:600;vertical-align:top">Message</td>
              <td style="padding:10px 0;color:#111827;white-space:pre-wrap">${esc(submission.message)}</td>
            </tr>
          </table>
          <div style="margin-top:24px">
            <a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/contact"
               style="display:inline-block;background:#1a9fd4;color:#fff;text-decoration:none;padding:10px 20px;border-radius:8px;font-weight:600;font-size:13px">
              View in admin panel →
            </a>
          </div>
        </div>
        <div style="background:#f9fafb;padding:14px 28px;border-top:1px solid #e5e7eb">
          <p style="color:#9ca3af;font-size:11px;margin:0">Reply directly to this email to respond to ${esc(submission.name)}</p>
        </div>
      </div>
    `,
  })
}

export async function sendCourseInquiryNotification(inquiry: {
  name: string; email: string; phone?: string | null
  level?: string | null; courseId?: string | null
  preferredDates?: string | null; howHeard?: string | null; message?: string | null
}) {
  await transporter.sendMail({
    from: FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `🪁 New course inquiry from ${esc(inquiry.name)}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto">
        <h3>New course booking inquiry</h3>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px;font-weight:bold">Name</td><td>${esc(inquiry.name)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Email</td><td>${esc(inquiry.email)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Phone</td><td>${inquiry.phone ? esc(inquiry.phone) : '—'}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Level</td><td>${inquiry.level ? esc(inquiry.level) : '—'}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Preferred dates</td><td>${inquiry.preferredDates ? esc(inquiry.preferredDates) : '—'}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">How they heard</td><td>${inquiry.howHeard ? esc(inquiry.howHeard) : '—'}</td></tr>
          <tr><td style="padding:6px;font-weight:bold;vertical-align:top">Message</td><td>${inquiry.message ? esc(inquiry.message) : '—'}</td></tr>
        </table>
        <p><a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/courses">View in admin panel →</a></p>
      </div>
    `,
  })
}

export async function sendAdminReply(to: string, name: string, replyText: string) {
  await transporter.sendMail({
    from: FROM,
    to,
    subject: `Re: Your message to Kite Side`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto">
        <p>Hi ${esc(name)},</p>
        <div style="white-space:pre-wrap">${esc(replyText)}</div>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#666;font-size:13px">📍 Kite Side · Ras Sudr, Egypt · +20 11 16407080</p>
      </div>
    `,
  })
}
