<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../../stores/index'
import router from '../../router'
import SearchIcon from '../../assets/search.svg'

const store = useStore()
const activeIndex = ref<string>('')
const searchInput = ref<string>('')
const theme = ref(localStorage.theme === 'dark' ? true : false)

// const currentPath = router.currentRoute.value
// if (currentPath.indexOf('/', 1)) {
//   activeIndex.value = currentPath.substring(0, currentPath.indexOf('/', 1))
// } else {
//   activeIndex.value = currentPath
// }
// activeIndex.value = currentPath.path

const handelClick = () => {
  activeIndex.value = ''
  if (!localStorage.getItem('token')) {
    router.push('/user/login')
  } else {
    router.push('/user/personal')
  }
}

const themeChange = (value: boolean) => {
  if (value) {
    localStorage.theme = 'dark'
    document.documentElement.classList.add('dark')
    store.theme = 'dark'
  } else {
    localStorage.theme = 'light'
    document.documentElement.classList.remove('dark')
    store.theme = 'light'
  }
}

const toEditor = () => {
  router.push('/editor')
}
</script>
<template>
  <div class="fixed top-0 z-10 w-full shadow-md dark:shadow-white-md">
    <el-menu
      :default-active="activeIndex"
      class="flex items-center transition-all duration-500 dark:border-gray-800 dark:bg-black dark:text-gray-200"
      mode="horizontal"
      router
    >
      <div class="w-32 flex-grow"></div>
      <el-menu-item
        index="/homepage"
        class="py-0 px-4 transition-all duration-500 hover:py-6"
        >首页</el-menu-item
      >
      <div class="mx-8">
        <el-input v-model="searchInput" placeholder="search something...">
          <template #suffix>
            <img :src="SearchIcon" class="hover:cursor-pointer" />
          </template>
        </el-input>
      </div>
      <el-menu-item index="/article" class="">文章</el-menu-item>
      <el-menu-item index="/post" class="">帖子</el-menu-item>
      <el-menu-item index="/favorite" class="">收藏</el-menu-item>
      <el-menu-item index="/history" class="">历史</el-menu-item>
      <el-menu-item index="/board" class="">留言板</el-menu-item>
      <el-menu-item index="/friend" class="">好友</el-menu-item>

      <div class="pl-2">
        <el-switch
          v-model="theme"
          inline-prompt
          active-text="dark &nbsp "
          inactive-text="&nbsp light"
          @change="themeChange"
          size="large"
        />
      </div>
      <div class="pl-4">
        <button @click="toEditor" class="btn-red">创作中心</button>
      </div>
      <div
        class="flex rounded-full hover:outline-none hover:ring-2 hover:ring-blue-300 hover:border-transparent hover:cursor-pointer mx-5"
        @click="handelClick"
      >
        <el-avatar :src="store.avatarUrl"></el-avatar>
      </div>
      <div class="w-32 flex-grow"></div>
    </el-menu>
  </div>
</template>
<style scoped lang="pcss">
.el-switch {
  --el-switch-on-color: white;
  --el-switch-off-color: white;
  --el-switch-border-color: gray;
}

::v-deep .el-switch__core .el-switch__action {
  background-color: #000;
}

::v-deep .el-switch__core .el-switch__inner .is-text {
  color: black;
}

.el-avatar {
  width: 40px;
  height: 40px;
  transition-duration: 0.5s;
}

.el-avatar:hover {
  width: 45px;
  height: 45px;
}

.el-menu-item {
  padding: 0 20px;
  transition-property: all;
  transition-duration: 0.5s;
  @apply dark:text-white;
}
.el-menu-item:hover {
  font-size: large;
  padding: 0 30px;
}

::v-deep .searchInput {
  padding: 0;
  transition-property: padding;
  transition-duration: 0.5s;
}

::v-deep .searchInput:hover {
  padding: 10px 0;
}
</style>
