<script setup lang="ts">
import {
  onMounted,
  ref,
  onBeforeMount,
  reactive,
  defineProps,
  watch
} from 'vue'
import {
  searchArticleApi,
  searchPostApi,
  searchZipfileApi,
  searchArticleInterApi,
  searchArticleUnionApi,
  searchPostInterApi,
  searchPostUnionApi,
  searchZipfileInterApi,
  searchZipfileUnionApi
} from '../../api/search'
import { searchUserEmailApi, searchUserNameApi } from '../../api/searchUser'
import nprogress from 'nprogress'
import { Article, Post, Zipfile, User } from '../../stores/store'
import ArticleCard from '../articleCard.vue'
import PostCard from '../postCard.vue'
import UserCard from '../userCard.vue'
import router from '../../router/router'
import { useRoute } from 'vue-router'

type Mode = 'text' | 'label' | 'text&label'

const { text, mode } = defineProps(['text', 'mode'])
const searchText = ref<string>(text)
const searchMode = ref<Mode>(mode)
const searchKind = ref<'article' | 'post' | 'zipfile' | 'user' | 'all'>('all')
const articleList = reactive({
  list: [] as Array<Article>
})
const postList = reactive({
  list: [] as Array<Post>
})
const zipfileList = reactive({
  list: [] as Array<Zipfile>
})
const userList = reactive({
  list: [] as Array<User>
})

const showNone = ref<boolean>(false)
const showKind = ref<boolean>(false)
const loading = ref<boolean>(true)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  doSearch()
  const route = useRoute()
  watch(route, () => {
    searchText.value = route.query.text as string
    searchMode.value = route.query.mode as Mode
    doSearch()
  })
})

const doSearch = async () => {
  showNone.value = false
  searchKind.value = 'all'
  nprogress.start()
  userList.list.length = 0
  if (searchMode.value === 'text') {
    await Promise.all([
      searchArticleApi(searchText.value, config),
      searchPostApi(searchText.value, config),
      searchZipfileApi(searchText.value, config),
      searchUserNameApi(searchText.value, config),
      searchUserEmailApi(searchText.value, config)
    ]).then(res => {
      articleList.list = res[0].data.data.articles
      postList.list = res[1].data.data.posts
      zipfileList.list = res[2].data.data.zipfiles
      if (res[3].data.data) {
        userList.list.push(res[3].data.data.user)
      }
      if (res[4].data.data) {
        userList.list.push(res[4].data.data.user)
      }
      nprogress.done()

      loading.value = false
    })
  } else if (searchMode.value === 'label') {
    const text = searchText.value.replaceAll('+', '%2B')
    await Promise.all([
      searchArticleUnionApi(text, config),
      searchPostUnionApi(text, config),
      searchZipfileUnionApi(text, config)
    ]).then(res => {
      console.log(res[0])
      articleList.list = res[0].data.data.articles
      postList.list = res[1].data.data.posts
      zipfileList.list = res[2].data.data.zipfiles
      nprogress.done()
      loading.value = false
    })
  } else if (searchMode.value === 'text&label') {
    await Promise.all([])
  }
  if (
    articleList.list.length === 0 &&
    postList.list.length === 0 &&
    zipfileList.list.length === 0 &&
    userList.list.length === 0
  ) {
    nprogress.done()
    showNone.value = true
  } else {
    showKind.value = true
  }
}

const toSearch = () => {
  router.push({
    name: 'search',
    query: {
      text: searchText.value,
      mode: searchMode.value
    }
  })
}

