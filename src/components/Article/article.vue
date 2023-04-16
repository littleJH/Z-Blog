<script setup lang="ts">
import router from '../../router/router'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { Article, User, useStore } from '../../stores/store'
import { defineProps } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { userinfoApi } from '../../api/user'
import tocbor from 'tocbot'
import 'tocbot/dist/tocbot.css'
import { setArticleHistoryApi } from '../../api/history'
import { createArticleLikeApi, deleteArticleLikeApi } from '../../api/like'
import { createArticleFavApi, deleteArticleFavApi } from '../../api/favorite'
import { getArticleLevelApi } from '../../api/visible'
import userCard from '../userCard.vue'
import { userArticlesApi, userPostsApi, userThreadsApi } from '../../api/user'
import labelCard from '../labelCard.vue'
import likefavList from '../likefavList.vue'

const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
const props = defineProps(['id'])
const store = useStore()
const lfList = reactive({
  likeList: [] as Array<string>,
  favList: [] as Array<string>
})
const showList = ref<boolean>(false)
const article = reactive<Article>(
  JSON.parse(localStorage.getItem('article') as string) as Article
)
const total = reactive({
  article: 0,
  post: 0,
  thread: 0
})
const languageList = reactive<Array<string>>([])
const userInfo = reactive<User>({} as any)
const markdownBody = ref<string>(
  localStorage.getItem('theme') === 'dark'
    ? 'github-markdown-body'
    : 'vuepress-markdown-body'
)
const showModifyIcon = ref<boolean>(false)
const showCatalogue = ref<boolean>(true)

store.$subscribe((mutation: any, state: any) => {
  if (mutation.events.key === 'theme') {
    themeChange(mutation.events.newValue)
  }
})
const themeChange = (theme: 'light' | 'dark') => {
  markdownBody.value =
    theme === 'dark' ? 'github-markdown-body' : 'vuepress-markdown-body'
}

onBeforeMount(() => {
  setArticleHistoryApi(props.id, config)
  Promise.all([
    userinfoApi(article.user_id, config),
    userArticlesApi(article.user_id, config, 0, 0),
    userPostsApi(article.user_id, config, 0, 0),
    userThreadsApi(article.user_id, config, 0, 0),
    getArticleLevelApi(article.id, config)
  ]).then(res => {
    Object.assign(userInfo, res[0].data.data.user)
    userInfo.ID = article.user_id
    showModifyIcon.value =
      userInfo.Name ===
      JSON.parse(localStorage.getItem('userInfo') as string).Name
        ? true
        : false
    total.article = res[1].data.data.total
    total.post = res[2].data.data.total
    total.thread = res[3].data.data.total
    article.level = res[4].data.data.Level
  })
})

onMounted(() => {
  const el = document.getElementById(`${article.id}`) as HTMLElement
  const titleEl = el.querySelectorAll('h1') as NodeList
  titleEl[0]?.parentElement?.removeChild(titleEl[0])
  const blocks = el.querySelectorAll('pre')
  blocks.forEach((block: HTMLElement, index: number) => {
    hljs.highlightBlock(block)
    languageList.push(
      block.classList.value.slice(block.classList.value.indexOf('language') + 9)
    )

    block?.classList.add('relative', 'overflow-x-auto', 'overflow-y-auto')
    const codeEl = block.querySelector('code')
    const newEl = document.createElement('span')
    newEl.innerHTML = languageList[index]
    newEl.classList.add(
      'absolute',
      'top-0',
      'right-0',
      'px-1',
      'm-2',
      'rounded-lg'
    )
    block?.insertBefore(newEl, codeEl)
  })
  initTocbor()
})

const initTocbor = () => {
  tocbor.init({
    tocSelector: '#toc',
    contentSelector: '.content',
    headingSelector: 'h1, h2, h3, h4, h5, h6',
    collapseDepth: 6,
    headingsOffset: 0
  })
  //实现同步滚动
  const catalogueContainer = document.querySelector(
    '#catalogueContainer'
  ) as HTMLElement
  const articleContainer = document.querySelector(
    '#articleContainer'
  ) as HTMLElement
  const html = document.querySelector('html') as HTMLElement
  window.addEventListener('scroll', () => {
    catalogueContainer.scrollTop =
      html.scrollTop *
      ((catalogueContainer.scrollHeight - catalogueContainer.clientHeight) /
        (articleContainer.scrollHeight - html.clientHeight))
  })
}

