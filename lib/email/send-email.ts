import "server-only";
import { resend, EMAIL_FROM } from "./resend";

interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail({
  to,
  subject,
  react,
}: SendEmailOptions) {
  const { data, error } = await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject,
    react,
  });

  if (error) {
    console.error("SpeakUp email failed:", error);
    throw new Error("Failed to send email");
  }

  return data;
}