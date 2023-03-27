<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { Post, Thread, User, useStore } from '../../stores'
import { defineProps } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { userinfoApi } from '../../api/user'
import { getThreadListApi, createThread } from '../../api/thread'
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
import tocbor from 'tocbot'
import 'tocbot/dist/tocbot.css'
import router from '../../router'
import { marked } from 'marked'

const props = defineProps(['id'])
const post = reactive<Post>(
  JSON.parse(localStorage.getItem('post') as string) as Post
)
let threadList = reactive<Array<Thread>>([])
const languageList = reactive<Array<string>>([])
const userinfo = reactive<User>({})
const commentMode = ref<boolean>(false)
const threadMarkdown = ref<string>(
  localStorage.getItem('threadMarkdown') !== null
    ? (localStorage.getItem('threadMarkdown') as string)
    : ''
)
const threadText = ref<string>('')
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

onMounted(async () => {
  Promise.all([
    userinfoApi(post.user_id, config),
    getPostLikedApi(post.id, config),
    getPostLikeListApi(post.id, config),
    getPostFavoritedApi(post.id, config),
    getPostFavListApi(post.id, config)
  ]).then(res => {
    Object.assign(userinfo, res[0].data.data.user)
    post.likeFlag = res[1].data.data.likeFlag
    post.likeNum = res[2].data.data.total
    post.favoriteFlag = res[3].data.data.favoriteFlag
    post.favNum = res[4].data.data.total
  })

  getThreadlist()

  aboutMainbody()
})

const getThreadlist = () => {
  getThreadListApi(post.id, config).then(result => {
    for (let item of result.data.data.threads) {
      item.updated_at = item.updated_at.slice(0, 10)

      Promise.all([
        getThreadLikeApi(item.id, config),
        getThreadLikeListApi(item.id, config),
        getThreadFavoritedApi(item.id, config),
        getThreadFavListApi(item.id, config),
        userinfoApi(item.user_id, config)
      ]).then(res => {
        item.likeFlag = res[0].data.data.likeFlag
        item.likeNum = res[1].data.data.total
        item.favoriteFlag = res[2].data.data.favoriteFlag
        item.favNum = res[3].data.data.total
        item.author = res[4].data.data.user.Name
        item.authorIcon = res[4].data.data.user.Icon
        item.post = post
        item.favSvgColor = '#6B7280'
        item.likeSvgColor = '#6B7280'
        threadList.push(item)
      })
    }
  })
}

const aboutMainbody = () => {
  const el = document.getElementById(`${props.id}`) as HTMLElement
  const titleEl = el.querySelectorAll('h1')
  titleEl[0]?.parentNode?.removeChild(titleEl[0])
  const blocks = el.querySelectorAll('pre')
  blocks.forEach((block: HTMLElement, index: number) => {
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
      'rounded-lg'
    )
    block?.insertBefore(langTag, codeEl)
  })

  tocbor.init({
    tocSelector: '#toc',
    contentSelector: '.content',
    headingSelector: 'h1, h2, h3, h4, h5, h6',
    collapseDepth: 6,
    headingsOffset: -50
  })
}

const toUserpage = () => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: post.user_id
    }
  })
}

const doLike = (index: any) => {
  if (!threadList[index].likeFlag) {
    createThreadLikeApi(threadList[index].id, config).then(res => {
      console.log(res)
      if (res.data.code === 200) {
        threadList[index].likeFlag = true
      }
    })
  } else {
    deleteThreadLikeApi(threadList[index].id, config).then(res => {
      if (res.data.code === 200) {
        threadList[index].likeFlag = false
      }
    })
  }
}

const doFav = (index: any) => {
  if (!threadList[index].favoriteFlag) {
    createThreadFavApi(threadList[index].id, config).then(res => {
      if (res.data.code === 200) {
        threadList[index].favoriteFlag = true
      }
    })
  } else {
    deleteThreadFavApi(threadList[index].id, config).then(res => {
      if (res.data.code === 200) {
        threadList[index].favoriteFlag = false
      }
    })
  }
}

