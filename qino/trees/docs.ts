import { z } from 'zod'
import siteConfig from '../../configs/site-config.json'
import { getTableOfContents } from '../../src/utils/get-table-of-contents'
import qino from '../'

export const docsTree = qino.defineTree({
  directory: 'docs',
  extension: '.mdx',
  titleField: 'title',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    id: z.string().optional(),
    author: z.string().optional(),
    video: z.string().optional(),
    category: z.string().optional(),
    aria: z.string().optional(),
    // Folder anchors that only exist to satisfy the tree layout
    unlisted: z.boolean().optional(),
  }),
  views: (view) => ({
    default: view({
      augment: (doc) => ({
        frontMatter: {
          title: doc.title,
          description: doc.description,
          slug: `/docs/${doc._meta.slug}`,
          editUrl: `${siteConfig.repo.editUrl}/docs/${doc._meta.slug}.mdx`,
          headings: getTableOfContents(doc.markdown),
        },
      }),
    }),
  }),
})
