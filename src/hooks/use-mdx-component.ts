import { getMDXComponent } from 'mdx-bundler/client'
import { useMemo } from 'react'

export function useMDXComponent(code: string) {
  return useMemo(() => getMDXComponent(code), [code])
}
