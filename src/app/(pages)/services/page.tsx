import { Breadcrumb } from "@/components/Breadcrumb";
import { Testimonial } from "@/components/Testimonial";
import { Why } from "@/components/Why";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Ayurvedic Services | Panchakarma & Treatments in Boudha, Kathmandu",
  description: "Explore traditional Ayurvedic treatments at Parampara Ayurvedic Clinic in Pipalbot, Boudha. We offer authentic Panchakarma, natural therapies, and health consultations in Kathmandu.",
  keywords: [
    "ayurvedic services kathmandu",
    "ayurvedic services boudha",
    "ayurvedic services chabahil",
    "ayurvedic services gokarneshwor",
    "ayurvedic services devkota sadak",
    "panchakarma treatment kathmandu",
    "panchakarma treatment boudha",
    "panchakarma treatment chabahil",
    "panchakarma treatment gokarneshwor",
    "panchakarma treatment devkota sadak",
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
    "ayurvedic therapy kathmandu",
    "ayurvedic therapy boudha",
    "ayurvedic therapy chabahil",
    "ayurvedic therapy gokarneshwor",
    "ayurvedic therapy devkota sadak",
  ],
  authors: [{ name: "Parampara Ayurvedic Clinic" }],
  creator: "Parampara Ayurvedic Clinic",
  publisher: "Parampara Ayurvedic Clinic",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Ayurvedic Services & Treatments | Parampara Ayurvedic Clinic",
    description: "Discover holistic Panchakarma therapies, wellness treatments, and expert consultation services at Parampara Ayurvedic Clinic in Boudha, Kathmandu.",
    type: "website",
    locale: "en_US",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
    siteName: "Parampara Ayurvedic Clinic",
    images: [
      {
        url: "/images/preview.webp",
        width: 1200,
        height: 630,
        alt: "Ayurvedic Services at Parampara Ayurvedic Clinic",
      },
    ],
  },
};

export default function ServicesPage() {
  return <>
  <Breadcrumb />
  <Why />
  <Testimonial />
  </>;
}
