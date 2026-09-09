/**
 * Transactional email sending for Parampara Divya Ayurved Udhyog.
 *
 * Uses a plain fetch() call against Resend's REST API directly, rather
 * than the `resend` npm SDK — the SDK's internal fetch call was
 * consistently failing with a network-level "Unable to fetch data. The
 * request could not be resolved." error (statusCode: null) on Vercel,
 * even though the same request succeeds fine as a raw HTTPS call.
 *
 * Every sender below fails silently (logs only) on purpose — a flaky
 * email provider should never turn into a 500 for the visitor, since
 * whatever triggered the email (signup, login, order, contact form,
 * password reset) has already been safely written to the database by
 * the time this is called.
 *
 * Env vars used:
 *   RESEND_API_KEY   - required, Resend API key
 *   NOTIFY_EMAIL     - required for admin-facing emails, clinic/shop inbox
 *   FROM_EMAIL       - optional, e.g. "Parampara Divya Ayurved <no-reply@yourdomain.com>"
 *                       Resend's shared "onboarding@resend.dev" sender works
 *                       immediately with no domain setup, but only delivers to
 *                       the email you signed up with — fine for testing. Once
 *                       your own domain is verified in the Resend dashboard,
 *                       set this to send from your own domain to any address.
 */

// ---------------------------------------------------------------------------
// Brand tokens — pulled from style.css (:root) so these emails actually look
// like the rest of the site instead of a generic template.
// ---------------------------------------------------------------------------
const BRAND = {
  primary: "#CD8973", // --ayur-primary-color
  primaryDark: "#a16957", // decorative darker shade used alongside primary on-site
  headingColor: "#000000", // --ayur-heading-color
  darkText: "#222222", // --ayur-banheading-color
  bodyText: "#797979", // --ayur-para-color
  mutedText: "#ABABAB", // --ayur-text-color
  bgSoft: "#FCF9F8", // --ayur-testpara-bgcolor
  bgSofter: "#F6F1ED", // --ayur-primary-lightcolor
  border: "#FFEBE4", // --ayur-border-color
  footerBg: "#220F08", // --ayur-footer-bg
  footerText: "#E4D4CF", // --ayur-footertext-color
  white: "#FFFFFF",
};

// Archivo/Inter are the site's fonts (Google Fonts) — most email clients
// strip @import/<link>, so they fall back to the same-shape system stack.
const HEADING_FONT = "'Archivo', Helvetica, Arial, sans-serif";
const BODY_FONT = "'Inter', Helvetica, Arial, sans-serif";

const BRAND_NAME = "Parampara Divya Ayurved";

// ---------------------------------------------------------------------------
// Core send primitive — shared retry logic used by every email below.
// ---------------------------------------------------------------------------
type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
};

// Resend occasionally resets the connection before the TLS handshake
// finishes (a stale/reused keep-alive socket on the platform side, not a
// real error from Resend) — a fresh attempt on a new connection almost
// always succeeds, so retry once more before giving up rather than
// dropping the email entirely.
const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [300, 1000];

async function sendResendEmail({ to, subject, html }: SendArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(`sendResendEmail: RESEND_API_KEY is not set — skipping "${subject}".`);
    return;
  }

  const from = process.env.FROM_EMAIL || "Parampara Divya Ayurved <onboarding@resend.dev>";

  const body = JSON.stringify({ from, to, subject, html });

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body,
      });

      if (!res.ok) {
        const responseBody = await res.text().catch(() => "<no body>");
        console.error(
          `sendResendEmail: Resend API returned ${res.status} ${res.statusText} for "${subject}":`,
          responseBody
        );
        // A non-ok response is a real answer from Resend (bad request,
        // auth issue, etc.) — retrying won't change that, so stop here.
        return;
      }

      return; // success
    } catch (err) {
      const isLastAttempt = attempt === MAX_ATTEMPTS;
      console.error(
        `sendResendEmail: attempt ${attempt}/${MAX_ATTEMPTS} failed to send "${subject}":`,
        err
      );
      if (isLastAttempt) return;
      await new Promise((resolve) => setTimeout(resolve, BACKOFF_MS[attempt - 1]));
    }
  }
}

