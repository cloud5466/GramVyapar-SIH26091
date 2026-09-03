import { BrandMark } from './BrandMark';
import { SITE_CONFIG } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.055] bg-[#030712]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <div><BrandMark /><p className="mt-3 text-sm text-[#64748B]">Evidence-backed rural business advisory.</p></div>
        <div className="flex flex-wrap gap-x-7 gap-y-2 text-sm text-[#64748B]"><span>{SITE_CONFIG.eventName}</span><span>Problem Statement {SITE_CONFIG.problemId}</span><span>{SITE_CONFIG.teamName}</span></div>
      </div>
    </footer>
  );
}
