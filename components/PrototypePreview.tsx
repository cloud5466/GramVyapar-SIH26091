'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BadgeIndianRupee,
  ChevronDown,
  Milk,
  LoaderCircle,
  MapPin,
  MessageCircleMore,
  Plus,
  Scissors,
  ShoppingCart,
  Store,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeader } from './SectionHeader';

const businesses = [
  { id: 'Dairy', label: 'Dairy', icon: Milk },
  { id: 'Tailoring Shop', label: 'Tailoring', icon: Scissors },
  { id: 'Kirana Store', label: 'Kirana', icon: ShoppingCart },
  { id: 'Other Business', label: 'Other', icon: Plus },
] as const;

const insights = [
  { icon: UsersRound, title: 'Customers', copy: 'Local demand appears promising.' },
  { icon: Store, title: 'Competition', copy: 'Some competition exists nearby.' },
  { icon: BadgeIndianRupee, title: 'Money', copy: 'Your available investment can support further planning.' },
] as const;

const scores = [
  ['Demand score', 24, 30],
  ['Competition score', 17, 25],
  ['Financial feasibility', 21, 25],
  ['Operational risk', 14, 20],
] as const;

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between gap-4 text-sm"><span className="font-semibold text-[#445168]">{label}</span><span className="font-bold text-[#123B70]">{value} / {max}</span></div>
      <Progress value={(value / max) * 100} className="gap-0"><ProgressTrack className="h-2 bg-[#E5EEF7]"><ProgressIndicator className="bg-[#006EFF]" /></ProgressTrack></Progress>
    </div>
  );
}

