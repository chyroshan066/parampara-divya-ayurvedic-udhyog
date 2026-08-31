import { Banner } from "@/components/Banner";
import { Care } from "@/components/Care";
import { Header } from "@/components/Header";
import { Preloader } from "@/components/Preloader";
import { TopProducts } from "@/components/TopProducts";

export default function Home() {
  return (
    <>
    <Preloader />
    <Header />
    <Banner/>
    <Care />
    <TopProducts />
    </>
  );
}
