import { Breadcrumb } from "@/components/Breadcrumb";
import { Contact } from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Parampara Ayurvedic Clinic in Boudha, Kathmandu",
  description: "Get in touch with Parampara Ayurvedic Clinic located in Pipalbot, Boudha, Kathmandu. Book an appointment for Panchakarma, health consultations, and Ayurvedic remedies.",
  keywords: [
    "contact parampara ayurvedic clinic",
    "ayurvedic clinic in kathmandu",
    "best ayurvedic clinic in kathmandu",
    "ayurvedic clinic in boudha",
    "best ayurvedic clinic in boudha",
    "ayurvedic clinic in chabahil",
    "best ayurvedic clinic in chabahil",
    "ayurvedic clinic in gokarneshwor",
    "best ayurvedic clinic in gokarneshwor",
    "ayurvedic clinic in devkota sadak",
    "best ayurvedic clinic in devkota sadak",
    "ayurvedic doctor appointment kathmandu",
    "ayurvedic doctor appointment boudha",
    "ayurvedic doctor appointment chabahil",
    "ayurvedic doctor appointment gokarneshwor",
    "ayurvedic doctor appointment devkota sadak",
    "ayurvedic consultation kathmandu",
    "ayurvedic consultation boudha",
    "ayurvedic consultation chabahil",
    "ayurvedic consultation gokarneshwor",
    "ayurvedic consultation devkota sadak",
  ],
  authors: [{ name: "Parampara Ayurvedic Clinic" }],
  creator: "Parampara Ayurvedic Clinic",
  publisher: "Parampara Ayurvedic Clinic",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us | Parampara Ayurvedic Clinic",
    description: "Visit or contact Parampara Ayurvedic Clinic in Pipalbot, Boudha. Reach out to schedule your Ayurvedic consultation or enquire about our holistic treatments.",
    type: "website",
    locale: "en_US",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    siteName: "Parampara Ayurvedic Clinic",
    images: [
      {
        url: "/images/preview.webp",
        width: 1200,
        height: 630,
        alt: "Contact Parampara Ayurvedic Clinic",
      },
    ],
  },
};

export default function ContactPage() {
  return <>
  <Breadcrumb />
  <Contact />
  </>;
}
