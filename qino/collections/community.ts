import { z } from 'zod'
import siteConfig from '../../configs/site-config.json'
import { getTableOfContents } from '../../src/utils/get-table-of-contents'
import qino from '../'

export const communityCollection = qino.defineCollection({
  directory: 'community',
  extension: '.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
    author: z.string().optional(),
  }),
  views: (view) => ({
    default: view({
      augment: (doc) => ({
        frontMatter: {
          title: doc.title,
          description: doc.description,
          tags: doc.tags,
          author: doc.author,
          slug: `/community/${doc._meta.slug}`,
          editUrl: `${siteConfig.repo.editUrl}/community/${doc._meta.fileName}`,
          headings: getTableOfContents(doc.markdown),
        },
      }),
    }),
  }),
})
