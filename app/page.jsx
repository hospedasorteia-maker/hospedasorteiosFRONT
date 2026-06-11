import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Plans from "@/components/Plans";
import Support from "@/components/Support";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";

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