function requireAdminInbox(context: string): string | null {
  const notifyTo = process.env.NOTIFY_EMAIL;
  if (!notifyTo) {
    console.error(`${context}: NOTIFY_EMAIL is not set — skipping admin notification.`);
    return null;
  }
  return notifyTo;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ---------------------------------------------------------------------------
// Shared layout — table-based + inline styles, brand-matched. Email clients
// (Gmail, Outlook, Apple Mail) don't reliably support flexbox/grid or <style>
// blocks, so everything is deliberately old-school.
// ---------------------------------------------------------------------------
function detailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid ${BRAND.border}; width: 130px; vertical-align: top;">
        <span style="font-family: ${BODY_FONT}; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${BRAND.mutedText};">${label}</span>
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid ${BRAND.border}; vertical-align: top;">
        <span style="font-family: ${BODY_FONT}; font-size: 15px; color: ${BRAND.darkText}; line-height: 1.5;">${value}</span>
      </td>
    </tr>`;
}

function detailTable(rows: string) {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.bgSoft}; border: 1px solid ${BRAND.border}; border-radius: 14px; padding: 4px 20px;">
      ${rows}
    </table>`;
}

type LayoutArgs = {
  badgeText: string;
  heading: string;
  intro: string;
  bodyHtml: string;
  cta?: { label: string; url: string };
};

function renderEmailLayout({ badgeText, heading, intro, bodyHtml, cta }: LayoutArgs) {
  return `
<!DOCTYPE html>
<html lang="en">
  <body style="margin: 0; padding: 0; background-color: ${BRAND.bgSofter};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: ${BRAND.bgSofter}; padding: 32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color: ${BRAND.white}; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 18px rgba(34, 15, 8, 0.10);">

            <!-- Header -->
            <tr>
              <td style="background-color: ${BRAND.primary}; padding: 28px 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="font-family: ${HEADING_FONT}; font-size: 19px; font-weight: 700; color: ${BRAND.white};">${BRAND_NAME}</span>
                    </td>
                    <td align="right">
                      <span style="font-family: ${BODY_FONT}; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: ${BRAND.primaryDark}; background-color: ${BRAND.white}; padding: 6px 12px; border-radius: 999px;">${escapeHtml(badgeText)}</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Accent strip -->
            <tr>
              <td style="height: 6px; background-color: ${BRAND.border};"></td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="padding: 32px 32px 8px 32px;">
                <span style="font-family: ${HEADING_FONT}; font-size: 22px; font-weight: 700; color: ${BRAND.headingColor};">${escapeHtml(heading)}</span>
                <br />
                <span style="font-family: ${BODY_FONT}; font-size: 14px; color: ${BRAND.bodyText};">${intro}</span>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 20px 32px 8px 32px;">
                ${bodyHtml}
              </td>
            </tr>

            ${
              cta
                ? `
            <!-- CTA -->
            <tr>
              <td style="padding: 28px 32px 32px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-radius: 22px; background-color: ${BRAND.primary};">
                      <a href="${cta.url}" style="display: inline-block; padding: 12px 26px; font-family: ${BODY_FONT}; font-size: 14px; font-weight: 500; color: ${BRAND.white}; text-decoration: none;">${escapeHtml(cta.label)}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>`
                : `<tr><td style="height: 12px;"></td></tr>`
            }

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 32px; background-color: ${BRAND.footerBg};">
                <span style="display: block; font-family: ${HEADING_FONT}; font-size: 14px; font-weight: 700; color: ${BRAND.white}; padding-bottom: 6px;">${BRAND_NAME} Udhyog</span>
                <span style="display: block; font-family: ${BODY_FONT}; font-size: 12px; line-height: 1.6; color: ${BRAND.footerText};">
                  Manufacturing Office: Meghauli, Chitwan, Bharatpur<br />
                  Contact Office: Pipalbot, Boudha, Kathmandu<br />
                  9713164487 / 01-4917152 / 9803073093 &nbsp;•&nbsp; paramparadivyaayurvedic@gmail.com
                </span>
                <span style="display: block; font-family: ${BODY_FONT}; font-size: 11px; color: ${BRAND.footerText}; opacity: 0.7; padding-top: 14px;">This is an automated message from the Parampara Divya Ayurved website.</span>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

// ---------------------------------------------------------------------------
// 1. Registration — customer confirmation + admin notification
// ---------------------------------------------------------------------------
type NewCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
};

export async function sendCustomerWelcomeEmail(customer: NewCustomer) {
  const html = renderEmailLayout({
    badgeText: "Welcome",
    heading: `Welcome, ${escapeHtml(customer.firstName)}!`,
    intro: "Your account with Parampara Divya Ayurved is ready to go.",
    bodyHtml: `
      <span style="font-family: ${BODY_FONT}; font-size: 15px; color: ${BRAND.darkText}; line-height: 1.6;">
        Thanks for creating an account, ${escapeHtml(customer.firstName)}. You can now sign in any time to
        browse our herb products, track your orders, and manage your details.
      </span>`,
    cta: { label: "Start Shopping", url: process.env.NEXT_PUBLIC_BASE_URL || "https://www.udhyog.paramparadivyaayurved.com.np/shop" },
  });

  await sendResendEmail({
    to: customer.email,
    subject: `Welcome to ${BRAND_NAME}`,
    html,
  });
}

export async function sendAdminNewCustomerEmail(customer: NewCustomer) {
  const notifyTo = requireAdminInbox("sendAdminNewCustomerEmail");
  if (!notifyTo) return;

  const rows = [
    detailRow("Name", escapeHtml(`${customer.firstName} ${customer.lastName}`)),
    detailRow("Email", `<a href="mailto:${escapeHtml(customer.email)}" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 600;">${escapeHtml(customer.email)}</a>`),
    customer.phone
      ? detailRow("Phone", `<a href="tel:${escapeHtml(customer.phone)}" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 600;">${escapeHtml(customer.phone)}</a>`)
      : "",
    customer.address ? detailRow("Address", escapeHtml(customer.address)) : "",
  ].join("");

  const html = renderEmailLayout({
    badgeText: "New Customer",
    heading: "A new customer just signed up",
    intro: "New registration on the website.",
    bodyHtml: detailTable(rows),
  });

  await sendResendEmail({
    to: notifyTo,
    subject: `New customer registered — ${customer.firstName} ${customer.lastName}`,
    html,
  });
}

