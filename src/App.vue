<script setup lang="ts">
import Header from './components/Header/header.vue'
import { useStarField } from './hooks/stars'
import { onMounted } from 'vue'
import { User, useStore } from './stores/store'
import { personalGetApi } from './api/user'
import { getUserLabelApi } from './api/label'
import { ElMessage } from 'element-plus'
import router from './router/router'
import { ref } from 'vue'
import Search from './components/Search/search.vue'

const store = useStore()
const showSearch = ref<boolean>(false)
const showDark = ref<boolean>(false)

const getPersonal = () => {
  if (localStorage.getItem('token')) {
    const config = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    }
    personalGetApi(config).then(res => {
      if (res.data.code === 201) {
        ElMessage.warning({
          message: '登录已过期',
          offset: 80
        })
        router.push('/login')
        return
      }
      const user = res.data.data.user as User
      getUserLabelApi(user.ID, config).then(result => {
        user.Labels = result.data.data.labels
        store.userInfo = user
        localStorage.setItem('userInfo', JSON.stringify(user))
      })
    })
  }
}

onMounted(() => {
  if (localStorage.getItem('theme')) {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      showDark.value = true
    } else {
      document.documentElement.classList.remove('dark')
      showDark.value = false
    }
  }

  getPersonal()
})

const afterEnter = () => {
  useStarField()
}

const themeChange = (value: any) => {
  if (value.theme === 'dark') {
    showDark.value = true
  } else {
    showDark.value = false
  }
}

const openSearch = () => {
  showSearch.value = true
}
</script>
<template>
  <Transition @after-enter="afterEnter">
    <canvas v-if="showDark" id="starField" class="fixed top-0 z-0 w-full h-full"></canvas>
  </Transition>

  <Header @theme-change="themeChange" @open-search="openSearch"></Header>
  <Search v-if="showSearch"></Search>
  <RouterView></RouterView>
</template>
<style scoped lang="less"></style>
