import { z } from 'zod'
import siteConfig from '../../configs/site-config.json'
import qino from '../'

export const blogCollection = qino.defineCollection({
  directory: 'blog',
  extension: '.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    authors: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    publishedDate: z.string().optional(),
    image: z.string().nullish(),
  }),
  views: (view) => ({
    default: view({
      augment: (doc) => ({
        slug: `/blog/${doc._meta.slug}`,
        frontMatter: {
          publishedDate: {
            raw: doc.publishedDate,
            iso: new Date(doc.publishedDate).toISOString(),
            text: new Date(doc.publishedDate).toDateString(),
          },
          image: doc.image,
          authors: doc.authors,
          tags: doc.tags,
          title: doc.title,
          description: doc.description,
          slug: `/blog/${doc._meta.slug}`,
          editUrl: `${siteConfig.repo.editUrl}/blog/${doc._meta.fileName}`,
        },
      }),
    }),
  }),
})
