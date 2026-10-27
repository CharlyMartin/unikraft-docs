import { GetStaticPaths, InferGetStaticPropsType } from 'next'
import { MDXComponents } from 'components/mdx-components'
import { useMDXComponent } from 'hooks/use-mdx-component'
import BlogLayout from 'layouts/blog'
import { compileMDX, toProps } from 'utils/mdx'
import { blogCollection } from '../../qino/collections/blog'

export default function Page({
  blog,
  code,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(code)
  return (
    <BlogLayout frontmatter={blog.frontMatter}>
      <Component components={MDXComponents as any} />
    </BlogLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = await blogCollection.getEntries()
  const paths = blogs.map((blog) => ({ params: { slug: [blog._meta.slug] } }))

  return { paths, fallback: false }
}

export const getStaticProps = async (ctx) => {
  const params = Array.isArray(ctx.params.slug)
    ? ctx.params.slug
    : [ctx.params.slug]

  const blog = await blogCollection.getEntry(params.join('/'))

  return {
    props: toProps({
      blog: { frontMatter: blog.frontMatter },
      code: await compileMDX(blog.markdown),
    }),
  }
}
