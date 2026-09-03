import { ArrowRight } from 'lucide-react';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/site-config';
import { BrandMark } from './BrandMark';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#DCEBFA] bg-white/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10"
        aria-label="Primary navigation"
      >
        <a href="#overview" aria-label={`${SITE_CONFIG.productName} home`}>
          <BrandMark />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md text-[15px] font-semibold text-[#5B6475] transition-colors hover:text-[#006EFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006EFF]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div aria-label="Language selector preview" className="flex items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm">
            <span className="text-[#006EFF]"><span className="hidden sm:inline">English</span><span className="sm:hidden">EN</span></span><span className="text-[#B7C2D0]">|</span><span className="text-[#5B6475]">हिंदी</span>
          </div>
          <a href="#prototype" className="group inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-xl bg-[#006EFF] px-4 text-sm font-bold text-white shadow-[0_8px_20px_rgba(0,110,255,.18)] transition hover:bg-[#005ED9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006EFF] focus-visible:ring-offset-2">
            <span className="hidden lg:inline">Start Planning</span><span className="lg:hidden">Start</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </nav>
    </header>
  );
}
