import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(siteDir, 'dist');
const pages = new Map([
  ['/', 'index.html'],
  ['/work', 'work/index.html'],
  ['/services', 'services/index.html'],
]);

const readPage = (route: string) => fs.readFileSync(path.join(distDir, pages.get(route)!), 'utf8');
const outputForPath = (pathname: string) => {
  const clean = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, '');
  if (!clean) return path.join(distDir, 'index.html');
  return /\.[^/]+$/.test(clean)
    ? path.join(distDir, clean)
    : path.join(distDir, clean, 'index.html');
};

describe('generated portfolio', () => {
  it('builds the three routes and a staging robots file', () => {
    for (const file of [...pages.values(), 'robots.txt'])
      expect(fs.existsSync(path.join(distDir, file))).toBe(true);
    expect(fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8')).toContain('Disallow: /');
  });

  it('contains essential MVP content and honest unavailable states', () => {
    const home = readPage('/');
    const work = readPage('/work');
    const services = readPage('/services');
    expect(home).toContain('Saymon Rivas');
    expect(home).toContain('id="explore-link"');
    expect(work).toContain('University of Central Florida');
    expect(work).toContain('id="resume"');
    expect(work).not.toContain('id="case-studies"');
    expect(services).toContain('Starting at $1,200');
    expect(services).toContain('Starting at $2,400');
    expect(work.match(/<details\b/g)?.length).toBeGreaterThanOrEqual(3);
    expect(services.match(/class="service-entry"/g)?.length).toBeGreaterThanOrEqual(2);
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
