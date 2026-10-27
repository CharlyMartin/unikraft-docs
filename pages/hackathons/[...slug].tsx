import { MDXComponents } from 'components/mdx-components'
import { useMDXComponent } from 'hooks/use-mdx-component'
import MDXLayout from 'layouts/mdx'
import { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { toArray } from 'utils/js-utils'
import { compileMDX, toProps } from 'utils/mdx'
import { hackathonCollection } from '../../qino/collections/hackathons'

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
  const hackathons = await hackathonCollection.getEntries()
  const paths = hackathons.map((hackathon) => ({
    params: { slug: [hackathon._meta.slug] },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async (ctx) => {
  const params = toArray(ctx.params.slug)
  const doc = await hackathonCollection.getEntry(params.join('/'))
  return {
    props: toProps({
      doc: { frontMatter: doc.frontMatter },
      code: await compileMDX(doc.markdown),
    }),
  }
}
