import { ArrowDown, BrainCircuit, Calculator, Database, LayoutDashboard, MapPin, ShieldCheck, UserRound } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const layers = [
  { title: 'User Input', icon: UserRound, items: ['Location', 'Business', 'Capital'] },
  { title: 'Data & Evidence', icon: Database, items: ['Population', 'Mapped Businesses', 'Government Data', 'Entrepreneur Input'] },
  { title: 'Decision Engines', icon: Calculator, items: ['Viability Engine', 'Financial Rules Engine'] },
  { title: 'AI Advisory', icon: BrainCircuit, items: ['SWOT', 'Risks', 'Explanation', 'Next Actions'] },
  { title: 'Entrepreneur Dashboard', icon: LayoutDashboard, items: ['Clear decision', 'Action plan'] },
] as const;

export function ArchitectureSection() {
  return (
    <section id="architecture" className="section-shell border-y border-white/[0.045] bg-[#050B15]">
      <div className="section-container">
        <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <SectionHeader eyebrow="System architecture" title="Evidence In. Auditable Decisions Out." description="The architecture keeps evidence collection, deterministic calculation and AI interpretation clearly separated." />
            <div className="mt-9 rounded-2xl border border-[#008CFF]/20 bg-[#008CFF]/[0.055] p-6">
              <ShieldCheck className="size-6 text-[#00B7FF]" />
              <p className="mt-5 text-xl font-semibold tracking-[-0.03em] text-white">AI does not calculate critical financial values.</p>
              <p className="mt-3 text-sm leading-6 text-[#94A3B8]">Financial calculations remain deterministic and auditable. AI interprets the evidence and explains the decision in accessible language.</p>
            </div>
            <div className="mt-5 flex items-center gap-3 text-sm text-[#64748B]"><MapPin className="size-4 text-[#008CFF]" />Built for a hyper-local evidence boundary</div>
          </div>

          <div className="rounded-[24px] border border-[#008CFF]/20 bg-[#07111F] p-4 sm:p-6">
            {layers.map(({ title, icon: Icon, items }, index) => (
              <div key={title}>
                <div className={`grid gap-4 rounded-2xl border p-5 sm:grid-cols-[180px_1fr] sm:items-center ${index === 2 ? 'border-[#008CFF]/35 bg-[#008CFF]/[0.065]' : 'border-white/[0.06] bg-[#0B1728]'}`}>
                  <div className="flex items-center gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#008CFF]/10 text-[#00B7FF]"><Icon className="size-[18px]" /></div><p className="text-sm font-semibold text-white">{title}</p></div>
                  <div className="flex flex-wrap gap-2">{items.map((item) => <span key={item} className="rounded-lg border border-white/[0.06] bg-black/10 px-2.5 py-1.5 text-xs text-[#94A3B8]">{item}</span>)}</div>
                </div>
                {index < layers.length - 1 && <div className="flex h-10 items-center justify-center"><ArrowDown className="size-4 text-[#008CFF]" /></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
