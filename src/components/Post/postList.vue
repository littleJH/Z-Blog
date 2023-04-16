<script setup lang="ts">
import { userPostsApi, getPostsApi } from '../../api/user'

import router from '../../router/router'
import { Post } from '../../stores/store'
import { ref, reactive, onBeforeMount, defineProps } from 'vue'
import postCard from '../postCard.vue'

const { userId } = defineProps(['userId'])
const loading = ref<boolean>(true)
const showNone = ref<boolean>(false)
const postList = reactive({
  list: [] as Array<Post>
})
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(async () => {
  if (!userId) {
    await getPostsApi(config).then(res => {
      postList.list = res.data.data.posts
    })
  } else {
    await userPostsApi(userId, config).then(res => {
      postList.list = res.data.data.posts
    })
  }
  loading.value = false
  if (postList.list.length === 0) showNone.value = true
})
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated />
  <div class="" style="width: 800px">
    <TransitionGroup name="list" tag="div">
      <div v-for="(item, index) in postList.list" :key="index">
        <div class="divider" v-if="index !== 0"></div>

        <postCard :post="item"></postCard>
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
