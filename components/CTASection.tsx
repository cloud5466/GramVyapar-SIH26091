import { ArrowRight, Handshake } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site-config';

export function CTASection() {
  return (
    <section className="px-5 py-12 sm:px-8 sm:py-16">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden rounded-[28px] bg-[#006EFF] px-6 py-16 text-center text-white shadow-[0_22px_60px_rgba(0,110,255,.2)] sm:px-10 sm:py-20">
        <div className="absolute -left-16 -top-20 size-72 rounded-full border-[50px] border-white/[0.06]" aria-hidden="true" />
        <div className="absolute -bottom-24 -right-16 size-80 rounded-full border-[56px] border-white/[0.06]" aria-hidden="true" />
        <div className="relative"><div className="mx-auto grid size-14 place-items-center rounded-[20px] bg-white/15"><Handshake className="size-7" /></div><h2 className="mx-auto mt-6 max-w-3xl text-[clamp(2.35rem,5vw,4.35rem)] leading-[1.04] font-bold tracking-[-0.055em]">Business ka pehla kadam,<br />samajhkar uthaiye.</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-white/85">{SITE_CONFIG.tagline}. Apna simple business plan abhi dekhiye.</p><a href="#prototype" className="mx-auto mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-white px-7 text-base font-extrabold text-[#006EFF] shadow-[0_10px_28px_rgba(18,59,112,.18)] transition hover:bg-[#F4F9FF]">Start My Business Plan<ArrowRight className="size-5" /></a></div>
      </div>
    </section>
  );
}
