import { AudioLines, BadgeIndianRupee, BrainCircuit, ChartNoAxesCombined, Check, Radar, ShieldCheck } from 'lucide-react';
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress';
import { SectionHeader } from './SectionHeader';

function MiniScore({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs"><span className="text-[#94A3B8]">{label}</span><span className="font-medium text-[#CBD5E1]">{value}/{max}</span></div>
      <Progress value={(value / max) * 100} className="gap-0"><ProgressTrack className="h-1.5 bg-white/[0.06]"><ProgressIndicator className="bg-gradient-to-r from-[#008CFF] to-[#22D3EE]" /></ProgressTrack></Progress>
    </div>
  );
}

const confidence = [
  ['Population', 'High confidence', 'bg-[#34D399]'],
  ['Competition', 'Medium confidence', 'bg-[#FBBF24]'],
  ['Local pricing', 'User verified', 'bg-[#00B7FF]'],
] as const;

export function CapabilityGrid() {
  return (
    <section id="capabilities" className="section-shell border-y border-white/[0.045] bg-[#050B15]">
      <div className="section-container">
        <SectionHeader eyebrow="Core capabilities" title="Intelligence Built Around the Entrepreneur." description="Every output traces back to evidence, structured evaluation and practical next steps—not a free-form answer." />

        <div className="mt-12 grid auto-rows-auto gap-4 lg:grid-cols-12">
          <article className="premium-card relative overflow-hidden p-7 lg:col-span-7">
            <div className="absolute right-0 top-0 h-48 w-48 bg-[#008CFF]/[0.065] blur-3xl" />
            <div className="relative flex items-start justify-between"><div className="icon-box"><Radar className="size-5" /></div><span className="feature-index">01</span></div>
            <div className="relative mt-10 grid gap-8 sm:grid-cols-[1fr_1.15fr] sm:items-end">
              <div><h3 className="feature-title">Hyper-Local Market Intelligence</h3><p className="feature-copy">Understand the real opportunity surrounding a proposed business—not a generic national average.</p></div>
              <div className="space-y-3">
                {['Potential customer reach', 'Mapped competition', 'Location-specific indicators'].map((item) => <div key={item} className="data-row"><Check className="size-3.5 text-[#22D3EE]" />{item}</div>)}
              </div>
            </div>
          </article>

          <article className="premium-card p-7 lg:col-span-5 lg:row-span-2">
            <div className="flex items-start justify-between"><div className="icon-box"><ChartNoAxesCombined className="size-5" /></div><span className="feature-index">02</span></div>
            <h3 className="feature-title mt-9">Explainable Viability</h3>
            <p className="feature-copy">A composite view with each contributing signal visible.</p>
            <div className="mt-7 rounded-2xl border border-[#008CFF]/15 bg-[#07111F] p-5">
              <div className="flex items-end justify-between border-b border-white/[0.06] pb-5"><div><p className="text-xs text-[#64748B]">Overall viability</p><p className="mt-1 text-sm font-semibold text-[#34D399]">Promising</p></div><p className="text-4xl font-semibold tracking-[-0.06em] text-white">76<span className="ml-1 text-sm text-[#64748B]">/100</span></p></div>
              <div className="mt-5 space-y-4"><MiniScore label="Demand" value={24} max={30} /><MiniScore label="Competition" value={17} max={25} /><MiniScore label="Financial feasibility" value={21} max={25} /><MiniScore label="Operational risk" value={14} max={20} /></div>
            </div>
          </article>

          <article className="premium-card p-7 lg:col-span-7">
            <div className="flex items-start justify-between"><div className="icon-box"><BadgeIndianRupee className="size-5" /></div><span className="feature-index">03</span></div>
            <h3 className="feature-title mt-9">Financial Structuring</h3>
            <div className="mt-7 grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
              {['₹1,00,000\nMargin', '₹10,00,000\nProject', '₹9,00,000\nPotential financing'].map((item, index) => (
                <div key={item} className="contents">
                  <div className="rounded-xl border border-white/[0.06] bg-[#07111F] p-4 text-center text-sm leading-6 font-semibold whitespace-pre-line text-[#CBD5E1]">{item}</div>
                  {index < 2 && <span className="text-center text-[#008CFF]">→</span>}
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-[#64748B]">Final eligibility and sanction remain subject to authorised agencies.</p>
          </article>

          <article className="premium-card p-7 lg:col-span-4">
            <div className="flex items-start justify-between"><div className="icon-box"><BrainCircuit className="size-5" /></div><span className="feature-index">04</span></div>
            <h3 className="feature-title mt-9">AI Advisory</h3>
            <div className="mt-6 flex flex-wrap gap-2">{['SWOT', 'Risks', 'Opportunities', 'Recommended actions'].map((item) => <span key={item} className="rounded-full border border-[#008CFF]/15 bg-[#008CFF]/[0.055] px-3 py-1.5 text-xs font-medium text-[#94A3B8]">{item}</span>)}</div>
          </article>

          <article className="premium-card p-7 lg:col-span-4">
            <div className="flex items-start justify-between"><div className="icon-box"><ShieldCheck className="size-5" /></div><span className="feature-index">05</span></div>
            <h3 className="feature-title mt-9">Evidence Confidence</h3>
            <div className="mt-6 space-y-4">{confidence.map(([label, state, color]) => <div key={label} className="flex items-center justify-between gap-4 text-xs"><span className="text-[#94A3B8]">{label}</span><span className="flex items-center gap-2 font-medium text-[#CBD5E1]"><span className={`size-1.5 rounded-full ${color}`} />{state}</span></div>)}</div>
            <p className="mt-6 text-xs leading-5 text-[#64748B]">Verified, estimated and user-provided information stay visibly distinct.</p>
          </article>

          <article className="premium-card p-7 lg:col-span-4">
            <div className="flex items-start justify-between"><div className="icon-box"><AudioLines className="size-5" /></div><span className="feature-index">06</span></div>
            <h3 className="feature-title mt-9">Accessible Guidance</h3>
            <div className="mt-6 space-y-3">{['Simple financial language', 'Future regional-language support', 'Future voice interaction'].map((item) => <div key={item} className="flex items-start gap-2.5 text-sm leading-5 text-[#94A3B8]"><Check className="mt-0.5 size-3.5 shrink-0 text-[#22D3EE]" />{item}</div>)}</div>
          </article>
        </div>
      </div>
    </section>
  );
}
