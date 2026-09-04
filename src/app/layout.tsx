import type { Metadata, Viewport } from "next";
import "@/styles/legacy.css";
import "@/styles/tailwind-admin.css";
import AnalyticsWrapper from "@/utils/AnalyticsWrapper";
import { archivo, inter } from "./fonts";
import Script from "next/script";
import { SiteChrome } from "@/components/SiteChrome";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/utils/auth";

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
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const isAdminLoggedIn = token ? Boolean(await verifySessionToken(token)) : false;

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
        <SiteChrome isAdminLoggedIn={isAdminLoggedIn}>
        {children}
        </SiteChrome>
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