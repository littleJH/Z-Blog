<script setup lang="ts">
import { Article } from '../../stores/store'
import { onBeforeMount, reactive, ref } from 'vue'
import { getArticleRecommentApi } from '../../api/hotspot'
import nprogress from 'nprogress'
import { getArticleApi } from '../../api/article'
import ArticleCard from '../articleCard.vue'

nprogress.start()
const loading = ref<boolean>(true)
const articleList = reactive({
  list: [] as Array<Article>,
  total: 0
})
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getArticleRecommentApi(config).then(async result => {
    console.log('🚀 ~ getArticleRecommentApi ~ result:', result)
    const arr = reactive<Array<Article>>([])
    articleList.total = result.data.data.total
    for (let item of result.data.data.articles) {
      await getArticleApi(item, config).then(resu => {
        if (resu.data.code === 200) {
          arr.push(resu.data.data.article)
        }
        // else {
        //   arr.push(null as any)
        // }
      })
    }
    articleList.list = arr
    nprogress.done()
    loading.value = false
  })
})
</script>
<template>
  <el-skeleton :rows="10" :loading="loading" animated />
  <TransitionGroup name="list" tag="div">
    <div v-for="(item, index) in articleList.list" :key="index">
      <div v-if="index !== 0" class="divider"></div>
      <ArticleCard :article="item"></ArticleCard>
    </div>
  </TransitionGroup>
  <div class="flex justify-center m-4">
    <el-pagination background layout="prev, pager, next" :hide-on-single-page="articleList.total <= 20" :total="articleList.total" page-size="20" />
  </div>
</template>
<style scoped lang="less"></style>
