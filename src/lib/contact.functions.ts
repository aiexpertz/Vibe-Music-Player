import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(5000),
});

export const notifyContactMessage = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    const { sendContactNotification } = await import("./contact-mailer.server");
    try {
      return await sendContactNotification(data);
    } catch (error) {
      console.error("[notifyContactMessage] send failed", error);
      return { sent: false, reason: "send_failed" as const };
    }
  });
