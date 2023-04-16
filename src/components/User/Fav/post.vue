<script setup lang="ts">
import { getPostFavUserlistApi } from '../../../api/favorite'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { getPostApi } from '../../../api/post'
import { Post } from '../../../stores/store'
import postCard from '../../postCard.vue'
import pagination from '../../pagination.vue'

let list: Array<string>
const postList = reactive({
  list: [] as Array<Post>
})
const loading = ref<boolean>(true)
const total = ref<number>(0)
const pageNum = ref(1)
const pageSize = 10
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getPostFavUserlistApi(config).then(async res => {
    list = res.data.data.Favorites
    total.value = res.data.data.total
    getPosts()
  })
})

const getPosts = async () => {
  postList.list.length = 0
  loading.value = true
  const posts = [] as Array<Post>
  let index = (pageNum.value - 1) * pageSize
  for (let item of list) {
    if (
      index < pageNum.value * pageSize &&
      index >= (pageNum.value - 1) * pageSize &&
      index < total.value
    ) {
      await getPostApi(list[index], config).then(result => {
        posts.push(result.data.data.post)
        index++
      })
    }
  }
  postList.list = posts
  loading.value = false
}

const pageChange = (value: any) => {
  pageNum.value = value.page
  getPosts()
}
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated />
  <TransitionGroup name="list">
    <div v-for="(item, index) in postList.list" :key="index">
      <p class="divider" v-if="index !== 0"></p>
      <postCard :post="item"></postCard>
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
