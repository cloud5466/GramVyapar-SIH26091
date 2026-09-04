'use client';

import { BadgeIndianRupee, CheckCircle2, Store, UsersRound } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { SectionHeader } from './SectionHeader';

const icons = [CheckCircle2, UsersRound, BadgeIndianRupee, Store] as const;

export function CapabilityGrid() {
  const { t } = useLanguage();
  return (
    <section id="what-you-get" className="section-shell bg-[#EFF7FF]">
      <div className="section-container">
        <SectionHeader eyebrow={t.capabilities.eyebrow} title={t.capabilities.title} align="center" />
        <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.capabilities.items.map(([label, title, copy], index) => {
            const Icon = icons[index];
            const accent = index === 0;
            return (
            <article key={label} className={`rounded-[20px] border p-6 shadow-[0_12px_30px_rgba(18,59,112,.06)] ${accent ? 'border-[#BCD8FA] bg-[#006EFF] text-white' : 'border-[#DCEBFA] bg-white'}`}>
              <div className={`grid size-12 place-items-center rounded-2xl ${accent ? 'bg-white/16 text-white' : 'bg-[#EFF7FF] text-[#006EFF]'}`}><Icon className="size-6" /></div>
              <p className={`mt-6 text-sm font-extrabold tracking-[0.08em] uppercase ${accent ? 'text-white/75' : 'text-[#6380A0]'}`}>{label}</p>
              <h3 className={`mt-2 text-xl font-bold tracking-[-0.03em] ${accent ? 'text-white' : 'text-[#172033]'}`}>{title}</h3>
              <p className={`mt-3 text-base leading-7 ${accent ? 'text-white/85' : 'text-[#5B6475]'}`}>{copy}</p>
            </article>
          );})}
        </div>
      </div>
    </section>
  );
}
