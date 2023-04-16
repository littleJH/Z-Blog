<script setup lang="ts">
import router from '../../../router/router'
import {
  getArticleHistoryApi,
  getPostHistoryApi,
  getZipfileHistoryApi
} from '../../../api/history'
import { userinfoApi } from '../../../api/user'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { Article, History } from '../../../stores/store'
import moment from 'moment'
import articleCard from '../../articleCard.vue'
import postCard from '../../postCard.vue'
import { getArticleApi } from '../../../api/article'
import pagination from '../../pagination.vue'
import { getPostApi } from '../../../api/post'

const range = ref<'day' | 'mounth' | 'year' | 'all'>('day')
const mode = ref<'article' | 'post'>('article')
let list: Array<History>
const historyList = reactive({
  list: [] as Array<History>
})
const total = ref<number>(0)
const pageNum = ref<number>(1)
const pageSize = 5
const loading = ref<boolean>(true)
const showNone = ref<boolean>(false)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getArticleList()
})

const getArticleList = () => {
  const time = caculateTime()
  loading.value = true
  historyList.list.length = 0
  getArticleHistoryApi(config, time.start, time.end).then(async res => {
    console.log(res)
    list = res.data.data.articleHistorys
    if (list) {
      total.value = list.length
      const historys = [] as Array<History>
      let index = (pageNum.value - 1) * pageSize
      for (let item of list) {
        if (
          index < pageNum.value * pageSize &&
          index >= (pageNum.value - 1) * pageSize &&
          index < total.value
        ) {
          await getArticleApi(list[index].article_id, config).then(result => {
            if (result.data.data) {
              item.article = result.data.data.article
              historys.push(item)
            } else {
              historys.push(item)
            }
            index++
          })
        }
      }
      historyList.list = historys
    } else showNone.value = true
    loading.value = false
  })
}
const getPostList = () => {
  const time = caculateTime()
  loading.value = true
  historyList.list.length = 0
  getPostHistoryApi(config, time.start, time.end).then(async res => {
    console.log(res)
    list = res.data.data.postHistorys
    if (list) {
      total.value = list.length
      const historys = [] as Array<History>
      let index = (pageNum.value - 1) * pageSize
      for (let item of list) {
        if (
          index < pageNum.value * pageSize &&
          index >= (pageNum.value - 1) * pageSize &&
          index < total.value
        ) {
          await getPostApi(list[index].post_id, config).then(result => {
            if (result.data.data) {
              item.post = result.data.data.post
              historys.push(item)
            } else {
              historys.push(item)
            }
            index++
          })
        }
      }
      historyList.list = historys
    } else showNone.value = true
    loading.value = false
  })
}
const getZipfileList = () => {}

const pageChange = (value: any) => {
  pageNum.value = value.page
  if (mode.value === 'article') {
    getArticleList()
  } else if (mode.value === 'post') {
    getPostList()
  }
}

const rangeChange = (val: any) => {
  list.length = 0
  if (mode.value === 'article') {
    getArticleList()
  } else if (mode.value === 'post') {
    getPostList()
  }
}

const modeChange = (val: any) => {
  list.length = 0
  if (val === 'article') {
    getArticleList()
  } else if (val === 'post') {
    getPostList()
  }
}

const caculateTime = (): any => {
  const endTime = moment(new Date())
  const end = endTime.format('YYYY/MM/DD')
  let start
  if (range.value === 'day') {
    start = endTime.subtract('days', 3).format('YYYY/MM/DD')
  } else if (range.value === 'mounth') {
    start = endTime.subtract('month', 1).format('YYYY/MM/DD')
  } else if (range.value === 'year') {
    start = endTime.subtract('month', 6).format('YYYY/MM/DD')
  } else {
    start = endTime.subtract('years', 10).format('YYYY/MM/DD')
  }
  return { start, end }
}
</script>
<template>
  <div class="flex min-h-max items-center mb-4">
    <div class="font-bold flex-grow">游览历史记录</div>
    <div class="">
      <el-select v-model="range" @change="rangeChange" style="width: 100px">
        <el-option label="近三天" value="day"></el-option>
        <el-option label="近一月" value="mounth"></el-option>
        <el-option label="近半年" value="year"></el-option>
        <el-option label="全部" value="all"></el-option>
      </el-select>
      <el-select
        v-model="mode"
        @change="modeChange"
        style="width: 100px; margin-left: 1rem"
      >
        <el-option label="文章" value="article"></el-option>
        <el-option label="帖子" value="post"></el-option>
      </el-select>
    </div>
  </div>
  <el-skeleton :rows="6" :loading="loading" animated></el-skeleton>

  <div v-if="mode === 'article'">
    <TransitionGroup name="list">
      <div
        class="relative"
        v-for="(item, index) in historyList.list"
        :key="index"
      >
        <p class="divider" v-if="index !== 0"></p>
        <articleCard v-if="item.article" :article="item.article">
          <span
            class="px-2 py-1 rounded bg-red-100 text-gray-700 text-bold text-xs flex items-center"
          >
            游览于：{{ item?.created_at }}
          </span>
        </articleCard>
        <div v-else class="py-2 mx-2 my-8 bg-gray-100 rounded flex">
          <span class="flex-grow px-4"> 哦豁~文章不在啦！ </span>
          <span
            class="px-2 py-1 rounded bg-red-100 text-gray-700 text-bold text-xs"
          >
            游览于：{{ item?.created_at }}
          </span>
        </div>
      </div>
    </TransitionGroup>
  </div>
  <div v-else-if="mode === 'post'">
    <TransitionGroup name="list">
      <div
        class="relative"
        v-for="(item, index) in historyList.list"
        :key="index"
      >
        <p class="divider" v-if="index !== 0"></p>
        <postCard v-if="item.post" :post="item.post">
          <span
            class="px-2 py-1 rounded bg-red-100 text-gray-700 text-bold text-xs flex items-center"
          >
            游览于：{{ item?.created_at }}
          </span>
        </postCard>
        <div v-else class="py-2 mx-2 my-8 bg-gray-100 rounded flex">
          <span class="flex-grow px-4"> 哦豁~帖子不在啦！ </span>
          <span
            class="px-2 py-1 rounded bg-red-100 text-gray-700 text-bold text-xs"
          >
            游览于：{{ item?.created_at }}
          </span>
        </div>
      </div>
    </TransitionGroup>
  </div>

  <pagination
    v-if="!loading"
    :total="total"
    :page-num="pageNum"
    :page-size="pageSize"
    @page-change="pageChange"
  ></pagination>
  <div v-if="showNone" class="show-none text-gray-500">空空如也~</div>
</template>
<style scoped lang="less"></style>
