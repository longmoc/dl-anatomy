import { defineCollection, z } from 'astro:content';

const articleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  lang: z.enum(['vi', 'en']).default('vi'),
  translation: z.string().optional(), // slug of the other-language version
  category: z.enum(['foundations', 'optimization', 'activations', 'training']),
  order: z.number().optional(),
  draft: z.boolean().default(false),
  date: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
});

export const collections = {
  foundations: defineCollection({ type: 'content', schema: articleSchema }),
  optimization: defineCollection({ type: 'content', schema: articleSchema }),
  activations: defineCollection({ type: 'content', schema: articleSchema }),
  training: defineCollection({ type: 'content', schema: articleSchema }),
};
