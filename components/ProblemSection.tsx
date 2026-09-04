'use client';

import { BadgeIndianRupee, Store, UsersRound } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { SectionHeader } from './SectionHeader';

const icons = [UsersRound, Store, BadgeIndianRupee] as const;

export function ProblemSection() {
  const { t } = useLanguage();
  return (
    <section className="section-shell bg-[#EFF7FF]">
      <div className="section-container">
        <SectionHeader eyebrow={t.problem.eyebrow} title={t.problem.title} align="center" />
        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {t.problem.items.map(([title, copy], index) => {
            const Icon = icons[index];
            return (
            <article key={title} className="friendly-card group p-7 text-center sm:p-8">
              <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#EFF7FF] text-[#006EFF] transition group-hover:bg-[#006EFF] group-hover:text-white">
                <Icon className="size-8" strokeWidth={1.8} />
              </div>
              <p className="mt-5 text-sm font-extrabold tracking-[0.1em] text-[#8AA0B8]">0{index + 1}</p>
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.035em] text-[#172033]">{title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-base leading-7 text-[#5B6475]">{copy}</p>
            </article>
          );})}
        </div>
      </div>
    </section>
  );
}
