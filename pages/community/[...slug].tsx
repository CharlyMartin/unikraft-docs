import { MDXComponents } from 'components/mdx-components'
import { useMDXComponent } from 'hooks/use-mdx-component'
import MDXLayout from 'layouts/mdx'
import { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { toArray } from 'utils/js-utils'
import { compileMDX, toProps } from 'utils/mdx'
import { communityCollection } from '../../qino/collections/community'

export default function Page({
  doc,
  code,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(code)
  return (
    <MDXLayout frontmatter={doc.frontMatter}>
      <Component components={MDXComponents as any} />
    </MDXLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const docs = await communityCollection.getEntries()
  const paths = docs.map((doc) => ({
    params: { slug: doc._meta.slug.split('/') },
  }))
  return { paths, fallback: false }
}

export const getStaticProps = async (ctx) => {
  const params = toArray(ctx.params.slug)
  const doc = await communityCollection.getEntry(params.join('/'))
  return {
    props: toProps({
      doc: { frontMatter: doc.frontMatter },
      code: await compileMDX(doc.markdown),
    }),
  }
}
