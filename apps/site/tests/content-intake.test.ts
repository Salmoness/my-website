import { describe, expect, it } from 'vitest';
import { getCollection } from 'astro:content';
import { PORTFOLIO, safeLink, emailLink } from '../src/config/site';

describe('Spec 005 Tasks 3 & 4: Identity, Credentials, Projects & Case Studies', () => {
  describe('Task 3: Site Identity, Credentials & Contact Assets (FR-1, FR-4, FR-6, FR-10)', () => {
    it('agrees with approved identity and UCF education credentials', async () => {
      expect(PORTFOLIO.name).toBe('Saymon Rivas');
      expect(PORTFOLIO.role.trim()).not.toBe('');
      expect(PORTFOLIO.about).toContain('University of Central Florida');
      expect(PORTFOLIO.about).toContain('2026');

      const education = await getCollection('education');
      const ucf = education.find((item) => /central florida|ucf/i.test(item.data.institution));
      expect(ucf).toBeDefined();
      expect(ucf?.data.credential).toContain('Computer Science');
      expect(ucf?.data.dates).toContain('2026');
      expect(ucf?.data.status).toBe('ready');
    });

    it('provides employer, dates, and achievements for ready experience records', async () => {
      const experience = await getCollection('experience');
      expect(experience.length).toBeGreaterThanOrEqual(1);
      for (const item of experience) {
        if (item.data.status === 'ready') {
          expect(item.data.organization.trim()).not.toBe('');
          expect(item.data.dates.trim()).not.toBe('');
          expect(item.data.achievements.length).toBeGreaterThan(0);
        }
      }
    });

    it('ensures configured contact and resume destinations are valid or safely unavailable', () => {
      if (PORTFOLIO.email?.trim()) {
        expect(emailLink(PORTFOLIO.email)).toBe(`mailto:${PORTFOLIO.email.trim()}`);
      } else {
        expect(emailLink(PORTFOLIO.email)).toBeUndefined();
      }

      for (const value of [PORTFOLIO.github, PORTFOLIO.linkedin, PORTFOLIO.resumeUrl]) {
        if (value?.trim()) {
          expect(safeLink(value)).toBe(value.trim());
        } else {
          expect(safeLink(value)).toBeUndefined();
        }
      }
    });

    it('validates supplied contact and resume destinations and safely rejects empty or unsafe values', () => {
      expect(emailLink('saymon@example.com')).toBe('mailto:saymon@example.com');
      expect(emailLink('')).toBeUndefined();
      expect(emailLink('   ')).toBeUndefined();
      expect(emailLink(undefined)).toBeUndefined();

      expect(safeLink('https://github.com/saymon')).toBe('https://github.com/saymon');
      expect(safeLink('https://linkedin.com/in/saymon')).toBe('https://linkedin.com/in/saymon');
      expect(safeLink('/resume.pdf')).toBe('/resume.pdf');
      expect(safeLink('')).toBeUndefined();
      expect(safeLink('   ')).toBeUndefined();
      expect(safeLink(undefined)).toBeUndefined();
      expect(safeLink('javascript:alert(1)')).toBeUndefined();
    });
  });

  describe('Task 4: Projects and Case Studies (FR-1–FR-3, FR-5–FR-6, FR-10–FR-11)', () => {
    it('maintains 3 projects with stable IDs for incoming links and hashes', async () => {
      const projects = await getCollection('projects');
      expect(projects.length).toBeGreaterThanOrEqual(3);
      const projectIds = projects.map((p) => p.id);
      expect(projectIds).toContain('project-one');
      expect(projectIds).toContain('project-two');
      expect(projectIds).toContain('project-three');
    });

    it('resolves the configured featured project to an existing project', async () => {
      const projects = await getCollection('projects');
      const projectIds = new Set(projects.map((p) => p.id));
      expect(projectIds.has(PORTFOLIO.featuredProjectId)).toBe(true);

      const featured = projects.find((p) => p.id === PORTFOLIO.featuredProjectId);
      expect(featured).toBeDefined();
      expect(featured?.id).toBe(PORTFOLIO.featuredProjectId);
    });

    it('enforces that any project with an image has a descriptive imageAlt', async () => {
      const projects = await getCollection('projects');
      for (const project of projects) {
        if (project.data.image) {
          expect(project.data.imageAlt).toBeDefined();
          expect(project.data.imageAlt?.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });
});