const toDetail = (index: number) => {
  localStorage.setItem('thread', JSON.stringify(threadList[index]))
  router.push({
    name: 'thread',
    params: {
      id: threadList[index].id
    }
  })
}

const mouseoverLikeSvg = (index: number) => {
  threadList[index].likeSvgColor = '#1296db'
}

const mouseleaveLikeSvg = (index: number) => {
  threadList[index].likeSvgColor = '#6B7280'
}

const mouseoverFavSvg = (index: number) => {
  threadList[index].favSvgColor = '#1296db'
}

const mouseleaveFavSvg = (index: number) => {
  threadList[index].favSvgColor = '#6B7280'
}

const toThreadUserpage = (id: any) => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: id
    }
  })
}

const commentmodeChange = () => {
  commentMode.value === true
    ? (commentMode.value = true)
    : (commentMode.value = false)
}

const textChange = () => {
  localStorage.setItem('threadMarkdown', threadMarkdown.value)
}
const textSave = () => {
  const blob = new Blob([threadMarkdown.value], {
    type: 'text/markdown'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'threadMarkdown.md'
  a.click()
  URL.revokeObjectURL(url)
}

const submitThread = () => {
  type Data = {
    [key: string]: string
  }
  let data: Data
  Object.assign(config.headers, { 'Content-Type': 'application/json' })
  if (!commentMode) {
    data = {
      content: threadText.value
    }
  } else {
    data = {
      content: threadMarkdown.value,
      res_long: marked(threadMarkdown.value)
    }
  }
  createThread(post.id, JSON.stringify(data), config).then(res => {
    console.log(res.data)
    if (res.data.code === 200) {
      threadMarkdown.value = ''
      threadText.value = ''
      localStorage.removeItem('threadMarkdown')
      localStorage.removeItem('threadText')
      threadList.length = 0
      getThreadlist()
    }
  })
}
</script>
<template>
  <div class="ct-bg">
    <div class="rounded-lg flex justify-center">
      <!-- left -->
      <div>
        <!-- post -->
        <div
          class="shadow-md p-8 dark:bg-deepBlack max-w-screen-lg"
          style="min-width: 800px"
        >
          <p class="text-4xl mt-4 mb-8 font-bold">{{ post.title }}</p>
          <div class="h-16 my-8 flex jusitfy-center">
            <span class="text-gray-700 dark:text-gray-400">
              <p class="h-8 m-0 p-0 text-xl font-semibold">{{ post.author }}</p>
              <p class="h-8 flex justify-center items-center tracking-wide">
                <span>{{ post.updated_at }}</span>
                <el-divider direction="vertical"></el-divider>
                <span class="flex items-center pl-1">
                  <p>阅读：{{ post.visible }}</p>
                </span>
              </p>
            </span>
          </div>
          <el-divider></el-divider>
          <v-md-preview-html
            :id="post.id"
            :html="post.res_long"
            class="content"
            :preview-class="markdownBody"
          ></v-md-preview-html>
        </div>
        <!-- thread -->
        <div
          class="shadow-md bg-white p-8 dark:bg-deepBlack max-w-screen-lg"
          style="min-width: 800px"
        >
          <div class="flex items-center justify-between dark:bg-deepBlack">
            <p class="text-2xl font-bold order-first">回复</p>
            <p class="order-last">
              <el-switch
                v-model="commentMode"
                inline-prompt
                active-text="MD &nbsp"
                inactive-text="&nbsp MD"
                @change="commentmodeChange"
                size="large"
              >
              </el-switch>
            </p>
          </div>
          <div class="my-8 relative">
            <textarea
              v-if="!commentMode"
              v-model="threadText"
              rows="3"
              name=""
              placeholder="回复这篇帖子（Enter换行）"
              class="w-full p-2 rounded-lg ring-1 ring-gray-500 focus:outline-none focus:ring-blue-500 focus:border-transparent dark:bg-black"
              style="min-height: 3rem"
            />
            <div v-else>
              <v-md-editor
                v-model="threadMarkdown"
                height="400px"
                left-toolbar="undo redo  | h bold italic  quote ul ol table hr  |  link image code  "
                right-toolbar="save preview toc sync-scroll fullscreen"
                @change="textChange"
                @save="textSave"
              ></v-md-editor>
            </div>
            <button
              @click="submitThread"
              class="absolute bottom-4 right-4 btn-opacity-small"
            >
              回复
            </button>
          </div>
          <!-- threadList -->
          <div class="my-8">
            <div v-for="(item, index) in threadList">
              <div
                class="mt-8 rounded-lg hover:shadow-md hover:cursor-pointer p-4 transition-all duration-500 ease-in-out dark:hover:bg-black"
                @click="toDetail(index)"
              >
                <!-- author -->
                <div class="flex justify-start items-center">
                  <img
                    :src="`http://icon.mgaronya.com/${item.authorIcon}`"
                    class="h-8 w-8 rounded-full shadow-mg hover:cursor-pointer"
                    alt=""
                    @click.stop="toThreadUserpage(item.user_id)"
                  />
                  <span
                    class="font-bold px-2 text-lg hover:text-blue-500 hover:cursor-pointer"
                    @click.stop="toThreadUserpage(item.user_id)"
                  >
                    {{ item.author }}
                  </span>
                </div>
                <!-- thread -->
                <div class="mt-4">
                  <v-md-preview-html
                    :html="item.res_long"
                    class="rounded-lg bg-white border border-gray-300 dark:bg-black dark:border-gray-600"
                    preview-class="github-markdown-body "
                  >
                  </v-md-preview-html>
                  <!-- footer -->
                  <div
                    class="h-8 flex justify-start items-center text-gray-500"
                  >
                    <span
                      class="h-6 ml-2 flex items-center"
                      @click.stop="doLike(index)"
                      @mouseover="mouseoverLikeSvg(index)"
                      @mouseleave="mouseleaveLikeSvg(index)"
                    >
                      <svg
                        v-if="!item.likeFlag"
                        t="1679044901705"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="6768"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"
                          p-id="6769"
                          :fill="item.likeSvgColor"
                        ></path>
                      </svg>
                      <svg
                        v-else
                        t="1679044901705"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="6768"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"
                          p-id="6769"
                          fill="#1296db"
                        ></path>
                      </svg>
                      <span class="ml-2">{{ item.likeNum }}</span>
                    </span>
                    <span
                      class="h-6 ml-2 flex items-center"
                      @click.stop="doFav(index)"
                      @mouseover="mouseoverFavSvg(index)"
                      @mouseleave="mouseleaveFavSvg(index)"
                    >
                      <svg
                        v-if="!item.favoriteFlag"
                        t="1679043184932"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="5674"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M487.009524 113.078857a56.07619 56.07619 0 0 1 73.216 21.918476l1.901714 3.535238 100.400762 203.215239 224.402286 32.572952a56.07619 56.07619 0 0 1 33.938285 92.647619l-2.876952 3.023238-162.328381 158.061714 38.326857 223.256381a56.07619 56.07619 0 0 1-77.726476 60.854857l-3.608381-1.706666-200.801524-105.472-200.801524 105.447619a56.07619 56.07619 0 0 1-81.871238-55.344762l0.512-3.779048 38.351238-223.256381-162.32838-158.061714a56.07619 56.07619 0 0 1 27.282285-94.98819l3.779048-0.682667 224.377905-32.572952 100.425142-203.215239a56.07619 56.07619 0 0 1 25.429334-25.453714z m-77.287619 295.521524l-228.205715 33.133714 165.132191 160.743619-39.009524 227.132953 204.214857-107.25181 204.190476 107.25181-39.009523-227.132953 165.13219-160.743619-228.205714-33.133714-102.107429-206.701714-102.15619 206.701714z"
                          p-id="5675"
                          :fill="item.favSvgColor"
                        ></path>
                      </svg>
                      <svg
                        v-else
                        t="1679043184932"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="5674"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M487.009524 113.078857a56.07619 56.07619 0 0 1 73.216 21.918476l1.901714 3.535238 100.400762 203.215239 224.402286 32.572952a56.07619 56.07619 0 0 1 33.938285 92.647619l-2.876952 3.023238-162.328381 158.061714 38.326857 223.256381a56.07619 56.07619 0 0 1-77.726476 60.854857l-3.608381-1.706666-200.801524-105.472-200.801524 105.447619a56.07619 56.07619 0 0 1-81.871238-55.344762l0.512-3.779048 38.351238-223.256381-162.32838-158.061714a56.07619 56.07619 0 0 1 27.282285-94.98819l3.779048-0.682667 224.377905-32.572952 100.425142-203.215239a56.07619 56.07619 0 0 1 25.429334-25.453714z m-77.287619 295.521524l-228.205715 33.133714 165.132191 160.743619-39.009524 227.132953 204.214857-107.25181 204.190476 107.25181-39.009523-227.132953 165.13219-160.743619-228.205714-33.133714-102.107429-206.701714-102.15619 206.701714z"
                          p-id="5675"
                          fill="#1296db"
                        ></path>
                      </svg>
                      <span class="ml-2">{{ item.favNum }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- right -->
      <div>
        <!-- container -->
        <div class="sticky top-40 max-w-min mx-8">
          <!-- author card -->
          <div class="my-8 p-4 shadow-md min-w-max dark:bg-deepBlack">
            <div class="flex justify-start">
              <img
                :src="`http://icon.mgaronya.com/${userinfo.Icon}`"
                alt=""
                class="inline-block h-16 w-16 mx-4 rounded-full shadow-md hover:cursor-pointer"
                @click="toUserpage"
              />
              <span class="text-gray-700 dark:text-gray-400">
                <p class="h-8 m-0 p-0 text-xl font-bold">
                  {{ post.author }}
                </p>
                <p class="h-8 m-0 p-0 texx-xl">{{ userinfo.Email }}</p>
              </span>
            </div>
            <p class="mt-4">
              <button @click="toUserpage" class="btn-blue">主页</button>
              <button class="btn-red">私信</button>
            </p>
            <el-divider></el-divider>
          </div>
          <!-- 目录 -->
          <div class="my-8 p-4 shadow-md dark:bg-deepBlack">
            <p class="m-1 text-xl font-bold">{{ post.title }}</p>
            <el-divider></el-divider>
            <div id="toc" class=""></div>
          </div>
          <!-- like fav -->
          <div class="flex justify-center w-full flex-wrap">
            <span
              class="circle hover:cursor-pointer dark:bg-deepBlack"
              @mouseover="post.likeSvgColor = '#1296db'"
              @mouseleave="post.likeSvgColor = '#6B7280'"
            >
              <svg
                v-if="!post.likeFlag"
                t="1679044901705"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6768"
                width="28"
                height="28"
              >
                <path
                  d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"
                  p-id="6769"
                  :fill="post.likeSvgColor"
                ></path>
              </svg>
              <svg
                v-else
                t="1679044901705"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6768"
                width="28"
                height="28"
              >
                <path
                  d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4-20.5-21.5-48.1-33.4-77.9-33.4-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-0.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81z m636.4-353l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4c4.6 8.4 6.9 17.6 6.9 27.3 0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5c5.2-18.9 22.5-32.2 42.2-32.3 7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"
                  p-id="6769"
                  fill="#1296db"
                ></path>
              </svg>
              <span
                class="absolute px-2 top-0 right-0 text-center rounded-full bg-gray-200 dark:text-gray-300 dark:bg-gray-500"
                >{{ post.likeNum }}</span
              >
            </span>
            <span
              class="circle hover:cursor-pointer"
              @mouseover="post.favSvgColor = '#1296db'"
              @mouseleave="post.favSvgColor = '#6B7280'"
            >
              <svg
                v-if="!post.favoriteFlag"
                t="1679043184932"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5674"
                width="28"
                height="28"
              >
                <path
                  d="M487.009524 113.078857a56.07619 56.07619 0 0 1 73.216 21.918476l1.901714 3.535238 100.400762 203.215239 224.402286 32.572952a56.07619 56.07619 0 0 1 33.938285 92.647619l-2.876952 3.023238-162.328381 158.061714 38.326857 223.256381a56.07619 56.07619 0 0 1-77.726476 60.854857l-3.608381-1.706666-200.801524-105.472-200.801524 105.447619a56.07619 56.07619 0 0 1-81.871238-55.344762l0.512-3.779048 38.351238-223.256381-162.32838-158.061714a56.07619 56.07619 0 0 1 27.282285-94.98819l3.779048-0.682667 224.377905-32.572952 100.425142-203.215239a56.07619 56.07619 0 0 1 25.429334-25.453714z m-77.287619 295.521524l-228.205715 33.133714 165.132191 160.743619-39.009524 227.132953 204.214857-107.25181 204.190476 107.25181-39.009523-227.132953 165.13219-160.743619-228.205714-33.133714-102.107429-206.701714-102.15619 206.701714z"
                  p-id="5675"
                  :fill="post.favSvgColor"
                ></path>
              </svg>
              <svg
                v-else
                t="1679043184932"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="5674"
                width="28"
                height="28"
              >
                <path
                  d="M487.009524 113.078857a56.07619 56.07619 0 0 1 73.216 21.918476l1.901714 3.535238 100.400762 203.215239 224.402286 32.572952a56.07619 56.07619 0 0 1 33.938285 92.647619l-2.876952 3.023238-162.328381 158.061714 38.326857 223.256381a56.07619 56.07619 0 0 1-77.726476 60.854857l-3.608381-1.706666-200.801524-105.472-200.801524 105.447619a56.07619 56.07619 0 0 1-81.871238-55.344762l0.512-3.779048 38.351238-223.256381-162.32838-158.061714a56.07619 56.07619 0 0 1 27.282285-94.98819l3.779048-0.682667 224.377905-32.572952 100.425142-203.215239a56.07619 56.07619 0 0 1 25.429334-25.453714z m-77.287619 295.521524l-228.205715 33.133714 165.132191 160.743619-39.009524 227.132953 204.214857-107.25181 204.190476 107.25181-39.009523-227.132953 165.13219-160.743619-228.205714-33.133714-102.107429-206.701714-102.15619 206.701714z"
                  p-id="5675"
                  fill="#1296db"
                ></path>
              </svg>
              <span
                class="absolute px-2 top-0 right-0 text-center rounded-full bg-gray-200 dark:text-gray-300 dark:bg-gray-500"
                >{{ post.favNum }}</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
/* my-theme.css */
.v-md-editor.dark\:bg-gray-800 {
  background-color: #1a202c;
}

/* my-theme.css */
.v-md-preview-html.dark\:text-gray-300 {
  color: #cbd5e0;
}

::v-deep .vuepress-markdown-body:not(.custom) {
  @apply p-0;
  // @apply dark:bg-deepBlack !important;
}

// ::v-deep .v-md-textarea-editor textarea {
//   @apply bg-black text-gray-300;
// }
// ::v-deep .v-md-editor {
//   @apply bg-black border border-gray-300;
// }

::v-deep .toc-link::before {
  height: 0;
}
.circle {
  @apply relative w-16 h-16  rounded-full flex justify-center items-center shadow-md m-4  dark:bg-deepBlack;
}
span {
  @apply mr-2;
}
</style>
