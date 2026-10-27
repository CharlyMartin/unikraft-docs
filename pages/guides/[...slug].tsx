import { MDXComponents } from 'components/mdx-components'
import { useMDXComponent } from 'hooks/use-mdx-component'
import MDXTutorialLayout from 'layouts/guide'
import { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { compileMDX, toProps } from 'utils/mdx'
import { guideCollection } from '../../qino/collections/guides'

export default function Page({
  guide,
  code,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(code)
  return (
    <MDXTutorialLayout frontmatter={guide.frontMatter}>
      <Component components={MDXComponents as any} />
    </MDXTutorialLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const guides = await guideCollection.getEntries()
  const paths = guides.map((guide) => ({
    params: { slug: [guide._meta.slug] },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async (ctx) => {
  const params = Array.isArray(ctx.params.slug)
    ? ctx.params.slug
    : [ctx.params.slug]

  const guide = await guideCollection.getEntry(params.join('/'))

  return {
    props: toProps({
      guide: { frontMatter: guide.frontMatter },
      code: await compileMDX(guide.markdown),
    }),
  }
}
