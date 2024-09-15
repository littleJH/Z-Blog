<script setup lang="ts">
import { reactive, ref, onBeforeMount, getCurrentInstance } from 'vue'
import { useStore, Article, Post, User, obj, article, post, user } from '../stores/store'
import { getArticleHotRankingApi, getPostHotRankingApi, getUserHotRankingJApi } from '../api/hotspot'
import { getArticleApi } from '../api/article'
import { getPostApi } from '../api/post'
import { userinfoApi } from '../api/user'
import { getArticleLikedApi, getArticleLikeListApi, getPostLikedApi, getPostLikeListApi } from '../api/like'
import { getArticleFavListApi, getArticleFavoritedApi, getPostFavListApi, getPostFavoritedApi } from '../api/favorite'
import router from '../router/router'
import nprogress from 'nprogress'
import Articles from '../components/Homepage/articles.vue'
import Posts from '../components/Homepage/posts.vue'
import Users from '../components/Homepage/users.vue'

const topNum = 3
const currentCom = ref<'Articles' | 'Posts' | 'Users'>('Articles')
const articleRank = reactive<article>({
  articles: [],
  articleList: []
})
const postRank = reactive<post>({ posts: [], postList: [] })
const userRank = reactive<user>({
  users: [],
  userList: []
})
const loading = ref<boolean>(true)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
const coms = {
  Articles,
  Posts,
  Users
}
onBeforeMount(async () => {
  nprogress.start()
  await Promise.all([getArticleHotRankingApi(config, 1, topNum), getPostHotRankingApi(config, 1, topNum), getUserHotRankingJApi(config, 1, topNum)]).then(res => {
    articleRank.articles = res[0].data.data.articles
    postRank.posts = res[1].data.data.posts
    userRank.users = res[2].data.data.users
    getArticleRankList()
    getPostRankList()
    getUserRankList()
  })

  loading.value = false
})

const getArticleRankList = async () => {
  const list: Array<Article> = []
  for (let item of articleRank.articles as Array<obj>) {
    await getArticleApi(item.Member, config).then(res => {
      if (res.data.data) list.push(res.data.data.article)
      else list.push(null as any)
    })
  }
  Object.assign(articleRank, { articleList: list })
}

const getPostRankList = async () => {
  const list: Array<Post> = []
  for (let item of postRank.posts as Array<obj>) {
    await getPostApi(item.Member, config).then(res => {
      if (res.data.data) list.push(res.data.data.post)
      else list.push(null as any)
    })
  }
  Object.assign(postRank, { postList: list })
}

const getUserRankList = async () => {
  const list: Array<User> = []
  for (let item of userRank.users as Array<obj>) {
    await userinfoApi(item.Member, config).then(res => {
      if (res.data.data) list.push(res.data.data.user)
      else list.push(null as any)
    })
  }
  Object.assign(userRank, { userList: list })
}

const toDetail = async (mode: 'articleRank' | 'postRank' | 'userRank', index: number) => {
  nprogress.start()
  switch (mode) {
    case 'articleRank':
      const article = articleRank.articleList[index]
      await Promise.all([getArticleLikedApi(article.id, config), getArticleLikeListApi(article.id, config), getArticleFavoritedApi(article.id, config), getArticleFavListApi(article.id, config)]).then(res => {
        article.likeFlag = res[0].data.data.flag
        article.likeNum = res[1].data.data.total
        article.favoriteFlag = res[2].data.data.flag
        article.favNum = res[3].data.data.total
      })
      localStorage.setItem('article', JSON.stringify(article))
      router.push({
        name: 'article',
        params: {
          id: article.id
        }
      })
      nprogress.done()
      break

    case 'postRank':
      const post = postRank.postList[index]
      await Promise.all([getPostLikedApi(post.id, config), getPostLikeListApi(post.id, config), getPostFavoritedApi(post.id, config), getPostFavListApi(post.id, config)]).then(res => {
        post.likeFlag = res[0].data.data.flag
        post.likeNum = res[1].data.data.total
        post.favoriteFlag = res[2].data.data.flag
        post.favNum = res[3].data.data.total
      })
      localStorage.setItem('post', JSON.stringify(post))
      router.push({
        name: 'post',
        params: {
          id: post.id
        }
      })
      nprogress.done()
      break
    case 'userRank':
      const user = userRank.users[index] as obj
      router.push({
        name: 'userArticleList',
        params: {
          userId: user.Member
        }
      })
      nprogress.done()
      break
    default:
      break
  }
}

