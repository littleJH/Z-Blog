<script setup lang="ts">
import { ref, reactive, onUpdated, onBeforeMount } from 'vue'
import { defineProps } from 'vue'
import { Thread, User, useStore } from '../stores/store'
import router from '../router/router'
import { getThreadLikeListApi, getThreadLikeApi } from '../api/like'
import { getThreadFavListApi, getThreadFavoritedApi } from '../api/favorite'
import { getPostLikedApi, getPostLikeListApi } from '../api/like'
import { getPostFavListApi, getPostFavoritedApi } from '../api/favorite'
import { getPostLabelApi } from '../api/label'
import { userinfoApi } from '../api/user'
import { getPostApi } from '../api/post'

const { thread } = defineProps(['thread'])
const object = reactive({
  thread: null as Thread | null
})
const loading = ref<boolean>(true)
const userInfo = reactive({
  info: null as User | null
})
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
    userinfoApi(thread.user_id, config),
    getThreadLikeApi(thread.id, config),
    getThreadLikeListApi(thread.id, config),
    getThreadFavoritedApi(thread.id, config),
    getThreadFavListApi(thread.id, config),
    getPostApi(thread.post_id, config)
  ]).then(async result => {
    userInfo.info = result[0].data.data.user
    thread.author = result[0].data.data.user.Name
    thread.likeFlag = result[1].data.data.flag
    thread.likeNum = result[2].data.data.total
    thread.favoriteFlag = result[3].data.data.flag
    thread.favNum = result[4].data.data.total
    thread.post = result[5].data.data.post
    await userinfoApi(thread.post.user_id, config).then(res => {
      thread.post.author = res.data.data.user.Name
      object.thread = thread
    })
    loading.value = false
  })
})

onUpdated(() => {
  let content = ''
  const node = document.createElement('div')
  node.innerHTML = object.thread?.post.res_long as string
  let blocks = node.querySelectorAll('h1,h2, h3, h4, h5, h6, p, span')
  blocks.forEach(block => {
    content += block.textContent
  })
  content = content.replace(/\s+/g, '')
  const el = document.getElementById(
    `${object.thread?.id}&${object.thread?.post_id}`
  ) as HTMLElement
  el.innerText = content
})

const toThreadUserpage = () => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: thread.user_id
    }
  })
}

const toDetail = () => {
  localStorage.setItem('thread', JSON.stringify(thread))
  router.push({
    name: 'thread',
    params: {
      id: thread.id
    }
  })
}

const toPostDetail = async () => {
  await Promise.all([
    getPostLikedApi(thread.post.id, config),
    getPostLikeListApi(thread.post.id, config),
    getPostFavoritedApi(thread.post.id, config),
    getPostFavListApi(thread.post.id, config),
    getPostLabelApi(thread.post.id, config)
  ]).then(res => {
    thread.post.likeFlag = res[0].data.data.flag
    thread.post.likeNum = res[1].data.data.total
    thread.post.favoriteFlag = res[2].data.data.flag
    thread.post.favNum = res[3].data.data.total
    thread.post.labels = res[4].data.data.labels
    localStorage.setItem('post', JSON.stringify(thread.post))
    router.push({
      name: 'post',
      params: {
        id: thread.post.id
      }
    })
  })
}

const toPostUserpage = () => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: object.thread?.post.user_id
    }
  })
}
</script>
<template>
  <div class="rounded px-2 py-4">
    <!-- header -->
    <div class="h-8 pl-2 flex justify-start items-center">
      <img
        @click.stop="toThreadUserpage()"
        class="avatar-small ml-0"
        :src="`http://icon.mgaronya.com/${userInfo.info?.Icon}`"
        alt=""
      />
      <span class="flex-shrink-0 font-bold">{{ object.thread?.author }}</span>
      <el-divider direction="vertical" />
      <span class="flex-shrink-0 ml-2 text-xs">{{
        object.thread?.updated_at
      }}</span>
    </div>
    <!-- body -->
    <div>
      <!-- user reply -->
      <div class="dark:bg-black mt-2 text-sm" @click="toDetail()">
        <v-md-preview-html
          :html="object.thread?.res_long"
          :preview-class="markdownBody"
        ></v-md-preview-html>
      </div>
      <!-- original post -->
      <div
        class="mt-2 p-2 text-sm rounded hover:cursor-pointer hover:ring-1 hover:ring-gray-500 transition-all ease-in-out duration-300"
        @click="toPostDetail()"
      >
        <p class="flex items-center">
          <span class="font-bold truncate">{{
            object.thread?.post.title
          }}</span>
          <!-- <span
            class="py-1 px-2 ml-2 text-xs bg-blue-100 text-black rounded text-center shadow-sm dark:bg-opacity-30 dark:text-gray-200"
            v-for="label in object.thread?.post.labels"
            >{{ label }}
          </span> -->
          <span class="text-lg flex-grow flex justify-end items-center">
            <span
              class="text-sm text-center hover:text-blue-500"
              @click.stop="toPostUserpage()"
              >{{ object.thread?.post.author }}</span
            >
            <span class="ml-4 text-xs text-center">{{
              object.thread?.post.updated_at
            }}</span>
          </span>
        </p>
        <p
          :id="`${object.thread?.id}&${object.thread?.post_id}`"
          class="mt-2 p-0 truncate"
        ></p>
      </div>
      <div
        v-if="!loading"
        class="h-8 p-2 text-sm flex justify-start items-center text-gray-500"
      >
        <span>点赞：{{ object.thread?.likeNum }}</span>
        <el-divider direction="vertical"></el-divider>
        <span>收藏：{{ object.thread?.favNum }}</span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
::v-deep .vuepress-markdown-body:not(.custom) {
  @apply p-4;
}

::v-deep .vuepress-markdown-body {
  @apply bg-gray-100 rounded hover:shadow-md rounded-lg bg-gray-100 hover:shadow-md hover:cursor-pointer transition-all duration-500 ease-in-out;
}

::v-deep .github-markdown-body {
  @apply p-4;
}
</style>
