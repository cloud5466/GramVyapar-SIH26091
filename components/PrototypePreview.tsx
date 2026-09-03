'use client';

import { useState } from 'react';
import { ArrowRight, BadgeIndianRupee, BarChart3, Check, LoaderCircle, MapPin, ShieldAlert, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress, ProgressIndicator, ProgressTrack } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SectionHeader } from './SectionHeader';

const scores = [
  ['Demand', 24, 30],
  ['Competition', 17, 25],
  ['Financial Feasibility', 21, 25],
  ['Operational Readiness', 14, 20],
] as const;

function ResultScore({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm"><span className="text-[#94A3B8]">{label}</span><span className="font-semibold text-[#F8FAFC]">{value} <span className="font-normal text-[#475569]">/ {max}</span></span></div>
      <Progress value={(value / max) * 100} className="gap-0"><ProgressTrack className="h-1.5 bg-white/[0.065]"><ProgressIndicator className="bg-gradient-to-r from-[#008CFF] to-[#22D3EE]" /></ProgressTrack></Progress>
    </div>
  );
}

export function PrototypePreview() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(true);

  function analyze() {
    setIsAnalyzing(true);
    setShowResult(false);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 850);
  }

  return (
    <section id="prototype" className="section-shell relative overflow-hidden">
      <div className="absolute right-[5%] top-[20%] -z-10 h-96 w-96 rounded-full bg-[#008CFF]/[0.055] blur-[100px]" />
      <div className="section-container">
        <SectionHeader eyebrow="Sample advisory experience" title="From Three Inputs to a Clearer Next Move." description="A simulated view of the future application experience. All values below are illustrative and do not represent live local findings." />

        <div className="mt-12 overflow-hidden rounded-[24px] border border-[#008CFF]/25 bg-[#07111F] shadow-[0_32px_100px_rgba(0,0,0,.32),0_0_70px_rgba(0,140,255,.04)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#008CFF]/15 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-xl bg-[#008CFF]/10"><Sparkles className="size-[18px] text-[#00B7FF]" /></div><div><p className="text-sm font-semibold text-white">Advisory Workspace</p><p className="text-xs text-[#64748B]">Business pre-assessment</p></div></div>
            <span className="rounded-full border border-[#22D3EE]/20 bg-[#22D3EE]/[0.06] px-3 py-1.5 text-[10px] font-bold tracking-[0.12em] text-[#67E8F9] uppercase">Illustrative Prototype Analysis</span>
          </div>

          <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
            <div className="border-b border-[#008CFF]/12 p-5 sm:p-7 lg:border-r lg:border-b-0">
              <p className="text-xs font-bold tracking-[0.14em] text-[#64748B] uppercase">Entrepreneur inputs</p>
              <div className="mt-7 space-y-5">
                <label htmlFor="location" className="block"><span className="field-label"><MapPin className="size-3.5" />Location</span><Select defaultValue="sample-block"><SelectTrigger id="location" className="mt-2 h-12 w-full rounded-xl border-white/[0.08] bg-[#0B1728] px-4 text-[15px] hover:bg-[#0D1C31]"><SelectValue /></SelectTrigger><SelectContent className="border border-[#008CFF]/20"><SelectItem value="sample-block">Sample Rural Block</SelectItem><SelectItem value="pilot-block">Pilot Rural Block</SelectItem></SelectContent></Select></label>
                <label htmlFor="business" className="block"><span className="field-label"><BarChart3 className="size-3.5" />Business</span><Input id="business" defaultValue="Dairy Enterprise" className="mt-2 h-12 rounded-xl border-white/[0.08] bg-[#0B1728] px-4 text-[15px]" /></label>
                <label htmlFor="capital" className="block"><span className="field-label"><BadgeIndianRupee className="size-3.5" />Available Capital</span><Input id="capital" defaultValue="₹1,00,000" className="mt-2 h-12 rounded-xl border-white/[0.08] bg-[#0B1728] px-4 text-[15px]" /></label>
              </div>
              <Button onClick={analyze} disabled={isAnalyzing} className="mt-7 h-12 w-full rounded-xl bg-[#008CFF] text-sm font-semibold shadow-[0_12px_36px_rgba(0,140,255,.18)] hover:bg-[#0A9BFF]">
                {isAnalyzing ? <><LoaderCircle className="size-4 animate-spin" />Analyzing evidence</> : <>Analyse Business<ArrowRight className="size-4" /></>}
              </Button>
              <p className="mt-4 text-center text-xs leading-5 text-[#475569]">Demo interaction only. No data is submitted.</p>
            </div>

            <div className="min-h-[620px] p-5 sm:p-7">
              {isAnalyzing && <div className="grid h-full min-h-[560px] place-items-center"><div className="text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl border border-[#008CFF]/20 bg-[#008CFF]/10"><LoaderCircle className="size-6 animate-spin text-[#00B7FF]" /></div><p className="mt-4 text-sm font-semibold text-[#CBD5E1]">Structuring illustrative analysis…</p><p className="mt-1 text-xs text-[#64748B]">Evaluating market, viability and finance</p></div></div>}
              {showResult && !isAnalyzing && (
                <div className="result-reveal">
                  <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
                    <div className="rounded-2xl border border-[#008CFF]/18 bg-[radial-gradient(circle_at_50%_0%,rgba(0,140,255,.13),transparent_60%),#0B1728] p-6 text-center">
                      <p className="text-xs font-semibold tracking-[0.12em] text-[#64748B] uppercase">Business viability</p>
                      <p className="mt-5 text-6xl font-semibold tracking-[-0.08em] text-white">76<span className="ml-1 text-base tracking-normal text-[#64748B]">/100</span></p>
                      <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#34D399]/20 bg-[#34D399]/[0.07] px-3 py-1.5 text-xs font-semibold text-[#6EE7B7]"><Check className="size-3.5" />Promising</span>
                      <p className="mt-6 text-xs leading-5 text-[#64748B]">Composite score across four decision dimensions</p>
                    </div>
                    <div className="rounded-2xl border border-white/[0.06] bg-[#0B1728] p-6"><div className="space-y-5">{scores.map(([label, value, max]) => <ResultScore key={label} label={label} value={value} max={max} />)}</div></div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="insight-card"><div className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]"><span className="size-2 rounded-full bg-[#34D399]" />Local Opportunity</div><p className="mt-3 text-sm leading-6 text-[#94A3B8]">Demand indicators suggest reasonable potential, subject to local verification.</p></div>
                    <div className="insight-card"><div className="flex items-center gap-2 text-sm font-semibold text-[#F8FAFC]"><ShieldAlert className="size-4 text-[#FBBF24]" />Key Risk</div><p className="mt-3 text-sm leading-6 text-[#94A3B8]">Supplier dependency and existing competition should be validated.</p></div>
                  </div>

                  <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl border border-white/[0.06] bg-[#0B1728] p-5"><p className="text-xs font-bold tracking-[0.12em] text-[#64748B] uppercase">Financial structure</p><dl className="mt-4 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-[#94A3B8]">Margin</dt><dd className="font-semibold text-white">₹1,00,000</dd></div><div className="flex justify-between gap-4"><dt className="text-[#94A3B8]">Estimated Project Cost</dt><dd className="font-semibold text-white">₹10,00,000</dd></div><div className="flex justify-between gap-4 border-t border-white/[0.06] pt-3"><dt className="text-[#94A3B8]">Potential Financing</dt><dd className="font-semibold text-[#00B7FF]">₹9,00,000</dd></div></dl></div>
                    <div className="rounded-2xl border border-white/[0.06] bg-[#0B1728] p-5"><p className="text-xs font-bold tracking-[0.12em] text-[#64748B] uppercase">Recommended next steps</p><ol className="mt-4 space-y-3">{['Verify supplier pricing', 'Survey prospective customers', 'Review applicable financing documentation'].map((step, index) => <li key={step} className="flex items-center gap-3 text-sm text-[#CBD5E1]"><span className="font-mono text-xs font-semibold text-[#008CFF]">0{index + 1}</span><span className="h-px w-4 bg-[#008CFF]/25" />{step}</li>)}</ol></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
