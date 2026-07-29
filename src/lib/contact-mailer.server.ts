import process from "node:process";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactNotification(payload: ContactPayload) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const to = process.env.CONTACT_NOTIFY_EMAIL;

  if (!host || !user || !pass || !to) {
    console.error("[contact-mailer] Missing SMTP configuration");
    return { sent: false, reason: "smtp_not_configured" as const };
  }

  const nodemailer = (await import("nodemailer")).default;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const text = [
    `New contact form message`,
    ``,
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    ``,
    payload.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2 style="margin:0 0 12px">New contact form message</h2>
      <p style="margin:0"><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
      <p style="margin:0"><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
      <hr style="border:none;border-top:1px solid #ddd;margin:16px 0" />
      <p style="white-space:pre-wrap;margin:0">${escapeHtml(payload.message)}</p>
    </div>`;

  await transporter.sendMail({
    from: `"Portfolio Contact" <${user}>`,
    to,
    replyTo: payload.email,
    subject: `New message from ${payload.name}`,
    text,
    html,
  });

  return { sent: true as const };
}
