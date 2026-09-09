import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';
import { projectKindEnum, projectSchema, serviceSchema } from '../src/content.config';

describe('portfolio content', () => {
  it('provides the planned starting content for both audiences', async () => {
    const [projects, services, experience, education] = await Promise.all([
      getCollection('projects'),
      getCollection('services'),
      getCollection('experience'),
      getCollection('education'),
    ]);

    expect(projects.length).toBeGreaterThanOrEqual(3);
    expect(services.length).toBeGreaterThanOrEqual(2);
    expect(experience.length).toBeGreaterThanOrEqual(1);
    expect(
      education.some(
        ({ data }) =>
          /central florida|ucf/i.test(data.institution) && /computer science/i.test(data.field),
      ),
    ).toBe(true);

    const employerAudiences = [...projects, ...experience, ...education].map(
      ({ data }) => data.audience,
    );
    const clientAudiences = services.map(({ data }) => data.audience);
    expect(
      employerAudiences.some((audience) => audience === 'employer' || audience === 'both'),
    ).toBe(true);
    expect(clientAudiences.some((audience) => audience === 'client' || audience === 'both')).toBe(
      true,
    );
  });

  it('keeps collection references resolvable', async () => {
    const [projects, services] = await Promise.all([
      getCollection('projects'),
      getCollection('services'),
    ]);
    const projectIds = new Set(projects.map(({ id }) => id));
    const referenceId = (reference: string | { id: string }) =>
      typeof reference === 'string' ? reference : reference.id;

    for (const service of services) {
      if (service.data.project)
        expect(projectIds.has(referenceId(service.data.project))).toBe(true);
    }
  });

  it('requires meaningful fields before work or services are marked ready', () => {
    expect(
      projectSchema.safeParse({
        title: 'Project',
        summary: 'Summary',
        status: 'ready',
        kind: 'personal',
      }).success,
    ).toBe(false);
    expect(
      projectSchema.safeParse({
        title: 'Project',
        summary: 'Summary',
        status: 'ready',
        kind: 'personal',
        role: 'Developer',
        timeframe: '2026',
        problem: 'A real problem',
        solution: 'A considered solution',
        technologies: ['Astro'],
      }).success,
    ).toBe(true);

    expect(
      serviceSchema.safeParse({ title: 'Service', summary: 'Summary', status: 'ready' }).success,
    ).toBe(false);
    expect(
      serviceSchema.safeParse({
        title: 'Service',
        summary: 'Summary',
        status: 'ready',
        idealClient: 'A small business',
        deliverables: ['Website'],
        exclusions: ['Hosting'],
        timeline: '2 weeks',
        revisions: '1 round',
        support: '7 days',
        pricing: { mode: 'custom-quote' },
        process: ['Discover', 'Build'],
        engagementModel: 'Fixed scope',
        availability: 'By arrangement',
      }).success,
    ).toBe(true);
  });

  it('requires explicit concept classification and descriptions for supplied images', () => {
    expect(projectKindEnum.safeParse('concept').success).toBe(true);
    expect(projectKindEnum.safeParse('speculative').success).toBe(false);
    expect(
      projectSchema.safeParse({
        title: 'Project',
        summary: 'Summary',
        image: '/images/work.webp',
      }).success,
    ).toBe(false);
    expect(
      projectSchema.safeParse({
        title: 'Project',
        summary: 'Summary',
        image: '/images/work.webp',
        imageAlt: 'Project interface',
      }).success,
    ).toBe(true);
  });
});
