<script setup lang="ts">
import router from '../../router'
import { ref, reactive, onMounted } from 'vue'
import { Article, User, useStore } from '../../stores/index'
import { defineProps } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { userinfoApi } from '../../api/user'
import tocbor from 'tocbot'
import 'tocbot/dist/tocbot.css'

const props = defineProps(['id'])
const store = useStore()
const article = reactive<Article>(
  JSON.parse(localStorage.getItem('article') as string) as Article
)
const languageList = reactive<Array<string>>([])
const userInfo = reactive<User>({})
const markdownBody = ref<string>('')
const modifyIconColor = ref<string>('#333333')
const showModifyIcon = ref<boolean>(
  article.author === JSON.parse(localStorage.getItem('userInfo') as string).Name
    ? true
    : false
)
markdownBody.value =
  localStorage.getItem('theme') === 'dark'
    ? 'github-markdown-body'
    : 'vuepress-markdown-body'
store.$subscribe((mutation: any, state: any) => {
  if (mutation.events.key === 'theme') {
    themeChange(mutation.events.newValue)
  }
})

const themeChange = (theme: 'light' | 'dark') => {
  markdownBody.value =
    theme === 'dark' ? 'github-markdown-body' : 'vuepress-markdown-body'
}

const getUserInfo = () => {
  userinfoApi(article.user_id, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }).then(res => {
    Object.assign(userInfo, res.data.data.user)
  })
}

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
  getUserInfo()
  tocbor.init({
    tocSelector: '#toc',
    contentSelector: '.content',
    headingSelector: 'h1, h2, h3, h4, h5, h6',
    collapseDepth: 6,
    headingsOffset: -50
  })
})

const toUserpage = () => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: article.user_id
    }
  })
}
const mouseoverLikeSvg = () => {
  article.likeSvgColor = '#1296db'
}

const mouseleaveLikeSvg = () => {
  article.likeSvgColor = '#6B7280'
}

const mouseoverFavSvg = () => {
  article.favSvgColor = '#1296db'
}

const mouseleaveFavSvg = () => {
  article.favSvgColor = '#6B7280'
}

const toModifyAritcle = () => {
  router.push({
    name: 'articleModify',
    params: {
      id: article.id
    }
  })
}
</script>

<template>
  <div class="ct-bg">
    <div class="rounded-lg flex justify-center">
      <!-- article -->
      <div
        class="shadow-lg p-8 dark:bg-deepBlack max-w-screen-lg"
        style="min-width: 800px"
      >
        <p class="flex justify-between items-center">
          <span class="text-4xl mt-4 mb-8 font-bold">{{ article.title }}</span>
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
        </p>
        <div class="h-16 my-8 flex jusitfy-center">
          <span class="text-gray-700 dark:text-gray-400">
            <p class="h-8 m-0 p-0 text-xl">作者：{{ article.author }}</p>
            <p class="h-8 flex justify-center items-center tracking-wide">
              <span>{{ article.updated_at }}</span>
              <span class="flex items-center pl-1">
                <p>· 阅读：{{ article.visible }}</p>
              </span>
            </p>
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
        <div class="sticky top-40 max-w-min mx-8">
          <!-- author card -->
          <div class="my-8 p-4 shadow-lg min-w-max dark:bg-deepBlack">
            <div class="flex justify-start">
              <img
                :src="`http://icon.mgaronya.com/${userInfo.Icon}`"
                alt=""
                class="inline-block h-16 w-16 mx-4 rounded-full hover:cursor-pointer"
                @click="toUserpage"
              />
              <span class="text-gray-700 dark:text-gray-400">
                <p class="h-8 m-0 p-0 text-xl">{{ article.author }}</p>
                <p class="h-8 m-0 p-0 texx-xl">{{ userInfo.Email }}</p>
              </span>
            </div>
            <p class="mt-4">
              <button @click="toUserpage" class="btn-blue">主页</button>
              <button class="btn-red">私信</button>
            </p>
            <el-divider></el-divider>
          </div>
          <!-- 目录 -->
          <div class="my-8 p-4 shadow-lg dark:bg-deepBlack">
            <p class="m-1 text-xl font-bold">{{ article.title }}</p>
            <el-divider></el-divider>
            <div id="toc" class=""></div>
          </div>
          <!-- like fav -->
          <div class="flex justify-center w-full flex-wrap">
            <span
              class="circle hover:cursor-pointer dark:bg-deepBlack"
              @mouseover="mouseoverLikeSvg"
              @mouseleave="mouseleaveLikeSvg"
            >
              <svg
                v-if="!article.likeFlag"
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
                  :fill="article.likeSvgColor"
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
                >{{ article.likeNum }}</span
              >
            </span>
            <span
              class="circle hover:cursor-pointer"
              @mouseover="mouseoverFavSvg"
              @mouseleave="mouseleaveFavSvg"
            >
              <svg
                v-if="!article.favoriteFlag"
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
                  :fill="article.favSvgColor"
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
                >{{ article.favNum }}</span
              >
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
::v-deep .toc-link::before {
  height: 0;
}
.circle {
  @apply relative w-16 h-16  rounded-full flex justify-center items-center shadow-lg m-4  dark:bg-deepBlack;
}
</style>
