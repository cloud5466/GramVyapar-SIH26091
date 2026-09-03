import { Accessibility, BadgeIndianRupee, Building2, Map } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const modules = [
  { icon: Building2, label: 'Businesses', items: ['Dairy', 'Tailoring', 'Kirana', '+ More'] },
  { icon: Map, label: 'Locations', items: ['Village', 'Block', 'District', 'State', '+ More'] },
  { icon: BadgeIndianRupee, label: 'Financial Products', items: ['Initial Scheme Rules', '+ Additional Schemes'] },
  { icon: Accessibility, label: 'Accessibility', items: ['English', 'Regional Languages', 'Voice', 'Offline Assistance'] },
] as const;

export function ScalabilitySection() {
  return (
    <section className="section-shell relative overflow-hidden">
      <div className="absolute left-[7%] top-[15%] -z-10 size-80 rounded-full bg-[#008CFF]/[0.04] blur-[100px]" />
      <div className="section-container">
        <div className="grid gap-12 lg:grid-cols-[.76fr_1.24fr] lg:items-center">
          <div><SectionHeader eyebrow="Modular foundation" title="Built Small. Designed to Scale." description="The hackathon prototype demonstrates the architecture with limited business categories and locations. It does not pretend to offer complete nationwide coverage." /><div className="mt-8 flex items-center gap-3 text-sm text-[#64748B]"><span className="h-px w-10 bg-[#008CFF]" />Prototype scope is explicit by design</div></div>
          <div className="grid gap-4 sm:grid-cols-2">{modules.map(({ icon: Icon, label, items }) => <article key={label} className="premium-card p-6"><div className="flex items-center gap-3"><div className="icon-box"><Icon className="size-5" /></div><h3 className="text-sm font-semibold tracking-[-0.01em] text-white">{label}</h3></div><div className="mt-6 flex flex-wrap gap-2">{items.map((item, index) => <span key={item} className={`rounded-lg border px-3 py-2 text-xs ${index === items.length - 1 && item.startsWith('+') ? 'border-dashed border-[#008CFF]/25 text-[#00B7FF]' : 'border-white/[0.06] bg-[#07111F] text-[#94A3B8]'}`}>{item}</span>)}</div></article>)}</div>
        </div>
      </div>
    </section>
  );
}
