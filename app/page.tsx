import { ArchitectureSection } from '@/components/ArchitectureSection';
import { CapabilityGrid } from '@/components/CapabilityGrid';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Navbar } from '@/components/Navbar';
import { ProblemSection } from '@/components/ProblemSection';
import { PrototypePreview } from '@/components/PrototypePreview';
import { TrustSection } from '@/components/TrustSection';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-[#172033]">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <CapabilityGrid />
      <PrototypePreview />
      <TrustSection />
      <ArchitectureSection />
      <CTASection />
      <Footer />
    </main>
  );
}
