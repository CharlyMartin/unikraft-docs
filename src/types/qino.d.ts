// Next 12 forces `moduleResolution: node`, which ignores `exports`, so point
// TypeScript at the published declarations through their runtime path.
declare module '@qino/cms' {
  export * from '@qino/cms/dist/index.mjs'
}
