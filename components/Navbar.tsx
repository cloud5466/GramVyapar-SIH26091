import { ArrowUpRight } from 'lucide-react';
import { NAV_ITEMS, SITE_CONFIG } from '@/lib/site-config';
import { BrandMark } from './BrandMark';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#008CFF]/15 bg-[#030712]/78 backdrop-blur-xl">
      <nav
        className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12"
        aria-label="Primary navigation"
      >
        <a href="#overview" aria-label={`${SITE_CONFIG.productName} home`}>
          <BrandMark />
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-[#94A3B8] transition-colors hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008CFF]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#prototype"
          className="group inline-flex h-10 items-center gap-2 rounded-xl border border-[#008CFF]/30 bg-[#008CFF]/10 px-4 text-sm font-semibold text-[#F8FAFC] transition hover:border-[#008CFF]/55 hover:bg-[#008CFF]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#008CFF]"
        >
          <span className="hidden sm:inline">Explore Prototype</span>
          <span className="sm:hidden">Prototype</span>
          <ArrowUpRight className="size-4 text-[#00B7FF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </nav>
    </header>
  );
}
