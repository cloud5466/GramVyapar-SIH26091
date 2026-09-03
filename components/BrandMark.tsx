import { Network } from 'lucide-react';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative grid size-9 place-items-center rounded-xl border border-[#008CFF]/35 bg-[#008CFF]/10 text-[#00B7FF] shadow-[0_0_24px_rgba(0,140,255,0.12)]">
        <Network className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
        <span className="absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent" />
      </span>
      {!compact && (
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-[#F8FAFC]">
          GramVyapar <span className="text-[#00B7FF]">AI</span>
        </span>
      )}
    </span>
  );
}
