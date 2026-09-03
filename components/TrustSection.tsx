import { Calculator, Database, ShieldCheck } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const trustItems = [
  { icon: Database, title: 'Verified Information', copy: 'Government/open datasets where available.' },
  { icon: Calculator, title: 'Clear Calculations', copy: 'Financial numbers are calculated using programmed rules.' },
  { icon: ShieldCheck, title: 'Honest Confidence', copy: 'If local information is incomplete, Dhandha Dost tells you.' },
] as const;

export function TrustSection() {
  return (
    <section id="about" className="section-shell bg-[#EFF7FF]">
      <div className="section-container">
        <SectionHeader eyebrow="Seedhi aur sachchi advice" title="Dhandha Dost Aapko Guess Karke Advice Nahi Deta." description="Aapko pata rahega ki information kahan se aayi aur numbers kaise nikle." align="center" />
        <div className="mt-11 grid gap-5 md:grid-cols-3">{trustItems.map(({ icon: Icon, title, copy }) => <article key={title} className="friendly-card p-7"><div className="icon-bubble"><Icon className="size-6" /></div><h3 className="mt-6 text-xl font-bold tracking-[-0.03em] text-[#172033]">{title}</h3><p className="mt-3 text-base leading-7 text-[#5B6475]">{copy}</p></article>)}</div>
      </div>
    </section>
  );
}
