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

type Config = {
  host: string;
  port: number;
  user: string;
  pass: string;
  to: string;
};

function buildBodies(payload: ContactPayload) {
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

  return { text, html, subject: `New message from ${payload.name}` };
}

/**
 * Cloudflare Workers (the published runtime) has no Node net/dns stack, so
 * nodemailer cannot open an SMTP connection there. worker-mailer speaks SMTP
 * over `cloudflare:sockets`, which works in the Worker.
 */
async function sendViaWorkerMailer(cfg: Config, payload: ContactPayload) {
  const { WorkerMailer } = await import("worker-mailer");
  const { text, html, subject } = buildBodies(payload);

  const attempts: Array<{ port: number; secure: boolean; startTls: boolean }> = [
    { port: cfg.port, secure: cfg.port === 465, startTls: cfg.port !== 465 },
    { port: 587, secure: false, startTls: true },
  ].filter((a, i, arr) => i === 0 || a.port !== arr[0].port);

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      const mailer = await WorkerMailer.connect({
        host: cfg.host,
        port: attempt.port,
        secure: attempt.secure,
        startTls: attempt.startTls,
        credentials: { username: cfg.user, password: cfg.pass },
        authType: ["plain", "login"],
        logLevel: 2,
      } as never);

      await mailer.send({
        from: { name: "Portfolio Contact", email: cfg.user },
        to: { email: cfg.to },
        reply: { name: payload.name, email: payload.email },
        subject,
        text,
        html,
      });
      await mailer.close?.();
      console.log(
        `[contact-mailer] sent via worker-mailer host=${cfg.host} port=${attempt.port}`,
      );
      return { sent: true as const, transport: "worker-mailer" as const };
    } catch (error) {
      lastError = error;
      console.error(
        `[contact-mailer] worker-mailer attempt failed host=${cfg.host} port=${attempt.port}:`,
        error instanceof Error ? `${error.name}: ${error.message}` : String(error),
      );
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/** Used in Node-based environments (local dev / preview sandbox). */
async function sendViaNodemailer(cfg: Config, payload: ContactPayload) {
  const nodemailer = (await import("nodemailer")).default;
  const { text, html, subject } = buildBodies(payload);
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.port === 465,
    auth: { user: cfg.user, pass: cfg.pass },
  });

  const info = await transporter.sendMail({
    from: `"Portfolio Contact" <${cfg.user}>`,
    to: cfg.to,
    replyTo: payload.email,
    subject,
    text,
    html,
  });
  console.log(`[contact-mailer] sent via nodemailer messageId=${info.messageId}`);
  return { sent: true as const, transport: "nodemailer" as const };
}

function isWorkerRuntime() {
  // workerd exposes navigator.userAgent === "Cloudflare-Workers"
  const ua = (globalThis as { navigator?: { userAgent?: string } }).navigator?.userAgent;
  return ua === "Cloudflare-Workers" || typeof (globalThis as { caches?: unknown }).caches !== "undefined" && typeof process.versions?.node === "undefined";
}

export async function sendContactNotification(payload: ContactPayload) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  const to = process.env.CONTACT_NOTIFY_EMAIL;

  if (!host || !user || !pass || !to) {
    console.error(
      `[contact-mailer] Missing SMTP configuration (host=${!!host} user=${!!user} pass=${!!pass} to=${!!to})`,
    );
    return { sent: false, reason: "smtp_not_configured" as const };
  }

  const cfg: Config = { host, port, user, pass, to };
  const worker = isWorkerRuntime();
  console.log(
    `[contact-mailer] sending notification runtime=${worker ? "worker" : "node"} host=${host} port=${port} to=${to}`,
  );

  const order = worker
    ? [sendViaWorkerMailer, sendViaNodemailer]
    : [sendViaNodemailer, sendViaWorkerMailer];

  let lastError: unknown;
  for (const send of order) {
    try {
      return await send(cfg, payload);
    } catch (error) {
      lastError = error;
      console.error(
        "[contact-mailer] transport failed:",
        error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : String(error),
      );
    }
  }

  return {
    sent: false,
    reason: "send_failed" as const,
    error: lastError instanceof Error ? lastError.message : String(lastError),
  };
}
