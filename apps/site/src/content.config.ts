import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { safeLink } from './config/site';

const optionalImageSchema = z
  .string()
  .refine((value) => value === '' || safeLink(value) !== undefined, {
    message: 'Use an HTTPS image URL or a root-relative asset path',
  })
  .optional();

const projectLinkSchema = z.url().refine((value) => safeLink(value) !== undefined, {
  message: 'Use an HTTPS URL without credentials',
});

// Shared Enums & Fields
export const publicationStatusEnum = z.enum(['placeholder', 'draft', 'ready']);
export type PublicationStatus = z.infer<typeof publicationStatusEnum>;

export const audienceEnum = z.enum(['employer', 'client', 'both']);
export type Audience = z.infer<typeof audienceEnum>;

export const sharedContentSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  order: z.number().int().default(0),
  status: publicationStatusEnum.default('placeholder'),
  audience: audienceEnum.default('both'),
  lang: z.literal('en').default('en'),
});

// Projects Collection Schema
export const projectKindEnum = z.enum(['personal', 'client', 'concept']);
export type ProjectKind = z.infer<typeof projectKindEnum>;

export const mediaItemSchema = z.object({
  src: z.string().refine((value) => safeLink(value) !== undefined, {
    message: 'Use an HTTPS image URL or a root-relative asset path',
  }),
  alt: z.string().min(1, 'Media items require an alt description'),
  caption: z.string().optional(),
  credit: z.string().optional(),
});
export type MediaItem = z.infer<typeof mediaItemSchema>;

export const projectSchema = sharedContentSchema
  .extend({
    kind: projectKindEnum.default('personal'),
    image: optionalImageSchema,
    imageAlt: z.string().optional(),
    category: z.string().optional(),
    role: z.string().optional(),
    timeframe: z.string().optional(),
    problem: z.string().optional(),
    solution: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    outcomes: z.array(z.string()).optional(),
    links: z
      .object({
        repo: projectLinkSchema.optional(),
        live: projectLinkSchema.optional(),
      })
      .optional(),
    media: z.union([z.array(z.string()), z.array(mediaItemSchema)]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.image && !data.imageAlt?.trim()) {
      ctx.addIssue({
        code: 'custom',
        message: 'Describe the supplied project image with imageAlt',
        path: ['imageAlt'],
      });
    }

    if (data.status === 'ready') {
      if (!data.role || data.role.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Role is required when project status is ready',
          path: ['role'],
        });
      }
      if (!data.timeframe || data.timeframe.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Timeframe is required when project status is ready',
          path: ['timeframe'],
        });
      }
      if (!data.problem || data.problem.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Problem description is required when project status is ready',
          path: ['problem'],
        });
      }
      if (!data.solution || data.solution.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Solution description is required when project status is ready',
          path: ['solution'],
        });
      }
      if (!data.technologies || data.technologies.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'At least one technology is required when project status is ready',
          path: ['technologies'],
        });
      }
    }
  });

// Experience Collection Schema
export const experienceSchema = sharedContentSchema
  .extend({
    organization: z.string().min(1),
    role: z.string().min(1),
    dates: z.string().min(1),
    achievements: z.array(z.string()).default([]),
    technologies: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'ready') {
      if (!data.achievements || data.achievements.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Achievements are required when experience status is ready',
          path: ['achievements'],
        });
      }
    }
  });

// Education Collection Schema
export const educationSchema = sharedContentSchema.extend({
  institution: z.string().min(1),
  credential: z.string().min(1),
  field: z.string().min(1),
  dates: z.string().min(1),
  highlights: z.array(z.string()).optional(),
});

// Service Package Pricing Schema
export const pricingModeEnum = z.enum(['fixed', 'starting-at', 'custom-quote']);
export type PricingMode = z.infer<typeof pricingModeEnum>;

export const packagePricingSchema = z
  .object({
    mode: pricingModeEnum,
    amount: z.number().positive().optional(),
    currency: z.string().min(1).optional(),
    note: z.string().optional(),
  })
  .superRefine((pricing, ctx) => {
    if (pricing.mode === 'fixed' || pricing.mode === 'starting-at') {
      if (pricing.amount === undefined || pricing.amount <= 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Fixed and starting-at pricing require a positive amount',
          path: ['amount'],
        });
      }
      if (!pricing.currency || pricing.currency.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Fixed and starting-at pricing require a currency code (e.g., USD)',
          path: ['currency'],
        });
      }
    } else if (pricing.mode === 'custom-quote') {
      if (pricing.amount !== undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Custom quotes must omit amount',
          path: ['amount'],
        });
      }
      if (pricing.currency !== undefined) {
        ctx.addIssue({
          code: 'custom',
          message: 'Custom quotes must omit currency',
          path: ['currency'],
        });
      }
    }
  });
export type PackagePricing = z.infer<typeof packagePricingSchema>;

// Services Collection Schema
export const serviceSchema = sharedContentSchema
  .extend({
    idealClient: z.string().optional(),
    deliverables: z.array(z.string()).default([]),
    exclusions: z.array(z.string()).default([]),
    clientResponsibilities: z.array(z.string()).default([]),
    timeline: z.string().optional(),
    revisions: z.string().optional(),
    support: z.string().optional(),
    pricing: packagePricingSchema.optional(),
    process: z.array(z.string()).default([]),
    engagementModel: z.string().optional(),
    availability: z.string().optional(),
    project: reference('projects').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'ready') {
      if (!data.idealClient || data.idealClient.trim() === '') {
        ctx.addIssue({
          code: 'custom',
          message: 'Ideal client description is required when service status is ready',
          path: ['idealClient'],
        });
      }
      if (!data.deliverables || data.deliverables.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Deliverables are required when service status is ready',
          path: ['deliverables'],
        });
      }
      if (!data.exclusions || data.exclusions.length === 0) {
        ctx.addIssue({
          code: 'custom',
          message: 'Exclusions are required when service status is ready',
          path: ['exclusions'],
        });
      }

      if (!data.pricing) {
        ctx.addIssue({
          code: 'custom',
          message: 'Pricing terms are required when service status is ready',
          path: ['pricing'],
        });
      }
    }
  });

// Collections Registration
const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: projectSchema,
});

const experienceCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: experienceSchema,
});

const educationCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/education' }),
  schema: educationSchema,
});

const servicesCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: serviceSchema,
});

export const collections = {
  projects: projectsCollection,
  experience: experienceCollection,
  education: educationCollection,
  services: servicesCollection,
};
