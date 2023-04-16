<script setup lang="ts">
import {
  getArticleHotRankingApi,
  getPostHotRankingApi,
  getUserHotLevelApi,
  getUserHotRankingJApi
} from '../../api/hotspot'
import { reactive, ref, onBeforeMount } from 'vue'
import { Article, Post, User } from '../../stores/store'
import { getArticlesApi } from '../../api/user'
import { getPostsApi } from '../../api/user'
import { userinfoApi } from '../../api/user'
import pagination from '../pagination.vue'
import articleCard from '../articleCard.vue'
import postCard from '../postCard.vue'
import userCard from '../userCard.vue'
import router from '../../router/router'
import { forInRight } from 'lodash'
import { getArticleApi } from '../../api/article'
import { getPostApi } from '../../api/post'

type Mode = 'article' | 'post' | 'user'
const pageNum = ref(1)
const pageSize = 10
const total = ref(0)
const topList = reactive({
  list: [] as Array<Article | Post | User>,
  scoreList: [] as Array<number>
})
const props = defineProps(['mode'])
const mode = ref<Mode>(props.mode)
const loading = ref<boolean>(true)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getList()
})

const getList = () => {
  if (mode.value === 'article') {
    getArticles()
  } else if (mode.value === 'post') {
    getPosts()
  } else if (mode.value === 'user') {
    getUsers()
  }
}

const getArticles = () => {
  topList.list.length = 0
  loading.value = true
  getArticleHotRankingApi(config, pageNum.value, pageSize).then(async res => {
    const list = [] as Array<Article>
    for (let item of res.data.data.articles) {
      topList.scoreList.push(item.Score)
      await getArticleApi(item.Member, config).then(result => {
        if (result.data.data) {
          list.push(result.data.data.article)
        } else {
          list.push(null as any)
        }
      })
    }
    topList.list = list
    total.value = res.data.data.total
    loading.value = false
  })
}
const getPosts = async () => {
  topList.list.length = 0
  loading.value = true
  getPostHotRankingApi(config, pageNum.value, pageSize).then(async res => {
    const list = [] as Array<Post>
    for (let item of res.data.data.posts) {
      topList.scoreList.push(item.Score)
      await getPostApi(item.Member, config).then(result => {
        if (result.data.data) {
          list.push(result.data.data.post)
        } else {
          list.push(null as any)
        }
      })
    }
    topList.list = list
    total.value = res.data.data.total
    loading.value = false
  })
}
const getUsers = async () => {
  topList.list.length = 0
  loading.value = true
  getUserHotRankingJApi(config, pageNum.value, pageSize).then(async res => {
    const list = [] as Array<User>
    for (let item of res.data.data.users) {
      topList.scoreList.push(item.Score)
      await Promise.all([
        userinfoApi(item.Member, config),
        getUserHotLevelApi(item.Member, config)
      ]).then(result => {
        if (result[0].data.data.user) {
          result[0].data.data.user.HotLevel = result[1].data.data.Level
          list.push(result[0].data.data.user)
        } else {
          list.push(null as any)
        }
      })
    }
    topList.list = list
    total.value = res.data.data.total
    loading.value = false
  })
}