const modeChange = () => {
  router.push({
    name: 'search',
    query: {
      text: searchText.value,
      mode: searchMode.value
    }
  })
}
</script>
<template>
  <div class="ct-bg">
    <div
      class="p-4 min-h-min rounded-lg shadow-lg bg-white dark:bg-deepBlack"
      style="width: 1024px"
    >
      <div>
        <div class="flex">
          <span class="w-10 h-10 flex justify-center items-center">
            <svg
              @click="toSearch"
              t="1680336024935"
              class="icon h-8 w-8 hover:h-10 hover:w-10 hover:cursor-pointer transition-all ease-in-out duration-300"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="14315"
              data-spm-anchor-id="a313x.7781069.0.i7"
              width="32"
              height="32"
            >
              <path
                d="M869.484748 1024a96.009331 96.009331 0 0 1-76.327418-37.923686l-174.736982-228.982254a96.009331 96.009331 0 0 1 152.654836-116.651337l174.736982 228.982254a96.009331 96.009331 0 0 1-76.327418 154.094976z"
                fill="#D34233"
                p-id="14316"
              ></path>
              <path
                d="M770.595138 640.92277a96.009331 96.009331 0 0 0-100.809798-34.563359 240.023327 240.023327 0 0 1-57.605598 65.766391c-3.360327 2.400233-7.2007 4.32042-11.041074 6.720653a96.009331 96.009331 0 0 0 16.801633 79.687745l70.566859 92.649004a432.041989 432.041989 0 0 0 39.843872-26.882612A429.161709 429.161709 0 0 0 826.760596 715.810048z"
                fill="#C1211A"
                p-id="14317"
              ></path>
              <path
                d="M490.727938 864.144464a432.041989 432.041989 0 1 1 261.625427-88.328584A432.041989 432.041989 0 0 1 490.727938 864.144464zM490.727938 192.079148a240.023327 240.023327 0 1 0 192.018662 96.009331 240.023327 240.023327 0 0 0-192.018662-96.009331z"
                fill="#F16A54"
                p-id="14318"
                data-spm-anchor-id="a313x.7781069.0.i8"
                class="selected"
              ></path>
            </svg>
          </span>
          <input
            id="searchInput"
            v-model="searchText"
            class="ml-8 text-2xl flex-grow bg-opacity-0 focus:outline-none dark:bg-deepBlack"
            placeholder="Search something..."
            type="text"
            @keyup.enter.native="toSearch"
          />
          <el-select
            v-model="searchMode"
            effect="dark"
            placeholder=""
            size="large"
            class="w-36"
            @change="modeChange"
          >
            <el-option label="按文本搜索" value="text"></el-option>
            <el-option label="按标签搜索" value="label"></el-option>
          </el-select>
        </div>
      </div>
      <div class="my-4">
        <el-divider></el-divider>
      </div>
      <div class="flex justify-end items-center h-8">
        <div v-if="showKind">
          <el-select v-model="searchKind" placeholder="全部结果" class="w-28">
            <el-option label="全部结果" value="all"></el-option>
            <el-option label="文章" value="article"></el-option>
            <el-option label="帖子" value="post"></el-option>
            <el-option label="用户" value="user"></el-option>
            <el-option label="前端文件" value="zipfile"></el-option>
          </el-select>
        </div>
      </div>
      <el-skeleton v-if="loading" :rows="5" :loading="true" animated />

      <div>
        <TransitionGroup name="list">
          <div
            v-if="!(searchKind !== 'article' && searchKind !== 'all')"
            v-for="(item, index) in articleList.list"
            :key="item.id"
          >
            <div class="divider" v-if="index !== 0"></div>
            <ArticleCard :article="item"></ArticleCard>
          </div>
        </TransitionGroup>

        <TransitionGroup name="list">
          <div
            v-if="!(searchKind !== 'post' && searchKind !== 'all')"
            v-for="(item, index) in postList.list"
            :key="item.id"
          >
            <div class="divider" v-if="index !== 0"></div>

            <PostCard :post="item"></PostCard>
          </div>
        </TransitionGroup>

        <TransitionGroup name="list" tag="div">
          <div
            v-if="!(searchKind !== 'user' && searchKind !== 'all')"
            v-for="(item, index) in userList.list"
            :key="item.ID"
          >
            <div class="divider" v-if="index !== 0"></div>

            <UserCard :user="item"></UserCard>
          </div>
        </TransitionGroup>
      </div>
      <div
        class="flex justify-center m-8"
        v-if="
          showNone ||
          (searchKind === 'article' && articleList.list.length === 0) ||
          (searchKind === 'post' && postList.list.length === 0) ||
          (searchKind === 'zipfile' && zipfileList.list.length === 0) ||
          (searchKind === 'user' && userList.list.length === 0)
        "
      >
        这里什么都没有
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
::v-deep .el-divider--horizontal {
  margin: 0;
}
</style>
