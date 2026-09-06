/**
 * Minimal email stub so the forgot-password flow works end-to-end
 * before you've picked an email provider. In development it just logs
 * the reset link to the console instead of sending anything.
 *
 * TODO: wire up a real provider (Resend, Postmark, SES, etc.) inside
 * this function. The caller — app/api/auth/forgot-password/route.ts —
 * doesn't need to change either way. Example with Resend:
 *
 *   npm install resend
 *
 *   import { Resend } from "resend";
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *
 *   export async function sendPasswordResetEmail(to: string, resetUrl: string) {
 *     await resend.emails.send({
 *       from: "Parampara Divya Ayurvedic <no-reply@yourdomain.com>",
 *       to,
 *       subject: "Reset your password",
 *       html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
 *     });
 *   }
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[mail:dev] Password reset link for ${to}: ${resetUrl}`);
    return;
  }

  // Fail loudly in production rather than silently pretending an email
  // was sent when no provider is configured yet.
  throw new Error(
    "No email provider configured. Implement sendPasswordResetEmail in src/utils/mail.ts."
  );
}