const toModifyAritcle = () => {
  localStorage.setItem('articleModifyText', article.content)
  router.push({
    name: 'articleModify',
    params: {
      id: article.id
    }
  })
}
const doLike = () => {
  if (!article.likeFlag) {
    createArticleLikeApi(article.id, config).then(res => {
      if (res.data.code === 200) {
        article.likeFlag = true
        article.likeNum++
      }
    })
  } else {
    deleteArticleLikeApi(article.id, config).then(res => {
      if (res.data.code === 200) {
        article.likeFlag = false
        article.likeNum--
      }
    })
  }
}

const doFav = () => {
  if (!article.favoriteFlag) {
    createArticleFavApi(article.id, config).then(res => {
      if (res.data.code === 200) {
        article.favoriteFlag = true
        article.favNum++
      }
    })
  } else {
    deleteArticleFavApi(article.id, config).then(res => {
      if (res.data.code === 200) {
        article.favoriteFlag = false
        article.favNum--
      }
    })
  }
}

const catalogueEnter = () => {
  initTocbor()
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })
}

const getLikeFavList = async () => {
  const { getArticleLikeListApi } = await import('../../api/like')
  const { getArticleFavListApi } = await import('../../api/favorite')
  await Promise.all([
    getArticleLikeListApi(article.id, config),
    getArticleFavListApi(article.id, config)
  ]).then(res => {
    console.log(res)
    lfList.likeList = res[0].data.data.Liks
    lfList.favList = res[1].data.data.Favorites
  })
  showList.value = true
}
</script>

