import { About } from "@/components/About";
import { Achievement } from "@/components/Achievement";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Why } from "@/components/Why";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Parampara Ayurvedic Clinic in Boudha, Kathmandu",
  description: "Learn about Parampara Ayurvedic Clinic in Pipalbot, Boudha. Discover our legacy of authentic Ayurvedic care, expert doctors, achievements, and commitment to holistic health in Kathmandu.",
  keywords: [
    "about parampara ayurvedic clinic",
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
    "ayurvedic doctors in boudha kathmandu",
    "ayurvedic doctors in chabahil kathmandu",
    "ayurvedic doctors in gokarneshwor kathmandu",
    "ayurvedic doctors in devkota sadak kathmandu",
    "authentic ayurveda nepal",
  ],
  authors: [{ name: "Parampara Ayurvedic Clinic" }],
  creator: "Parampara Ayurvedic Clinic",
  publisher: "Parampara Ayurvedic Clinic",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us | Parampara Ayurvedic Clinic",
    description: "Discover our journey, achievements, and why patients trust Parampara Ayurvedic Clinic for traditional healing and holistic wellness in Boudha, Kathmandu.",
    type: "website",
    locale: "en_US",
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    siteName: "Parampara Ayurvedic Clinic",
    images: [
      {
        url: "/images/preview.webp",
        width: 1200,
        height: 630,
        alt: "About Parampara Ayurvedic Clinic",
      },
    ],
  },
};

export default function AboutPage() {
  return <>
  <Breadcrumb />
  <About marginTopValue="100px" />
  <WhyChooseUs />
  <Achievement />
  <Why />
  </>;
}
