import { initQino } from '@qino/cms'

export default initQino({
  contentFolder: 'content',
  mediaFolder: 'public',
  cli: {
    // Page links like `/releases/v0.9.0` look like files to the media check
    check: { localAssetReferences: { exclude: ['/releases/**', '/blog/**'] } },
  },
})
