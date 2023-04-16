<script setup lang="ts">
import {
  getFriendListApi,
  getFriendAppliedApi,
  getFriendApplyingApi
} from '../../../api/friend'
import {
  getFriendArticlesApi,
  getFriendPostsApi,
  getFriendZipfilesApi
} from '../../../api/friend'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import router from '../../../router/router'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeNav = ref<
  'friendCircle' | 'friendList' | 'friendApply' | 'myApply'
>('friendCircle')
const total = reactive({
  circle: 0,
  list: 0,
  apply: 0,
  myApply: 0
})
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  activeNav.value = route.name as any
  Promise.all([
    getFriendArticlesApi(config, 0, 0),
    getFriendPostsApi(config, 0, 0),
    getFriendZipfilesApi(config, 0, 0),
    getFriendListApi(config),
    getFriendAppliedApi(config),
    getFriendApplyingApi(config)
  ]).then(res => {
    total.circle =
      res[0].data.data.total + res[1].data.data.total + res[2].data.data.total
    total.list = res[3].data.data.friends.length
    total.apply = res[4].data.data.friends.length
    total.myApply = res[5].data.data.friends.length
  })
})
const toCircle = () => {
  activeNav.value = 'friendCircle'
  router.push('circle')
}
const toFriend = () => {
  activeNav.value = 'friendList'
  router.push('list')
}
const toApply = () => {
  activeNav.value = 'friendApply'
  router.push('apply')
}
const toMyapply = () => {
  activeNav.value = 'myApply'
  router.push('myApply')
}
</script>
<template>
  <div class="navBar">
    <span
      @click="toCircle"
      :class="{ activeNav: activeNav === 'friendCircle' }"
    >
      好友圈({{ total.circle }})
    </span>
    <span @click="toFriend" :class="{ activeNav: activeNav === 'friendList' }">
      好友({{ total.list }})
    </span>
    <span @click="toApply" :class="{ activeNav: activeNav === 'friendApply' }">
      好友申请({{ total.apply }})
    </span>
    <span @click="toMyapply" :class="{ activeNav: activeNav === 'myApply' }">
      我的申请({{ total.myApply }})
    </span>
  </div>
  <div class="">
    <RouterView></RouterView>
  </div>
</template>
<style scoped lang="less"></style>
