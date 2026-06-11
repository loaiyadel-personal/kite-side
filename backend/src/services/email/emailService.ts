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
    subject: '🪁 We received your message — Kite Side Ras Sudr',
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#0a6d96">Hey ${esc(name)}! 🤙</h2>
        <p>Thanks for reaching out to <strong>Kite Side</strong> in Ras Sudr, Egypt.</p>
        <p>We've received your message and one of our team members will get back to you within <strong>24 hours</strong>.</p>
        <p>In the meantime, feel free to WhatsApp us directly at <strong>+20 11 16407080</strong>.</p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
        <p style="color:#666;font-size:13px">📍 Kite Side · Ras Sudr, Suez Governorate, Egypt</p>
        <p style="color:#666;font-size:13px">📞 +20 11 16407080 · ✉️ Ahmedyehya47@gmail.com</p>
      </div>
    `,
  })
}

export async function sendAdminNotification(submission: any) {
  await transporter.sendMail({
    from: FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `📬 New contact from ${submission.name}: ${submission.subject}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:auto">
        <h3>New contact form submission</h3>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px;font-weight:bold">Name</td><td>${esc(submission.name)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Email</td><td>${esc(submission.email)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Phone</td><td>${submission.phone ? esc(submission.phone) : '—'}</td></tr>
          <tr><td style="padding:6px;font-weight:bold">Subject</td><td>${esc(submission.subject)}</td></tr>
          <tr><td style="padding:6px;font-weight:bold;vertical-align:top">Message</td><td>${esc(submission.message)}</td></tr>
        </table>
        <p><a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/contact">View in admin panel →</a></p>
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