// ---------------------------------------------------------------------------
// 2. Login — simple welcome-back note to the customer
//    (deliberately lightweight: no device/IP/security details, just a
//    friendly one-line note per sign-in)
// ---------------------------------------------------------------------------
type ReturningCustomer = {
  firstName: string;
  email: string;
};

export async function sendWelcomeBackEmail(customer: ReturningCustomer) {
  const html = renderEmailLayout({
    badgeText: "Signed In",
    heading: `Welcome back, ${escapeHtml(customer.firstName)}!`,
    intro: "You just signed in to your Parampara Divya Ayurved account.",
    bodyHtml: `
      <span style="font-family: ${BODY_FONT}; font-size: 15px; color: ${BRAND.darkText}; line-height: 1.6;">
        Good to see you again. If this wasn't you, please reset your password right away.
      </span>`,
  });

  await sendResendEmail({
    to: customer.email,
    subject: `Welcome back, ${customer.firstName}`,
    html,
  });
}

// ---------------------------------------------------------------------------
// 3. Order placed — admin notification only
//    NOTE: no order-creation route was provided yet, so this is ready to
//    call but not yet wired to a call site. Shape it to whatever your
//    checkout/create-order route has on hand (adjust fields as needed).
// ---------------------------------------------------------------------------
type NewOrderItem = {
  productName: string;
  unitPrice: number;
  quantity: number;
};

type NewOrder = {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: NewOrderItem[];
  total: number;
};

