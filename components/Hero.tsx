import {
  ArrowDownRight,
  ArrowRight,
  BadgeIndianRupee,
  Building2,
  CheckCircle2,
  Database,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site-config';

function ViabilityRing() {
  return (
    <div className="relative grid size-28 shrink-0 place-items-center" aria-label="Business viability score: 76 out of 100">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(148,163,184,.11)" strokeWidth="8" />
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#score-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray="314"
          strokeDashoffset="75"
          className="score-ring"
        />
        <defs>
          <linearGradient id="score-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#008CFF" />
            <stop offset="1" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center">
        <div className="text-3xl font-semibold tracking-[-0.05em] text-white">76</div>
        <div className="text-[11px] font-medium text-[#64748B]">/ 100</div>
      </div>
    </div>
  );
}

const sourceTags = [
  ['Population', 'Verified Data', CheckCircle2],
  ['Competition', 'Mapped Data', MapPin],
  ['Finance', 'Rule Engine', ShieldCheck],
] as const;

export function Hero() {
  return (
    <section id="overview" className="relative isolate overflow-hidden pb-24 pt-32 sm:pb-28 sm:pt-40 lg:min-h-[920px] lg:pt-44">
      <div className="hero-grid absolute inset-0 -z-20 opacity-50" aria-hidden="true" />
      <div className="absolute left-[57%] top-24 -z-10 h-[560px] w-[560px] rounded-full bg-[#008CFF]/[0.075] blur-[110px]" aria-hidden="true" />
      <div className="absolute left-[8%] top-[18%] -z-10 size-48 rounded-full border border-[#008CFF]/10" aria-hidden="true" />

      <div className="mx-auto grid max-w-[1440px] items-center gap-16 px-5 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12 lg:px-12 xl:gap-20">
        <div className="relative z-10 max-w-[650px]">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[#008CFF]/20 bg-[#07111F]/80 px-3.5 py-2 text-[12px] font-semibold tracking-[0.12em] text-[#94A3B8] uppercase">
            <Sparkles className="size-3.5 text-[#00B7FF]" />
            {SITE_CONFIG.eventName} <span className="text-[#334155]">·</span> {SITE_CONFIG.problemId}
          </div>

          <h1 className="animate-fade-up delay-1 mt-7 max-w-[640px] text-[clamp(3.15rem,6vw,5.8rem)] leading-[0.96] font-semibold tracking-[-0.065em] text-[#F8FAFC]">
            Turn Local Insight Into <span className="blue-text">Smarter Enterprise.</span>
          </h1>

          <p className="animate-fade-up delay-2 mt-7 max-w-[590px] text-lg leading-8 text-[#94A3B8] sm:text-xl">
            An evidence-backed AI advisory platform helping rural micro-entrepreneurs evaluate local business opportunities and understand how their projects can be financially structured.
          </p>

          <div className="animate-fade-up delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#how-it-works" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#008CFF] px-5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(0,140,255,.22)] transition hover:bg-[#0A9BFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22D3EE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712]">
              Explore How It Works
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </a>
            <a href="#architecture" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-5 text-sm font-semibold text-[#CBD5E1] transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008CFF]">
              View System Architecture
              <ArrowRight className="size-4 text-[#64748B] transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="animate-fade-up delay-4 mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#64748B]">
            <span>Hyper-local insights</span><span className="size-1 rounded-full bg-[#008CFF]" />
            <span>Explainable viability</span><span className="size-1 rounded-full bg-[#008CFF]" />
            <span>Transparent finance</span>
          </div>
        </div>

        <div className="animate-fade-up delay-2 relative mx-auto w-full max-w-[720px] lg:mx-0">
          <div className="absolute -inset-6 -z-10 rounded-[36px] bg-[#008CFF]/[0.05] blur-3xl" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[24px] border border-[#008CFF]/25 bg-[#07111F]/95 shadow-[0_32px_100px_rgba(0,0,0,.48),0_0_60px_rgba(0,140,255,.05)]">
            <div className="flex items-center justify-between border-b border-[#008CFF]/15 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="grid size-9 place-items-center rounded-lg bg-[#008CFF]/10 text-[#00B7FF]"><Database className="size-[18px]" /></div>
                <div>
                  <p className="text-sm font-semibold text-[#F8FAFC]">Business Opportunity Analysis</p>
                  <p className="mt-0.5 text-xs text-[#64748B]">Evidence-backed decision workspace</p>
                </div>
              </div>
              <span className="rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/[0.06] px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] text-[#67E8F9] uppercase">Sample Analysis</span>
            </div>

            <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-[1.04fr_.96fr]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/[0.065] bg-[#0B1728] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium tracking-[0.08em] text-[#64748B] uppercase">Proposed business</p>
                      <div className="mt-3 flex items-center gap-2.5 text-lg font-semibold text-[#F8FAFC]"><Building2 className="size-5 text-[#00B7FF]" /> Dairy Enterprise</div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-[#94A3B8]"><MapPin className="size-4 text-[#64748B]" /> Sample Rural Block</div>
                    </div>
                    <span className="mt-0.5 size-2 rounded-full bg-[#34D399] shadow-[0_0_12px_rgba(52,211,153,.5)]" aria-label="Analysis ready" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="metric-card">
                    <Users className="size-4 text-[#00B7FF]" />
                    <p className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">18.4K</p>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">Potential population</p>
                  </div>
                  <div className="metric-card">
                    <MapPin className="size-4 text-[#00B7FF]" />
                    <p className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">03</p>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">Mapped competitors</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#008CFF]/15 bg-[radial-gradient(circle_at_50%_0%,rgba(0,140,255,.11),transparent_55%),#0B1728] p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium tracking-[0.08em] text-[#64748B] uppercase">Business viability</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#34D399]/20 bg-[#34D399]/[0.07] px-2.5 py-1 text-xs font-semibold text-[#6EE7B7]"><CheckCircle2 className="size-3.5" /> Promising</div>
                  </div>
                  <ViabilityRing />
                </div>
                <div className="mt-5 space-y-3 border-t border-white/[0.06] pt-4">
                  <div className="flex items-center justify-between text-sm"><span className="text-[#94A3B8]">Potential project cost</span><span className="font-semibold text-[#F8FAFC]">₹10,00,000</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-[#94A3B8]">Potential financing</span><span className="font-semibold text-[#00B7FF]">₹9,00,000</span></div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full w-[76%] rounded-full bg-gradient-to-r from-[#008CFF] to-[#22D3EE]" /></div>
                </div>
              </div>
            </div>

            <div className="grid gap-px border-t border-[#008CFF]/10 bg-[#008CFF]/10 sm:grid-cols-3">
              {sourceTags.map(([label, value, Icon]) => (
                <div key={label} className="flex items-center gap-2.5 bg-[#07111F] px-4 py-3.5">
                  <Icon className="size-3.5 text-[#22D3EE]" />
                  <div><p className="text-[10px] font-medium text-[#64748B]">{label}</p><p className="mt-0.5 text-xs font-semibold text-[#CBD5E1]">{value}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-xl border border-[#008CFF]/20 bg-[#07111F]/95 px-4 py-3 shadow-xl backdrop-blur sm:flex">
            <div className="grid size-8 place-items-center rounded-lg bg-[#008CFF]/10"><BadgeIndianRupee className="size-4 text-[#00B7FF]" /></div>
            <div><p className="text-[10px] text-[#64748B]">Decision model</p><p className="text-xs font-semibold text-[#CBD5E1]">Auditable financial logic</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}
