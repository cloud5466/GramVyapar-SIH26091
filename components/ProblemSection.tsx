import { BadgeIndianRupee, Store, UsersRound } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const questions = [
  {
    icon: UsersRound,
    number: '01',
    title: 'Yahan Customers Milenge?',
    copy: 'Hum aapke area ki demand aur nearby market ko samajhne mein madad karte hain.',
  },
  {
    icon: Store,
    number: '02',
    title: 'Competition Kitna Hai?',
    copy: 'Aas-paas similar businesses aur possible competition dekhiye.',
  },
  {
    icon: BadgeIndianRupee,
    number: '03',
    title: 'Kitna Paisa Chahiye?',
    copy: 'Investment, project cost aur possible financing ko simple language mein samjhiye.',
  },
] as const;

export function ProblemSection() {
  return (
    <section className="section-shell bg-[#EFF7FF]">
      <div className="section-container">
        <SectionHeader eyebrow="Business ki taiyaari" title="Business Shuru Karne Se Pehle 3 Sawal" align="center" />
        <div className="mt-11 grid gap-5 md:grid-cols-3">
          {questions.map(({ icon: Icon, number, title, copy }) => (
            <article key={title} className="friendly-card group p-7 text-center sm:p-8">
              <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#EFF7FF] text-[#006EFF] transition group-hover:bg-[#006EFF] group-hover:text-white">
                <Icon className="size-8" strokeWidth={1.8} />
              </div>
              <p className="mt-5 text-sm font-extrabold tracking-[0.1em] text-[#8AA0B8]">{number}</p>
              <h3 className="mt-3 text-2xl font-bold tracking-[-0.035em] text-[#172033]">{title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-base leading-7 text-[#5B6475]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
