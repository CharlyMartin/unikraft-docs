import { z } from 'zod'
import siteConfig from '../../configs/site-config.json'
import { getTableOfContents } from '../../src/utils/get-table-of-contents'
import qino from '../'

export const guideCollection = qino.defineCollection({
  directory: 'guides',
  extension: '.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    authors: z.array(z.string()).optional(),
    category: z.string().optional(),
    publishedDate: z.string().optional(),
    image: z.string().optional(),
  }),
  views: (view) => ({
    default: view({
      augment: (doc) => ({
        slug: `/guides/${doc._meta.slug}`,
        frontMatter: {
          title: doc.title,
          description: doc.description,
          tags: doc.tags,
          image: doc.image,
          authors: doc.authors,
          slug: `/guides/${doc._meta.slug}`,
          editUrl: `${siteConfig.repo.editUrl}/guides/${doc._meta.fileName}`,
          headings: getTableOfContents(doc.markdown),
        },
      }),
    }),
  }),
})
