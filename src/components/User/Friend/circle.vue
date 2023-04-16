<script setup lang="ts">
import {
  getFriendArticlesApi,
  getFriendPostsApi,
  getFriendZipfilesApi
} from '../../../api/friend'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { Article, Post, Zipfile, useStore } from '../../../stores/store'
import ArticleCard from '../../articleCard.vue'
import PostCard from '../../postCard.vue'
import pagination from '../../pagination.vue'

const showNone = ref<boolean>(false)
const loading = ref<boolean>(true)
const pageNum = ref(1)
const pageSize = 10
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
const articleList = reactive({
  list: [] as Array<Article>
})

const postList = reactive({
  list: [] as Array<Post>
})
const zipfileList = reactive({
  list: [] as Array<Zipfile>
})
const total = ref(0)

onBeforeMount(() => {
  getList()
})

const getList = async () => {
  showNone.value = false
  await Promise.all([
    getFriendArticlesApi(config, pageNum.value, pageSize),
    getFriendPostsApi(config, pageNum.value, pageSize),
    getFriendZipfilesApi(config, pageNum.value, pageSize)
  ]).then(res => {
    console.log(res)
    articleList.list = res[0].data.data.articles
    postList.list = res[1].data.data.posts
    zipfileList.list = res[2].data.data.zipfiles
    total.value =
      res[0].data.data.total + res[1].data.data.total + res[2].data.data.total
    loading.value = false
  })
  if (
    articleList.list.length === 0 &&
    postList.list.length === 0 &&
    zipfileList.list.length === 0
  )
    showNone.value = true
}

const pageChange = (value: any) => {
  pageNum.value = value.page
  getList()
}
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated></el-skeleton>
  <TransitionGroup name="list" tag="div">
    <div v-for="(item, index) in articleList.list" :key="item.id">
      <p
        class="divider"
        v-if="index !== 0 && articleList.list.length !== 0"
      ></p>

      <ArticleCard :article="item"></ArticleCard>
    </div>
  </TransitionGroup>
  <TransitionGroup name="list" tag="div">
    <div v-for="(item, index) in postList.list" :key="item.id">
      <p class="divider" v-if="index !== 0"></p>
      <PostCard :post="item"></PostCard>
    </div>
  </TransitionGroup>
  <div v-if="showNone" class="show-none text-gray-500">空空如也~</div>
  <pagination
    :total="total"
    :page-num="pageNum"
    :page-size="pageSize"
    @page-change="pageChange"
  ></pagination>
</template>
<style scoped lang="less"></style>
