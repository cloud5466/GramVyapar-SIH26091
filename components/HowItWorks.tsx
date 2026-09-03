import { BadgeIndianRupee, BrainCircuit, BriefcaseBusiness, DatabaseZap, MapPin, Route, WalletCards } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const inputs = [
  { label: 'Location', value: 'Where will it operate?', icon: MapPin },
  { label: 'Business idea', value: 'What will be built?', icon: BriefcaseBusiness },
  { label: 'Available capital', value: 'What can they invest?', icon: WalletCards },
] as const;

const stages = [
  { label: 'Local evidence', detail: 'Demand + competition', icon: DatabaseZap },
  { label: 'Viability', detail: 'Opportunity + risk', icon: Route },
  { label: 'Financial structure', detail: 'Cost + capital gap', icon: BadgeIndianRupee },
  { label: 'AI advisory', detail: 'Explain + recommend', icon: BrainCircuit },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-shell relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -z-10 h-80 w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#008CFF]/[0.045] blur-[100px]" />
      <div className="section-container">
        <SectionHeader eyebrow="Decision flow" title="Three Inputs. One Actionable Decision." align="center" />

        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {inputs.map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl border border-[#008CFF]/15 bg-[#07111F] p-5">
              <div className="icon-box shrink-0"><Icon className="size-5" /></div>
              <div><p className="text-xs font-bold tracking-[0.12em] text-[#00B7FF] uppercase">{label}</p><p className="mt-1 text-sm text-[#94A3B8]">{value}</p></div>
            </div>
          ))}
        </div>

        <div className="relative mx-auto my-7 h-14 max-w-[80%]" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#008CFF]/20 to-[#008CFF]" />
          <div className="connector-pulse absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full bg-[#22D3EE] shadow-[0_0_16px_#22D3EE]" />
        </div>

        <div className="overflow-hidden rounded-[22px] border border-[#008CFF]/20 bg-[#07111F] p-4 shadow-[0_20px_70px_rgba(0,0,0,.24)] sm:p-6">
          <div className="grid gap-3 md:grid-cols-4">
            {stages.map(({ label, detail, icon: Icon }, index) => (
              <div key={label} className="relative rounded-2xl border border-white/[0.055] bg-[#0B1728] p-5">
                <div className="flex items-center justify-between"><Icon className="size-5 text-[#00B7FF]" /><span className="font-mono text-[10px] text-[#475569]">0{index + 1}</span></div>
                <p className="mt-7 text-sm font-semibold tracking-[-0.01em] text-[#F8FAFC]">{label}</p>
                <p className="mt-1 text-xs text-[#64748B]">{detail}</p>
                {index < stages.length - 1 && <span className="absolute -right-2 top-1/2 z-10 hidden size-4 -translate-y-1/2 rotate-45 border-r border-t border-[#008CFF]/40 bg-[#07111F] md:block" />}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-3 rounded-xl border border-[#34D399]/15 bg-[#34D399]/[0.05] px-5 py-4 text-center">
            <span className="size-2 rounded-full bg-[#34D399] shadow-[0_0_12px_rgba(52,211,153,.45)]" />
            <span className="text-xs font-bold tracking-[0.16em] text-[#6EE7B7] uppercase">Action Plan</span>
          </div>
        </div>
      </div>
    </section>
  );
}
