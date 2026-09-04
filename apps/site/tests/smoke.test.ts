import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import reactRenderer from '@astrojs/react/server.js';
import ReactIslandFixture from './fixtures/ReactIslandFixture.astro';
import testCss from './fixtures/test-style.css?inline';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distHtmlPath = path.resolve(__dirname, '../dist/index.html');

describe('Spec 001 Automated Smoke Integration Tests', () => {
  describe('Static Page Contract (Zero-JS Static Render)', () => {
    it('produces valid semantic HTML and accessibility targets in static build output', () => {
      expect(
        fs.existsSync(distHtmlPath),
        'Expected apps/site/dist/index.html to exist after build',
      ).toBe(true);

      const html = fs.readFileSync(distHtmlPath, 'utf8');

      // Semantic structure & accessibility
      expect(html).toContain('lang="en"');
      expect(html).toContain('<main id="main-content"');
      expect(html).toContain('<h1');
      expect(html).toContain('Saymon Rivas');
      expect(html).toContain('id="explore-link"');
      expect(html).toContain('href="#main-content"');
    });

    it('guarantees zero client-side JavaScript hydration runtime in static smoke page', () => {
      const html = fs.readFileSync(distHtmlPath, 'utf8');

      // Static output must not contain astro-island or client hydration directives
      expect(html).not.toContain('astro-island');
      expect(html).not.toContain('<astro-island');
      expect(html).not.toContain('client:load');
      expect(html).not.toContain('client:idle');
      expect(html).not.toContain('client:visible');
      expect(html).not.toContain('client:only');

      // Static output must not import client hydration runtime scripts
      expect(html).not.toContain('@astrojs/react/client');
      expect(html).not.toMatch(/<script[^>]*src="[^"]*astro[^"]*"[^>]*>/i);
    });
  });

  describe('React Island Hydration Contract', () => {
    it('renders React island through Astro container with server markup and astro-island client:visible contract', async () => {
      const container = await AstroContainer.create();
      container.addServerRenderer({ renderer: reactRenderer });
      container.addClientRenderer({
        name: '@astrojs/react',
        entrypoint: '@astrojs/react/client.js',
      });

      const rendered = await container.renderToString(ReactIslandFixture);

      // Server-rendered content presence
      expect(rendered).toContain('Astro Island Integration Test Fixture');
      expect(rendered).toContain('Hydrated React Island Message');
      expect(rendered).toContain('react-smoke-island');

      // Astro island hydration contract
      expect(rendered).toContain('astro-island');
      expect(rendered).toContain('client="visible"');
    });
  });

  describe('Tailwind Styling Pipeline Contract', () => {
    it('generates distinct utility CSS rules for both Astro and React fixture sentinels via @source', () => {
      expect(typeof testCss).toBe('string');
      expect(testCss.length).toBeGreaterThan(0);

      // React-side Tailwind utility sentinel (bg-amber-500)
      expect(testCss).toMatch(/bg-amber-500/);

      // Astro-side Tailwind utility sentinel (text-cyan-400)
      expect(testCss).toMatch(/text-cyan-400/);
    });
  });
});
