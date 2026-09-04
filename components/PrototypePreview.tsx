'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BadgeIndianRupee,
  ChevronDown,
  LoaderCircle,
  MapPin,
  MessageCircleMore,
  Milk,
  Scissors,
  ShoppingCart,
  Store,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  analyzeBusiness,
  type AnalysisResponse,
} from '@/lib/api/gramvyapar-client';
import { SectionHeader } from './SectionHeader';

const locations = [
  { id: 'demo-location-01', label: 'Demo Location 1' },
  { id: 'demo-location-02', label: 'Demo Location 2' },
] as const;

const businesses = [
  { id: 'dairy', label: 'Dairy', icon: Milk },
  { id: 'tailoring', label: 'Tailoring', icon: Scissors },
  { id: 'kirana', label: 'Kirana', icon: ShoppingCart },
] as const;

interface FormErrors {
  location?: string;
  business?: string;
  capital?: string;
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatOptionalCurrency(value: number | null) {
  return value === null ? 'Not available' : formatCurrency(value);
}

function formatPercentage(value: number | null) {
  return value === null ? 'Not available' : `${value.toLocaleString('en-IN')}% p.a.`;
}

function formatYears(value: number | null) {
  if (value === null) return 'Not available';
  return `${value.toLocaleString('en-IN')} ${value === 1 ? 'year' : 'years'}`;
}

function formatMonths(value: number | null) {
  if (value === null) return 'Not available';
  return `${value.toLocaleString('en-IN')} ${value === 1 ? 'month' : 'months'}`;
}

function formatVerifiedDate(value: string | null) {
  if (value === null) return 'Not available';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export function PrototypePreview() {
  const [location, setLocation] = useState('');
  const [business, setBusiness] = useState('');
  const [capital, setCapital] = useState('1,00,000');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serviceError, setServiceError] = useState<string | null>(null);

  function clearPreviousResult() {
    setAnalysis(null);
    setServiceError(null);
    setDetailsOpen(false);
  }

  async function analyze() {
    const parsedCapital = Number(capital.replace(/[₹,\s]/g, ''));
    const nextErrors: FormErrors = {};

    if (!location) {
      nextErrors.location = 'Please choose your location.';
    }
    if (!business) {
      nextErrors.business = 'Please choose a business.';
    }
    if (!capital.trim() || !Number.isFinite(parsedCapital) || parsedCapital <= 0) {
      nextErrors.capital = 'Please enter an amount greater than ₹0.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setServiceError(null);
      setAnalysis(null);
      return;
    }

    setErrors({});
    setServiceError(null);
    setAnalysis(null);
    setDetailsOpen(false);
    setIsAnalyzing(true);

    try {
      const response = await analyzeBusiness({
        location_id: location,
        business_id: business,
        available_capital: parsedCapital,
      });
      setAnalysis(response);
    } catch {
      setServiceError("We couldn't prepare your analysis right now. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  const localMarketCards = analysis
    ? [
        {
          icon: UsersRound,
          title: 'Potential Customer Reach',
          copy:
            analysis.local_market.population_estimate === null
              ? 'Awaiting verified local data'
              : analysis.local_market.population_estimate.toLocaleString('en-IN'),
        },
        {
          icon: Store,
          title: 'Mapped Competition',
          copy:
            analysis.local_market.mapped_competitors === null
              ? 'Awaiting verified local data'
              : analysis.local_market.mapped_competitors.toLocaleString('en-IN'),
        },
        {
          icon: BadgeIndianRupee,
          title: 'Confidence',
          copy:
            analysis.local_market.confidence.charAt(0).toUpperCase() +
            analysis.local_market.confidence.slice(1),
        },
      ]
    : [];

  return (
    <section id="prototype" className="section-shell bg-white">
      <div className="section-container">
        <SectionHeader
          eyebrow="Try the prototype"
          title="Try GramVyapar"
          description="Teen simple answers dein. Ek easy business plan dekhein."
          align="center"
        />

        <div className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-[24px] border border-[#CFE3F7] bg-white shadow-[0_24px_70px_rgba(18,59,112,.1)]">
          <div className="grid lg:grid-cols-[.82fr_1.18fr]">
            <div className="border-b border-[#DCEBFA] bg-[#F8FBFF] p-5 sm:p-8 lg:border-r lg:border-b-0">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#006EFF] text-white">
                  <MessageCircleMore className="size-5" />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#172033]">Tell us about your plan</p>
                  <p className="text-sm text-[#5B6475]">It takes less than a minute.</p>
                </div>
              </div>

              <div className="mt-8 space-y-8">
                <div>
                  <label
                    htmlFor="plan-location"
                    className="flex items-center gap-3 text-base font-bold text-[#172033]"
                  >
                    <span className="step-number">1</span>Where do you live?
                  </label>
                  <Select
                    value={location || null}
                    onValueChange={(value) => {
                      setLocation(value ?? '');
                      setErrors((current) => ({ ...current, location: undefined }));
                      clearPreviousResult();
                    }}
                  >
                    <SelectTrigger
                      id="plan-location"
                      aria-invalid={Boolean(errors.location)}
                      aria-describedby="plan-location-help plan-location-error"
                      className="mt-3 h-14 w-full rounded-2xl border-[#C9DDF1] bg-white px-4 text-base font-semibold text-[#26344A]"
                    >
                      <SelectValue placeholder="Choose a demo location" />
                    </SelectTrigger>
                    <SelectContent className="border-[#CFE3F7] bg-white">
                      {locations.map(({ id, label }) => (
                        <SelectItem key={id} value={id}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p id="plan-location-help" className="mt-2 text-sm text-[#68758A]">
                    Temporary demo locations — verified location data is not connected yet.
                  </p>
                  {errors.location && (
                    <p id="plan-location-error" role="alert" className="mt-2 text-sm font-semibold text-[#B42318]">
                      {errors.location}
                    </p>
                  )}
                </div>

                <fieldset aria-describedby="plan-business-error">
                  <legend className="flex items-center gap-3 text-base font-bold text-[#172033]">
                    <span className="step-number">2</span>What business do you want to start?
                  </legend>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                    {businesses.map(({ id, label, icon: Icon }) => {
                      const selected = business === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            setBusiness(id);
                            setErrors((current) => ({ ...current, business: undefined }));
                            clearPreviousResult();
                          }}
                          className={`flex min-h-24 flex-col items-center justify-center rounded-2xl border p-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006EFF] focus-visible:ring-offset-2 ${
                            selected
                              ? 'border-[#006EFF] bg-[#EAF4FF] text-[#006EFF] shadow-[inset_0_0_0_1px_#006EFF]'
                              : 'border-[#D7E6F4] bg-white text-[#445168] hover:border-[#8FBEF3]'
                          }`}
                        >
                          <Icon className="mb-2 size-7" strokeWidth={1.9} />
                          {label}
                          {selected && <span className="sr-only"> selected</span>}
                        </button>
                      );
                    })}
                  </div>
                  {errors.business && (
                    <p id="plan-business-error" role="alert" className="mt-2 text-sm font-semibold text-[#B42318]">
                      {errors.business}
                    </p>
                  )}
                </fieldset>

                <div>
                  <label
                    htmlFor="plan-capital"
                    className="flex items-center gap-3 text-base font-bold text-[#172033]"
                  >
                    <span className="step-number">3</span>How much can you invest?
                  </label>
                  <div
                    className={`mt-3 flex h-14 items-center rounded-2xl border bg-white px-4 focus-within:border-[#006EFF] focus-within:ring-2 focus-within:ring-[#006EFF]/20 ${
                      errors.capital ? 'border-[#D92D20]' : 'border-[#C9DDF1]'
                    }`}
                  >
                    <span className="text-xl font-bold text-[#006EFF]">₹</span>
                    <Input
                      id="plan-capital"
                      inputMode="numeric"
                      value={capital}
                      aria-invalid={Boolean(errors.capital)}
                      aria-describedby="plan-capital-error"
                      onChange={(event) => {
                        setCapital(event.target.value);
                        setErrors((current) => ({ ...current, capital: undefined }));
                        clearPreviousResult();
                      }}
                      className="h-full border-0 bg-transparent px-3 text-lg font-bold text-[#172033] shadow-none focus-visible:ring-0"
                    />
                  </div>
                  {errors.capital && (
                    <p id="plan-capital-error" role="alert" className="mt-2 text-sm font-semibold text-[#B42318]">
                      {errors.capital}
                    </p>
                  )}
                </div>
              </div>

              <Button
                onClick={analyze}
                disabled={isAnalyzing}
                className="mt-8 h-14 w-full rounded-2xl bg-[#006EFF] text-base font-extrabold text-white shadow-[0_10px_24px_rgba(0,110,255,.2)] hover:bg-[#005ED9]"
              >
                {isAnalyzing ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" />Preparing your business plan…
                  </>
                ) : (
                  <>
                    Check My Business<ArrowRight className="size-5" />
                  </>
                )}
              </Button>
              {serviceError && (
                <div role="alert" className="mt-4 rounded-2xl border border-[#F4C7C3] bg-[#FFF5F4] p-4 text-sm text-[#8A1C13]">
                  <p className="font-bold">{serviceError}</p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="mt-1">Make sure the GramVyapar analysis service is running.</p>
                  )}
                </div>
              )}
              <p className="mt-4 text-center text-sm text-[#68758A]">
                Prototype only. No information is saved.
              </p>
            </div>

            <div className="min-h-[690px] p-5 sm:p-8">
              {!analysis && !isAnalyzing && (
                <div className="grid h-full min-h-[620px] place-items-center rounded-[20px] border-2 border-dashed border-[#DCEBFA] bg-[#FBFDFF] p-8 text-center">
                  <div>
                    <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#EFF7FF] text-[#006EFF]">
                      <ArrowRight className="size-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-[#172033]">Your simple plan will appear here</h3>
                    <p className="mx-auto mt-2 max-w-sm text-base leading-7 text-[#5B6475]">
                      Choose your location, business and budget, then tap “Check My Business”.
                    </p>
                  </div>
                </div>
              )}

              {isAnalyzing && (
                <output aria-live="polite" className="grid h-full min-h-[620px] place-items-center text-center">
                  <div>
                    <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#EFF7FF] text-[#006EFF]">
                      <LoaderCircle className="size-7 animate-spin" />
                    </div>
                    <p className="mt-5 text-lg font-bold text-[#172033]">Preparing your business plan…</p>
                    <p className="mt-2 text-base text-[#5B6475]">Sending your details securely to the local analysis service.</p>
                  </div>
                </output>
              )}

              {analysis && !isAnalyzing && (
                <div className="result-reveal" aria-live="polite">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCEBFA] pb-6">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF5DD] px-3 py-1.5 text-xs font-extrabold text-[#9A6500]">
                        <span className="size-2 rounded-full bg-[#F59E0B]" />Illustrative Prototype Analysis
                      </span>
                      <p className="mt-5 text-sm font-extrabold tracking-[0.08em] text-[#6380A0] uppercase">Your Business Plan</p>
                      <h3 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#172033]">
                        {analysis.business.business_name}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-base text-[#5B6475]">
                        <MapPin className="size-4 text-[#006EFF]" />
                        {analysis.business.location_name}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-[#E9F9F2] px-6 py-4 text-center">
                      <p className="text-xs font-bold text-[#39745F]">Business Potential</p>
                      <p className="mt-1 text-2xl font-extrabold text-[#137A52]">
                        {analysis.business_potential.rating}
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#39745F]">
                        {analysis.business_potential.score} / 100
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-[20px] border border-[#DCEBFA] bg-[#FBFDFF] p-5">
                    <h4 className="text-sm font-extrabold tracking-[0.08em] text-[#123B70] uppercase">What We Know So Far</h4>
                    <p className="mt-3 text-base leading-7 text-[#445168]">{analysis.insights.summary}</p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {localMarketCards.map(({ icon: Icon, title, copy }) => (
                      <article key={title} className="rounded-2xl border border-[#DCEBFA] bg-[#FBFDFF] p-4">
                        <div className="icon-bubble-sm">
                          <Icon className="size-5" />
                        </div>
                        <h4 className="mt-4 text-base font-bold text-[#172033]">{title}</h4>
                        <p className="mt-1 text-sm leading-6 text-[#5B6475]">{copy}</p>
                      </article>
                    ))}
                  </div>

                  <div className="mt-6 rounded-[20px] border border-[#CFE3F7] bg-[#EFF7FF] p-5 sm:p-6">
                    <h4 className="text-sm font-extrabold tracking-[0.08em] text-[#123B70] uppercase">
                      Estimated financial structure
                    </h4>
                    <dl className="mt-5 space-y-4 text-base">
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">Your Money</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatCurrency(analysis.finance.available_capital)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">Estimated Project Size</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatCurrency(analysis.finance.project_cost)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-[#CFE3F7] pt-4">
                        <dt className="font-semibold text-[#123B70]">Potential Financing</dt>
                        <dd className="text-right font-extrabold text-[#006EFF]">
                          {formatOptionalCurrency(analysis.finance.potential_financing)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">Financing Route</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {analysis.finance.scheme_name ?? 'Outside current coverage'}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">Interest</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatPercentage(analysis.finance.interest_rate)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">Repayment Period</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatYears(analysis.finance.repayment_years)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">Moratorium</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatMonths(analysis.finance.moratorium_months)}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-5 border-t border-[#CFE3F7] pt-4 text-sm leading-6 text-[#52657C]">
                      {analysis.finance.notes}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#52657C]">
                      Final eligibility and loan sanction remain subject to the authorised financing
                      agency and applicable scheme conditions.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-extrabold tracking-[0.08em] text-[#123B70] uppercase">Your Next Steps</h4>
                    <ol className="mt-4 space-y-3">
                      {analysis.insights.next_steps.map((step, index) => (
                        <li key={step} className="flex items-center gap-4 rounded-2xl border border-[#E0ECF7] p-4 text-base font-semibold text-[#445168]">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#006EFF] text-sm font-extrabold text-white">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Collapsible
                    open={detailsOpen}
                    onOpenChange={setDetailsOpen}
                    className="mt-6 rounded-[20px] border border-[#DCEBFA]"
                  >
                    <CollapsibleTrigger className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[20px] px-5 text-left text-base font-bold text-[#006EFF] hover:bg-[#F8FBFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006EFF]">
                      See Detailed Analysis
                      <ChevronDown className={`size-5 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-t border-[#DCEBFA] p-5">
                      <div className="grid gap-5 md:grid-cols-2">
                        <div className="rounded-2xl bg-[#F7FAFC] p-4">
                          <p className="text-sm font-bold text-[#172033]">Opportunities to Check</p>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5B6475]">
                            {analysis.insights.opportunities.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl bg-[#FFF9ED] p-4">
                          <p className="text-sm font-bold text-[#172033]">Things to Verify</p>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5B6475]">
                            {analysis.insights.risks.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-5 border-t border-[#DCEBFA] pt-5">
                        <p className="text-sm font-bold text-[#172033]">Sources</p>
                        <p className="mt-2 text-sm leading-6 text-[#5B6475]">
                          {analysis.sources.length > 0
                            ? `${analysis.sources.length} source records returned.`
                            : 'Local-market sources are not connected yet.'}
                        </p>
                      </div>
                      <div className="mt-5 grid gap-4 border-t border-[#DCEBFA] pt-5 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-bold text-[#172033]">Financing rule source</p>
                          <p className="mt-2 text-sm leading-6 text-[#5B6475]">
                            {analysis.finance.rule_source ?? 'No configured rule matched'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#172033]">Rule verified</p>
                          <p className="mt-2 text-sm leading-6 text-[#5B6475]">
                            {formatVerifiedDate(analysis.finance.rule_verified_date)}
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <p className="mt-5 rounded-2xl border border-[#F2D6A2] bg-[#FFF9ED] p-4 text-sm leading-6 text-[#7A5510]">
                    {analysis.disclaimer}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
