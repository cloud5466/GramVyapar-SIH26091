'use client';

import { ArrowDown, BadgeIndianRupee, BrainCircuit, Calculator, Database, MessageSquareText } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { SectionHeader } from './SectionHeader';

const icons = [Database, Calculator, BadgeIndianRupee, BrainCircuit, MessageSquareText] as const;

export function ArchitectureSection() {
  const { t } = useLanguage();
  return (
    <section id="architecture" className="section-shell bg-white">
      <div className="section-container">
        <SectionHeader eyebrow={t.architecture.eyebrow} title={t.architecture.title} description={t.architecture.description} align="center" />
        <div className="mx-auto mt-12 max-w-4xl rounded-[24px] border border-[#CFE3F7] bg-[#F8FBFF] p-5 shadow-[0_18px_50px_rgba(18,59,112,.07)] sm:p-8">
          {t.architecture.layers.map(([title, detail], index) => { const Icon = icons[index]; return <div key={title}><div className={`flex flex-col items-center gap-4 rounded-[18px] border p-5 text-center sm:flex-row sm:text-left ${index === 2 ? 'border-[#98C8FF] bg-[#E7F3FF]' : 'border-[#DCEBFA] bg-white'}`}><div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#EFF7FF] text-[#006EFF]"><Icon className="size-6" /></div><div className="flex-1"><p className="text-lg font-bold text-[#172033]">{title}</p><p className="mt-1 text-sm text-[#5B6475]">{detail}</p></div><span className="text-sm font-extrabold text-[#9AB0C8]">0{index + 1}</span></div>{index < t.architecture.layers.length - 1 && <div className="flex h-10 items-center justify-center"><ArrowDown className="size-5 text-[#006EFF]" /></div>}</div>; })}
        </div>
        <div className="mx-auto mt-8 max-w-4xl rounded-[20px] bg-[#123B70] px-6 py-7 text-center text-white sm:px-10">
          <p className="text-lg font-bold sm:text-xl">{t.architecture.statement} <span className="text-[#7EC2FF]">{t.architecture.calculation}</span> {t.architecture.explanation}</p>
        </div>
      </div>
    </section>
  );
}
