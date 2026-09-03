import { ArchitectureSection } from '@/components/ArchitectureSection';
import { CapabilityGrid } from '@/components/CapabilityGrid';
import { ComparisonSection } from '@/components/ComparisonSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { ImpactSection } from '@/components/ImpactSection';
import { Navbar } from '@/components/Navbar';
import { ProblemSection } from '@/components/ProblemSection';
import { PrototypePreview } from '@/components/PrototypePreview';
import { ScalabilitySection } from '@/components/ScalabilitySection';

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#030712] text-[#F8FAFC]">
      <Navbar />
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <CapabilityGrid />
      <PrototypePreview />
      <ArchitectureSection />
      <ComparisonSection />
      <ImpactSection />
      <ScalabilitySection />
      <CTASection />
      <Footer />
    </main>
  );
}
