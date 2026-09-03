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
      <p className="text-sm font-extrabold tracking-[0.09em] text-[#006EFF] uppercase">{eyebrow}</p>
      <h2 className="mt-4 text-[clamp(2.25rem,4.4vw,3.8rem)] leading-[1.08] font-bold tracking-[-0.05em] text-[#172033]">{title}</h2>
      {description && <p className={`mt-5 max-w-2xl text-base leading-7 text-[#5B6475] sm:text-lg ${align === 'center' ? 'mx-auto' : ''}`}>{description}</p>}
    </div>
  );
}
