<script setup lang="ts">
import Header from './components/Header/header.vue'
import { useStarField } from './hooks/stars'
import { onMounted } from 'vue'
import { User, useStore } from './stores'
import { personalGetApi } from './api/user'
import { ElMessage } from 'element-plus'
import router from './router'

const store = useStore()
const getPersonal = () => {
  if (localStorage.getItem('token')) {
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
    personalGetApi(config).then(res => {
      if (res.data.code === 200) {
        store.userInfo = res.data.data.user
        localStorage.setItem('userInfo', JSON.stringify(res.data.data.user))
      }
      if (res.data.code === 201) {
        ElMessage.warning({
          message: '登录已过期',
          duration: 3000
        })
        router.push('/user')
      }
    })
  }
}

onMounted(() => {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  useStarField()
  getPersonal()
})
</script>
<template>
  <canvas id="starField" class="fixed top-0 z-0 w-full h-full"></canvas>
  <Header></Header>
  <RouterView></RouterView>
</template>
<style scoped lang="less"></style>
