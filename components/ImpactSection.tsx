import { ChartSpline, Landmark, Languages, Network } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const impact = [
  { icon: Landmark, title: 'Informed Entrepreneurship', copy: 'Evaluate market context and financial shape before committing capital.' },
  { icon: ChartSpline, title: 'Reduced Decision Risk', copy: 'Surface assumptions, dependencies and evidence gaps early.' },
  { icon: Languages, title: 'Accessible Financial Understanding', copy: 'Translate complex structures into clear, practical language.' },
  { icon: Network, title: 'Scalable Rural Advisory', copy: 'Extend a consistent advisory model across more business categories and locations.' },
] as const;

export function ImpactSection() {
  return (
    <section id="impact" className="section-shell border-y border-white/[0.045] bg-[#050B15]">
      <div className="section-container">
        <SectionHeader eyebrow="Potential impact" title="Better Decisions Before Borrowing." description="The goal is not to promise outcomes. It is to help entrepreneurs ask better questions, understand the numbers and take the next step with more confidence." />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{impact.map(({ icon: Icon, title, copy }, index) => <article key={title} className="premium-card p-6 sm:p-7"><div className="flex items-center justify-between"><div className="icon-box"><Icon className="size-5" /></div><span className="feature-index">0{index + 1}</span></div><h3 className="mt-9 text-lg font-semibold tracking-[-0.025em] text-white">{title}</h3><p className="mt-3 text-sm leading-6 text-[#94A3B8]">{copy}</p></article>)}</div>
      </div>
    </section>
  );
}
