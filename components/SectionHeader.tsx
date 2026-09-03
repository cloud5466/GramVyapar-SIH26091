import type { ReactNode } from 'react';

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: 'left' | 'center';
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="text-xs font-semibold tracking-[0.16em] text-[#00B7FF] uppercase">{eyebrow}</p>
      <h2 className="mt-4 text-[clamp(2.25rem,4vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.055em] text-[#F8FAFC]">{title}</h2>
      {description && <p className="mt-5 max-w-2xl text-base leading-7 text-[#94A3B8] sm:text-lg">{description}</p>}
    </div>
  );
}
