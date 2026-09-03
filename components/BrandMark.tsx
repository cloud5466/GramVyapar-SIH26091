import { Handshake } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/site-config';

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-3 whitespace-nowrap">
      <span className="grid size-10 place-items-center rounded-2xl bg-[#006EFF] text-white shadow-[0_8px_20px_rgba(0,110,255,0.2)]">
        <Handshake className="size-5" strokeWidth={2} aria-hidden="true" />
      </span>
      {!compact && (
        <span className="text-[17px] font-bold tracking-[-0.03em] text-[#123B70]">{SITE_CONFIG.brandDisplay}</span>
      )}
    </span>
  );
}
