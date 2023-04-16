<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount } from 'vue'

import { getAticleFavUserlistApi } from '../../../api/favorite'
import { Article } from '../../../stores/store'
import articleCard from '../../articleCard.vue'
import { getArticleApi } from '../../../api/article'
import pagination from '../../pagination.vue'

let list: Array<string>
const articleList = reactive({
  list: [] as Array<Article>
})
const loading = ref<boolean>(true)
const total = ref<number>(0)
const pageNum = ref(1)
const pageSize = 20

const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getAticleFavUserlistApi(config).then(async res => {
    list = res.data.data.Favorites
    total.value = res.data.data.total
    getArticles()
  })
})

const getArticles = async () => {
  articleList.list.length = 0
  loading.value = true
  const articles = [] as Array<Article>
  let index = (pageNum.value - 1) * pageSize
  for (let item of list) {
    if (
      index < pageNum.value * pageSize &&
      index >= (pageNum.value - 1) * pageSize &&
      index < total.value
    ) {
      await getArticleApi(list[index], config).then(result => {
        articles.push(result.data.data.article)
        index++
      })
    }
  }
  articleList.list = articles
  loading.value = false
}

const pageChange = (value: any) => {
  pageNum.value = value.page
  getArticles()
}
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated />
  <TransitionGroup name="list">
    <div v-for="(item, index) in articleList.list" :key="index">
      <p class="divider" v-if="index !== 0"></p>
      <articleCard :article="item"></articleCard>
    </div>
  </TransitionGroup>
  <pagination
    v-if="!loading"
    :total="total"
    :page-num="pageNum"
    :page-size="pageSize"
    @page-change="pageChange"
  ></pagination>
</template>
<style scoped lang="less"></style>
