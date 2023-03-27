<script setup lang="ts">
import { reactive, onMounted, ref, onUnmounted } from 'vue'
import { Post, Thread, User, useStore } from '../../stores'

import { userinfoApi } from '../../api/user'
import {
  getThreadLikeApi,
  getThreadLikeListApi,
  createThreadLikeApi,
  deleteThreadLikeApi,
  getPostLikedApi,
  getPostLikeListApi
} from '../../api/like'
import {
  getThreadFavoritedApi,
  getThreadFavListApi,
  createThreadFavApi,
  deleteThreadFavApi,
  getPostFavListApi,
  getPostFavoritedApi
} from '../../api/favorite'
import router from '../../router'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const { id } = defineProps(['id'])
const thread = reactive<Thread>(
  JSON.parse(localStorage.getItem('thread') as string) as Thread
)
const userinfo = reactive<User>({})
const languageList = reactive<Array<string>>([])
const markdownBody = ref<string>('')
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

markdownBody.value =
  localStorage.getItem('theme') === 'dark'
    ? 'github-markdown-body'
    : 'vuepress-markdown-body'

useStore().$subscribe((mutation: any, state: any) => {
  if (mutation.events.key === 'theme') {
    themeChange(mutation.events.newValue)
  }
})

const themeChange = (theme: 'light' | 'dark') => {
  markdownBody.value =
    theme === 'dark' ? 'github-markdown-body' : 'vuepress-markdown-body'
}

onMounted(() => {
  Promise.all([
    userinfoApi(thread.user_id, config),
    getThreadLikeApi(id, config),
    getThreadLikeListApi(id, config),
    getThreadFavoritedApi(id, config),
    getThreadFavListApi(id, config)
  ]).then(res => {
    Object.assign(userinfo, res[0].data.data.user)
    thread.likeFlag = res[1].data.data.likeFlag
    thread.likeNum = res[2].data.data.total
    thread.favoriteFlag = res[3].data.data.favoriteFlag
    thread.favNum = res[4].data.data.total
  })
  aboutMainbody()
})

const aboutMainbody = () => {
  const el = document.getElementById(`${thread.post.id}`) as HTMLElement
  const blocks = document.querySelectorAll('pre')
  blocks.forEach((block: HTMLElement, index: number) => {
    hljs.highlightBlock(block)
    languageList.push(
      block.classList.value.slice(block.classList.value.indexOf('language') + 9)
    )

    block?.classList.add(
      'relative',
      'overflow-x-auto',
      'overflow-y-auto',
      'bg-black'
    )
    const codeEl = block.querySelector('code')
    const langTag = document.createElement('span')
    langTag.innerHTML = languageList[index]
    langTag.classList.add(
      'absolute',
      'top-0',
      'right-0',
      'px-1',
      'm-2',
      'rounded-lg'
    )
    block?.insertBefore(langTag, codeEl)
  })
}

const toUserpage = () => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: thread.post.user_id
    }
  })
}
</script>
<template>
  <div class="ct-bg">
    <div class="rounded-lg flex justify-center">
      <!-- left -->
      <div
        class="shadow-md p-8 dark:bg-deepBlack max-w-screen-lg"
        style="min-width: 800px"
      >
        <div class="h-16 flex items-center">
          <img
            :src="`http://icon.mgaronya.com/${userinfo.Icon}`"
            alt=""
            class="inline-block h-12 w-12 mr-4 rounded-full shadow-md hover:cursor-pointer"
            @click="toUserpage"
          />
          <span class="text-xl font-semibold">{{ thread.author }}</span>
          <el-divider direction="vertical"></el-divider>
          <span>{{ thread.updated_at }}</span>
        </div>
        <el-divider></el-divider>
        <v-md-preview-html
          :id="thread.id"
          :html="thread.res_long"
          :preview-class="markdownBody"
        ></v-md-preview-html>
        <div
          class="border-solid border border-gray-500 shadow-md dark:bg-black mt-2 text-sm rounded-lg"
        >
          <p class="mt-4 ml-4 font-semibold hover:text-blue-500">
            {{ thread.post.author }}：
          </p>

          <v-md-preview-html
            :id="thread.post.id"
            :html="thread.post.res_long"
            :preview-class="markdownBody"
          ></v-md-preview-html>
        </div>
      </div>
      <!-- right -->
    </div>
  </div>
</template>
<style scoped lang="less"></style>
