import AboutApp from "@/modules/landing/components/AboutApp";
import CTA from "@/modules/landing/components/CTA";
import Footer from "@/modules/landing/components/Footer";
import Header from "@/modules/landing/components/Header";
import Hero from "@/modules/landing/components/Hero";
import Pricing from "@/modules/landing/components/Pricing";

const Page = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <Hero />
        <AboutApp />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default Page;
