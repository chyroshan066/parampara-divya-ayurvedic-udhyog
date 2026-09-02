import { About } from "@/components/About";
import { Achievement } from "@/components/Achievement";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Why } from "@/components/Why";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export default function AboutPage() {
  return <>
  <Breadcrumb />
  <About marginTopValue="100px" />
  <WhyChooseUs />
  <Achievement />
  <Why />
  </>;
}
