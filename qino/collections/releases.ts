import { z } from 'zod'
import { getTableOfContents } from '../../src/utils/get-table-of-contents'
import qino from '../'

export const releaseCollection = qino.defineCollection({
  directory: 'releases',
  extension: '.mdx',
  schema: z.object({
    version: z.string(),
    codename: z.string(),
    commit: z.string(),
    releaseDate: z.string(),
    changelog: z.string().optional(),
    blogPost: z.string().optional(),
  }),
  views: (view) => ({
    default: view({
      augment: (doc) => ({
        frontMatter: {
          slug: `/releases/${doc._meta.slug}`,
          headings: getTableOfContents(doc.markdown),
          version: doc.version,
          codename: doc.codename,
          commit: doc.commit,
          releaseDate: doc.releaseDate,
          changelog: doc.changelog,
          blogPost: doc.blogPost,
        },
      }),
    }),
  }),
})
