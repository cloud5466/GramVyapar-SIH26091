import { ArrowRight, Network } from 'lucide-react';

export function CTASection() {
  return (
    <section className="px-5 pb-10 pt-8 sm:px-8 sm:pb-14 lg:px-12">
      <div className="relative mx-auto max-w-[1344px] overflow-hidden rounded-[26px] border border-[#008CFF]/25 bg-[#07111F] px-6 py-20 text-center sm:px-12 sm:py-24">
        <div className="absolute left-1/2 top-1/2 -z-0 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#008CFF]/[0.12] blur-[110px]" />
        <div className="hero-grid absolute inset-0 z-0 opacity-30" />
        <div className="relative z-10">
          <div className="mx-auto grid size-11 place-items-center rounded-2xl border border-[#008CFF]/25 bg-[#008CFF]/10 text-[#00B7FF]"><Network className="size-5" /></div>
          <h2 className="mx-auto mt-7 max-w-3xl text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.06em] text-white">From Business Idea<br /><span className="blue-text">to Informed Decision.</span></h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#94A3B8] sm:text-lg">Helping rural entrepreneurs understand their market, their numbers and their next move.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><a href="#prototype" className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#008CFF] px-6 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(0,140,255,.22)] transition hover:bg-[#0A9BFF]">Explore Prototype<ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" /></a><a href="#architecture" className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-6 text-sm font-semibold text-[#CBD5E1] transition hover:border-white/20 hover:bg-white/[0.06]">View Architecture</a></div>
        </div>
      </div>
    </section>
  );
}
