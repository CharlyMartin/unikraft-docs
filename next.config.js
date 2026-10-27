const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const imageHosts = [
  'avatars.githubusercontent.com',
  'avatars0.githubusercontent.com',
  'avatars1.githubusercontent.com',
  'avatars2.githubusercontent.com',
  'avatars3.githubusercontent.com',
  'github.com',
  'img.youtube.com',
  'raw.githubusercontent.com',
  'res.cloudinary.com',
]

/**
 * @type {import('next').NextConfig}
 **/
module.exports = () => {
  const plugins = [withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    images: {
      remotePatterns: imageHosts.map((hostname) => ({
        protocol: 'https',
        hostname,
      })),
    },
    productionBrowserSourceMaps: true,
    redirects: require('./next-redirect'),
    reactStrictMode: true,
    output: 'standalone',
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  })
}
