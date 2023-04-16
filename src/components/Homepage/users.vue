<script setup lang="ts">
import { User } from '../../stores/store'
import { getUserHotLevelApi, getUserRecommentApi } from '../../api/hotspot'
import { userinfoApi } from '../../api/user'
import { onBeforeMount, reactive, ref } from 'vue'
import router from '../../router/router'
import nprogress from 'nprogress'
import UserCard from '../userCard.vue'

nprogress.start()
const loading = ref<boolean>(true)
const userList = reactive({
  list: [] as Array<User>
})
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
onBeforeMount(() => {
  getUserRecommentApi(config).then(async result => {
    const arr = reactive<Array<User>>([])
    for (let item of result.data.data.users) {
      await userinfoApi(item, config).then(resu => {
        const user = resu.data.data.user
        getUserHotLevelApi(item, config).then(res => {
          user.HotLevel = res.data.data.Level
          user.ID = item
          arr.push(user)
        })
      })
    }
    userList.list = arr
    nprogress.done()
    loading.value = false
  })
})
</script>
<template>
  <el-skeleton v-if="loading" :rows="10" :loading="true" animated />
  <TransitionGroup name="list" tag="div">
    <div class="p-4" v-for="(item, index) in userList.list" :key="index">
      <UserCard :user="item"></UserCard>
    </div>
  </TransitionGroup>
</template>
<style scoped lang="less">
span {
  @apply mr-4 flex items-center;
}
</style>