export async function sendAdminNewOrderEmail(order: NewOrder) {
  const notifyTo = requireAdminInbox("sendAdminNewOrderEmail");
  if (!notifyTo) return;

  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid ${BRAND.border}; font-family: ${BODY_FONT}; font-size: 14px; color: ${BRAND.darkText};">${escapeHtml(item.productName)} &times; ${item.quantity}</td>
        <td style="padding: 10px 0; border-bottom: 1px solid ${BRAND.border}; font-family: ${BODY_FONT}; font-size: 14px; color: ${BRAND.darkText}; text-align: right;">Rs. ${(item.unitPrice * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const rows = [
    detailRow("Order ID", escapeHtml(order.orderId)),
    detailRow("Customer", escapeHtml(order.customerName)),
    detailRow("Email", `<a href="mailto:${escapeHtml(order.customerEmail)}" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 600;">${escapeHtml(order.customerEmail)}</a>`),
  ].join("");

  const html = renderEmailLayout({
    badgeText: "New Order",
    heading: "A new order was placed",
    intro: "Someone just checked out on the website.",
    bodyHtml: `
      ${detailTable(rows)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
        ${itemRows}
        <tr>
          <td style="padding: 14px 0 0; font-family: ${BODY_FONT}; font-size: 15px; font-weight: 700; color: ${BRAND.headingColor};">Total</td>
          <td style="padding: 14px 0 0; font-family: ${BODY_FONT}; font-size: 15px; font-weight: 700; color: ${BRAND.headingColor}; text-align: right;">Rs. ${order.total.toFixed(2)}</td>
        </tr>
      </table>`,
  });

  await sendResendEmail({
    to: notifyTo,
    subject: `New order — ${order.customerName} (${order.orderId})`,
    html,
  });
}

// ---------------------------------------------------------------------------
// 4. Forgot password — reset link to the customer
//    Same export name/signature as before, so
//    app/api/auth/forgot-password/route.ts needs no changes.
// ---------------------------------------------------------------------------
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const html = renderEmailLayout({
    badgeText: "Password Reset",
    heading: "Reset your password",
    intro: "We received a request to reset your password.",
    bodyHtml: `
      <span style="font-family: ${BODY_FONT}; font-size: 15px; color: ${BRAND.darkText}; line-height: 1.6;">
        Click the button below to choose a new password. This link expires in 1 hour. If you didn't
        request this, you can safely ignore this email.
      </span>`,
    cta: { label: "Reset Password", url: resetUrl },
  });

  await sendResendEmail({
    to,
    subject: "Reset your password",
    html,
  });
}

// ---------------------------------------------------------------------------
// 5. Contact form — admin notification only
// ---------------------------------------------------------------------------
type ContactMessage = {
  firstName: string;
  lastName: string;
  email: string;
  subject?: string;
  message: string;
};

export async function sendContactAdminEmail(contact: ContactMessage) {
  const notifyTo = requireAdminInbox("sendContactAdminEmail");
  if (!notifyTo) return;

  const rows = [
    detailRow("Name", escapeHtml(`${contact.firstName} ${contact.lastName}`)),
    detailRow("Email", `<a href="mailto:${escapeHtml(contact.email)}" style="color: ${BRAND.primary}; text-decoration: none; font-weight: 600;">${escapeHtml(contact.email)}</a>`),
    contact.subject ? detailRow("Subject", escapeHtml(contact.subject)) : "",
  ].join("");

  const html = renderEmailLayout({
    badgeText: "Contact Form",
    heading: "New contact message",
    intro: "Someone just submitted the contact form on the website.",
    bodyHtml: `
      ${detailTable(rows)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; background-color: ${BRAND.bgSoft}; border: 1px solid ${BRAND.border}; border-radius: 14px;">
        <tr>
          <td style="padding: 16px 20px;">
            <span style="font-family: ${BODY_FONT}; font-size: 15px; color: ${BRAND.darkText}; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(contact.message)}</span>
          </td>
        </tr>
      </table>`,
  });

  await sendResendEmail({
    to: notifyTo,
    subject: `New contact message — ${contact.firstName} ${contact.lastName}`,
    html,
  });
}