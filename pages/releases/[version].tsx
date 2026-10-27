import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'
import { useRouter } from 'next/router'
import semverMaxSatisfying from 'semver/ranges/max-satisfying'
import { useEffect } from 'react'
import { MDXComponents } from 'components/mdx-components'
import { useMDXComponent } from 'hooks/use-mdx-component'
import ReleaseLayout from 'layouts/release'
import { compileMDX, toProps } from 'utils/mdx'
import { releaseCollection } from '../../qino/collections/releases'

export default function Page({
  doc,
  code,
  releases,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const Component = useMDXComponent(code)
  const router = useRouter()

  useEffect(() => {
    if (router.query.version === 'latest') {
      router.replace(`/releases/v${doc.version}`)
    }
  }, [router, doc])

  return (
    <ReleaseLayout
      hideToc
      release={doc}
      releases={releases}
      frontmatter={doc.frontMatter}
    >
      <Component components={MDXComponents as any} />
    </ReleaseLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const releases = await releaseCollection.getEntries()
  const paths = [
    ...releases.map((doc) => ({
      params: { version: `v${doc.version}` },
    })),
    {
      params: { version: 'latest' },
    },
  ]
  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const allReleases = await releaseCollection.getEntries()
  let versionParam = ctx.params.version

  if (versionParam === 'latest') {
    versionParam = `v${semverMaxSatisfying(
      allReleases.map(({ version }) => version),
      '*',
    )}`
  }
  const { markdown, raw, _meta, ...release } = allReleases.find(
    ({ version }) => `v${version}` === versionParam,
  )
  const doc = {
    ...release,
    frontMatter: {
      ...release.frontMatter,
      title: `v${release.version} (${release.codename})`,
    },
  }

  return {
    props: toProps({
      doc,
      code: await compileMDX(markdown),
      releases: allReleases.map(({ version, codename }) => ({
        version,
        codename,
      })),
    }),
  }
}
