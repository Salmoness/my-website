import { describe, expect, it } from 'vitest';
import {
  serviceSchema,
  packagePricingSchema,
  mediaItemSchema,
  projectSchema,
} from '../src/content.config';
import { packageInquiryLink, PORTFOLIO } from '../src/config/site';

describe('Spec 005 Task 2: Service Packages and Content Models', () => {
  describe('Package Pricing Schema', () => {
    it('accepts custom-quote mode without amount or currency', () => {
      const result = packagePricingSchema.safeParse({
        mode: 'custom-quote',
        note: 'Custom quote based on scope.',
      });
      expect(result.success).toBe(true);
    });

    it('rejects custom-quote mode if an amount is supplied', () => {
      const result = packagePricingSchema.safeParse({
        mode: 'custom-quote',
        amount: 2500,
      });
      expect(result.success).toBe(false);
    });

    it('accepts starting-at and fixed modes with positive amount and currency', () => {
      const starting = packagePricingSchema.safeParse({
        mode: 'starting-at',
        amount: 2500,
        currency: 'USD',
      });
      expect(starting.success).toBe(true);

      const fixed = packagePricingSchema.safeParse({
        mode: 'fixed',
        amount: 3500,
        currency: 'USD',
        note: 'Fixed project scope',
      });
      expect(fixed.success).toBe(true);
    });

    it('rejects starting-at or fixed modes without amount or currency', () => {
      const noAmount = packagePricingSchema.safeParse({
        mode: 'starting-at',
        currency: 'USD',
      });
      expect(noAmount.success).toBe(false);

      const noCurrency = packagePricingSchema.safeParse({
        mode: 'fixed',
        amount: 3000,
      });
      expect(noCurrency.success).toBe(false);
    });
  });

  describe('Service Package Schema', () => {
    const validReadyPackage = {
      title: 'Complete Website Build',
      summary: 'Bespoke static website built from scratch.',
      status: 'ready' as const,
      idealClient: 'Independent businesses seeking a modern web presence.',
      deliverables: ['Custom layout', 'Design tokens', 'Accessibility QA'],
      exclusions: ['Continuous copywriting', 'Backend database architecture'],
      clientResponsibilities: ['Provide brand assets', 'Review milestone drafts'],
      timeline: '3 to 5 weeks',
      revisions: 'Up to 2 structured review rounds',
      support: '14 days post-launch warranty',
      pricing: {
        mode: 'custom-quote' as const,
        note: 'Custom quote based on scope and page count.',
      },
      process: ['Discovery', 'Tokens', 'Development', 'Verification', 'Launch'],
      engagementModel: 'Fixed milestone engagement',
      availability: 'Immediate availability',
    };

    it('validates a complete ready package with custom quote pricing', () => {
      const result = serviceSchema.safeParse(validReadyPackage);
      expect(result.success).toBe(true);
    });

    it('validates a complete ready package with starting-at pricing', () => {
      const result = serviceSchema.safeParse({
        ...validReadyPackage,
        pricing: {
          mode: 'starting-at',
          amount: 2500,
          currency: 'USD',
        },
      });
      expect(result.success).toBe(true);
    });

    it('rejects ready status if exclusions or pricing are missing', () => {
      const missingExclusions = { ...validReadyPackage, exclusions: [] };
      expect(serviceSchema.safeParse(missingExclusions).success).toBe(false);

      const missingPricing = { ...validReadyPackage, pricing: undefined };
      expect(serviceSchema.safeParse(missingPricing).success).toBe(false);
    });

    it('keeps existing draft and placeholder records valid even with omitted package fields', () => {
      const draftService = {
        title: 'Draft Service',
        summary: 'Under construction',
        status: 'draft' as const,
      };
      expect(serviceSchema.safeParse(draftService).success).toBe(true);

      const placeholderService = {
        title: 'Placeholder Service',
        summary: 'Future service reservation',
        status: 'placeholder' as const,
      };
      expect(serviceSchema.safeParse(placeholderService).success).toBe(true);
    });
  });

  describe('Structured Media Items', () => {
    it('validates structured media items with required description', () => {
      const validItem = {
        src: '/images/project-screenshot.webp',
        alt: 'Dashboard analytics overview',
        caption: 'Main dashboard view',
      };
      expect(mediaItemSchema.safeParse(validItem).success).toBe(true);

      const missingAlt = {
        src: '/images/project-screenshot.webp',
        alt: '',
      };
      expect(mediaItemSchema.safeParse(missingAlt).success).toBe(false);
    });

    it('allows projects to specify structured media items', () => {
      const projectWithMedia = {
        title: 'Modular UI',
        summary: 'Design system components',
        media: [
          {
            src: '/images/shot-1.webp',
            alt: 'Component library grid',
          },
        ],
      };
      expect(projectSchema.safeParse(projectWithMedia).success).toBe(true);
    });
  });

  describe('Package Inquiry Helper', () => {
    it('handles mailbox configuration safely for package inquiries', () => {
      expect(packageInquiryLink('Complete Website Build', '')).toBeUndefined();
      expect(packageInquiryLink('Complete Website Build', '   ')).toBeUndefined();

      if (PORTFOLIO.email?.trim()) {
        expect(packageInquiryLink('Complete Website Build')).toBe(
          `mailto:${PORTFOLIO.email.trim()}?subject=Project%20inquiry%3A%20Complete%20Website%20Build`,
        );
      } else {
        expect(packageInquiryLink('Complete Website Build')).toBeUndefined();
      }
    });

    it('generates a safely encoded mailto URL with package title in subject', () => {
      const link = packageInquiryLink('Complete Website Build', 'saymon@example.com');
      expect(link).toBe(
        'mailto:saymon@example.com?subject=Project%20inquiry%3A%20Complete%20Website%20Build',
      );
    });

    it('sanitizes extra whitespace and newlines from package title in subject', () => {
      const link = packageInquiryLink(
        'Frontend Modernization\n& Architecture',
        'saymon@example.com',
      );
      expect(link).toBe(
        'mailto:saymon@example.com?subject=Project%20inquiry%3A%20Frontend%20Modernization%20%26%20Architecture',
      );
    });
  });
});