const toTopall = (mode: string) => {
  router.push({
    name: 'topAll',
    params: {
      mode: mode
    }
  })
}
</script>
<template>
  <div class="ct-bg">
    <!-- rank -->
    <div class="max-w-screen-lg rounded shadow-md bg-white grid grid-cols-3 divide-x py-2 dark:bg-deepBlack" style="width: 1024px; height: 180px">
      <div class="py-2 px-4">
        <p class="rankHeader">
          <span class="flex-grow font-bold">文章top{{ topNum }}</span>
          <span @click="toTopall('article')" class="text-xs text-gray-500 flex items-center hover:cursor-pointer hover:underline">
            <svg t="1681362064271" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2588" width="12" height="12">
              <path
                d="M353.045333 86.826667L754.56 488.362667a32 32 0 0 1 2.090667 42.965333l-2.090667 2.282667L353.066667 935.168a8.533333 8.533333 0 0 1-6.037334 2.496h-66.368a8.533333 8.533333 0 0 1-6.037333-14.570667L686.72 511.018667 274.602667 98.901333a8.533333 8.533333 0 0 1 6.037333-14.570666h66.346667a8.533333 8.533333 0 0 1 6.058666 2.496z"
                fill="#6b7280"
                p-id="2589"
              ></path>
            </svg>
            <span>全部</span>
          </span>
        </p>
        <el-skeleton :rows="2" :loading="loading" animated />
        <div class="">
          <TransitionGroup name="list">
            <p class="flex justify-between py-1" v-for="(item, index) in articleRank.articleList" :key="index">
              <span
                ><svg v-if="index === 0" t="1680100565759" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25956" width="24" height="24">
                  <path
                    d="M597.333333 725.333333 512 725.333333 512 384 426.666667 384 426.666667 298.666667 597.333333 298.666667M810.666667 128 213.333333 128C166.4 128 128 166.4 128 213.333333L128 810.666667C128 857.6 166.4 896 213.333333 896L810.666667 896C857.6 896 896 857.6 896 810.666667L896 213.333333C896 166.4 857.6 128 810.666667 128Z"
                    p-id="25957"
                    fill="#EF4444"
                  ></path>
                </svg>
                <svg v-if="index === 1" t="1680100650919" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26159" width="24" height="24">
                  <path
                    d="M640 469.333333a85.333333 85.333333 0 0 1-85.333333 85.333334h-85.333334v85.333333h170.666667v85.333333H384v-170.666666a85.333333 85.333333 0 0 1 85.333333-85.333334h85.333334V384H384V298.666667h170.666667a85.333333 85.333333 0 0 1 85.333333 85.333333m170.666667-256H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z"
                    fill="#F59E0B"
                    p-id="26160"
                  ></path>
                </svg>
                <svg v-if="index === 2" t="1680100692779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26362" width="24" height="24">
                  <path
                    d="M640 448a64 64 0 0 1-64 64c35.84 0 64 28.586667 64 64V640c0 47.36-37.973333 85.333333-85.333333 85.333333H384v-85.333333h170.666667v-85.333333h-85.333334v-85.333334h85.333334V384H384V298.666667h170.666667c47.36 0 85.333333 37.973333 85.333333 85.333333m170.666667-256H213.333333c-46.506667 0-85.333333 38.4-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z"
                    fill="#FCD34D"
                    p-id="26363"
                  ></path></svg
              ></span>
              <span class="truncate flex-grow">
                <span class="hover:text-blue-500 hover:underline hover:cursor-pointer transition-all ease-in-out" v-if="item" @click="toDetail('articleRank', index)">{{ item.title }}</span>
                <span v-else class="text-gray-500">(权限不足)</span>
              </span>
              <span class="flex items-center ml-2">
                <svg t="1680090857317" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4017" width="12" height="12">
                  <path
                    d="M726.4 201.6c-12.8-9.6-28.8-6.4-38.4 0-9.6 9.6-16 25.6-9.6 38.4 6.4 12.8 9.6 28.8 12.8 44.8-86.4-201.6-230.4-246.4-236.8-249.6-9.6-3.2-22.4 0-28.8 6.4-9.6 6.4-12.8 19.2-9.6 28.8 12.8 86.4-25.6 188.8-115.2 310.4-6.4-25.6-16-51.2-32-80-9.6-9.6-22.4-16-35.2-12.8-16 3.2-25.6 12.8-25.6 28.8-3.2 48-25.6 92.8-51.2 140.8-22.4 41.6-44.8 86.4-54.4 134.4-32 150.4 99.2 329.6 233.6 380.8 9.6 3.2 19.2 6.4 32 9.6-25.6-19.2-41.6-51.2-48-96-25.6-195.2 185.6-246.4 195.2-425.6 153.6 105.6 224 336 137.6 505.6 3.2 0 6.4-3.2 9.6-3.2 0 0 3.2 0 3.2-3.2 163.2-89.6 252.8-208 259.2-345.6 16-211.2-163.2-390.4-198.4-412.8z"
                    fill="#EF4444"
                    p-id="4018"
                  ></path>
                </svg>
                <span class="text-sm">{{ Math.trunc(articleRank.articles[index].Score) }}</span>
              </span>
            </p>
          </TransitionGroup>
        </div>
      </div>
      <div class="py-2 px-4">
        <p class="rankHeader">
          <span class="flex-grow font-bold">帖子top{{ topNum }}</span>
          <span @click="toTopall('post')" class="text-xs text-gray-500 flex items-center hover:cursor-pointer hover:underline">
            <svg t="1681362064271" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2588" width="12" height="12">
              <path
                d="M353.045333 86.826667L754.56 488.362667a32 32 0 0 1 2.090667 42.965333l-2.090667 2.282667L353.066667 935.168a8.533333 8.533333 0 0 1-6.037334 2.496h-66.368a8.533333 8.533333 0 0 1-6.037333-14.570667L686.72 511.018667 274.602667 98.901333a8.533333 8.533333 0 0 1 6.037333-14.570666h66.346667a8.533333 8.533333 0 0 1 6.058666 2.496z"
                fill="#6b7280"
                p-id="2589"
              ></path>
            </svg>
            <span>全部</span>
          </span>
        </p>
        <el-skeleton :rows="2" :loading="loading" animated />
        <TransitionGroup name="list">
          <p v-for="(item, index) in postRank.postList" :key="index" class="flex justify-between py-1">
            <span>
              <svg v-if="index === 0" t="1680100565759" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25956" width="24" height="24">
                <path
                  d="M597.333333 725.333333 512 725.333333 512 384 426.666667 384 426.666667 298.666667 597.333333 298.666667M810.666667 128 213.333333 128C166.4 128 128 166.4 128 213.333333L128 810.666667C128 857.6 166.4 896 213.333333 896L810.666667 896C857.6 896 896 857.6 896 810.666667L896 213.333333C896 166.4 857.6 128 810.666667 128Z"
                  p-id="25957"
                  fill="#EF4444"
                ></path>
              </svg>
              <svg v-if="index === 1" t="1680100650919" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26159" width="24" height="24">
                <path
                  d="M640 469.333333a85.333333 85.333333 0 0 1-85.333333 85.333334h-85.333334v85.333333h170.666667v85.333333H384v-170.666666a85.333333 85.333333 0 0 1 85.333333-85.333334h85.333334V384H384V298.666667h170.666667a85.333333 85.333333 0 0 1 85.333333 85.333333m170.666667-256H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z"
                  fill="#F59E0B"
                  p-id="26160"
                ></path>
              </svg>
              <svg v-if="index === 2" t="1680100692779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26362" width="24" height="24">
                <path
                  d="M640 448a64 64 0 0 1-64 64c35.84 0 64 28.586667 64 64V640c0 47.36-37.973333 85.333333-85.333333 85.333333H384v-85.333333h170.666667v-85.333333h-85.333334v-85.333334h85.333334V384H384V298.666667h170.666667c47.36 0 85.333333 37.973333 85.333333 85.333333m170.666667-256H213.333333c-46.506667 0-85.333333 38.4-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z"
                  fill="#FCD34D"
                  p-id="26363"
                ></path>
              </svg>
            </span>
            <span class="truncate flex-grow">
              <span class="hover:text-blue-500 hover:underline hover:cursor-pointer transition-all ease-in-out" v-if="item" @click="toDetail('postRank', index)">{{ item.title }}</span>
              <span v-else class="text-gray-500">(权限不足)</span>
            </span>
            <span class="flex items-center ml-2">
              <svg t="1680090857317" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4017" width="12" height="12">
                <path
                  d="M726.4 201.6c-12.8-9.6-28.8-6.4-38.4 0-9.6 9.6-16 25.6-9.6 38.4 6.4 12.8 9.6 28.8 12.8 44.8-86.4-201.6-230.4-246.4-236.8-249.6-9.6-3.2-22.4 0-28.8 6.4-9.6 6.4-12.8 19.2-9.6 28.8 12.8 86.4-25.6 188.8-115.2 310.4-6.4-25.6-16-51.2-32-80-9.6-9.6-22.4-16-35.2-12.8-16 3.2-25.6 12.8-25.6 28.8-3.2 48-25.6 92.8-51.2 140.8-22.4 41.6-44.8 86.4-54.4 134.4-32 150.4 99.2 329.6 233.6 380.8 9.6 3.2 19.2 6.4 32 9.6-25.6-19.2-41.6-51.2-48-96-25.6-195.2 185.6-246.4 195.2-425.6 153.6 105.6 224 336 137.6 505.6 3.2 0 6.4-3.2 9.6-3.2 0 0 3.2 0 3.2-3.2 163.2-89.6 252.8-208 259.2-345.6 16-211.2-163.2-390.4-198.4-412.8z"
                  fill="#EF4444"
                  p-id="4018"
                ></path>
              </svg>
              <span class="text-sm">{{ Math.trunc(postRank.posts[index].Score) }}</span>
            </span>
          </p>
        </TransitionGroup>
      </div>
      <div class="py-2 px-4">
        <p class="rankHeader">
          <span class="flex-grow font-bold">用户top{{ topNum }}</span>
          <span @click="toTopall('user')" class="text-xs text-gray-500 flex items-center hover:cursor-pointer hover:underline">
            <svg t="1681362064271" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2588" width="12" height="12">
              <path
                d="M353.045333 86.826667L754.56 488.362667a32 32 0 0 1 2.090667 42.965333l-2.090667 2.282667L353.066667 935.168a8.533333 8.533333 0 0 1-6.037334 2.496h-66.368a8.533333 8.533333 0 0 1-6.037333-14.570667L686.72 511.018667 274.602667 98.901333a8.533333 8.533333 0 0 1 6.037333-14.570666h66.346667a8.533333 8.533333 0 0 1 6.058666 2.496z"
                fill="#6b7280"
                p-id="2589"
              ></path>
            </svg>
            <span>全部</span>
          </span>
        </p>
        <el-skeleton :rows="2" :loading="loading" animated />
        <TransitionGroup name="list">
          <p v-for="(item, index) in userRank.userList" :key="index" class="flex justify-between py-1">
            <span>
              <svg v-if="index === 0" t="1680100565759" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25956" width="24" height="24">
                <path
                  d="M597.333333 725.333333 512 725.333333 512 384 426.666667 384 426.666667 298.666667 597.333333 298.666667M810.666667 128 213.333333 128C166.4 128 128 166.4 128 213.333333L128 810.666667C128 857.6 166.4 896 213.333333 896L810.666667 896C857.6 896 896 857.6 896 810.666667L896 213.333333C896 166.4 857.6 128 810.666667 128Z"
                  p-id="25957"
                  fill="#EF4444"
                ></path>
              </svg>
              <svg v-if="index === 1" t="1680100650919" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26159" width="24" height="24">
                <path
                  d="M640 469.333333a85.333333 85.333333 0 0 1-85.333333 85.333334h-85.333334v85.333333h170.666667v85.333333H384v-170.666666a85.333333 85.333333 0 0 1 85.333333-85.333334h85.333334V384H384V298.666667h170.666667a85.333333 85.333333 0 0 1 85.333333 85.333333m170.666667-256H213.333333a85.333333 85.333333 0 0 0-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z"
                  fill="#F59E0B"
                  p-id="26160"
                ></path>
              </svg>
              <svg v-if="index === 2" t="1680100692779" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26362" width="24" height="24">
                <path
                  d="M640 448a64 64 0 0 1-64 64c35.84 0 64 28.586667 64 64V640c0 47.36-37.973333 85.333333-85.333333 85.333333H384v-85.333333h170.666667v-85.333333h-85.333334v-85.333334h85.333334V384H384V298.666667h170.666667c47.36 0 85.333333 37.973333 85.333333 85.333333m170.666667-256H213.333333c-46.506667 0-85.333333 38.4-85.333333 85.333333v597.333334a85.333333 85.333333 0 0 0 85.333333 85.333333h597.333334a85.333333 85.333333 0 0 0 85.333333-85.333333V213.333333a85.333333 85.333333 0 0 0-85.333333-85.333333z"
                  fill="#FCD34D"
                  p-id="26363"
                ></path>
              </svg>
            </span>
            <span @click="toDetail('userRank', index)" class="truncate flex-grow hover:text-blue-500 hover:underline hover:cursor-pointer transition-all ease-in-out">{{ item.Name }}</span>
            <span class="flex items-center ml-2">
              <svg t="1680090857317" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4017" width="12" height="12">
                <path
                  d="M726.4 201.6c-12.8-9.6-28.8-6.4-38.4 0-9.6 9.6-16 25.6-9.6 38.4 6.4 12.8 9.6 28.8 12.8 44.8-86.4-201.6-230.4-246.4-236.8-249.6-9.6-3.2-22.4 0-28.8 6.4-9.6 6.4-12.8 19.2-9.6 28.8 12.8 86.4-25.6 188.8-115.2 310.4-6.4-25.6-16-51.2-32-80-9.6-9.6-22.4-16-35.2-12.8-16 3.2-25.6 12.8-25.6 28.8-3.2 48-25.6 92.8-51.2 140.8-22.4 41.6-44.8 86.4-54.4 134.4-32 150.4 99.2 329.6 233.6 380.8 9.6 3.2 19.2 6.4 32 9.6-25.6-19.2-41.6-51.2-48-96-25.6-195.2 185.6-246.4 195.2-425.6 153.6 105.6 224 336 137.6 505.6 3.2 0 6.4-3.2 9.6-3.2 0 0 3.2 0 3.2-3.2 163.2-89.6 252.8-208 259.2-345.6 16-211.2-163.2-390.4-198.4-412.8z"
                  fill="#EF4444"
                  p-id="4018"
                ></path>
              </svg>
              <span class="text-sm">{{ Math.trunc(userRank.users[index].Score) }}</span>
            </span>
          </p>
        </TransitionGroup>
      </div>
    </div>
    <!-- recomment -->
    <div class="mt-8 max-w-screen-lg rounded shadow-md bg-white p-4 dark:bg-deepBlack" style="width: 1024px; min-height: 400px">
      <div class="flex justify-start">
        <svg t="1680150934725" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8641" width="60" height="60">
          <path
            d="M803.517 92H220.482c-35.688 0-64.723 29.805-64.723 66.44v707.12c0 36.635 29.034 66.44 64.723 66.44h8.866l280.743-142.75L794.759 932h8.758c35.688 0 64.724-29.805 64.724-66.44V158.44C868.24 121.805 839.205 92 803.517 92zM433.659 626.544h-37.934V487.59a442.42 442.42 0 0 1-25.152 22.472 1027.1 1027.1 0 0 1-27.626 22.06l-16.905-40.82c19.238-13.742 37.039-28.656 53.396-44.737 16.352-16.081 30.854-33.192 43.501-51.335h-79.167v-35.872H444.38c3.021-5.496 5.908-11.545 8.659-18.143h-24.327v-22.266h-89.063v-35.872h89.063v-29.688l39.583 1.649v28.038h89.475v-29.688l39.171 1.649v28.038h86.589v35.872h-86.59v23.503h-39.17v-23.503h-89.475v7.834l31.337 7.422-11.133 25.152h197.504v35.872H469.532c-10.998 18.696-22.955 35.873-35.873 51.541v179.776z m260.591-91.949H590.344v43.295c0 9.07-0.689 16.628-2.063 22.678-1.378 6.043-3.987 10.927-7.834 14.638-3.853 3.711-9.071 6.597-15.668 8.658-6.598 2.062-15.256 3.505-25.977 4.33l-23.915 2.062-11.957-38.347 23.09-1.649c10.166-0.824 17.111-2.821 20.822-5.979s5.566-8.311 5.566-15.462v-34.224H450.152V499.96h102.257v-15.669l53.603-28.45H471.594v-34.224h202.452v31.75l-82.054 46.593H694.25v34.635z"
            fill="#EF4444"
            p-id="8642"
          ></path>
        </svg>
        <div class="navBar ml-4">
          <span :class="{ activeNav: currentCom === 'Articles' }" @click="currentCom = 'Articles'">文章</span>
          <span :class="{ activeNav: currentCom === 'Posts' }" @click="currentCom = 'Posts'">帖子</span>
          <span :class="{ activeNav: currentCom === 'Users' }" @click="currentCom = 'Users'">用户</span>
        </div>
      </div>

      <component :is="coms[currentCom]"></component>
      <!-- <RouterView></RouterView> -->
    </div>
  </div>
</template>
<style scoped lang="less">
.rankHeader {
  @apply flex items-center mb-4 p-0;
}
</style>
