import type { ImageMetadata } from 'astro';

export type MainRoute = '/' | '/services' | '/how-we-work' | '/about' | '/privacy' | '/work';

export interface SiteConfig {
  readonly name: string;
  readonly shortName: string;
  readonly operator: string;
  readonly headline: string;
  readonly supportingLine: string;
  readonly email: string;
  readonly siteUrl: string;
  readonly location: string;
  readonly serviceArea: string;
  readonly consultationHref: string;
  readonly formEndpoint: string;
  readonly founderPortrait: ImageMetadata;
  readonly motionEnabled: boolean;
  readonly scrollFogEnabled: boolean;
}

/** Owner-editable copy and optional destinations. Empty strings mean unavailable. */
export interface PortfolioSettings {
  readonly name: string;
  readonly role: string;
  readonly headline: string;
  readonly introduction: string;
  readonly about: string;
  readonly featuredProjectId: string;
  readonly heroImageUrl: string;
  readonly heroImageAlt: string;
  readonly contactHeading: string;
  readonly contactIntro: string;
  readonly email: string;
  readonly github: string;
  readonly linkedin: string;
  readonly resumeUrl: string;
  readonly headshotUrl: string;
  readonly headshotAlt: string;
  readonly siteUrl: string;
  readonly socialImageUrl: string;
  readonly socialImageAlt: string;
  readonly motionEnabled: boolean;
}

export interface NavItem {
  readonly label: string;
  readonly href: MainRoute;
}

export type AudienceType = 'employer' | 'client' | 'both';

export type ActionVariant = 'primary' | 'secondary' | 'quiet';

export interface AudienceAction {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly audience: AudienceType;
  readonly variant: ActionVariant;
  readonly isExternal?: boolean;
  readonly isPlaceholder?: boolean;
}

export interface SiteMetadata {
  title: string;
  description: string;
  lang: string;
  charset: 'UTF-8';
}

export interface PageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  lang?: string;
  charset?: 'UTF-8';
  socialImage?: string;
  socialImageAlt?: string;
  noindex?: boolean;
}

export type ShellWidth = 'standard' | 'reading' | 'evidence' | 'full';

export interface PageShellProps {
  metadata: PageMetadata;
  activeRoute?: MainRoute;
  width?: ShellWidth;
  kicker?: string;
  title?: string;
  subtitle?: string;
}

export interface DisclosureModel {
  readonly id: string;
  readonly heading: string;
  readonly summary?: string;
  readonly initialOpen?: boolean;
}

export interface PlaceholderRequirement {
  readonly kind: 'copy' | 'media' | 'link';
  readonly label: string;
  readonly status: string;
  readonly expectedAspectRatio?: string;
  readonly notes?: string;
}

export type SiteMode = 'staging' | 'production';

export interface ContactConfig {
  readonly email: string;
  readonly github: string;
  readonly linkedin: string;
  readonly isPlaceholder: boolean;
  readonly notes: string;
}

export const SMOKE_SITE_METADATA: SiteMetadata = {
  title: 'Saymon Rivas | Portfolio Foundation',
  description: 'Public platform foundation smoke page.',
  lang: 'en',
  charset: 'UTF-8',
};
