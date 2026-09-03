import { Bot, Check, X } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const generic = ['General advice', 'Unverified assumptions', 'Opaque reasoning', 'Free-form calculations'];
const ours = ['Local evidence', 'Structured calculations', 'Explainable viability', 'Source confidence', 'Scheme-aware finance', 'Actionable next steps'];

export function ComparisonSection() {
  return (
    <section className="section-shell">
      <div className="section-container">
        <SectionHeader eyebrow="The difference" title="Not Another Generic AI Business Chatbot." align="center" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2">
          <article className="rounded-[22px] border border-white/[0.065] bg-[#07111F] p-7 sm:p-9">
            <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-white/[0.04] text-[#64748B]"><Bot className="size-5" /></div><div><p className="text-xs font-bold tracking-[0.14em] text-[#64748B] uppercase">Generic AI</p><p className="mt-1 text-sm text-[#475569]">Unstructured conversation</p></div></div>
            <div className="mt-8 space-y-3">{generic.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.018] px-4 py-3.5 text-sm text-[#94A3B8]"><X className="size-4 text-[#475569]" />{item}</div>)}</div>
          </article>
          <article className="relative overflow-hidden rounded-[22px] border border-[#008CFF]/30 bg-[radial-gradient(circle_at_100%_0%,rgba(0,140,255,.12),transparent_45%),#07111F] p-7 shadow-[0_20px_70px_rgba(0,140,255,.055)] sm:p-9">
            <div className="absolute right-5 top-5 rounded-full border border-[#008CFF]/20 bg-[#008CFF]/10 px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-[#00B7FF] uppercase">Evidence-led</div>
            <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-[#008CFF]/10 text-[#00B7FF]"><Bot className="size-5" /></div><div><p className="text-xs font-bold tracking-[0.14em] text-[#00B7FF] uppercase">Our platform</p><p className="mt-1 text-sm text-[#64748B]">Structured decision support</p></div></div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">{ours.map((item) => <div key={item} className="flex items-center gap-3 rounded-xl border border-[#008CFF]/10 bg-[#008CFF]/[0.035] px-4 py-3.5 text-sm font-medium text-[#CBD5E1]"><Check className="size-4 text-[#22D3EE]" />{item}</div>)}</div>
          </article>
        </div>
      </div>
    </section>
  );
}