<template>
  <div class="ct-bg">
    <div class="rounded-lg flex justify-center">
      <!-- like fav list -->
      <div v-if="showList" class="fixed z-50 top-0 left-0">
        <likefavList
          @close-dialog="showList = false"
          :list="lfList"
        ></likefavList>
      </div>
      <!-- article -->
      <div
        id="articleContainer"
        class="shadow-lg p-8 bg-white dark:bg-deepBlack"
        style="width: 800px"
      >
        <div class="flex items-center">
          <span class="flex-grow flex items-center">
            <span class="text-4xl font-bold mr-4">{{ article.title }}</span>
            <labelCard v-for="item in article.labels" :label="item"></labelCard>
          </span>
          <span
            v-if="showModifyIcon"
            class="h-8 w-8 flex justify-center items-center"
            @click="toModifyAritcle"
          >
            <svg
              t="1679904819720"
              class="icon h-6 w-6 hover:h-8 hover:w-8 hover:cursor-pointer transition-all duration-500 ease-in-out"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3437"
              width="24"
              height="24"
            >
              <path
                d="M300.8 723.2c0 12.8 0 19.2 6.4 25.6 6.4 6.4 12.8 6.4 19.2 6.4h6.4l172.8-44.8 448-448c19.2-19.2 32-51.2 0-83.2l-64-64c-32-32-64-32-96 6.4l-448 435.2-44.8 166.4zM825.6 160c6.4-6.4 19.2-6.4 25.6 0l44.8 44.8c6.4 6.4 6.4 19.2 0 25.6l-44.8 44.8-70.4-70.4 44.8-44.8zM736 249.6l70.4 70.4-313.6 313.6-70.4-70.4L736 249.6zM384 608l64 64-83.2 19.2L384 608z m544-204.8c-25.6 0-38.4 12.8-38.4 25.6v409.6c0 19.2-19.2 38.4-38.4 38.4H166.4c-19.2 0-38.4-19.2-38.4-38.4V179.2c0-19.2 19.2-38.4 38.4-38.4h448c12.8 0 25.6-12.8 25.6-32s-12.8-32-32-32H160c-51.2 0-96 44.8-96 96v678.4c0 51.2 44.8 96 96 96h704c51.2 0 96-44.8 96-96v-416c0-19.2-12.8-32-32-32z"
                fill="#6B7280"
                p-id="3438"
              ></path>
            </svg>
          </span>
        </div>

        <div
          class="my-4 text-gray-700 flex items-center tracking-wide dark:text-gray-400"
        >
          <span class="flex items-center flex-grow">
            <span class="font-bold">{{ userInfo.Name }}</span>
            <p class="divider-vertical h-3"></p>
            <span class="text-gray-500 text-sm">{{ article.updated_at }}</span>
            <p class="divider-vertical h-3"></p>
            <span class="text-gray-500 text-sm">
              阅读：{{ article.visible }}
            </span>
            <p class="divider-vertical h-3"></p>
            <span class="text-gray-500 text-sm">
              <span v-if="article.level === 1">所有人可见</span>
              <span v-if="article.level === 2">好友圈可见</span>
              <span v-if="article.level === 3">仅自己可见</span>
            </span>
          </span>
          <span
            @click="getLikeFavList"
            class="flex justify-end items-center text-xs text-gray-500 hover:cursor-pointer"
          >
            <svg
              t="1681375863362"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3501"
              width="16"
              height="16"
            >
              <path
                d="M170.666667 298.666667h682.666666v42.666666H170.666667V298.666667z m0 426.666666h426.666666v42.666667H170.666667v-42.666667z m0-213.333333h682.666666v42.666667H170.666667v-42.666667z"
                fill="#6B7280"
                p-id="3502"
              ></path>
            </svg>
            <span>点赞·收藏</span>
          </span>
        </div>
        <el-divider></el-divider>
        <v-md-preview-html
          :id="article.id"
          :html="article.res_long"
          class="content"
          :preview-class="markdownBody"
        ></v-md-preview-html>
      </div>
      <!-- right -->
      <div>
        <!-- container -->
        <div class="sticky top-20 max-w-min mx-8 min-w-max">
          <!-- author card -->
          <div
            class="shadow-md w-full bg-white flex flex-col justify-center items-center dark:bg-deepBlack"
          >
            <userCard :user="userInfo"></userCard>
            <div class="p-4">
              <span
                @click="
                  router.push({
                    name: 'userArticleList',
                    params: {
                      userId: article.user_id
                    }
                  })
                "
                class="text-sm font-bold p-4 hover:cursor-pointer hover:underline hover:text-blue-500"
                >文章：{{ total.article }}</span
              >
              <span
                @click="
                  router.push({
                    name: 'userPostList',
                    params: {
                      userId: article.user_id
                    }
                  })
                "
                class="text-sm font-bold p-4 hover:cursor-pointer hover:underline hover:text-blue-500"
              >
                帖子：{{ total.post }}</span
              >
              <span
                @click="
                  router.push({
                    name: 'userThreadList',
                    params: {
                      userId: article.user_id
                    }
                  })
                "
                class="text-sm font-bold p-4 hover:cursor-pointer hover:underline hover:text-blue-500"
                >跟帖：{{ total.thread }}</span
              >
            </div>
            <!-- <div class="mt-4 mx-4 flex justify-start">
              <button @click="toUserpage" class="btn-blue-large">主页</button>
              <button class="btn-red-large">留言</button>
            </div> -->
          </div>
          <!-- 目录 -->
          <div
            id="catalogueContainer"
            class="my-8 min-h-min max-h-96 bg-white shadow-md dark:bg-deepBlack overflow-y-scroll"
          >
            <div class="sticky top-0 bg-white dark:bg-deepBlack">
              <p class="p-4 font-bold flex">
                <span class="flex-grow select-none">目录</span>
                <span
                  @click="showCatalogue = !showCatalogue"
                  class="hover:cursor-pointer"
                >
                  <Transition mode="out-in">
                    <svg
                      v-if="!showCatalogue"
                      t="1680939795496"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2940"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M87.829333 352.021333L489.386667 753.578667a32 32 0 0 0 42.986666 2.069333l2.282667-2.069333 401.536-401.557334a8.533333 8.533333 0 0 0 2.496-6.037333v-66.346667a8.533333 8.533333 0 0 0-14.570667-6.037333L512.021333 685.674667 99.904 273.6a8.533333 8.533333 0 0 0-14.570667 6.037333v66.346667a8.533333 8.533333 0 0 0 2.496 6.037333z"
                        fill="#6B7280"
                        p-id="2941"
                      ></path>
                    </svg>
                    <svg
                      v-else
                      t="1680939736045"
                      class="icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      p-id="2314"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M936.170667 669.952L534.613333 268.394667a32 32 0 0 0-42.986666-2.069334l-2.282667 2.069334L87.829333 669.952a8.533333 8.533333 0 0 0-2.496 6.037333v66.346667a8.533333 8.533333 0 0 0 14.570667 6.058667l412.074667-412.096 412.117333 412.096a8.533333 8.533333 0 0 0 14.570667-6.037334v-66.346666a8.533333 8.533333 0 0 0-2.496-6.058667z"
                        fill="#6B7280"
                        p-id="2315"
                      ></path>
                    </svg>
                  </Transition>
                </span>
              </p>
            </div>
            <Transition @after-enter="catalogueEnter">
              <div v-if="showCatalogue" class="">
                <div id="toc"></div>
              </div>
            </Transition>
          </div>
          <!-- like fav -->
          <div class="flex justify-center w-full flex-wrap">
            <span
              class="circle relative hover:cursor-pointer dark:bg-deepBlack"
              @click="doLike"
            >
              <Transition
                mode="out-in"
                enter-active-class="animate_animated animate__heartBeat"
              >
                <svg
                  v-if="!article.likeFlag"
                  t="1680938723764"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2546"
                  width="32"
                  height="32"
                >
                  <path
                    d="M332.8 249.6c38.4 0 83.2 19.2 108.8 44.8L467.2 320 512 364.8 556.8 320l25.6-25.6c32-32 70.4-44.8 108.8-44.8 19.2 0 38.4 6.4 57.6 12.8 44.8 25.6 70.4 57.6 76.8 108.8 6.4 44.8-6.4 89.6-38.4 121.6L512 774.4 236.8 492.8C204.8 460.8 185.6 416 192 371.2c6.4-44.8 38.4-83.2 76.8-108.8C288 256 313.6 249.6 332.8 249.6L332.8 249.6M332.8 185.6C300.8 185.6 268.8 192 243.2 204.8 108.8 275.2 89.6 441.6 185.6 537.6l281.6 281.6C480 832 499.2 838.4 512 838.4s32-6.4 38.4-19.2l281.6-281.6c96-96 76.8-262.4-57.6-332.8-25.6-12.8-57.6-19.2-89.6-19.2-57.6 0-115.2 25.6-153.6 64L512 275.2 486.4 249.6C448 211.2 390.4 185.6 332.8 185.6L332.8 185.6z"
                    fill="#2c2c2c"
                    p-id="2547"
                  ></path>
                </svg>
                <svg
                  v-else
                  t="1680938828701"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2844"
                  width="32"
                  height="32"
                >
                  <path
                    d="M780.8 204.8c-83.2-44.8-179.2-19.2-243.2 44.8L512 275.2 486.4 249.6c-64-64-166.4-83.2-243.2-44.8C108.8 275.2 89.6 441.6 185.6 537.6l32 32 153.6 153.6 102.4 102.4c25.6 25.6 57.6 25.6 83.2 0l102.4-102.4 153.6-153.6 32-32C934.4 441.6 915.2 275.2 780.8 204.8z"
                    fill="#EF4444"
                    p-id="2845"
                  ></path>
                </svg>
              </Transition>
              <span
                class="absolute text-sm px-2 top-0 right-0 text-center rounded-full bg-gray-200 dark:text-gray-300 dark:bg-gray-500 select-none"
                >{{ article.likeNum }}</span
              >
            </span>
            <span class="circle hover:cursor-pointer" @click="doFav">
              <Transition
                mode="out-in"
                enter-active-class="animate_animated animate__heartBeat"
              >
                <svg
                  v-if="!article.favoriteFlag"
                  t="1680937802146"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2700"
                  width="32"
                  height="32"
                >
                  <path
                    d="M716.8 883.2c-6.4 0-19.2 0-25.6-6.4L512 755.2l-179.2 121.6c-19.2 12.8-38.4 12.8-57.6 0-19.2-12.8-25.6-32-19.2-51.2L320 614.4 147.2 480C134.4 467.2 128 448 134.4 428.8c6.4-19.2 25.6-32 44.8-32L390.4 384l76.8-204.8c12.8-38.4 76.8-38.4 89.6 0l0 0L633.6 384l217.6 6.4c19.2 0 38.4 12.8 44.8 32 6.4 19.2 0 38.4-19.2 51.2L704 614.4l57.6 211.2c6.4 19.2 0 38.4-19.2 51.2C736 876.8 729.6 883.2 716.8 883.2zM512 684.8c6.4 0 12.8 0 19.2 6.4l166.4 115.2-57.6-192C640 595.2 640 582.4 652.8 576l160-128L608 448C595.2 448 582.4 435.2 582.4 422.4L512 236.8l-70.4 192C441.6 435.2 428.8 448 416 448L211.2 454.4l160 128C384 582.4 384 595.2 384 608l-57.6 192 166.4-115.2C499.2 684.8 505.6 684.8 512 684.8z"
                    fill="#2c2c2c"
                    p-id="2701"
                  ></path>
                </svg>

                <svg
                  v-else
                  t="1680937895217"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="3478"
                  width="32"
                  height="32"
                >
                  <path
                    d="M889.6 428.8c-6.4-19.2-25.6-32-44.8-32L633.6 384 556.8 179.2l0 0c-12.8-38.4-76.8-38.4-89.6 0L390.4 384 179.2 390.4c-19.2 0-38.4 12.8-44.8 32C128 448 134.4 467.2 147.2 480L320 614.4l-57.6 211.2c-6.4 19.2 0 38.4 19.2 51.2 19.2 12.8 38.4 12.8 57.6 0L512 755.2l179.2 121.6c6.4 6.4 19.2 6.4 25.6 6.4 12.8 0 19.2 0 25.6-6.4 19.2-12.8 25.6-32 19.2-51.2L704 614.4l172.8-134.4C889.6 467.2 896 448 889.6 428.8z"
                    fill="#F59E0B"
                    p-id="3479"
                    data-spm-anchor-id="a313x.7781069.0.i7"
                    class=""
                  ></path>
                </svg>
              </Transition>
              <span
                class="absolute text-sm px-2 top-0 right-0 text-center rounded-full bg-gray-200 dark:text-gray-300 dark:bg-gray-500 select-none"
                >{{ article.favNum }}</span
              >
            </span>
            <span class="circle hover:cursor-pointer" @click="scrollToTop">
              <svg
                t="1680942910351"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4868"
                width="48"
                height="48"
              >
                <path
                  d="M800 192 224 192c-17.7 0-32 14.3-32 32s14.3 32 32 32l576 0c17.7 0 32-14.3 32-32S817.7 192 800 192z"
                  p-id="4869"
                  fill="#6B7280"
                ></path>
                <path
                  d="M534.7 297.4c-3-3-6.5-5.3-10.4-7-7.8-3.2-16.6-3.2-24.4 0-3.9 1.6-7.5 4-10.4 7l-256 256c-12.5 12.5-12.5 32.8 0 45.2s32.8 12.5 45.2 0L480 397.2 480 832c0 17.7 14.3 32 32 32s32-14.3 32-32L544 397.2l201.4 201.4c6.2 6.2 14.4 9.4 22.6 9.4s16.4-3.1 22.6-9.4c12.5-12.5 12.5-32.8 0-45.2L534.7 297.4z"
                  p-id="4870"
                  fill="#6B7280"
                ></path>
              </svg>
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
::v-deep .github-markdown-body {
  @apply p-0;
}

::v-deep .vuepress-markdown-body:not(.custom) {
  @apply p-0;
}
::v-deep .toc-link::before {
  height: 0;
}
.circle {
  @apply relative w-16 h-16  rounded-full flex justify-center items-center shadow-lg m-4  dark:bg-deepBlack;
}
</style>
