import { createHash } from 'node:crypto';
import { z } from 'zod';

const stableId = z
  .string()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const categoryId = z
  .string()
  .min(3)
  .max(80)
  .regex(
    /^(?:[a-z][a-z0-9]*-[a-z0-9-]+|[a-z][a-z0-9-]*\.[A-Za-z][A-Za-z0-9-]*)$/,
    'Use a standard arXiv category ID',
  );
const httpUrl = z.string().refine((value) => {
  if (/\s/.test(value)) return false;
  try {
    const parsed = new URL(value);
    return (
      (parsed.protocol === 'https:' || parsed.protocol === 'http:') &&
      Boolean(parsed.hostname)
    );
  } catch {
    return false;
  }
}, 'Use a valid HTTP(S) URL');

export const trackingConfigSchema = z
  .object({
    schemaVersion: z.literal(1),
    site: z
      .object({
        name: z.string().min(1).max(120),
        description: z.string().min(1).max(500),
        links: z.record(stableId, httpUrl).optional(),
      })
      .strict(),
    categories: z
      .array(
        z
          .object({
            id: categoryId,
            label: z.string().min(1).max(120),
            color: z
              .string()
              .regex(/^#[0-9a-fA-F]{6}$/)
              .optional(),
            topics: z
              .array(
                z
                  .object({ id: stableId, label: z.string().min(1).max(120) })
                  .strict(),
              )
              .min(1)
              .max(50),
            readingPreferences: z.string().min(1).max(5000),
          })
          .strict(),
      )
      .min(1)
      .max(50),
    fetchCategories: z.array(categoryId).max(50),
    displayCategories: z.array(categoryId).min(1).max(50),
  })
  .strict()
  .superRefine((value, context) => {
    const categoryIds = value.categories.map((category) => category.id);
    if (new Set(categoryIds).size !== categoryIds.length)
      context.addIssue({
        code: 'custom',
        path: ['categories'],
        message: 'Category IDs must be unique',
      });
    value.categories.forEach((category, index) => {
      const topicIds = category.topics.map((topic) => topic.id);
      if (new Set(topicIds).size !== topicIds.length)
        context.addIssue({
          code: 'custom',
          path: ['categories', index, 'topics'],
          message: 'Topic IDs must be unique within a category',
        });
    });
    const known = new Set(categoryIds);
    for (const [field, ids] of [
      ['fetchCategories', value.fetchCategories],
      ['displayCategories', value.displayCategories],
    ] as const) {
      if (new Set(ids).size !== ids.length)
        context.addIssue({
          code: 'custom',
          path: [field],
          message: `${field} must not contain duplicates`,
        });
      ids.forEach((id, index) => {
        if (!known.has(id))
          context.addIssue({
            code: 'custom',
            path: [field, index],
            message: `Unknown category ${id}`,
          });
      });
    }
  });

export type TrackingConfig = z.infer<typeof trackingConfigSchema>;
export type TrackingCategory = TrackingConfig['categories'][number];
export type TopicConfig = TrackingCategory['topics'][number];

export interface PublicTrackingConfig {
  schemaVersion: 1;
  configVersion: string;
  site: TrackingConfig['site'];
  displayCategories: string[];
  categories: Array<Omit<TrackingCategory, 'readingPreferences'>>;
}

export const publicTrackingConfigSchema: z.ZodType<PublicTrackingConfig> = z
  .object({
    schemaVersion: z.literal(1),
    configVersion: z.string().regex(/^[0-9a-f]{64}$/),
    site: z
      .object({
        name: z.string().min(1).max(120),
        description: z.string().min(1).max(500),
        links: z.record(stableId, httpUrl).optional(),
      })
      .strict(),
    displayCategories: z.array(categoryId).min(1).max(50),
    categories: z
      .array(
        z
          .object({
            id: categoryId,
            label: z.string().min(1).max(120),
            color: z
              .string()
              .regex(/^#[0-9a-fA-F]{6}$/)
              .optional(),
            topics: z
              .array(
                z
                  .object({ id: stableId, label: z.string().min(1).max(120) })
                  .strict(),
              )
              .min(1)
              .max(50),
          })
          .strict(),
      )
      .min(1)
      .max(50),
  })
  .strict()
  .superRefine((value, context) => {
    const categoryIds = value.categories.map((category) => category.id);
    const known = new Set(categoryIds);
    if (known.size !== categoryIds.length)
      context.addIssue({
        code: 'custom',
        path: ['categories'],
        message: 'Category IDs must be unique',
      });
    value.displayCategories.forEach((id, index) => {
      if (!known.has(id))
        context.addIssue({
          code: 'custom',
          path: ['displayCategories', index],
          message: `Unknown category ${id}`,
        });
    });
  });

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
        .map(([key, child]) => [key, canonicalize(child)]),
    );
  return value;
}

export function canonicalConfigJson(config: TrackingConfig): string {
  return JSON.stringify(canonicalize(config));
}

export function configVersion(config: TrackingConfig): string {
  return createHash('sha256')
    .update(canonicalConfigJson(config), 'utf8')
    .digest('hex');
}

export function parseTrackingConfig(value: unknown): TrackingConfig {
  return trackingConfigSchema.parse(value);
}

export function publicConfig(config: TrackingConfig): PublicTrackingConfig {
  return {
    schemaVersion: 1,
    configVersion: configVersion(config),
    site: config.site,
    displayCategories: [...config.displayCategories],
    categories: config.categories.map(
      ({ readingPreferences: _private, ...category }) => category,
    ),
  };
}

export function categoryMap(
  config: Pick<TrackingConfig, 'categories'>,
): Map<string, TrackingCategory> {
  return new Map(config.categories.map((category) => [category.id, category]));
}
