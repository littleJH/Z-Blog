<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import { getFriendApplyingApi } from '../../../api/friend'
import { userinfoApi } from '../../../api/user'
import { User } from '../../../stores/store'
import UserCard from '../../../components/userCard.vue'

const showNone = ref<boolean>(false)
const applyList = reactive({
  list: [] as Array<User>
})
const loading = ref<boolean>(true)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getFriendApplyingApi(config).then(async res => {
    const list = [] as Array<User>
    for (let item of res.data.data.friends) {
      await userinfoApi(item, config).then(result => {
        result.data.data.user.ID = item
        list.push(result.data.data.user)
      })
    }
    applyList.list = list
    loading.value = false
    if (applyList.list.length === 0) showNone.value = true
  })
})
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated></el-skeleton>
  <TransitionGroup name="list">
    <UserCard
      v-for="item in applyList.list"
      :key="item.ID"
      :user="item"
    ></UserCard>
  </TransitionGroup>
  <div v-if="showNone" class="show-none">空空如也~</div>
</template>
<style scoped lang="less"></style>
