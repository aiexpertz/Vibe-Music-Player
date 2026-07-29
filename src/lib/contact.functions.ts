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
    console.log(`[notifyContactMessage] received submission from ${data.email}`);
    const { sendContactNotification } = await import("./contact-mailer.server");
    try {
      const result = await sendContactNotification(data);
      console.log("[notifyContactMessage] result:", JSON.stringify(result));
      return result;
    } catch (error) {
      console.error(
        "[notifyContactMessage] send failed:",
        error instanceof Error ? `${error.name}: ${error.message}\n${error.stack}` : String(error),
      );
      return {
        sent: false,
        reason: "send_failed" as const,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  });

