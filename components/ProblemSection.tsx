import { CircleDollarSign, FileQuestion, MapPinned, PanelsTopLeft } from 'lucide-react';
import { SectionHeader } from './SectionHeader';

const problems = [
  { icon: MapPinned, title: 'Local Demand Unknown', copy: "Is there enough demand within the entrepreneur's actual market radius?" },
  { icon: FileQuestion, title: 'Competition Unclear', copy: 'How many similar businesses are already operating nearby?' },
  { icon: CircleDollarSign, title: 'Financial Complexity', copy: 'How large should the project be, and how much financing may be required?' },
  { icon: PanelsTopLeft, title: 'Fragmented Guidance', copy: 'Business information, local knowledge and financing rules exist across different systems.' },
] as const;

export function ProblemSection() {
  return (
    <section className="section-shell border-y border-white/[0.045] bg-[#050B15]">
      <div className="section-container">
        <SectionHeader
          eyebrow="The challenge"
          title="A Business Idea Shouldn't Begin With Guesswork."
          description="Rural entrepreneurs often know what they want to build and how much they can invest, but reliable market intelligence, business planning and financial guidance remain fragmented."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {problems.map(({ icon: Icon, title, copy }, index) => (
            <article key={title} className="premium-card group min-h-64 p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <div className="icon-box"><Icon className="size-5" strokeWidth={1.7} /></div>
                <span className="text-xs font-medium text-[#334155]">0{index + 1}</span>
              </div>
              <h3 className="mt-10 text-xl font-semibold tracking-[-0.03em] text-[#F8FAFC]">{title}</h3>
              <p className="mt-3 text-[15px] leading-6 text-[#94A3B8]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
