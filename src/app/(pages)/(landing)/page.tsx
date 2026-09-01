import { About } from "@/components/About";
import { Achievement } from "@/components/Achievement";
import { Banner } from "@/components/Banner";
import { Care } from "@/components/Care";
import { Team } from "@/components/Team";
import { Testimonial } from "@/components/Testimonial";
import { TopProducts } from "@/components/TopProducts";
import { Why } from "@/components/Why";

export default function Home() {
  return (
    <>
    <Banner/>
    <Care />
    <TopProducts />
    <About />
    <Achievement />
    <Why />
    <Testimonial />
    <Team />
    </>
  );
}
