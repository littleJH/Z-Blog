import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import elementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import router from './router/router.ts'
import 'animate.css'
import 'nprogress/nprogress.css'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import hljs from 'highlight.js'
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html'
import '@kangc/v-md-editor/lib/style/preview-html.css'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import emitter from 'mitt'
import Prism from 'prismjs'
type Events = {
  [propName: string]: any
}

const mitt = emitter<Events>()

VMdEditor.use(githubTheme, {
  Hljs: hljs
})
// VMdEditor.use(vuepressTheme, {
//   Hljs: hljs
// })
// VMdPreview.use(githubTheme, {
//   Prism
// })
// VMdPreview.use(vuepressTheme, {
//   Prism
// })
// VMdPreviewHtml.use(githubTheme, {
//   Prism
// })

// VMdPreviewHtml.use(vuepressTheme, {
//   Prism
// })

declare module 'vue' {
  export interface ComponentCustomProperties {
    $emitter: typeof mitt
  }
}
const pinia = createPinia()
const app = createApp(App)
app.config.globalProperties.$emitter = mitt

app.use(elementPlus)
app.use(pinia)
app.use(router)
app.use(VMdEditor)
app.use(VMdPreview)
app.use(VMdPreviewHtml)
app.mount('#app')
