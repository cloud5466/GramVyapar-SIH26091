import { ArrowDown, ArrowRight, BadgeIndianRupee, Handshake, MapPin, Store } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const steps = [
  { number: '1', icon: MapPin, title: 'Aap Kahan Rehte Ho?', detail: 'Location choose karein' },
  { number: '2', icon: Store, title: 'Kya Business Karna Hai?', detail: 'Dairy, Tailoring, Kirana etc.' },
  { number: '3', icon: BadgeIndianRupee, title: 'Kitna Invest Kar Sakte Ho?', detail: 'Apna available budget bataiye' },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-shell bg-white">
      <div className="section-container">
        <SectionHeader eyebrow="Bahut aasaan" title="Bas 3 Cheezein Bataiye" description="Koi lamba form nahi. Koi mushkil financial language nahi." align="center" />

        <div className="mt-12 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-3">
          {steps.map(({ number, icon: Icon, title, detail }, index) => (
            <div key={title} className="contents">
              <article className="friendly-card relative flex min-h-64 flex-col items-center justify-center p-7 text-center">
                <span className="absolute left-5 top-5 grid size-9 place-items-center rounded-full bg-[#006EFF] text-sm font-extrabold text-white">{number}</span>
                <div className="grid size-16 place-items-center rounded-[20px] bg-[#EFF7FF] text-[#006EFF]"><Icon className="size-8" /></div>
                <h3 className="mt-6 text-xl font-bold tracking-[-0.03em] text-[#172033]">{title}</h3>
                <p className="mt-2 text-base text-[#5B6475]">{detail}</p>
              </article>
              {index < steps.length - 1 && <div className="flex items-center justify-center py-1 text-[#77B5FF]"><ArrowDown className="size-7 md:hidden" /><ArrowRight className="hidden size-7 md:block" /></div>}
            </div>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center rounded-[22px] bg-[#006EFF] px-6 py-7 text-center text-white shadow-[0_16px_36px_rgba(0,110,255,.2)] sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
          <div className="grid size-14 place-items-center rounded-2xl bg-white/15"><Handshake className="size-7" /></div>
          <div className="mt-4 sm:mt-0"><p className="text-sm font-bold text-white/75">Dhandha Dost</p><p className="mt-1 text-2xl font-bold tracking-[-0.03em]">Aapka Simple Business Plan</p></div>
        </div>
      </div>
    </section>
  );
}
