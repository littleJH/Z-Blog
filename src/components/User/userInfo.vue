<script setup lang="ts">
import { defineProps, reactive, ref, onMounted } from 'vue'
import { userinfoApi } from '../../api/user'
import { User } from '../../stores/index'
import NProgress from 'nprogress'
import router from '../../router'
NProgress.start()
const { userId } = defineProps(['userId'])
const userInfo = reactive<User>({})
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onMounted(() => {
  userinfoApi(userId, config)
    .then(res => {
      Object.assign(userInfo, res.data.data.user)
      NProgress.done()
    })
    .catch(() => {
      NProgress.done()
    })

  changeNavColor('article')
})

const changeNavColor = (val: 'article' | 'post' | 'thread') => {
  const articleEl = document.getElementById('article') as HTMLElement
  const postEL = document.getElementById('post') as HTMLElement
  const threadEl = document.getElementById('thread') as HTMLElement
  if (val === 'article') {
    articleEl.classList.add('border-blue-300')
    postEL.classList.remove('border-blue-300')
    threadEl.classList.remove('border-blue-300')
  } else if (val === 'post') {
    articleEl.classList.remove('border-blue-300')
    postEL.classList.add('border-blue-300')
    threadEl.classList.remove('border-blue-300')
  } else if (val === 'thread') {
    articleEl.classList.remove('border-blue-300')
    postEL.classList.remove('border-blue-300')
    threadEl.classList.add('border-blue-300')
  }
}

const toArticle = () => {
  router.push({
    name: 'userArticleList'
  })
  changeNavColor('article')
}

const toPost = () => {
  router.push({
    name: 'userPostList'
  })
  changeNavColor('post')
}

const toThread = () => {
  router.push({
    name: 'userThreadList'
  })
  changeNavColor('thread')
}
</script>
<template>
  <div class="ct-bg">
    <div class="min-w-max dark:dark-deepBlack">
      <!-- user card -->
      <div class="my-8 p-4 shadow-lg min-w-max dark:bg-deepBlack">
        <div class="flex justify-start">
          <img
            :src="`http://icon.mgaronya.com/${userInfo.Icon}`"
            class="inline-block h-28 w-28 mx-4 rounded-full hover:cursor-pointer"
            alt=""
          />
          <span class="info text-gray-700 dark:text-gray-400">
            <p class="h-8 flex items-center">
              <span class="text-xl font-bold">{{ userInfo.Name }}</span>
            </p>
            <p class="h-8 flex items-center">
              <span>{{ userInfo.Sex === true ? '女' : '男' }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ userInfo.Email }}</span>
              <span v-if="userInfo.Hobby"
                ><el-divider direction="vertical"></el-divider
              ></span>
              <span v-if="userInfo.Hobby">爱好{{ userInfo.Hobby }}</span>
            </p>
            <p class="h-12 flex items-center">
              <button class="btn-blue">+关注</button>
              <button class="btn-red">私信</button>
            </p>
          </span>
        </div>
      </div>
      <!-- main body -->
      <div
        class="my-8 p-4 min-h-min shadow-lg dark:bg-deepBlack"
        style="width: 800px; min-height: 300px"
      >
        <div class="bodyNav mb-8">
          <span id="article" @click="toArticle">文章</span>
          <el-divider direction="vertical"></el-divider>
          <span id="post" @click="toPost">帖子</span>
          <el-divider direction="vertical"></el-divider>
          <span id="thread" @click="toThread">跟帖</span>
        </div>
        <!-- body -->
        <div class="">
          <RouterView></RouterView>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
.info {
  span {
    @apply px-2;
  }
}
.bodyNav {
  span {
    @apply text-center font-bold text-xl p-4 h-8 border-b-2 transition-all duration-500 ease-in-out hover:bg-blue-50 hover:cursor-pointer;
  }
}
</style>
