import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(siteDir, 'dist');
const pages = new Map([
  ['/', 'index.html'],
  ['/services', 'services/index.html'],
  ['/how-we-work', 'how-we-work/index.html'],
  ['/about', 'about/index.html'],
  ['/privacy', 'privacy/index.html'],
]);

const readPage = (route: string) => fs.readFileSync(path.join(distDir, pages.get(route)!), 'utf8');
const outputForPath = (pathname: string) => {
  const clean = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, '');
  if (!clean) return path.join(distDir, 'index.html');
  return /\.[^/]+$/.test(clean)
    ? path.join(distDir, clean)
    : path.join(distDir, clean, 'index.html');
};

describe('generated Azul site', () => {
  it('builds the public routes and a staging robots file', () => {
    for (const file of [...pages.values(), 'robots.txt'])
      expect(fs.existsSync(path.join(distDir, file))).toBe(true);
    expect(fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8')).toContain('Disallow: /');
  });

  it('contains the essential MVP proposition, offers, process, and founder context', () => {
    const home = readPage('/');
    const services = readPage('/services');
    const process = readPage('/how-we-work');
    const about = readPage('/about');
    const privacy = readPage('/privacy');

    expect(home).toContain('Grow your');
    expect(home).toContain('online Identity');
    expect(services).toContain('Online Foundation');
    expect(services).toContain('$1,500–$4,000');
    expect(services).toContain('Ongoing Visibility');
    expect(services).toContain('$600–$1,800');
    expect(services).toContain('id="service-guide"');
    expect(services).toContain('id="contact"');
    expect(services).toContain('id="ways-to-pay"');
    expect(services).toContain('Google Ads + Meta Ads');
    expect(process).toContain('A free call to understand your business');
    expect(process).toContain('A plan we both agree on');
    expect(process).toContain('Built in the open');
    expect(process).toContain('Launch + handoff');
    expect(about).toContain('University of Central Florida');
    expect(about).toContain('Founder of Azul Online Projects');
    expect(privacy).toContain('Privacy, in plain language.');
  });

  it('resolves every local page link and fragment', () => {
    for (const [route] of pages) {
      const html = readPage(route);
      const hrefs = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map((match) => match[1]!);
      for (const href of hrefs) {
        const target = new URL(href, `https://portfolio.test${route}`);
        if (target.origin !== 'https://portfolio.test') continue;
        const targetFile = outputForPath(target.pathname);
        expect(fs.existsSync(targetFile), `${route} links to missing ${target.pathname}`).toBe(
          true,
        );
        if (target.hash) {
          const id = decodeURIComponent(target.hash.slice(1));
          const targetHtml = fs.readFileSync(targetFile, 'utf8');
          const ids = [...targetHtml.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
          expect(
            ids.filter((candidate) => candidate === id),
            `${href} must resolve once`,
          ).toHaveLength(1);
        }
      }
    }
  });

  it('keeps production pages static without Astro islands', () => {
    for (const [route] of pages) expect(readPage(route)).not.toContain('astro-island');
  });
});
