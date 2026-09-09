import type {
  MainRoute,
  NavItem,
  AudienceAction,
  PageMetadata,
  ContactConfig,
  PortfolioSettings,
  SiteMetadata,
  SiteMode,
} from '../types/site';

import portfolioData from './portfolio.json';

// Build-time site constants: supply final copy and asset/link values in portfolio.json before public launch.
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
    // Reject malformed escapes before they reach an href or image source.
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

/** Generate an encoded mailto: URL for a specific package inquiry. */
export function packageInquiryLink(
  packageTitle: string,
  email: string | undefined = PORTFOLIO.email,
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

/** Resolve only supplied sharing inputs; never use a development/preview request origin. */
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

export const MAIN_ROUTES: readonly MainRoute[] = ['/', '/work', '/services'] as const;

export const SITE_NAV: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
] as const;

export const AUDIENCE_ACTIONS: readonly AudienceAction[] = [
  {
    id: 'selected-work',
    label: 'Explore Selected Work',
    href: '/work',
    audience: 'both',
    variant: 'primary',
  },
  {
    id: 'resume',
    label: 'View résumé',
    href: '/work#resume',
    audience: 'employer',
    variant: 'secondary',
  },
  {
    id: 'start-project',
    label: 'Start a project',
    href: '/services#contact',
    audience: 'client',
    variant: 'secondary',
  },
] as const;

export const DEFAULT_PAGE_METADATA: Record<MainRoute, PageMetadata> = {
  '/': {
    title: `${PORTFOLIO.name} — ${PORTFOLIO.role}`,
    description: `Work, ideas, and web development by ${PORTFOLIO.name}. Explore projects, read the stories behind them, and start a conversation.`,
    canonicalPath: '/',
    lang: 'en',
    charset: 'UTF-8',
  },
  '/work': {
    title: `Work & Experience — ${PORTFOLIO.name}`,
    description: `Explore projects, experience, and computer-science education from ${PORTFOLIO.name}.`,
    canonicalPath: '/work',
    lang: 'en',
    charset: 'UTF-8',
  },
  '/services': {
    title: `Web Development Services — ${PORTFOLIO.name}`,
    description:
      'Business Essentials from $1,200 and Business Growth from $2,400. Websites, lead generation, and automation with a free workflow improvement assessment.',
    canonicalPath: '/services',
    lang: 'en',
    charset: 'UTF-8',
  },
};

export const CONTACT_CONFIG: ContactConfig = {
  email: PORTFOLIO.email,
  github: PORTFOLIO.github,
  linkedin: PORTFOLIO.linkedin,
  isPlaceholder: !emailLink(PORTFOLIO.email),
  notes: 'Contact details will be added before launch.',
};

export function getRobotsContent(siteMode: SiteMode): string {
  if (siteMode === 'production') {
    return 'User-agent: *\nAllow: /\n';
  }
  return 'User-agent: *\nDisallow: /\n';
}
