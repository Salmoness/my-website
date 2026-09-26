import type {
  MainRoute,
  NavItem,
  AudienceAction,
  PageMetadata,
  ContactConfig,
  PortfolioSettings,
  SiteConfig,
  SiteMetadata,
  SiteMode,
} from '../types/site';
import saymonFounder from '../assets/images/azul/saymon-rivas-founder.png';

import portfolioData from './portfolio.json';

/** Current public identity. An empty form endpoint remains a release checklist item. */
export const SITE: SiteConfig = {
  name: 'Azul Online Projects',
  shortName: 'Azul',
  operator: 'Saymon Rivas',
  headline: 'Grow your online identity.',
  supportingLine:
    'Websites and systems that sharpen your business. Content that brings people to you.',
  email: 'saymon@azulonlineprojects.com',
  siteUrl: 'https://azulonlineprojects.com',
  location: 'Orlando, Florida',
  serviceArea: 'Central Florida and remote clients across the United States',
  consultationHref: '/services#contact',
  formEndpoint: '',
  founderPortrait: saymonFounder,
  motionEnabled: true,
  scrollFogEnabled: false,
  /** Home-page loading screen, shown on every Home load for at least one second. */
  loaderEnabled: true,
  /** Monthly website plan price range, e.g. '$150–$400'. Leave empty to show "Quoted after the call". */
  monthlyPlanPrice: '$50–$400',
};

/** Temporary compatibility export for the unlinked legacy Work route and its pending cleanup. */
export const PORTFOLIO: PortfolioSettings = portfolioData;

/** Allow HTTPS destinations and local paths, never protocol-relative URLs or credentials. */
export function safeLink(value: string | undefined): string | undefined {
  if (
    !value ||
    /[\s<>\\]/.test(value) ||
    /%(?:0[0-9a-f]|1[0-9a-f]|7f|5c)/i.test(value) ||
    Array.from(value).some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || code === 127;
    })
  ) {
    return undefined;
  }

  try {
    decodeURIComponent(value);
    if (/^\/(?!\/|%2f)/i.test(value)) return value;
    if (!/^https:\/\//i.test(value)) return undefined;
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined;
  } catch {
    return undefined;
  }
}

/** Common mailbox syntax only; URL parameters and encoded mail headers are not accepted. */
export function emailLink(value: string | undefined): string | undefined {
  return value &&
    /^[a-z0-9_+-]+(?:\.[a-z0-9_+-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(value)
    ? `mailto:${value}`
    : undefined;
}

/** Generate an encoded mailto URL for a specific package inquiry. */
export function packageInquiryLink(
  packageTitle: string,
  email: string | undefined = SITE.email,
): string | undefined {
  const mail = emailLink(email);
  if (!mail) return undefined;
  const cleanTitle = packageTitle.trim().replace(/[\r\n\t]/g, ' ');
  return `${mail}?subject=${encodeURIComponent(`Project inquiry: ${cleanTitle}`)}`;
}

function getPublicOrigin(value: string): string | undefined {
  const href = safeLink(value);
  if (!href || !href.startsWith('https://')) return undefined;
  const url = new URL(href);
  return url.pathname === '/' && !url.search && !url.hash ? url.origin : undefined;
}

/** Resolve only configured sharing inputs; never use a preview request origin. */
export function getPageSharing(
  metadata: PageMetadata | SiteMetadata,
  settings: PortfolioSettings = PORTFOLIO,
): {
  canonicalUrl: string | undefined;
  imageUrl: string | undefined;
  imageAlt: string | undefined;
} {
  const origin = getPublicOrigin(settings.siteUrl);
  const path = 'canonicalPath' in metadata ? safeLink(metadata.canonicalPath) : undefined;
  const canonicalUrl = origin && path?.startsWith('/') ? new URL(path, origin) : undefined;
  if (canonicalUrl) {
    canonicalUrl.search = '';
    canonicalUrl.hash = '';
  }

  const hasPageImage = 'socialImage' in metadata && metadata.socialImage !== undefined;
  const image = safeLink(hasPageImage ? metadata.socialImage : settings.socialImageUrl);
  const imageUrl = image?.startsWith('/')
    ? origin
      ? new URL(image, origin).href
      : undefined
    : image;
  const imageAlt = hasPageImage
    ? 'socialImageAlt' in metadata
      ? metadata.socialImageAlt
      : undefined
    : settings.socialImageAlt;

  return {
    canonicalUrl: canonicalUrl?.href,
    imageUrl,
    imageAlt: imageUrl ? imageAlt?.trim() || undefined : undefined,
  };
}

export const MAIN_ROUTES: readonly MainRoute[] = [
  '/',
  '/services',
  '/how-we-work',
  '/about',
] as const;

export const SITE_NAV: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'How We Work', href: '/how-we-work' },
  { label: 'About', href: '/about' },
] as const;

export const AUDIENCE_ACTIONS: readonly AudienceAction[] = [
  {
    id: 'starting',
    label: 'I’m starting a business',
    href: '/services#online-foundation',
    audience: 'client',
    variant: 'primary',
  },
  {
    id: 'growing',
    label: 'I’m ready to grow',
    href: '/services#ongoing-visibility',
    audience: 'client',
    variant: 'secondary',
  },
] as const;

export const DEFAULT_PAGE_METADATA: Record<MainRoute, PageMetadata> = {
  '/': {
    title: 'Azul Online Projects — Grow your online identity',
    description:
      'Websites, digital systems, and social content for small businesses in Orlando, Central Florida, and across the United States.',
    canonicalPath: '/',
    lang: 'en',
    charset: 'UTF-8',
  },
  '/services': {
    title: 'Services — Azul Online Projects',
    description:
      'Build an online foundation or stay visible: websites you own or run monthly, CRM, automations, follow-ups, social content, business profiles, and Google and Meta ads.',
    canonicalPath: '/services',
    lang: 'en',
    charset: 'UTF-8',
  },
  '/how-we-work': {
    title: 'How We Work — Azul Online Projects',
    description:
      'The four steps from a free first call to launch day: what happens, who does what, how long it takes, and what stays yours.',
    canonicalPath: '/how-we-work',
    lang: 'en',
    charset: 'UTF-8',
  },
  '/about': {
    title: 'About — Azul Online Projects',
    description:
      'Meet Saymon Rivas, the Orlando founder behind Azul, and what working with him is actually like.',
    canonicalPath: '/about',
    lang: 'en',
    charset: 'UTF-8',
  },
  '/privacy': {
    title: 'Privacy — Azul Online Projects',
    description: 'How Azul handles the information shared through a project enquiry.',
    canonicalPath: '/privacy',
    lang: 'en',
    charset: 'UTF-8',
  },
  '/work': {
    title: 'Archived portfolio route — Azul Online Projects',
    description: 'A legacy staging route scheduled for removal before the Azul MVP is released.',
    canonicalPath: '/work',
    lang: 'en',
    charset: 'UTF-8',
    noindex: true,
  },
};

export const CONTACT_CONFIG: ContactConfig = {
  email: SITE.email,
  github: '',
  linkedin: '',
  isPlaceholder: !emailLink(SITE.email),
  notes: 'Public mailbox configuration remains a release checklist item.',
};

export function getRobotsContent(siteMode: SiteMode): string {
  if (siteMode === 'production') return 'User-agent: *\nAllow: /\n';
  return 'User-agent: *\nDisallow: /\n';
}
