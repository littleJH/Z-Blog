<script setup lang="ts">
import { defineProps, ref } from 'vue'
import { useStore } from '../../stores/store'
import { createThreadLikeApi, deleteThreadLikeApi } from '../../api/like'
import { createThreadFavApi, deleteThreadFavApi } from '../../api/favorite'
import router from '../../router/router'

const props = defineProps(['thread'])
const item = ref(props.thread)
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
const toDetail = (index: number) => {
  localStorage.setItem('thread', JSON.stringify(item))
  router.push({
    name: 'thread',
    params: {
      id: item.id
    }
  })
}

const toThreadUserpage = (id: any) => {
  router.push({
    name: 'userPostList',
    params: {
      userId: id
    }
  })
}

const likeThread = (index: any) => {
  if (!item.likeFlag) {
    createThreadLikeApi(item.id, config).then(res => {
      console.log(res)
      if (res.data.code === 200) {
        item.likeFlag = true
        item.likeNum++
      }
    })
  } else {
    deleteThreadLikeApi(item.id, config).then(res => {
      console.log(res)
      if (res.data.code === 200) {
        item.likeFlag = false
        item.likeNum--
      }
    })
  }
}

const favThread = (index: any) => {
  if (!item.favoriteFlag) {
    createThreadFavApi(item.id, config).then(res => {
      if (res.data.code === 200) {
        item.favoriteFlag = true
        item.favNum++
      }
    })
  } else {
    deleteThreadFavApi(item.id, config).then(res => {
      if (res.data.code === 200) {
        item.favoriteFlag = false
        item.favNum--
      }
    })
  }
}
</script>
<template>
  <div class="mt-8">
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
        @click="toDetail"
        class="rounded bg-gray-100 dark:bg-black hover:shadow-md hover:cursor-pointer transition-all duration-500 ease-in-out"
        :preview-class="markdownBody"
      >
      </v-md-preview-html>
      <!-- footer -->
      <div class="likefav h-8 flex justify-start items-center text-gray-500">
        <span class="ml-2 flex items-center justify-center">
          <span @click.stop="likeThread">
            <Transition
              mode="out-in"
              enter-active-class="animate_animated animate__heartBeat"
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
                  d="M332.8 249.6c38.4 0 83.2 19.2 108.8 44.8L467.2 320 512 364.8 556.8 320l25.6-25.6c32-32 70.4-44.8 108.8-44.8 19.2 0 38.4 6.4 57.6 12.8 44.8 25.6 70.4 57.6 76.8 108.8 6.4 44.8-6.4 89.6-38.4 121.6L512 774.4 236.8 492.8C204.8 460.8 185.6 416 192 371.2c6.4-44.8 38.4-83.2 76.8-108.8C288 256 313.6 249.6 332.8 249.6L332.8 249.6M332.8 185.6C300.8 185.6 268.8 192 243.2 204.8 108.8 275.2 89.6 441.6 185.6 537.6l281.6 281.6C480 832 499.2 838.4 512 838.4s32-6.4 38.4-19.2l281.6-281.6c96-96 76.8-262.4-57.6-332.8-25.6-12.8-57.6-19.2-89.6-19.2-57.6 0-115.2 25.6-153.6 64L512 275.2 486.4 249.6C448 211.2 390.4 185.6 332.8 185.6L332.8 185.6z"
                  fill="#2c2c2c"
                  p-id="2547"
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
                  d="M780.8 204.8c-83.2-44.8-179.2-19.2-243.2 44.8L512 275.2 486.4 249.6c-64-64-166.4-83.2-243.2-44.8C108.8 275.2 89.6 441.6 185.6 537.6l32 32 153.6 153.6 102.4 102.4c25.6 25.6 57.6 25.6 83.2 0l102.4-102.4 153.6-153.6 32-32C934.4 441.6 915.2 275.2 780.8 204.8z"
                  fill="#EF4444"
                  p-id="2845"
                ></path>
              </svg>
            </Transition>
          </span>

          <span class="ml-2">{{ item.likeNum }}</span>
        </span>
        <span class="h-6 ml-2 flex items-center">
          <span @click.stop="favThread">
            <Transition
              mode="out-in"
              enter-active-class="animate_animated animate__heartBeat"
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
                  d="M716.8 883.2c-6.4 0-19.2 0-25.6-6.4L512 755.2l-179.2 121.6c-19.2 12.8-38.4 12.8-57.6 0-19.2-12.8-25.6-32-19.2-51.2L320 614.4 147.2 480C134.4 467.2 128 448 134.4 428.8c6.4-19.2 25.6-32 44.8-32L390.4 384l76.8-204.8c12.8-38.4 76.8-38.4 89.6 0l0 0L633.6 384l217.6 6.4c19.2 0 38.4 12.8 44.8 32 6.4 19.2 0 38.4-19.2 51.2L704 614.4l57.6 211.2c6.4 19.2 0 38.4-19.2 51.2C736 876.8 729.6 883.2 716.8 883.2zM512 684.8c6.4 0 12.8 0 19.2 6.4l166.4 115.2-57.6-192C640 595.2 640 582.4 652.8 576l160-128L608 448C595.2 448 582.4 435.2 582.4 422.4L512 236.8l-70.4 192C441.6 435.2 428.8 448 416 448L211.2 454.4l160 128C384 582.4 384 595.2 384 608l-57.6 192 166.4-115.2C499.2 684.8 505.6 684.8 512 684.8z"
                  fill="#2c2c2c"
                  p-id="2701"
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
                  d="M889.6 428.8c-6.4-19.2-25.6-32-44.8-32L633.6 384 556.8 179.2l0 0c-12.8-38.4-76.8-38.4-89.6 0L390.4 384 179.2 390.4c-19.2 0-38.4 12.8-44.8 32C128 448 134.4 467.2 147.2 480L320 614.4l-57.6 211.2c-6.4 19.2 0 38.4 19.2 51.2 19.2 12.8 38.4 12.8 57.6 0L512 755.2l179.2 121.6c6.4 6.4 19.2 6.4 25.6 6.4 12.8 0 19.2 0 25.6-6.4 19.2-12.8 25.6-32 19.2-51.2L704 614.4l172.8-134.4C889.6 467.2 896 448 889.6 428.8z"
                  fill="#F59E0B"
                  p-id="3479"
                  data-spm-anchor-id="a313x.7781069.0.i7"
                  class=""
                ></path>
              </svg>
            </Transition>
          </span>

          <span class="ml-2">{{ item.favNum }}</span>
        </span>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
::v-deep .vuepress-markdown-body:not(.custom) {
  @apply p-4;
}

::v-deep .vuepress-markdown-body {
  @apply p-4 bg-gray-100 rounded hover:shadow-md rounded-lg bg-gray-100 hover:shadow-md hover:cursor-pointer transition-all duration-500 ease-in-out;
}

::v-deep .github-markdown-body {
  @apply p-4;
}
</style>