const pageChange = (value: any) => {
  console.log(value)
  pageNum.value = value.page

  getList()
}
const modeChange = (value: any) => {
  mode.value = value
  router.push({
    name: 'topAll',
    params: {
      mode: value
    }
  })
  getList()
}
</script>
<template>
  <div class="ct-bg">
    <div style="width: 800px" class="shadow-lg p-4 bg-white dark:bg-deepBlack">
      <!-- header -->
      <div class="flex items-center">
        <div class="flex-grow flex items-center">
          <svg
            t="1681365807192"
            class="icon"
            viewBox="0 0 1138 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3678"
            width="38"
            height="38"
          >
            <path
              d="M340.727595 341.636202l0 113.575865-113.575865 0 0-113.575865 113.575865 0zM0 0l1137.575865 0 0 1024-1137.575865 0 0-1024zM454.303461 739.606034l0-455.212067-340.727595 0 0 455.212067 113.575865 0 0-170.818101 113.575865 0 0 170.818101 113.575865 0zM738.697427 739.606034l0-57.242236-113.575865 0 0-397.969831-113.575865 0 0 455.212067 227.15173 0zM1023.091393 739.606034l0-57.242236-113.575865 0 0-397.969831-113.575865 0 0 455.212067 227.15173 0z"
              p-id="3679"
              fill="#EF4444"
            ></path>
          </svg>
          <span class="font-bold px-4">总榜</span>
        </div>
        <div>
          <el-select v-model="mode" style="width: 6rem" @change="modeChange">
            <el-option label="文章" value="article"></el-option>
            <el-option label="帖子" value="post"></el-option>
            <el-option label="用户" value="user"></el-option>
          </el-select>
        </div>
      </div>
      <!-- body -->
      <div class="mt-4">
        <el-skeleton :rows="10" :loading="loading" animated />
        <TransitionGroup v-if="mode === 'article'" name="list" tag="div">
          <div v-for="(item, index) in topList.list" :key="index">
            <div v-if="index !== 0" class="divider"></div>
            <articleCard v-if="item" :article="item">
              <span class="px-2 py-1 rounded text-sm flex items-center">
                <svg
                  t="1680090857317"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4017"
                  width="16"
                  height="16"
                >
                  <path
                    d="M726.4 201.6c-12.8-9.6-28.8-6.4-38.4 0-9.6 9.6-16 25.6-9.6 38.4 6.4 12.8 9.6 28.8 12.8 44.8-86.4-201.6-230.4-246.4-236.8-249.6-9.6-3.2-22.4 0-28.8 6.4-9.6 6.4-12.8 19.2-9.6 28.8 12.8 86.4-25.6 188.8-115.2 310.4-6.4-25.6-16-51.2-32-80-9.6-9.6-22.4-16-35.2-12.8-16 3.2-25.6 12.8-25.6 28.8-3.2 48-25.6 92.8-51.2 140.8-22.4 41.6-44.8 86.4-54.4 134.4-32 150.4 99.2 329.6 233.6 380.8 9.6 3.2 19.2 6.4 32 9.6-25.6-19.2-41.6-51.2-48-96-25.6-195.2 185.6-246.4 195.2-425.6 153.6 105.6 224 336 137.6 505.6 3.2 0 6.4-3.2 9.6-3.2 0 0 3.2 0 3.2-3.2 163.2-89.6 252.8-208 259.2-345.6 16-211.2-163.2-390.4-198.4-412.8z"
                    fill="#EF4444"
                    p-id="4018"
                  ></path>
                </svg>
                <span>
                  {{ Math.trunc(topList.scoreList[index]) }}
                </span>
              </span>
            </articleCard>
            <div v-else class="py-2 mx-2 my-8 bg-gray-100 rounded flex">
              <span class="flex-grow px-4"> (权限不足) </span>
              <span class="px-2 py-1 rounded text-sm flex items-center">
                <svg
                  t="1680090857317"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4017"
                  width="16"
                  height="16"
                >
                  <path
                    d="M726.4 201.6c-12.8-9.6-28.8-6.4-38.4 0-9.6 9.6-16 25.6-9.6 38.4 6.4 12.8 9.6 28.8 12.8 44.8-86.4-201.6-230.4-246.4-236.8-249.6-9.6-3.2-22.4 0-28.8 6.4-9.6 6.4-12.8 19.2-9.6 28.8 12.8 86.4-25.6 188.8-115.2 310.4-6.4-25.6-16-51.2-32-80-9.6-9.6-22.4-16-35.2-12.8-16 3.2-25.6 12.8-25.6 28.8-3.2 48-25.6 92.8-51.2 140.8-22.4 41.6-44.8 86.4-54.4 134.4-32 150.4 99.2 329.6 233.6 380.8 9.6 3.2 19.2 6.4 32 9.6-25.6-19.2-41.6-51.2-48-96-25.6-195.2 185.6-246.4 195.2-425.6 153.6 105.6 224 336 137.6 505.6 3.2 0 6.4-3.2 9.6-3.2 0 0 3.2 0 3.2-3.2 163.2-89.6 252.8-208 259.2-345.6 16-211.2-163.2-390.4-198.4-412.8z"
                    fill="#EF4444"
                    p-id="4018"
                  ></path>
                </svg>
                <span>
                  {{ Math.trunc(topList.scoreList[index]) }}
                </span>
              </span>
            </div>
          </div>
        </TransitionGroup>
        <TransitionGroup v-if="mode === 'post'" name="list" tag="div">
          <div v-for="(item, index) in topList.list" :key="index">
            <div v-if="index !== 0" class="divider"></div>
            <postCard v-if="item" :post="item">
              <span class="px-2 py-1 rounded text-sm flex items-center">
                <svg
                  t="1680090857317"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4017"
                  width="16"
                  height="16"
                >
                  <path
                    d="M726.4 201.6c-12.8-9.6-28.8-6.4-38.4 0-9.6 9.6-16 25.6-9.6 38.4 6.4 12.8 9.6 28.8 12.8 44.8-86.4-201.6-230.4-246.4-236.8-249.6-9.6-3.2-22.4 0-28.8 6.4-9.6 6.4-12.8 19.2-9.6 28.8 12.8 86.4-25.6 188.8-115.2 310.4-6.4-25.6-16-51.2-32-80-9.6-9.6-22.4-16-35.2-12.8-16 3.2-25.6 12.8-25.6 28.8-3.2 48-25.6 92.8-51.2 140.8-22.4 41.6-44.8 86.4-54.4 134.4-32 150.4 99.2 329.6 233.6 380.8 9.6 3.2 19.2 6.4 32 9.6-25.6-19.2-41.6-51.2-48-96-25.6-195.2 185.6-246.4 195.2-425.6 153.6 105.6 224 336 137.6 505.6 3.2 0 6.4-3.2 9.6-3.2 0 0 3.2 0 3.2-3.2 163.2-89.6 252.8-208 259.2-345.6 16-211.2-163.2-390.4-198.4-412.8z"
                    fill="#EF4444"
                    p-id="4018"
                  ></path>
                </svg>
                <span>
                  {{ Math.trunc(topList.scoreList[index]) }}
                </span>
              </span>
            </postCard>
            <div v-else class="py-2 mx-2 my-8 bg-gray-100 rounded flex">
              <span class="flex-grow px-4"> (权限不足) </span>
              <span class="px-2 py-1 rounded text-sm flex items-center">
                <svg
                  t="1680090857317"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4017"
                  width="16"
                  height="16"
                >
                  <path
                    d="M726.4 201.6c-12.8-9.6-28.8-6.4-38.4 0-9.6 9.6-16 25.6-9.6 38.4 6.4 12.8 9.6 28.8 12.8 44.8-86.4-201.6-230.4-246.4-236.8-249.6-9.6-3.2-22.4 0-28.8 6.4-9.6 6.4-12.8 19.2-9.6 28.8 12.8 86.4-25.6 188.8-115.2 310.4-6.4-25.6-16-51.2-32-80-9.6-9.6-22.4-16-35.2-12.8-16 3.2-25.6 12.8-25.6 28.8-3.2 48-25.6 92.8-51.2 140.8-22.4 41.6-44.8 86.4-54.4 134.4-32 150.4 99.2 329.6 233.6 380.8 9.6 3.2 19.2 6.4 32 9.6-25.6-19.2-41.6-51.2-48-96-25.6-195.2 185.6-246.4 195.2-425.6 153.6 105.6 224 336 137.6 505.6 3.2 0 6.4-3.2 9.6-3.2 0 0 3.2 0 3.2-3.2 163.2-89.6 252.8-208 259.2-345.6 16-211.2-163.2-390.4-198.4-412.8z"
                    fill="#EF4444"
                    p-id="4018"
                  ></path>
                </svg>
                <span>
                  {{ Math.trunc(topList.scoreList[index]) }}
                </span>
              </span>
            </div>
          </div>
        </TransitionGroup>
        <TransitionGroup v-if="mode === 'user'" name="list" tag="div">
          <div v-for="(item, index) in topList.list" :key="index">
            <userCard :user="item">
              <span class="px-2 py-1 rounded text-sm flex items-center">
                <svg
                  t="1680090857317"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="4017"
                  width="16"
                  height="16"
                >
                  <path
                    d="M726.4 201.6c-12.8-9.6-28.8-6.4-38.4 0-9.6 9.6-16 25.6-9.6 38.4 6.4 12.8 9.6 28.8 12.8 44.8-86.4-201.6-230.4-246.4-236.8-249.6-9.6-3.2-22.4 0-28.8 6.4-9.6 6.4-12.8 19.2-9.6 28.8 12.8 86.4-25.6 188.8-115.2 310.4-6.4-25.6-16-51.2-32-80-9.6-9.6-22.4-16-35.2-12.8-16 3.2-25.6 12.8-25.6 28.8-3.2 48-25.6 92.8-51.2 140.8-22.4 41.6-44.8 86.4-54.4 134.4-32 150.4 99.2 329.6 233.6 380.8 9.6 3.2 19.2 6.4 32 9.6-25.6-19.2-41.6-51.2-48-96-25.6-195.2 185.6-246.4 195.2-425.6 153.6 105.6 224 336 137.6 505.6 3.2 0 6.4-3.2 9.6-3.2 0 0 3.2 0 3.2-3.2 163.2-89.6 252.8-208 259.2-345.6 16-211.2-163.2-390.4-198.4-412.8z"
                    fill="#EF4444"
                    p-id="4018"
                  ></path>
                </svg>
                <span>
                  {{ Math.trunc(topList.scoreList[index]) }}
                </span>
              </span>
            </userCard>
          </div>
        </TransitionGroup>
      </div>
      <!-- footer -->
      <pagination
        @page-change="pageChange"
        :total="total"
        :page-num="pageNum"
        :page-size="pageSize"
      ></pagination>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
