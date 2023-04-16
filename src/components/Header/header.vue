<script setup lang="ts">
import { ref, getCurrentInstance, defineEmits } from 'vue'
import { useStore } from '../../stores/store'
import router from '../../router/router'
import SearchIcon from '../../assets/search.svg'
import { useRoute } from 'vue-router'

const store = useStore()
const searchText = ref('')
const theme = ref(localStorage.getItem('theme') === 'dark' ? true : false)

const handelClick = () => {
  if (!localStorage.getItem('token')) {
    router.push('/login')
  } else {
    router.push('/personal')
  }
}

const themeChange = () => {
  if (theme.value) {
    localStorage.setItem('theme', 'dark')
    document.documentElement.classList.add('dark')
    store.theme = 'dark'
  } else {
    localStorage.setItem('theme', 'light')
    document.documentElement.classList.remove('dark')
    store.theme = 'light'
  }
}

const toEditor = () => {
  if (!localStorage.getItem('editorMdText')) {
    localStorage.setItem(
      'editorMdText',
      JSON.stringify({
        title: '',
        content: ''
      })
    )
  }
  router.push('/editor')
}

const toSearch = (e: any) => {
  router.push({
    name: 'search',
    query: {
      text: searchText.value,
      mode: 'text'
    }
  })
  searchText.value = ''
}
</script>
<template>
  <div class="fixed top-0 z-10 w-full shadow-md dark:shadow-white-md">
    <el-menu
      class="flex items-center transition-all duration-500 dark:border-gray-800 dark:bg-black dark:text-gray-200"
      mode="horizontal"
      router
    >
      <div class="w-32 flex-grow"></div>
      <el-menu-item
        index="/"
        class="py-0 px-4 transition-all duration-500 hover:py-6"
        >首页</el-menu-item
      >
      <div class="mx-8">
        <el-input
          v-model.trim="searchText"
          placeholder="search something..."
          @keyup.enter.native="toSearch"
        >
          <template #suffix>
            <img :src="SearchIcon" class="hover:cursor-pointer" />
          </template>
        </el-input>
      </div>
      <el-menu-item index="/article" class="">文章</el-menu-item>
      <el-menu-item index="/post" class="">帖子</el-menu-item>
      <el-menu-item index="/thread" class="">跟帖</el-menu-item>
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
        class="flex flex-shrink-0 justify-center items-center mx-5 w-10 h-10"
        @click="handelClick"
      >
        <img
          :src="store.avatarUrl"
          class="w-8 h-8 rounded-full hover:w-10 hover:h-10 hover:outline-none hover:ring-1 hover:ring-gray-300 hover:border-transparent hover:cursor-pointer transition-all duration-500 ease-in-out"
          alt=""
        />
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
