'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
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
  getLocations,
  type AnalysisRequest,
  type AnalysisResponse,
  type LocationOption,
} from '@/lib/api/gramvyapar-client';
import { LANGUAGE_CHANGE_EVENT, useLanguage } from '@/lib/i18n/language-context';
import { SectionHeader } from './SectionHeader';

const businesses = [
  { id: 'dairy', icon: Milk },
  { id: 'tailoring', icon: Scissors },
  { id: 'kirana', icon: ShoppingCart },
] as const;

interface FormErrors {
  location?: boolean;
  business?: boolean;
  capital?: boolean;
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatOptionalCurrency(value: number | null, unavailable: string) {
  return value === null ? unavailable : formatCurrency(value);
}

function formatPercentage(value: number | null, unavailable: string, perAnnum: string) {
  return value === null ? unavailable : `${value.toLocaleString('en-IN')}% ${perAnnum}`;
}

function formatYears(value: number | null, unavailable: string, unit: string) {
  if (value === null) return unavailable;
  return `${value.toLocaleString('en-IN')} ${unit}`;
}

function formatMonths(value: number | null, unavailable: string, unit: string) {
  if (value === null) return unavailable;
  return `${value.toLocaleString('en-IN')} ${unit}`;
}

function formatVerifiedDate(value: string | null, unavailable: string, locale: string) {
  if (value === null) return unavailable;
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatDistance(value: number | null, unavailable: string, away: string) {
  return value === null ? unavailable : `${value.toLocaleString('en-IN')} km ${away}`;
}

export function PrototypePreview() {
  const { language, t } = useLanguage();
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [location, setLocation] = useState('');
  const [business, setBusiness] = useState('');
  const [capital, setCapital] = useState('1,00,000');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<Omit<AnalysisRequest, 'language'> | null>(null);
  const [resultLanguage, setResultLanguage] = useState<'en' | 'hi' | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serviceError, setServiceError] = useState<'unavailable' | 'generic' | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'evidence' | 'finance' | 'advisory'>('evidence');

  useEffect(() => {
    let active = true;

    getLocations()
      .then((configuredLocations) => {
        if (active) setLocations(configuredLocations);
      })
      .catch(() => {
        if (active) setLocationError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isAnalyzing) return;
    const financeTimer = window.setTimeout(
      () => setAnalysisStage('finance'),
      450,
    );
    const advisoryTimer = window.setTimeout(
      () => setAnalysisStage('advisory'),
      950,
    );
    return () => {
      window.clearTimeout(financeTimer);
      window.clearTimeout(advisoryTimer);
    };
  }, [isAnalyzing]);

  useEffect(() => {
    async function refreshAdvisoryLanguage() {
      const savedLanguage = window.localStorage.getItem('gramvyapar-language');
      const nextLanguage = savedLanguage === 'hi' ? 'hi' : 'en';
      if (!analysis || !lastRequest || resultLanguage === nextLanguage) return;
      setIsAnalyzing(true);
      setServiceError(null);
      try {
        const response = await analyzeBusiness({ ...lastRequest, language: nextLanguage });
        setAnalysis(response);
        setResultLanguage(nextLanguage);
      } catch (error) {
        setAnalysis(null);
        setServiceError(
          error instanceof Error && error.message.includes('unavailable')
            ? 'unavailable'
            : 'generic',
        );
      } finally {
        setIsAnalyzing(false);
      }
    }
    window.addEventListener(LANGUAGE_CHANGE_EVENT, refreshAdvisoryLanguage);
    return () => window.removeEventListener(LANGUAGE_CHANGE_EVENT, refreshAdvisoryLanguage);
  }, [analysis, lastRequest, resultLanguage]);

  function clearPreviousResult() {
    setAnalysis(null);
    setLastRequest(null);
    setResultLanguage(null);
    setServiceError(null);
    setDetailsOpen(false);
  }

  async function analyze() {
    const parsedCapital = Number(capital.replace(/[₹,\s]/g, ''));
    const nextErrors: FormErrors = {};

    if (!location) {
      nextErrors.location = true;
    }
    if (!business) {
      nextErrors.business = true;
    }
    if (!capital.trim() || !Number.isFinite(parsedCapital) || parsedCapital <= 0) {
      nextErrors.capital = true;
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
    setAnalysisStage('evidence');
    setIsAnalyzing(true);

    try {
      const request = {
        location_id: location,
        business_id: business,
        available_capital: parsedCapital,
      };
      const response = await analyzeBusiness({ ...request, language });
      setAnalysis(response);
      setLastRequest(request);
      setResultLanguage(language);
    } catch (error) {
      setServiceError(
        error instanceof Error && error.message.includes('unavailable') ? 'unavailable' : 'generic',
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  const localMarketCards = analysis
    ? [
        {
          icon: UsersRound,
          title: t.prototype.customerBase,
          copy:
            analysis.local_market.population_estimate === null
              ? t.prototype.populationUnavailable
              : analysis.local_market.population_estimate.toLocaleString('en-IN'),
        },
        {
          icon: Store,
          title: t.prototype.mappedCompetitors,
          copy: `${analysis.local_market.mapped_competitors.toLocaleString('en-IN')} ${
            analysis.local_market.mapped_competitors === 1
              ? t.prototype.nearbyMappedSingular
              : t.prototype.nearbyMappedPlural
          }`,
        },
        {
          icon: MapPin,
          title: t.prototype.locationType,
          copy:
            language === 'hi'
              ? analysis.local_market.location_type === 'Rural'
                ? 'ग्रामीण'
                : 'अर्ध-शहरी'
              : analysis.local_market.location_type,
        },
      ]
    : [];

  const scoreComponents = analysis
    ? [
        {
          key: 'market-opportunity',
          label: t.prototype.marketOpportunity,
          component: analysis.business_potential.components.market_opportunity,
        },
        {
          key: 'competition',
          label: t.prototype.competition,
          component: analysis.business_potential.components.competition,
        },
        {
          key: 'financial-fit',
          label: t.prototype.financialFit,
          component: analysis.business_potential.components.financial_fit,
        },
        {
          key: 'operational-readiness',
          label: t.prototype.operationalReadiness,
          component: analysis.business_potential.components.operational_readiness,
        },
      ]
    : [];

  return (
    <section id="prototype" className="section-shell bg-white">
      <div className="section-container">
        <SectionHeader
          eyebrow={t.prototype.eyebrow}
          title={t.prototype.title}
          description={t.prototype.description}
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
                  <p className="text-lg font-bold text-[#172033]">{t.prototype.formTitle}</p>
                  <p className="text-sm text-[#5B6475]">{t.prototype.formTime}</p>
                </div>
              </div>

              <div className="mt-8 space-y-8">
                <div>
                  <label
                    htmlFor="plan-location"
                    className="flex items-center gap-3 text-base font-bold text-[#172033]"
                  >
                    <span className="step-number">1</span>{t.prototype.where}
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
                      <SelectValue placeholder={t.prototype.chooseLocation}>
                        {(selectedValue: string | null) => {
                          const selectedLocation = locations.find(
                            (option) => option.location_id === selectedValue,
                          );
                          return selectedLocation
                            ? `${selectedLocation.location_name} · ${language === 'hi' ? (selectedLocation.location_type === 'Rural' ? 'ग्रामीण' : 'अर्ध-शहरी') : selectedLocation.location_type}`
                            : t.prototype.chooseLocation;
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="border-[#CFE3F7] bg-white">
                      {locations.map(({ location_id, location_name, location_type }) => (
                        <SelectItem key={location_id} value={location_id}>
                          {location_name} · {language === 'hi' ? (location_type === 'Rural' ? 'ग्रामीण' : 'अर्ध-शहरी') : location_type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p id="plan-location-help" className="mt-2 text-sm text-[#68758A]">
                    {t.prototype.locationHelp}
                  </p>
                  {locationError && (
                    <p role="alert" className="mt-2 text-sm font-semibold text-[#B42318]">
                      {t.prototype.locationLoadError}
                    </p>
                  )}
                  {errors.location && (
                    <p id="plan-location-error" role="alert" className="mt-2 text-sm font-semibold text-[#B42318]">
                      {t.prototype.locationRequired}
                    </p>
                  )}
                </div>

                <fieldset aria-describedby="plan-business-error">
                  <legend className="flex items-center gap-3 text-base font-bold text-[#172033]">
                    <span className="step-number">2</span>{t.prototype.businessQuestion}
                  </legend>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                    {businesses.map(({ id, icon: Icon }) => {
                      const selected = business === id;
                      const label = t.prototype.businessNames[id];
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
                          {selected && <span className="sr-only"> {t.prototype.selected}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {errors.business && (
                    <p id="plan-business-error" role="alert" className="mt-2 text-sm font-semibold text-[#B42318]">
                      {t.prototype.businessRequired}
                    </p>
                  )}
                </fieldset>

                <div>
                  <label
                    htmlFor="plan-capital"
                    className="flex items-center gap-3 text-base font-bold text-[#172033]"
                  >
                    <span className="step-number">3</span>{t.prototype.capitalQuestion}
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
                      {t.prototype.capitalRequired}
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
                    <LoaderCircle className="size-5 animate-spin" />{t.prototype.analyzing}
                  </>
                ) : (
                  <>
                    {t.prototype.analyze}<ArrowRight className="size-5" />
                  </>
                )}
              </Button>
              {serviceError && (
                <div role="alert" className="mt-4 rounded-2xl border border-[#F4C7C3] bg-[#FFF5F4] p-4 text-sm text-[#8A1C13]">
                  <p className="font-bold">
                    {serviceError === 'unavailable'
                      ? t.prototype.serviceUnavailable
                      : t.prototype.serviceGeneric}
                  </p>
                  {process.env.NODE_ENV === 'development' && (
                    <p className="mt-1">{t.prototype.devHint}</p>
                  )}
                </div>
              )}
              <p className="mt-4 text-center text-sm text-[#68758A]">
                {t.prototype.privacy}
              </p>
            </div>

            <div className="min-h-[690px] p-5 sm:p-8">
              {!analysis && !isAnalyzing && (
                <div className="grid h-full min-h-[620px] place-items-center rounded-[20px] border-2 border-dashed border-[#DCEBFA] bg-[#FBFDFF] p-8 text-center">
                  <div>
                    <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-[#EFF7FF] text-[#006EFF]">
                      <ArrowRight className="size-7" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-[#172033]">{t.prototype.emptyTitle}</h3>
                    <p className="mx-auto mt-2 max-w-sm text-base leading-7 text-[#5B6475]">
                      {t.prototype.emptyCopy}
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
                    <p className="mt-5 text-lg font-bold text-[#172033]">
                      {analysisStage === 'evidence'
                        ? t.prototype.loadEvidence
                        : analysisStage === 'finance'
                          ? t.prototype.loadFinance
                          : t.prototype.loadAdvisory}
                    </p>
                    <p className="mt-2 text-base text-[#5B6475]">{t.prototype.loadingCopy}</p>
                  </div>
                </output>
              )}

              {analysis && !isAnalyzing && (
                <div className="result-reveal" aria-live="polite">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#DCEBFA] pb-6">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF5DD] px-3 py-1.5 text-xs font-extrabold text-[#9A6500]">
                        <span className="size-2 rounded-full bg-[#34A873]" />{t.prototype.analysisBadge}
                      </span>
                      <p className="mt-5 text-sm font-extrabold tracking-[0.08em] text-[#6380A0] uppercase">{t.prototype.planHeading}</p>
                      <h3 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#172033]">
                        {t.prototype.businessNames[analysis.business.business_id as keyof typeof t.prototype.businessNames] ?? analysis.business.business_name}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-base text-[#5B6475]">
                        <MapPin className="size-4 text-[#006EFF]" />
                        {analysis.business.location_name}
                      </p>
                    </div>
                    <div className="rounded-[18px] bg-[#E9F9F2] px-6 py-4 text-center">
                      <p className="text-xs font-bold text-[#39745F]">{t.prototype.potential}</p>
                      <p className="mt-1 text-2xl font-extrabold text-[#137A52]">
                        {t.prototype.ratings[analysis.business_potential.rating as keyof typeof t.prototype.ratings] ?? analysis.business_potential.rating}
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#39745F]">
                        {analysis.business_potential.score} / 100
                      </p>
                      <p className="mt-2 text-xs font-semibold text-[#39745F] capitalize">
                        {t.prototype.levels[analysis.business_potential.confidence]} {t.prototype.evidenceConfidence}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {scoreComponents.map(({ key, label, component }) => (
                      <article key={key} className="rounded-2xl border border-[#DCEBFA] bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-sm font-bold text-[#172033]">{label}</h4>
                          <p className="text-sm font-extrabold text-[#123B70]">
                            {component.score} / {component.max_score}
                          </p>
                        </div>
                        <progress
                          className="mt-3 h-2 w-full overflow-hidden rounded-full accent-[#006EFF]"
                          aria-label={`${label} score`}
                          max={component.max_score}
                          value={component.score}
                        >
                          {component.score} {t.prototype.outOf} {component.max_score}
                        </progress>
                      </article>
                    ))}
                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#68758A]">
                    {t.prototype.confidenceHelp}
                  </p>

                  <div className="mt-6 rounded-[20px] border border-[#CFE3F7] bg-[#F5FAFF] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h4 className="text-sm font-extrabold tracking-[0.08em] text-[#123B70] uppercase">{t.prototype.advisory}</h4>
                      {analysis.advisory.ai_status !== 'generated' && (
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#52657C]">
                          {t.prototype.fallback}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-base leading-7 text-[#445168]">{analysis.advisory.summary}</p>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-bold text-[#172033]">{t.prototype.whyScore}</p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-[#5B6475]">
                          {analysis.advisory.why_this_score.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#172033]">{t.prototype.thingsCheck}</p>
                        <ul className="mt-2 space-y-2 text-sm leading-6 text-[#5B6475]">
                          {analysis.advisory.risks.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
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

                  {analysis.local_market.evidence_status !== 'complete' && (
                    <p className="mt-4 rounded-2xl border border-[#F2D6A2] bg-[#FFF9ED] p-4 text-sm leading-6 text-[#7A5510]">
                      {t.prototype.incomplete}
                    </p>
                  )}

                  <div className="mt-6 rounded-[20px] border border-[#CFE3F7] bg-[#EFF7FF] p-5 sm:p-6">
                    <h4 className="text-sm font-extrabold tracking-[0.08em] text-[#123B70] uppercase">
                      {t.prototype.financeHeading}
                    </h4>
                    <dl className="mt-5 space-y-4 text-base">
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">{t.prototype.yourMoney}</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatCurrency(analysis.finance.available_capital)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">{t.prototype.projectSize}</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatCurrency(analysis.finance.project_cost)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4 border-t border-[#CFE3F7] pt-4">
                        <dt className="font-semibold text-[#123B70]">{t.prototype.financing}</dt>
                        <dd className="text-right font-extrabold text-[#006EFF]">
                          {formatOptionalCurrency(analysis.finance.potential_financing, t.prototype.unavailable)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">{t.prototype.financingRoute}</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {analysis.finance.scheme_name ?? t.prototype.outsideCoverage}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">{t.prototype.interest}</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatPercentage(analysis.finance.interest_rate, t.prototype.unavailable, t.prototype.perAnnum)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">{t.prototype.repayment}</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatYears(analysis.finance.repayment_years, t.prototype.unavailable, t.prototype.years)}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-[#5B6475]">{t.prototype.moratorium}</dt>
                        <dd className="text-right font-extrabold text-[#172033]">
                          {formatMonths(analysis.finance.moratorium_months, t.prototype.unavailable, t.prototype.months)}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-5 border-t border-[#CFE3F7] pt-4 text-sm leading-6 text-[#52657C]">
                      {analysis.finance.status === 'configured'
                        ? t.prototype.configuredNote
                        : t.prototype.outsideNote}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-[#52657C]">
                      {t.prototype.finalEligibility}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-extrabold tracking-[0.08em] text-[#123B70] uppercase">{t.prototype.nextSteps}</h4>
                    <ol className="mt-4 space-y-3">
                      {analysis.advisory.next_steps.map((step, index) => (
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
                      {t.prototype.details}
                      <ChevronDown className={`size-5 transition-transform ${detailsOpen ? 'rotate-180' : ''}`} />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="border-t border-[#DCEBFA] p-5">
                      <div>
                        <div className="flex flex-wrap items-end justify-between gap-3">
                          <div>
                            <p className="text-sm font-bold text-[#172033]">{t.prototype.detailsScore}</p>
                            <p className="mt-1 text-sm leading-6 text-[#5B6475]">
                              {t.prototype.detailsScoreCopy}
                            </p>
                          </div>
                          <p className="text-xs font-semibold text-[#68758A]">
                            {t.prototype.method}: {analysis.business_potential.methodology_version}
                          </p>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {scoreComponents.map(({ key, label, component }) => (
                            <article key={`reason-${key}`} className="rounded-2xl bg-[#F7FAFC] p-4">
                              <div className="flex items-center justify-between gap-3">
                                <h5 className="text-sm font-bold text-[#172033]">{label}</h5>
                                <span className="text-sm font-extrabold text-[#006EFF]">
                                  {component.score}/{component.max_score}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-[#5B6475]">
                                {component.reason}
                              </p>
                              <p className="mt-2 text-xs font-semibold text-[#68758A] capitalize">
                                {t.prototype.levels[component.confidence]} {t.prototype.confidence}
                              </p>
                              <p className="mt-2 text-xs leading-5 text-[#68758A]">
                                {component.limitations.join(' ')}
                              </p>
                            </article>
                          ))}
                        </div>
                        {analysis.business_potential.missing_evidence.length > 0 && (
                          <div className="mt-4 rounded-2xl border border-[#F2D6A2] bg-[#FFF9ED] p-4">
                            <p className="text-sm font-bold text-[#172033]">{t.prototype.evidenceNeeded}</p>
                            <p className="mt-2 text-sm leading-6 text-[#5B6475]">
                              {analysis.business_potential.missing_evidence
                                .map((item) => t.prototype.missingEvidence[item as keyof typeof t.prototype.missingEvidence] ?? item)
                                .join(' · ')}
                            </p>
                          </div>
                        )}
                        <p className="mt-4 text-sm leading-6 text-[#5B6475]">
                          {language === 'hi'
                            ? t.prototype.scoreDisclaimer
                            : analysis.business_potential.disclaimer}
                        </p>
                      </div>

                      <div className="mt-5 grid gap-5 border-t border-[#DCEBFA] pt-5 md:grid-cols-2">
                        <div className="rounded-2xl bg-[#F7FAFC] p-4">
                          <p className="text-sm font-bold text-[#172033]">{t.prototype.opportunities}</p>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5B6475]">
                            {analysis.advisory.opportunities.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="rounded-2xl bg-[#FFF9ED] p-4">
                          <p className="text-sm font-bold text-[#172033]">{t.prototype.verify}</p>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5B6475]">
                            {analysis.advisory.risks.map((item) => (
                              <li key={item}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-5 border-t border-[#DCEBFA] pt-5">
                        <p className="text-sm font-bold text-[#172033]">{t.prototype.swot}</p>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {(
                            [
                              [t.prototype.strengths, analysis.advisory.swot.strengths],
                              [t.prototype.weaknesses, analysis.advisory.swot.weaknesses],
                              [t.prototype.opportunities, analysis.advisory.swot.opportunities],
                              [t.prototype.threats, analysis.advisory.swot.threats],
                            ] as const
                          ).map(([label, items]) => (
                            <article key={label} className="rounded-2xl bg-[#F7FAFC] p-4">
                              <p className="text-sm font-bold text-[#172033]">{label}</p>
                              <ul className="mt-2 space-y-2 text-sm leading-6 text-[#5B6475]">
                                {items.map((item) => (
                                  <li key={item}>• {item}</li>
                                ))}
                              </ul>
                            </article>
                          ))}
                        </div>
                      </div>
                      <div className="mt-5 border-t border-[#DCEBFA] pt-5">
                        <p className="text-sm font-bold text-[#172033]">{t.prototype.questions}</p>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-[#5B6475]">
                          {analysis.advisory.questions_to_verify.map((item) => (
                            <li key={item}>• {item}</li>
                          ))}
                        </ul>
                        <p className="mt-4 text-sm leading-6 text-[#5B6475]">
                          {analysis.advisory.confidence_note}
                        </p>
                      </div>
                      <div className="mt-5 border-t border-[#DCEBFA] pt-5">
                        <p className="text-sm font-bold text-[#172033]">{t.prototype.localEvidence}</p>
                        <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
                          <div className="rounded-2xl bg-[#F7FAFC] p-4">
                            <dt className="font-bold text-[#172033]">{t.prototype.population}</dt>
                            <dd className="mt-2 leading-6 text-[#5B6475]">
                              {analysis.local_market.population_estimate?.toLocaleString('en-IN') ??
                                t.prototype.unavailable}
                              {analysis.local_market.population_year
                                ? ` · ${analysis.local_market.population_year}`
                                : ''}
                            </dd>
                            <dd className="mt-1 leading-6 text-[#5B6475]">
                              {t.prototype.source}: {analysis.local_market.population_source ?? t.prototype.unavailable}
                            </dd>
                            <dd className="mt-1 leading-6 text-[#5B6475]">
                              {t.prototype.confidence}:{' '}
                              {analysis.local_market.population_confidence
                                ? t.prototype.levels[analysis.local_market.population_confidence.toLowerCase() as 'high' | 'medium' | 'low']
                                : t.prototype.unavailable}
                            </dd>
                          </div>
                          <div className="rounded-2xl bg-[#F7FAFC] p-4">
                            <dt className="font-bold text-[#172033]">{t.prototype.searchArea}</dt>
                            <dd className="mt-2 leading-6 text-[#5B6475]">
                              {analysis.local_market.competitor_radius_km === null
                                ? t.prototype.radiusUnavailable
                                : `${t.prototype.upTo} ${analysis.local_market.competitor_radius_km.toLocaleString('en-IN')} km`}
                            </dd>
                            <dd className="mt-1 leading-6 text-[#5B6475]">
                              {t.prototype.evidenceStatus}:{' '}
                              {t.prototype.levels[analysis.local_market.evidence_status]}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <div className="mt-5 border-t border-[#DCEBFA] pt-5">
                        <p className="text-sm font-bold text-[#172033]">{t.prototype.mappedList}</p>
                        {analysis.local_market.competitors.length > 0 ? (
                          <ul className="mt-3 space-y-3">
                            {analysis.local_market.competitors.map((competitor) => (
                              <li
                                key={`${competitor.business_name}-${competitor.distance_km}`}
                                className="rounded-2xl bg-[#F7FAFC] p-4 text-sm"
                              >
                                <p className="font-bold text-[#172033]">{competitor.business_name}</p>
                                <p className="mt-1 leading-6 text-[#5B6475]">
                                  {formatDistance(competitor.distance_km, t.prototype.distanceUnavailable, t.prototype.away)} · {competitor.source} ·{' '}
                                  {t.prototype.levels[competitor.confidence.toLowerCase() as 'high' | 'medium' | 'low']} {t.prototype.confidence}
                                </p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm leading-6 text-[#5B6475]">
                            {t.prototype.noMapped}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 border-t border-[#DCEBFA] pt-5">
                        <p className="text-sm font-bold text-[#172033]">{t.prototype.businessEvidence}</p>
                        <dl className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
                          <div>
                            <dt className="font-semibold text-[#172033]">{t.prototype.customerType}</dt>
                            <dd className="mt-1 leading-6 text-[#5B6475]">
                              {analysis.local_market.business_profile.customer_type}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-[#172033]">{t.prototype.supplierDependency}</dt>
                            <dd className="mt-1 leading-6 text-[#5B6475]">
                              {analysis.local_market.business_profile.supplier_dependency}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-[#172033]">{t.prototype.seasonality}</dt>
                            <dd className="mt-1 leading-6 text-[#5B6475]">
                              {analysis.local_market.business_profile.seasonality}
                            </dd>
                          </div>
                          <div>
                            <dt className="font-semibold text-[#172033]">{t.prototype.demandIndicators}</dt>
                            <dd className="mt-1 leading-6 text-[#5B6475]">
                              {analysis.local_market.business_profile.key_demand_indicators.join('; ')}
                            </dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="font-semibold text-[#172033]">{t.prototype.operationalRisks}</dt>
                            <dd className="mt-1 leading-6 text-[#5B6475]">
                              {analysis.local_market.business_profile.main_operational_risks.join('; ')}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      {analysis.local_market.warnings.length > 0 && (
                        <div className="mt-5 border-t border-[#DCEBFA] pt-5">
                          <p className="text-sm font-bold text-[#172033]">{t.prototype.limitations}</p>
                          <ul className="mt-2 space-y-2 text-sm leading-6 text-[#5B6475]">
                            {analysis.local_market.warnings.map((warning) => (
                              <li key={warning}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <div className="mt-5 border-t border-[#DCEBFA] pt-5">
                        <p className="text-sm font-bold text-[#172033]">{t.prototype.sources}</p>
                        <p className="mt-2 text-sm leading-6 text-[#5B6475]">
                          {analysis.sources.length > 0
                            ? `${analysis.sources.length} ${t.prototype.sourceRecords}`
                            : t.prototype.noSources}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#5B6475] capitalize">
                          {t.prototype.advisoryStatus}:{' '}
                          {t.prototype.levels[analysis.advisory.ai_status]} · {t.prototype.prompt}:{' '}
                          {analysis.advisory.prompt_version}
                        </p>
                      </div>
                      <div className="mt-5 grid gap-4 border-t border-[#DCEBFA] pt-5 sm:grid-cols-2">
                        <div>
                          <p className="text-sm font-bold text-[#172033]">{t.prototype.ruleSource}</p>
                          <p className="mt-2 text-sm leading-6 text-[#5B6475]">
                            {analysis.finance.rule_source ?? t.prototype.outsideCoverage}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#172033]">{t.prototype.ruleVerified}</p>
                          <p className="mt-2 text-sm leading-6 text-[#5B6475]">
                            {formatVerifiedDate(
                              analysis.finance.rule_verified_date,
                              t.prototype.unavailable,
                              language === 'hi' ? 'hi-IN' : 'en-IN',
                            )}
                          </p>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <p className="mt-5 rounded-2xl border border-[#F2D6A2] bg-[#FFF9ED] p-4 text-sm leading-6 text-[#7A5510]">
                    {analysis.advisory.disclaimer}{' '}
                    {language === 'hi' ? t.prototype.scoreDisclaimer : analysis.disclaimer}
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
