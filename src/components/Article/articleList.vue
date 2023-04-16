<script setup lang="ts">
import { userArticlesApi, getArticlesApi } from '../../api/user'

import { reactive, ref, onBeforeMount, defineProps } from 'vue'
import NProgress from 'nprogress'
import { Article } from '../../stores/store'
import router from '../../router/router'
import articleCard from '../articleCard.vue'
import admin from './admin.vue'

const { userId } = defineProps(['userId'])
const articleList = reactive({
  list: [] as Array<Article>
})
const loading = ref<boolean>(true)
const showNone = ref<boolean>(false)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(async () => {
  if (userId) {
    await userArticlesApi(userId, config).then(res => {
      articleList.list = res.data.data.articles
    })
  } else {
    await getArticlesApi(config).then(res => {
      articleList.list = res.data.data.articles
    })
  }
  loading.value = false
  if (articleList.list.length === 0) showNone.value = true
})
</script>

<template>
  <el-skeleton :rows="4" :loading="loading" animated />
  <div class="" style="width: 800px">
    <TransitionGroup name="list" tag="div">
      <div v-for="(item, index) in articleList.list" :key="index">
        <div class="divider" v-if="index !== 0"></div>
        <articleCard :article="item"></articleCard>
      </div>
    </TransitionGroup>
    <div
      v-if="showNone"
      @click="router.push('/editor')"
      class="m-24 flex justify-center"
    >
      <span v-if="userId">空空如也~</span>
      <span v-else class="text-blue-500 hover:cursor-pointer"
        >+快来发布你的第一篇帖子吧！</span
      >
    </div>
  </div>
</template>
<style scoped lang="less">
::v-deep .el-divider--horizontal {
  margin: 0;
}

span {
  @apply mx-2;
}
</style>
