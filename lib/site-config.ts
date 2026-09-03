import { PROJECT_CONFIG } from '@/config/project';

export const SITE_CONFIG = {
  productName: PROJECT_CONFIG.productName,
  brandDisplay: PROJECT_CONFIG.productName,
  tagline: PROJECT_CONFIG.tagline,
  eventName: PROJECT_CONFIG.eventName,
  problemId: PROJECT_CONFIG.problemStatementId,
  teamName: PROJECT_CONFIG.teamName,
} as const;

export const NAV_ITEMS = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'What You Get', href: '#what-you-get' },
  { label: 'About', href: '#about' },
] as const;
