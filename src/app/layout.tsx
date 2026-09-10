import type { Metadata, Viewport } from "next";
import "@/styles/legacy.css";
import "@/styles/tailwind-admin.css";
import AnalyticsWrapper from "@/utils/AnalyticsWrapper";
import { archivo, inter } from "./fonts";
import Script from "next/script";
import { SiteChrome } from "@/components/SiteChrome";
import { cookies } from "next/headers";
import { sql } from "@/utils/db";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/utils/auth";
import {
  CUSTOMER_SESSION_COOKIE,
  verifyCustomerSessionToken,
} from "@/utils/customer-auth";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Parampara Divya Ayurvedic Udhyog",
  description: "<website_description>",
  keywords: [
    "<search_keyword1>",
    "<search_keyword2>",
    // ..... and so on
  ],
  authors: [{ name: "Parampara Divya Ayurvedic Udhyog" }],
  creator: "<website_name>",
  publisher: "<website_name>",
  metadataBase: new URL("https://www.udhyog.paramparadivyaayurved.com.np"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      {
        url: "/favicon_io/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon_io/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon_io/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/favicon_io/favicon.ico",
        sizes: "32x32",
      },
    ],
    shortcut: "/favicon_io/favicon.ico",
    apple: "/favicon_io/apple-touch-icon.png",
  },
  manifest: "/favicon_io/site.webmanifest",
  openGraph: {
    title: "<website_title>",
    description: "<website_description>",
    type: "website",
    locale: "en_US",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    siteName: "<website_name>",
    images: [
      {
        url: "/images/preview.webp",
        width: 1200,
        height: 630,
        alt: "Parampara Divya Ayurvedic Udhyog Preview",
      },
    ],
  },
  category: "<website_category>",
  classification: "<website_classification>",
  referrer: "origin-when-cross-origin",
  applicationName: "Parampara Divya Ayurvedic Udhyog",
  generator: "Next.js",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const adminSession = adminToken ? await verifySessionToken(adminToken) : null;

  const customerToken = cookieStore.get(CUSTOMER_SESSION_COOKIE)?.value;
  const customerSession = customerToken
    ? await verifyCustomerSessionToken(customerToken)
    : null;

  // Number of distinct products in the cart (cart_items rows), not the
  // sum of their quantities — 1 unit of X and 3 units of Y should read
  // as "2" on the badge, not "4".
  let cartCount = 0;
  if (customerSession) {
    const [{ total }] = await sql`
      select count(*)::int as total
      from cart_items
      where customer_id = ${customerSession.sub}
    `;
    cartCount = total;
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify("structured_data_from_constants"),
          }}
        />
      </head>

      <body
        className={`${archivo.variable} ${inter.variable}`}
        suppressHydrationWarning={true}
      >
        <ToastProvider>
          <SiteChrome
            isAdminLoggedIn={Boolean(adminSession)}
            isCustomerLoggedIn={Boolean(customerSession)}
            customerFirstName={customerSession?.firstName ?? null}
            cartCount={cartCount}
          >
            {children}
          </SiteChrome>
        </ToastProvider>
        <AnalyticsWrapper />

        <Script src="/js/jquery.js" strategy="afterInteractive" />
        <Script src="/js/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/js/select2.min.js" strategy="afterInteractive" />
        <Script src="/js/SmoothScroll.min.js" strategy="afterInteractive" />
        <Script src="/js/flatpicker.js" strategy="afterInteractive" />
        <Script src="/js/vanilla-tilt.min.js" strategy="afterInteractive" />
        <Script src="/js/swiper-bundle.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
