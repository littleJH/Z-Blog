<script setup lang="ts">
import { userThreadsApi, userinfoApi, getThreadsApi } from '../../api/user'

import { ref, reactive, onBeforeMount, defineProps, onUpdated } from 'vue'
import NProgress from 'nprogress'
import router from '../../router/router'
import { Thread } from '../../stores/store'
import threadCard from '../threadCard.vue'

const { userId } = defineProps(['userId'])
const threadList = reactive({
  list: [] as Array<Thread>
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
    await userThreadsApi(userId, config).then(res => {
      threadList.list = res.data.data.threads
    })
  } else {
    await getThreadsApi(config).then(res => {
      threadList.list = res.data.data.threads
    })
  }
  loading.value = false
  if (threadList.list.length === 0) showNone.value = true
})
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated />
  <div style="min-width: 800px">
    <TransitionGroup name="list" tag="div">
      <div v-for="(item, index) in threadList.list" :key="index">
        <div class="divider" v-if="index !== 0"></div>

        <threadCard :thread="item"></threadCard>
      </div>
    </TransitionGroup>
  </div>
  <div
    v-if="showNone"
    @click="router.push('/editor')"
    class="m-24 flex justify-center"
  >
    <span class="text-blue-500 hover:cursor-pointer">空空如也~</span>
  </div>
</template>
<style scoped lang="less">
::v-deep .el-divider--horizontal {
  margin: 0;
}

span {
  @apply mr-2;
}
</style>
