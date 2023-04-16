<script setup lang="ts">
import router from '../../../router/router'
import {
  getPostFavUserlistApi,
  getAticleFavUserlistApi,
  getThreadUserlistApi
} from '../../../api/favorite'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeNav = ref<'favArticle' | 'favPost' | 'favThread'>('favArticle')
const total = reactive({
  article: 0,
  post: 0,
  thread: 0
})
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  activeNav.value = route.name as any
  Promise.all([
    getAticleFavUserlistApi(config),
    getPostFavUserlistApi(config),
    getThreadUserlistApi(config)
  ]).then(res => {
    total.article = res[0].data.data.total
    total.post = res[1].data.data.total
    total.thread = res[2].data.data.total
  })
})

const toArticle = () => {
  router.push('article')
  activeNav.value = 'favArticle'
}

const toPost = () => {
  router.push('post')
  activeNav.value = 'favPost'
}
const toThread = () => {
  router.push('thread')
  activeNav.value = 'favThread'
}
</script>
<template>
  <div class="navBar">
    <span @click="toArticle" :class="{ activeNav: activeNav === 'favArticle' }"
      >文章({{ total.article }})</span
    >
    <span @click="toPost" :class="{ activeNav: activeNav === 'favPost' }"
      >帖子({{ total.post }})</span
    >
    <span @click="toThread" :class="{ activeNav: activeNav === 'favThread' }"
      >跟帖({{ total.thread }})</span
    >
  </div>
  <div>
    <RouterView></RouterView>
  </div>
</template>
<style scoped lang="less"></style>
