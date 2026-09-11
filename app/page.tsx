import { AboutSection } from "@/components/home/AboutSection";
import { Hero } from "@/components/home/Hero";
import { ProcessSection } from "@/components/home/ProcessSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <AboutSection />
        <ProcessSection />
        <TrustStrip />
      </main>
      <Footer />
    </>
  );
}
