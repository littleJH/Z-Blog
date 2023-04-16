declare module '@kangc/v-md-editor/lib/theme/vuepress.js'
declare module '@kangc/v-md-editor'
declare module 'prismjs'
declare module '@kangc/v-md-editor/lib/preview-html'
declare module '@kangc/v-md-editor/lib/theme/github.js'
declare module '@kangc/v-md-editor/lib/theme/base/highlight'
declare module 'nprogress'
declare module '@kangc/v-md-editor/lib/preview'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const vueComponent: DefineComponent<{}, {}, any>

  export default vueComponent
}