export function PrototypePreview() {
  const [business, setBusiness] = useState('Tailoring Shop');
  const [capital, setCapital] = useState('1,00,000');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  function analyze() {
    setIsAnalyzing(true);
    setShowResult(false);
    setDetailsOpen(false);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 700);
  }

  return (
    <section id="prototype" className="section-shell bg-white">
      <div className="section-container">
        <SectionHeader eyebrow="Try the prototype" title="Try Dhandha Dost" description="Teen simple answers dein. Ek easy business plan dekhein." align="center" />

        <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-[24px] border border-[#CFE3F7] bg-white shadow-[0_24px_70px_rgba(18,59,112,.1)]">
          <div className="grid lg:grid-cols-[.82fr_1.18fr]">
            <div className="border-b border-[#DCEBFA] bg-[#F8FBFF] p-5 sm:p-8 lg:border-r lg:border-b-0">
              <div className="flex items-center gap-3"><div className="grid size-11 place-items-center rounded-2xl bg-[#006EFF] text-white"><MessageCircleMore className="size-5" /></div><div><p className="text-lg font-bold text-[#172033]">Tell us about your plan</p><p className="text-sm text-[#5B6475]">It takes less than a minute.</p></div></div>

              <div className="mt-8 space-y-8">
                <div>
                  <label htmlFor="plan-location" className="flex items-center gap-3 text-base font-bold text-[#172033]"><span className="step-number">1</span>Where do you live?</label>
                  <Select defaultValue="margao"><SelectTrigger id="plan-location" className="mt-3 h-14 w-full rounded-2xl border-[#C9DDF1] bg-white px-4 text-base font-semibold text-[#26344A]"><SelectValue /></SelectTrigger><SelectContent className="border-[#CFE3F7] bg-white"><SelectItem value="margao">Margao, Goa</SelectItem><SelectItem value="sample-rural">Sample Rural Block</SelectItem><SelectItem value="pilot">Pilot Location</SelectItem></SelectContent></Select>
                </div>

                <fieldset>
                  <legend className="flex items-center gap-3 text-base font-bold text-[#172033]"><span className="step-number">2</span>What business do you want to start?</legend>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {businesses.map(({ id, label, icon: Icon }) => {
                      const selected = business === id;
                      return <button key={id} type="button" aria-pressed={selected} onClick={() => setBusiness(id)} className={`flex min-h-24 flex-col items-center justify-center rounded-2xl border p-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006EFF] focus-visible:ring-offset-2 ${selected ? 'border-[#006EFF] bg-[#EAF4FF] text-[#006EFF] shadow-[inset_0_0_0_1px_#006EFF]' : 'border-[#D7E6F4] bg-white text-[#445168] hover:border-[#8FBEF3]'}`}><Icon className="mb-2 size-7" strokeWidth={1.9} />{label}{selected && <span className="sr-only"> selected</span>}</button>;
                    })}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="plan-capital" className="flex items-center gap-3 text-base font-bold text-[#172033]"><span className="step-number">3</span>How much can you invest?</label>
                  <div className="mt-3 flex h-14 items-center rounded-2xl border border-[#C9DDF1] bg-white px-4 focus-within:border-[#006EFF] focus-within:ring-2 focus-within:ring-[#006EFF]/20"><span className="text-xl font-bold text-[#006EFF]">₹</span><Input id="plan-capital" inputMode="numeric" value={capital} onChange={(event) => setCapital(event.target.value)} className="h-full border-0 bg-transparent px-3 text-lg font-bold text-[#172033] shadow-none focus-visible:ring-0" /></div>
                </div>
              </div>

              <Button onClick={analyze} disabled={isAnalyzing} className="mt-8 h-14 w-full rounded-2xl bg-[#006EFF] text-base font-extrabold text-white shadow-[0_10px_24px_rgba(0,110,255,.2)] hover:bg-[#005ED9]">
                {isAnalyzing ? <><LoaderCircle className="size-5 animate-spin" />Checking your plan…</> : <>Check My Business<ArrowRight className="size-5" /></>}
              </Button>
              <p className="mt-4 text-center text-sm text-[#68758A]">Prototype only. No information is saved.</p>
            </div>

            <div className="min-h-[690px] p-5 sm:p-8">
              {!showResult && !isAnalyzing && <div className="grid h-full min-h-[620px] place-items-center rounded-[20px] border-2 border-dashed border-[#DCEBFA] bg-[#FBFDFF] p-8 text-center"><div><div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#EFF7FF] text-[#006EFF]"><ArrowRight className="size-7" /></div><h3 className="mt-5 text-xl font-bold text-[#172033]">Your simple plan will appear here</h3><p className="mx-auto mt-2 max-w-sm text-base leading-7 text-[#5B6475]">Choose your location, business and budget, then tap “Check My Business”.</p></div></div>}

              {isAnalyzing && <div className="grid h-full min-h-[620px] place-items-center text-center"><div><div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#EFF7FF] text-[#006EFF]"><LoaderCircle className="size-7 animate-spin" /></div><p className="mt-5 text-lg font-bold text-[#172033]">Checking your sample plan…</p><p className="mt-2 text-base text-[#5B6475]">Looking at customers, competition and money.</p></div></div>}

              {showResult && !isAnalyzing && <div className="result-reveal">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCEBFA] pb-6"><div><span className="inline-flex items-center gap-2 rounded-full bg-[#FFF5DD] px-3 py-1.5 text-xs font-extrabold text-[#9A6500]"><span className="size-2 rounded-full bg-[#F59E0B]" />Sample / Illustrative Analysis</span><p className="mt-5 text-sm font-extrabold tracking-[0.08em] text-[#6380A0] uppercase">Your Business Plan</p><h3 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#172033]">{business}</h3><p className="mt-1 flex items-center gap-2 text-base text-[#5B6475]"><MapPin className="size-4 text-[#006EFF]" />Margao, Goa</p></div><div className="rounded-[18px] bg-[#E9F9F2] px-6 py-4 text-center"><p className="text-xs font-bold text-[#39745F]">Business Potential</p><p className="mt-1 text-2xl font-extrabold text-[#137A52]">GOOD</p><p className="mt-1 text-sm font-bold text-[#39745F]">76 / 100</p></div></div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">{insights.map(({ icon: Icon, title, copy }) => <article key={title} className="rounded-2xl border border-[#DCEBFA] bg-[#FBFDFF] p-4"><div className="icon-bubble-sm"><Icon className="size-5" /></div><h4 className="mt-4 text-base font-bold text-[#172033]">{title}</h4><p className="mt-1 text-sm leading-6 text-[#5B6475]">{copy}</p></article>)}</div>

                <div className="mt-6 rounded-[20px] border border-[#CFE3F7] bg-[#EFF7FF] p-5 sm:p-6"><h4 className="text-sm font-extrabold tracking-[0.08em] text-[#123B70] uppercase">Estimated Money Plan</h4><dl className="mt-5 space-y-4 text-base"><div className="flex justify-between gap-4"><dt className="text-[#5B6475]">Your Money</dt><dd className="font-extrabold text-[#172033]">₹{capital || '1,00,000'}</dd></div><div className="flex justify-between gap-4"><dt className="text-[#5B6475]">Estimated Project Size</dt><dd className="font-extrabold text-[#172033]">₹10,00,000</dd></div><div className="flex justify-between gap-4 border-t border-[#CFE3F7] pt-4"><dt className="font-semibold text-[#123B70]">Potential Financing</dt><dd className="font-extrabold text-[#006EFF]">₹9,00,000</dd></div></dl></div>

                <div className="mt-6"><h4 className="text-sm font-extrabold tracking-[0.08em] text-[#123B70] uppercase">What Should You Do Next?</h4><ol className="mt-4 space-y-3">{['Check local shop rent', 'Speak to at least 10 potential customers', 'Compare supplier prices'].map((step, index) => <li key={step} className="flex items-center gap-4 rounded-2xl border border-[#E0ECF7] p-4 text-base font-semibold text-[#445168]"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#006EFF] text-sm font-extrabold text-white">{index + 1}</span>{step}</li>)}</ol></div>

                <Collapsible open={detailsOpen} onOpenChange={setDetailsOpen} className="mt-6 rounded-[20px] border border-[#DCEBFA]">
                  <CollapsibleTrigger className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[20px] px-5 text-left text-base font-bold text-[#006EFF] hover:bg-[#F8FBFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006EFF]">See Detailed Analysis<ChevronDown className={`size-5 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} /></CollapsibleTrigger>
                  <CollapsibleContent className="border-t border-[#DCEBFA] p-5">
                    <div className="grid gap-7 md:grid-cols-2"><div className="space-y-5">{scores.map(([label, value, max]) => <ScoreRow key={label} label={label} value={value} max={max} />)}</div><div><p className="text-sm font-bold text-[#172033]">SWOT snapshot</p><div className="mt-3 grid grid-cols-2 gap-2">{[['Strength', 'Skilled service'], ['Weakness', 'Supplier dependence'], ['Opportunity', 'Local demand'], ['Threat', 'Nearby competition']].map(([label, value]) => <div key={label} className="rounded-xl bg-[#F7FAFC] p-3"><p className="text-xs font-bold text-[#6380A0]">{label}</p><p className="mt-1 text-sm font-semibold text-[#445168]">{value}</p></div>)}</div></div></div>
                    <div className="mt-6 grid gap-3 border-t border-[#DCEBFA] pt-5 sm:grid-cols-2"><div><p className="text-sm font-bold text-[#172033]">Data confidence</p><p className="mt-2 text-sm leading-6 text-[#5B6475]">Population: High confidence<br />Competition: Medium confidence<br />Local pricing: User verification needed</p></div><div><p className="text-sm font-bold text-[#172033]">Sources used</p><p className="mt-2 text-sm leading-6 text-[#5B6475]">Government/open data<br />Mapped business data<br />Entrepreneur input</p></div></div>
                  </CollapsibleContent>
                </Collapsible>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
