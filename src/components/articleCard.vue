<script setup lang="ts">
import { defineProps, reactive, onBeforeMount, ref, onUpdated } from 'vue'
import router from '../router/router'
import { getArticleLikedApi, getArticleLikeListApi } from '../api/like'
import { getArticleFavListApi, getArticleFavoritedApi } from '../api/favorite'
import { getArticleLabelApi } from '../api/label'
import { userinfoApi } from '../api/user'
import nprogress from 'nprogress'
import { Article, User } from '../stores/store'
import labelCard from './labelCard.vue'

const { article } = defineProps(['article'])
const object = reactive({
  article: null as Article | null
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

onBeforeMount(async () => {
  await Promise.all([
    getArticleLikedApi(article.id, config),
    getArticleLikeListApi(article.id, config),
    getArticleFavoritedApi(article.id, config),
    getArticleFavListApi(article.id, config),
    getArticleLabelApi(article.id, config),
    userinfoApi(article.user_id, config)
  ]).then(res => {
    article.likeFlag = res[0].data.data.flag
    article.likeNum = res[1].data.data.total
    article.favoriteFlag = res[2].data.data.flag
    article.favNum = res[3].data.data.total
    article.labels = res[4].data.data.labels
    article.author = res[5].data.data.user.Name
    userInfo.info = res[5].data.data.user
    object.article = article
    loading.value = false
  })
  nprogress.done()
})

onUpdated(() => {
  const node = document.createElement('div')
  node.innerHTML = object.article?.res_long as string
  const elements = node.querySelectorAll('p, span')
  let str: string = ''
  elements.forEach(e => {
    str += e.textContent
  })
  str = str.replace(/\s+/g, '')
  const el = document.getElementById(`${object.article?.id}`) as HTMLElement

  el.innerText = str
})

const toDetail = () => {
  localStorage.setItem('article', JSON.stringify(article))
  router.push({
    name: 'article',
    params: {
      id: article.id
    }
  })
}

const toUserpage = () => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: article.user_id
    }
  })
}
</script>
<template>
  <div
    @click="toDetail"
    class="rounded px-2 py-4 hover:bg-gray-100 hover:shadow-md hover:cursor-pointer transition-all ease-in-out dark:bg-deepBlack dark:hover:bg-black"
  >
    <p class="flex items-center">
      <span class="font-bold truncate ml-2">{{ object.article?.title }}</span>

      <labelCard
        v-for="label in object.article?.labels"
        :label="label"
      ></labelCard>
      <span class="text-lg flex-grow flex justify-end items-center">
        <span class="mx-4 text-xs text-center">{{
          object.article?.updated_at
        }}</span>

        <span class="text-sm text-center">{{ object.article?.author }}</span>
        <img
          @click.stop="toUserpage()"
          class="avatar-small"
          :src="`http://icon.mgaronya.com/${userInfo.info?.Icon}`"
          alt=""
        />
      </span>
    </p>
    <p
      :id="object.article?.id"
      class="truncate mt-2 rounded bg-gray-100 p-4 dark:bg-shallowBlack"
    ></p>
    <div v-if="!loading" class="h-8 text-xs flex">
      <div class="flex-grow flex justify-start items-center text-gray-500">
        <span>点赞：{{ object.article?.likeNum }}</span>
        <div class="divider-vertical h-3"></div>
        <span>收藏：{{ object.article?.favNum }}</span>
        <div class="divider-vertical h-3"></div>
        <span>阅读：{{ object.article?.visible }}</span>
      </div>
      <div class="flex items-center">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
