import { z } from 'zod'
import { getTableOfContents } from '../../src/utils/get-table-of-contents'
import qino from '../'

const hostSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
})

export const hackathonCollection = qino.defineCollection({
  directory: 'hackathons',
  extension: '.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    // Normalized to an ISO string, as contentlayer's `date` field did
    startDate: z
      .string()
      .optional()
      .transform((date) => date && new Date(date).toISOString()),
    registerForm: z.string().optional(),
    address: z.array(z.string()).optional(),
    map: z.string().optional(),
    partners: z.array(hostSchema).optional(),
    hosts: z.array(hostSchema).optional(),
  }),
  views: (view) => ({
    default: view({
      augment: (doc) => ({
        slug: `/hackathons/${doc._meta.slug}`,
        frontMatter: {
          title: doc.title,
          description: doc.description,
          slug: `/hackathons/${doc._meta.slug}`,
          image: doc.image,
          headings: getTableOfContents(doc.markdown),
        },
      }),
    }),
  }),
})
