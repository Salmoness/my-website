import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';
import { packageInquiryLink, DEFAULT_PAGE_METADATA } from '../src/config/site';

describe('Spec 005 Tasks 5 & 6: Service Packages and Staging Verification', () => {
  it('loads both supplied service packages with starting prices', async () => {
    const services = await getCollection('services');
    expect(services.length).toBeGreaterThanOrEqual(2);

    const starter = services.find((s) => s.id === 'web-development');
    const modernization = services.find((s) => s.id === 'frontend-architecture');

    expect(starter).toBeDefined();
    expect(modernization).toBeDefined();

    for (const pkg of [starter!, modernization!]) {
      expect(pkg.data.status).toBe('ready');
      expect(pkg.data.pricing?.mode).toBe('starting-at');
      expect(pkg.data.deliverables.length).toBeGreaterThan(0);
      expect(pkg.data.exclusions.length).toBeGreaterThan(0);
      expect(pkg.data.support).toBeTruthy();
    }
  });

  it('generates package-specific inquiry links with encoded subjects', () => {
    const testEmail = 'hello@example.com';
    const link1 = packageInquiryLink('Business Essentials', testEmail);
    const link2 = packageInquiryLink('Business Growth', testEmail);

    expect(link1).toBe(
      'mailto:hello@example.com?subject=Project%20inquiry%3A%20Business%20Essentials',
    );
    expect(link2).toBe('mailto:hello@example.com?subject=Project%20inquiry%3A%20Business%20Growth');
  });

  it('retains accurate service metadata descriptions', () => {
    const serviceMeta = DEFAULT_PAGE_METADATA['/services'];
    expect(serviceMeta.description).toContain('online foundation');
    expect(serviceMeta.description).toContain('social content');
  });
});
