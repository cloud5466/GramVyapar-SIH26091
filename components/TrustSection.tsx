'use client';

import { Calculator, Database, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { SectionHeader } from './SectionHeader';

const icons = [Database, Calculator, ShieldCheck] as const;

export function TrustSection() {
  const { t } = useLanguage();
  return (
    <section id="about" className="section-shell bg-[#EFF7FF]">
      <div className="section-container">
        <SectionHeader eyebrow={t.trust.eyebrow} title={t.trust.title} description={t.trust.description} align="center" />
        <div className="mt-11 grid gap-5 md:grid-cols-3">{t.trust.items.map(([title, copy], index) => { const Icon = icons[index]; return <article key={title} className="friendly-card p-7"><div className="icon-bubble"><Icon className="size-6" /></div><h3 className="mt-6 text-xl font-bold tracking-[-0.03em] text-[#172033]">{title}</h3><p className="mt-3 text-base leading-7 text-[#5B6475]">{copy}</p></article>; })}</div>
      </div>
    </section>
  );
}
