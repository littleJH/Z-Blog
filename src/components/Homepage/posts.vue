<script setup lang="ts">
import { Post } from '../../stores/store'
import { onBeforeMount, reactive, ref } from 'vue'
import nprogress from 'nprogress'
import { getPostRecommentApi } from '../../api/hotspot'
import { getPostApi } from '../../api/post'
import postCard from '../postCard.vue'

nprogress.start()
const postList = reactive({
  list: [] as Array<Post>
})
const loading = ref<boolean>(true)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getPostRecommentApi(config).then(async result => {
    const arr = reactive<Array<Post>>([])
    for (let item of result.data.data.posts) {
      await getPostApi(item, config).then(resu => {
        arr.push(resu.data.data.post)
      })
    }
    postList.list = arr
    nprogress.done()
    loading.value = false
  })
})
</script>
<template>
  <el-skeleton v-if="loading" :rows="10" :loading="true" animated />
  <TransitionGroup name="list">
    <postCard
      v-for="(item, index) in postList.list"
      :key="index"
      :post="item"
    ></postCard>
  </TransitionGroup>
</template>
<style scoped lang="less">
::v-deep .el-divider--horizontal {
  margin: 0;
}
</style>
