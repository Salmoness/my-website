import { describe, expect, it } from 'vitest';
import {
  CONTACT_CONFIG,
  DEFAULT_PAGE_METADATA,
  MAIN_ROUTES,
  PORTFOLIO,
  SITE_NAV,
  emailLink,
  getPageSharing,
  getRobotsContent,
  safeLink,
} from '../src/config/site';

describe('site settings and destination safety', () => {
  it('defines the static identity, navigation, metadata, and staging state', () => {
    expect(PORTFOLIO.name.trim()).not.toBe('');
    expect(PORTFOLIO.headline.trim()).not.toBe('');
    expect(MAIN_ROUTES).toEqual(['/', '/services', '/how-we-work', '/about']);
    expect(SITE_NAV.map(({ href }) => href)).toEqual(MAIN_ROUTES);
    for (const route of MAIN_ROUTES) expect(DEFAULT_PAGE_METADATA[route].title.trim()).not.toBe('');
    expect(CONTACT_CONFIG.isPlaceholder).toBe(!emailLink(PORTFOLIO.email));
    expect(getRobotsContent('staging')).toContain('Disallow: /');
    expect(getRobotsContent('production')).toContain('Allow: /');
  });

  it('keeps local and HTTPS links while rejecting unsafe destinations', () => {
    expect(safeLink('/resume.pdf')).toBe('/resume.pdf');
    expect(safeLink('HTTPS://PORTFOLIO.EXAMPLE/work')).toBe('https://portfolio.example/work');
    for (const value of [
      undefined,
      '',
      '#',
      'javascript:alert(1)',
      'data:text/html,hello',
      'http://portfolio.example',
      '//other.example',
      '/%2fother.example',
      '/\\other.example',
      'https://owner:secret@portfolio.example',
    ]) {
      expect(safeLink(value)).toBeUndefined();
    }
  });

  it('creates simple mail links without accepting injected headers', () => {
    expect(emailLink('hello+work@portfolio.example')).toBe('mailto:hello+work@portfolio.example');
    for (const value of [
      undefined,
      '',
      'hello',
      'hello@portfolio.example?subject=hi',
      'hello%0d%0aBcc:other@portfolio.example',
    ]) {
      expect(emailLink(value)).toBeUndefined();
    }
  });

  it('emits sharing URLs only when a valid public origin is supplied', () => {
    const metadata = DEFAULT_PAGE_METADATA['/about'];
    expect(getPageSharing(metadata, { ...PORTFOLIO, siteUrl: '' }).canonicalUrl).toBeUndefined();
    expect(
      getPageSharing(metadata, {
        ...PORTFOLIO,
        siteUrl: 'https://portfolio.example',
        socialImageUrl: '/images/share.webp',
        socialImageAlt: 'Portfolio preview',
      }),
    ).toEqual({
      canonicalUrl: 'https://portfolio.example/about',
      imageUrl: 'https://portfolio.example/images/share.webp',
      imageAlt: 'Portfolio preview',
    });
  });
});
