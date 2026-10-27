import { bundleMDX } from 'mdx-bundler'
import remarkEmoji from 'remark-emoji'
import remarkGfm from 'remark-gfm'
import remarkSlug from 'remark-slug'
import { rehypeMdxCodeMeta } from './rehype-code-meta'

// Server-only: call from `getStaticProps`
export async function compileMDX(source: string) {
  if (source.length == 0) return ''

  const { code } = await bundleMDX({
    source,
    mdxOptions: (options) => {
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeMdxCodeMeta,
      ]
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkSlug,
        remarkGfm,
        remarkEmoji,
      ]
      return options
    },
  })

  return code
}

// Drops `undefined` values, which Next.js can't serialize as page props
export function toProps<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}
