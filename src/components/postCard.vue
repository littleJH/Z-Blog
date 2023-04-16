<script setup lang="ts">
import { defineProps, reactive, onBeforeMount, ref, onMounted } from 'vue'
import router from '../router/router'
import { getPostLikedApi, getPostLikeListApi } from '../api/like'
import { getPostFavListApi, getPostFavoritedApi } from '../api/favorite'
import { getPostLabelApi } from '../api/label'
import { userinfoApi } from '../api/user'
import nprogress from 'nprogress'
import { Post, User, useStore } from '../stores/store'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const { post } = defineProps(['post'])
const showBody = ref<boolean>(false)
const languageList = reactive<Array<string>>([])
const object = reactive({
  post: null as Post | null
})
const userInfo = reactive({
  info: null as User | null
})
const loading = ref<boolean>(true)

const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
const markdownBody = ref<string>(
  localStorage.getItem('theme') === 'dark'
    ? 'github-markdown-body'
    : 'vuepress-markdown-body'
)

useStore().$subscribe((mutation: any, state: any) => {
  if (mutation.events.key === 'theme') {
    themeChange(mutation.events.newValue)
  }
})

const themeChange = (theme: 'light' | 'dark') => {
  markdownBody.value =
    theme === 'dark' ? 'github-markdown-body' : 'vuepress-markdown-body'
}

onBeforeMount(async () => {
  await Promise.all([
    getPostLikedApi(post.id, config),
    getPostLikeListApi(post.id, config),
    getPostFavoritedApi(post.id, config),
    getPostFavListApi(post.id, config),
    getPostLabelApi(post.id, config),
    userinfoApi(post.user_id, config)
  ]).then(res => {
    post.likeFlag = res[0].data.data.flag
    post.likeNum = res[1].data.data.total
    post.favoriteFlag = res[2].data.data.flag
    post.favNum = res[3].data.data.total
    post.labels = res[4].data.data.labels
    post.author = res[5].data.data.user.Name
    userInfo.info = res[5].data.data.user
    object.post = post
    showBody.value = true
    loading.value = false
  })
  nprogress.done()
})

onMounted(() => {})

const afterEnter = () => {
  const el = document.getElementById(post.id) as HTMLElement
  const blocks = el.querySelectorAll('pre')
  blocks.forEach((block: any, index: number) => {
    hljs.highlightBlock(block)
    languageList.push(
      block.classList.value.slice(block.classList.value.indexOf('language') + 9)
    )

    block?.classList.add('relative', 'overflow-x-auto', 'overflow-y-auto')
    const codeEl = block.querySelector('code')
    const langTag = document.createElement('span')
    langTag.innerHTML = languageList[index]
    langTag.classList.add(
      'absolute',
      'top-0',
      'right-0',
      'px-1',
      'm-2',
      'rounded-lg',
      'text-sm'
    )
    block?.insertBefore(langTag, codeEl)
  })
}

// onUpdated(() => {
//   const node = document.createElement('div')
//   node.innerHTML = object.post?.res_long as string
//   const elements = node.querySelectorAll('p, span')
//   let str: string = ''
//   elements.forEach(e => {
//     str += e.textContent
//   })
//   str = str.replace(/\s+/g, '')
//   const el = document.getElementById(`${object.post?.id}`) as HTMLElement
//   el.innerText = str
// })

const toDetail = () => {
  localStorage.setItem('post', JSON.stringify(post))
  router.push({
    name: 'post',
    params: {
      id: post.id
    }
  })
}

const toUserpage = () => {
  router.push({
    name: 'userPostList',
    params: {
      userId: post.user_id
    }
  })
}
</script>
<template>
  <div
    @click="toDetail"
    class="rounded px-2 py-4 hover:shadow-lg hover:bg-gray-100 hover:cursor-pointer transition-all ease-in-out dark:bg-deepBlack dark:hover:bg-black"
  >
    <p class="flex items-center">
      <span class="font-bold truncate">{{ object.post?.title }}</span>
      <labelCard
        v-for="label in object.post?.labels"
        :label="label"
      ></labelCard>
      <span class="text-lg flex-grow flex justify-end items-center">
        <span class="mx-4 text-xs text-center">{{
          object.post?.updated_at
        }}</span>

        <span class="text-sm text-center">{{ object.post?.author }}</span>
        <img
          @click.stop="toUserpage()"
          class="avatar-small"
          :src="`http://icon.mgaronya.com/${userInfo.info?.Icon}`"
          alt=""
        />
      </span>
    </p>
    <div class="mt-2 rounded bg-gray-100 dark:bg-shallowBlack">
      <Transition @after-enter="afterEnter">
        <v-md-preview-html
          v-if="showBody"
          :id="post.id"
          :html="object.post?.res_long"
          :preview-class="markdownBody"
        ></v-md-preview-html>
      </Transition>
    </div>

    <div v-if="!loading" class="h-8 text-xs flex">
      <div class="flex-grow flex justify-start items-center text-gray-500">
        <span>点赞：{{ object.post?.likeNum }}</span>
        <div class="divider-vertical h-3"></div>
        <span>收藏：{{ object.post?.favNum }}</span>
        <div class="divider-vertical h-3"></div>
        <span>阅读：{{ object.post?.visible }}</span>
      </div>
      <div class="flex items-center">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
::v-deep .vuepress-markdown-body:not(.custom) {
  @apply p-4;
}

::v-deep .vuepress-markdown-body {
  @apply p-0 bg-white bg-opacity-0;
}

::v-deep .github-markdown-body {
  @apply p-4;
}
</style>
