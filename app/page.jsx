import Navbar from "@/components/public/landing/Navbar";
import Hero from "@/components/public/landing/Hero";
import Stats from "@/components/public/landing/Stats";
import Features from "@/components/public/landing/Features";
import HowItWorks from "@/components/public/landing/HowItWorks";
import Plans from "@/components/public/landing/Plans";
import Support from "@/components/public/landing/Support";
import CtaFinal from "@/components/public/landing/CtaFinal";
import Footer from "@/components/public/landing/Footer";
import ScrollEffects from "@/components/public/landing/ScrollEffects";

export default function Home() {
  return (
    <>
      <ScrollEffects />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Plans />
        <Support />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
