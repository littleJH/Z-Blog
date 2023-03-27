<script setup lang="ts">
import { userThreadsApi, userinfoApi, getThreadsApi } from '../../api/user'
import { getPostApi } from '../../api/post'
import {
  getThreadLikeListApi,
  getThreadLikeApi,
  createThreadLikeApi,
  deleteThreadLikeApi
} from '../../api/like'
import {
  getThreadFavListApi,
  getThreadFavoritedApi,
  deleteThreadFavApi,
  createThreadFavApi,
  getPostFavListApi
} from '../../api/favorite'
import { ref, reactive, onBeforeMount, defineProps, onUpdated } from 'vue'
import NProgress from 'nprogress'
import router from '../../router'
import { Thread } from '../../stores'

const { userId } = defineProps(['userId'])
let threadList: Array<Thread>
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
onBeforeMount(() => {
  NProgress.start()
  if (!userId) {
    getThreadsApi(config).then(res => {
      assign(res)
    })
  } else {
    userThreadsApi(userId, config).then(res => {
      assign(res)
    })
  }
})

const assign = async (res: any) => {
  const list = reactive<Array<Thread>>([])
  if (res.data.code === 200) {
    for (let item of res.data.data.threads) {
      item.updated_at = item.updated_at.slice(0, 10)
      await Promise.all([
        userinfoApi(userId, config),
        getThreadLikeApi(item.id, config),
        getThreadLikeListApi(item.id, config),
        getThreadFavoritedApi(item.id, config),
        getThreadFavListApi(item.id, config),
        getPostApi(item.post_id, config)
      ]).then(result => {
        item.author = result[0].data.data.user.Name
        item.likeFlag = result[1].data.data.flag
        item.likeNum = result[2].data.data.total
        item.favoriteFlag = result[3].data.data.flag
        item.favNum = result[4].data.data.total
        item.post = result[5].data.data.post
        item.favSvgColor = '#6B7280'
        item.likeSvgColor = '#6B7280'
      })
      await userinfoApi(item.post.user_id, config).then(result => {
        item.post.author = result.data.data.user.Name
      })
      list.push(item)
    }
    threadList = list
    NProgress.done()
    loading.value = false
  }
}

onUpdated(() => {
  threadList.forEach((item: any) => {
    let content = ''
    const node = document.createElement('div')
    node.innerHTML = item.post.res_long
    let blocks = node.querySelectorAll('h1,h2, h3, h4, h5, h6, p, span')
    blocks.forEach(block => {
      content += block.textContent
    })
    content = content.replace(/\s+/g, '')
    const el = document.getElementById(
      `${item.id}&${item.post_id}`
    ) as HTMLElement
    el.innerText = content

    // content = ''
    // node.innerHTML = item.post.res_long
    // blocks = node.querySelectorAll('p, span')
    // blocks.forEach(block => {
    //   content += block.textContent
    // })
    // content = content.replace(/\s+/g, '')
    // el = document.getElementById(`${item.id}&${item.post_id}`) as HTMLElement
    // el.innerText = content
  })
})

const doLike = (index: any) => {
  if (!threadList[index].likeFlag) {
    console.log(threadList[index].id)
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
const toPostDetail = (index: number) => {
  localStorage.setItem('post', JSON.stringify(threadList[index].post))
  router.push({
    name: 'post',
    params: {
      id: threadList[index].post.id
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

const toThreadUserpage = (index: number) => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: threadList[index].user_id
    }
  })
}

const toPostUserpage = (id: string) => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: id
    }
  })
}
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated />
  <div class="max-w-screen-md">
    <div class="bg-white dark:bg-deepBlack" v-for="(item, index) in threadList">
      <el-divider v-if="index !== 0"></el-divider>
      <div class="p-4 transition-all ease-in-out duration-500">
        <!-- header -->
        <div class="h-8 pl-2 flex justify-start items-center">
          <span
            @click.stop="toThreadUserpage(index)"
            class="flex-shrink-0 text-xl font-semibold hover:text-blue-500 hover:cursor-pointer"
            >{{ item.author }}</span
          >
          <el-divider direction="vertical" />
          <span class="flex-shrink-0 ml-2">{{ item.updated_at }}</span>
        </div>
        <!-- body -->
        <div>
          <!-- user reply -->
          <div
            class="border-solid border border-gray-500 dark:bg-black mt-2 p-2 text-sm rounded-lg hover:shadow-lg hover:cursor-pointer transition-all ease-in-out duration-500 dark:hover:shadow-white-lg"
            @click="toDetail(index)"
          >
            <v-md-preview-html
              :html="item.res_long"
              :preview-class="markdownBody"
            ></v-md-preview-html>
          </div>
          <!-- original post -->
          <div
            class="bg-gray-100 dark:bg-black mt-2 p-2 text-sm rounded-md hover:cursor-pointer hover:shadow-lg transition-all ease-in-out duration-500"
            @click="toPostDetail(index)"
          >
            <span
              class="font-semibold hover:text-blue-500"
              @click.stop="toPostUserpage(item.post.user_id)"
              >{{ item.post.author }}：</span
            >
            <p :id="`${item.id}&${item.post_id}`" class="mt-2 p-0 truncate"></p>
          </div>
        </div>
        <!-- footer -->
        <div class="h-8 flex justify-start items-center text-gray-500">
          <span
            class="h-6 ml-2 flex items-center hover:cursor-pointer"
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
            class="h-6 ml-2 flex items-center hover:cursor-pointer"
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
          <span class="h-6 ml-2 flex items-center">
            <svg
              t="1679045013055"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8210"
              width="16"
              height="16"
            >
              <path
                d="M1019.67 493.27C922.42 294.28 727.9 170.66 512 170.66S101.58 294.28 4.33 493.27a42.697 42.697 0 0 0 0 37.46C101.58 729.72 296.1 853.34 512 853.34s410.42-123.62 507.67-322.61a42.697 42.697 0 0 0 0-37.46zM512 768c-176.19 0-335.82-97.54-421.38-256C176.18 353.54 335.81 256 512 256s335.82 97.54 421.38 256C847.82 670.46 688.19 768 512 768z"
                fill="#6B7280"
                p-id="8211"
              ></path>
              <path
                d="M512 298.66c-117.63 0-213.34 95.7-213.34 213.34S394.37 725.34 512 725.34 725.34 629.64 725.34 512 629.63 298.66 512 298.66zM512 640c-70.58 0-128-57.42-128-128s57.42-128 128-128 128 57.42 128 128-57.42 128-128 128z"
                fill="#6B7280"
                p-id="8212"
              ></path>
            </svg>
            <span class="ml-2">{{ item.visible }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
::v-deep .el-divider--horizontal {
  margin: 0;
}

span {
  @apply mr-2;
}
</style>
