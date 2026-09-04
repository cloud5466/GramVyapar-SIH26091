'use client';

import { ArrowDown, ArrowRight, BadgeIndianRupee, Check, MapPin, Sparkles, Store, UserRound } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site-config';
import { useLanguage } from '@/lib/i18n/language-context';

export function Hero() {
  const { t } = useLanguage();
  const resultItems = t.hero.results;
  return (
    <section id="overview" className="relative isolate overflow-hidden bg-white pb-20 pt-32 sm:pb-24 sm:pt-40 lg:pb-28 lg:pt-44">
      <div className="soft-grid absolute inset-0 -z-20" aria-hidden="true" />
      <div className="absolute -right-28 top-24 -z-10 size-[520px] rounded-full bg-[#EFF7FF]" aria-hidden="true" />
      <div className="absolute left-[10%] top-28 -z-10 size-32 rounded-full bg-[#EFF7FF]" aria-hidden="true" />

      <div className="section-container grid items-center gap-14 lg:grid-cols-[1.03fr_.97fr] lg:gap-16">
        <div className="max-w-[670px]">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-[#CFE4FA] bg-[#EFF7FF] px-4 py-2 text-[13px] font-bold tracking-[0.06em] text-[#123B70] uppercase">
            <Sparkles className="size-4 text-[#006EFF]" />
            {SITE_CONFIG.eventName} <span className="text-[#94AEC9]">·</span> {SITE_CONFIG.problemId}
          </div>

          <h1 className="animate-fade-up delay-1 mt-7 text-[clamp(2.75rem,5.8vw,5.35rem)] leading-[1.02] font-bold tracking-[-0.055em] text-[#172033]">
            {t.hero.title}
            <span className="mt-2 block text-[#006EFF]">{t.hero.titleAccent}</span>
          </h1>

          <p className="animate-fade-up delay-2 mt-7 max-w-[620px] text-lg leading-8 text-[#39445A] sm:text-xl">
            {t.hero.intro}
          </p>
          <p className="animate-fade-up delay-2 mt-3 max-w-[610px] text-base leading-7 text-[#5B6475]">
            {t.hero.support}
          </p>

          <div className="animate-fade-up delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#prototype" className="blue-button group">{t.hero.primary}<ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" /></a>
            <a href="#how-it-works" className="secondary-button group">{t.hero.secondary}<ArrowDown className="size-5 transition-transform group-hover:translate-y-0.5" /></a>
          </div>
          <p className="animate-fade-up delay-4 mt-6 text-[15px] font-medium text-[#5B6475]">{t.hero.trust}</p>
        </div>

        <div className="animate-fade-up delay-2 mx-auto w-full max-w-[540px]">
          <div className="rounded-[24px] border border-[#D3E7FB] bg-white p-5 shadow-[0_24px_70px_rgba(18,59,112,.12)] sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-[#E6F0FA] pb-5">
              <div className="flex items-center gap-3"><div className="icon-bubble"><UserRound className="size-6" /></div><div><p className="text-sm font-extrabold tracking-[0.08em] text-[#123B70] uppercase">{t.hero.plan}</p><p className="mt-0.5 text-sm text-[#718096]">{t.hero.planDetail}</p></div></div>
              <span className="rounded-full bg-[#E9F9F2] px-3 py-1.5 text-xs font-bold text-[#137A52]">{t.hero.example}</span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="plan-row"><div className="icon-bubble-sm"><MapPin className="size-5" /></div><div><p className="plan-label">{t.hero.location}</p><p className="plan-value">Margao, Goa</p></div></div>
              <div className="plan-row"><div className="icon-bubble-sm"><Store className="size-5" /></div><div><p className="plan-label">{t.hero.business}</p><p className="plan-value">{t.hero.businessExample}</p></div></div>
              <div className="plan-row"><div className="icon-bubble-sm"><BadgeIndianRupee className="size-5" /></div><div><p className="plan-label">{t.hero.invest}</p><p className="plan-value">₹1,00,000</p></div></div>
            </div>

            <a href="#prototype" className="mt-6 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#006EFF] px-4 py-3 text-center text-base font-bold text-white shadow-[0_10px_24px_rgba(0,110,255,.2)] transition hover:bg-[#005ED9]">{t.hero.check}<ArrowRight className="size-5 shrink-0" /></a>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {resultItems.map((item) => <div key={item} className="flex items-center gap-2 text-sm font-semibold text-[#3B4B63]"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#E9F9F2] text-[#16A66A]"><Check className="size-3.5" strokeWidth={3} /></span>{item}</div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
