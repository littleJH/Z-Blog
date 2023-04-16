<script setup lang="ts">
import { getThreadUserlistApi } from '../../../api/favorite'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { getThread } from '../../../api/thread'
import { Thread } from '../../../stores/store'
import threadCard from '../../threadCard.vue'
import pagination from '../../pagination.vue'

let list: Array<string>
const threadList = reactive({
  list: [] as Array<Thread>
})
const total = ref<number>(0)
const loading = ref<boolean>(true)
const pageNum = ref(1)
const pageSize = 10
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getThreadUserlistApi(config).then(async res => {
    list = res.data.data.Favorites
    total.value = res.data.data.total
    getThreads()
  })
})

const getThreads = async () => {
  threadList.list.length = 0
  loading.value = true
  const threads = [] as Array<Thread>
  let index = (pageNum.value - 1) * pageSize
  for (let item of list) {
    if (
      index < pageNum.value * pageSize &&
      index >= (pageNum.value - 1) * pageSize &&
      index < total.value
    ) {
      await getThread(list[index], config).then(result => {
        threads.push(result.data.data.thread)
        index++
      })
    }
  }
  threadList.list = threads
  loading.value = false
}

const pageChange = (value: any) => {
  pageNum.value = value.page
  getThreads()
}
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated />
  <TransitionGroup name="list" tag="div">
    <div v-for="(item, index) in threadList.list" :key="index">
      <p class="divider" v-if="index !== 0"></p>
      <threadCard :thread="item"></threadCard>
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
