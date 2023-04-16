<script setup lang="ts">
import { reactive, onMounted, ref, onUnmounted } from 'vue'
import { Post, Thread, User, useStore } from '../../stores/store'

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
import router from '../../router/router'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const { id } = defineProps(['id'])
const thread = reactive<Thread>(
  JSON.parse(localStorage.getItem('thread') as string) as Thread
)
const userinfo = reactive<User>({} as User)
const languageList = reactive<Array<string>>([])
const markdownBody = ref<string>('')
const modifyIconColor = ref<string>('#333333')
const showModifyIcon = ref<boolean>(false)
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
    showModifyIcon.value =
      userinfo.Name ===
      JSON.parse(localStorage.getItem('userInfo') as string).Name
        ? true
        : false
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

const toModifyAritcle = () => {
  localStorage.setItem('threadModifyText', thread.content)
  router.push({
    name: 'threadModify',
    params: {
      id: thread.id
    }
  })
}
</script>
<template>
  <div class="ct-bg">
    <div class="rounded-lg flex justify-center bg-white dark:bg-deepBlack">
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
          <span
            class="text-xl font-semibold hover:text-blue-500 hover:cursor-pointer"
            @click="toUserpage"
            >{{ thread.author }}</span
          >
          <el-divider direction="vertical"></el-divider>
          <span>{{ thread.updated_at }}</span>
          <span class="flex-grow flex justify-end">
            <span
              v-if="showModifyIcon"
              class="hover:cursor-pointer"
              @mouseover="modifyIconColor = '#1296db'"
              @mouseleave="modifyIconColor = '#333333'"
              @click="toModifyAritcle"
            >
              <svg
                t="1679904819720"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="3437"
                width="24"
                height="24"
              >
                <path
                  d="M300.8 723.2c0 12.8 0 19.2 6.4 25.6 6.4 6.4 12.8 6.4 19.2 6.4h6.4l172.8-44.8 448-448c19.2-19.2 32-51.2 0-83.2l-64-64c-32-32-64-32-96 6.4l-448 435.2-44.8 166.4zM825.6 160c6.4-6.4 19.2-6.4 25.6 0l44.8 44.8c6.4 6.4 6.4 19.2 0 25.6l-44.8 44.8-70.4-70.4 44.8-44.8zM736 249.6l70.4 70.4-313.6 313.6-70.4-70.4L736 249.6zM384 608l64 64-83.2 19.2L384 608z m544-204.8c-25.6 0-38.4 12.8-38.4 25.6v409.6c0 19.2-19.2 38.4-38.4 38.4H166.4c-19.2 0-38.4-19.2-38.4-38.4V179.2c0-19.2 19.2-38.4 38.4-38.4h448c12.8 0 25.6-12.8 25.6-32s-12.8-32-32-32H160c-51.2 0-96 44.8-96 96v678.4c0 51.2 44.8 96 96 96h704c51.2 0 96-44.8 96-96v-416c0-19.2-12.8-32-32-32z"
                  :fill="modifyIconColor"
                  p-id="3438"
                ></path>
              </svg>
            </span>
          </span>
        </div>
        <el-divider></el-divider>
        <div class="border-solid bg-gray-100 rounded-lg p-2">
          <v-md-preview-html
            :id="thread.id"
            :html="thread.res_long"
            :preview-class="markdownBody"
          ></v-md-preview-html>
        </div>

        <div class="dark:bg-black mt-2 text-sm">
          <p class="mt-8 mx-4 flex">
            <span class="font-semibold mr-4 flex-grow">{{
              thread.post.title
            }}</span>
            <span>{{ thread.post.author }}</span>
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
<style scoped lang="less">
::v-deep .vuepress-markdown-body:not(.custom) {
  @apply p-4;
}

::v-deep .vuepress-markdown-body {
  @apply p-4 bg-white bg-opacity-0;
}

::v-deep .github-markdown-body {
  @apply p-4;
}
</style>
