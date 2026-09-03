import { BrandMark } from './BrandMark';
import { SITE_CONFIG } from '@/lib/site-config';

export function Footer() {
  return (
    <footer className="border-t border-[#DCEBFA] bg-white">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div><BrandMark /><p className="mt-3 text-base font-medium text-[#5B6475]">“{SITE_CONFIG.tagline}”</p></div>
        <div className="space-y-1 text-sm leading-6 text-[#5B6475] md:text-right"><p className="font-semibold text-[#123B70]">{SITE_CONFIG.eventName}</p><p>Problem Statement: {SITE_CONFIG.problemId}</p><p>Team name: {SITE_CONFIG.teamName}</p></div>
      </div>
    </footer>
  );
}
