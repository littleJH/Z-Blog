<script setup lang="ts">
import { userinfoApi, userPostsApi, getPostsApi } from '../../api/user'
import { getPostLabelApi } from '../../api/label'
import {
  getPostLikedApi,
  getPostLikeListApi,
  createPostLikeApi,
  deletePostLikeApi
} from '../../api/like'
import {
  getPostFavListApi,
  getPostFavoritedApi,
  createPostFavApi,
  deletePostFavApi
} from '../../api/favorite'
import router from '../../router'
import { Post } from '../../stores/index'
import NProgress from 'nprogress'
import { ref, reactive, onBeforeMount, defineProps, onUpdated } from 'vue'

const { userId } = defineProps(['userId'])
let postList: Array<Post>
const loading = ref<boolean>(true)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  NProgress.start()
  if (!userId) {
    getPostsApi(config)
      .then(res => {
        assign(res)
      })

      .catch(() => {
        NProgress.done()
      })
  } else {
    userPostsApi(userId, config)
      .then(res => {
        assign(res)
      })
      .catch(err => {
        NProgress.done()
      })
  }
})

const assign = async (postRes: any) => {
  if (postRes.data.code === 200) {
    const list = reactive<Array<Post>>([])

    for (let item of postRes.data.data.posts) {
      item.title = item.title.slice(item.title.indexOf('.') + 1)
      item.updated_at = item.updated_at.slice(0, 10)

      await Promise.all([
        userinfoApi(item.user_id, config),
        getPostLabelApi(item.id, config),
        getPostLikedApi(item.id, config),
        getPostLikeListApi(item.id, config),
        getPostFavoritedApi(item.id, config),
        getPostFavListApi(item.id, config)
      ]).then(result => {
        item.author = result[0].data.data.user.Name
        item.labels = result[1].data.data.labels
        item.likeFlag = result[2].data.data.flag
        item.likeNum = result[3].data.data.total
        item.favoriteFlag = result[4].data.data.flag
        item.favNum = result[5].data.data.total
        item.favSvgColor = '#6B7280'
        item.likeSvgColor = '#6B7280'
        list.push(item)
      })
    }
    postList = list
    NProgress.done()
    loading.value = false
  }
}

onUpdated(() => {
  postList.forEach((item: any) => {
    let content = ''
    const node = document.createElement('div')
    node.innerHTML = item.res_long
    const blocks = node.querySelectorAll('p, span')
    blocks.forEach(block => {
      content += block.textContent
    })
    content = content.replace(/\s+/g, '')
    const el = document.getElementById(`${item.id}`) as HTMLElement
    el.innerText = content
  })
})

const doLike = (index: any) => {
  if (!postList[index].likeFlag) {
    console.log(postList[index].id)
    createPostLikeApi(postList[index].id, config).then(res => {
      console.log(res)
      if (res.data.code === 200) {
        postList[index].likeFlag = true
      }
    })
  } else {
    deletePostLikeApi(postList[index].id, config).then(res => {
      if (res.data.code === 200) {
        postList[index].likeFlag = false
      }
    })
  }
}

const doFav = (index: any) => {
  if (!postList[index].favoriteFlag) {
    createPostFavApi(postList[index].id, config).then(res => {
      if (res.data.code === 200) {
        postList[index].favoriteFlag = true
      }
    })
  } else {
    deletePostFavApi(postList[index].id, config).then(res => {
      if (res.data.code === 200) {
        postList[index].favoriteFlag = false
      }
    })
  }
}

const toDetail = (index: number) => {
  localStorage.setItem('post', JSON.stringify(postList[index]))
  router.push({
    name: 'post',
    params: {
      id: postList[index].id
    }
  })
}
const mouseoverLikeSvg = (index: number) => {
  postList[index].likeSvgColor = '#1296db'
}

const mouseleaveLikeSvg = (index: number) => {
  postList[index].likeSvgColor = '#6B7280'
}

const mouseoverFavSvg = (index: number) => {
  postList[index].favSvgColor = '#1296db'
}

const mouseleaveFavSvg = (index: number) => {
  postList[index].favSvgColor = '#6B7280'
}

const toUserpage = (index: number) => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: postList[index].user_id
    }
  })
}
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated />

  <div class="max-w-screen-md">
    <div
      class="h-auto overflow-hidden bg-white dark:bg-deepBlack"
      v-for="(item, index) in postList"
    >
      <el-divider v-if="index !== 0"></el-divider>
      <div class="p-4" @click="toDetail(index)">
        <!-- header -->
        <div class="h-8 pl-2 flex justify-start items-center">
          <span
            @click.stop="toUserpage(index)"
            class="flex-shrink-0 hover:text-blue-500 font-semibold hover:cursor-pointer"
            >{{ item.author }}</span
          >
          <el-divider direction="vertical" />
          <span class="flex-shrink-0 ml-2">{{ item.updated_at }}</span>
          <span
            class="flex-shrink-0 h-6 min-w-max py-1 px-2 ml-2 text-xm bg-gray-200 rounded-2xl flex justify-center items-center shadow-2xl dark:bg-opacity-20"
            v-for="label in item.labels"
          >
            <el-divider direction="vertical" />
            <svg
              t="1679046455664"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="9187"
              data-spm-anchor-id="a313x.7781069.0.i18"
              width="16"
              height="16"
            >
              <path
                d="M1004.512 444.256l-160-256A127.968 127.968 0 0 0 736 128.096H128a128 128 0 0 0-128 128v512a128 128 0 0 0 128 128h608c44.128 0 85.12-22.752 108.512-60.192l160-256a127.776 127.776 0 0 0 0-135.648z m-54.272 101.728l-160 256.064a63.616 63.616 0 0 1-54.24 30.048H128c-35.296 0-64-28.736-64-64v-512c0-35.296 28.704-64 64-64h608a63.68 63.68 0 0 1 54.24 30.048l160 256a64.32 64.32 0 0 1 0 67.84z"
                fill="#1296db"
                p-id="9188"
              ></path>
              <path
                d="M736 416.096a96 96 0 1 0-0.064 191.936A96 96 0 0 0 736 416.096z m0 160.032a64 64 0 1 1 0-128 64 64 0 0 1 0 128z"
                fill="#1296db"
                p-id="9189"
              ></path>
            </svg>
            <span class="flex items-center p-0 m-0">{{ label }}</span>
          </span>
        </div>
        <!-- body -->
        <div
          class="border-solid border border-gray-500 p-2 rounded-lg bg-gray-100 hover:cursor-pointer transition-all ease-in-out duration-500 hover:shadow-lg dark:hover:shadow-white-lg dark:bg-black"
        >
          <p class="text-lg font-bold">
            {{ item.title }}
          </p>
          <p :id="item.id" class="mt-2 p-0 truncate"></p>
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
