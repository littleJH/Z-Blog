<script setup lang="ts">
import { useStore, Powerpoint } from '../../stores/store'
import { getArticlesApi, getPostsApi, getThreadsApi } from '../../api/user'
import { onBeforeMount, ref, reactive } from 'vue'
import { getSelfHotLevelApi, getSelfPptApi } from '../../api/hotspot'
import levelCard from '../levelCard.vue'
import { createUserLabelApi, getUserLabelApi } from '../../api/label'
import { ElMessage } from 'element-plus'
import alertCard from '../alertCard.vue'

const store = useStore()
const userInfo = reactive(
  localStorage.getItem('userInfo') !== null
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : ''
)
const articleNum = ref<number>(0)
const postNum = ref<number>(0)
const threadNum = ref<number>(0)
const hotLevel = ref<number>(0)
const showDialog = ref<boolean>(false)
const labelText = ref<string>('')
// const labelList = ref<Array<string>>([...userInfo.Labels])
const powerpoints = reactive({
  list: [] as Array<Powerpoint>
})

const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
onBeforeMount(async () => {
  await Promise.all([
    getArticlesApi(config, 0, 0),
    getPostsApi(config, 0, 0),
    getThreadsApi(config, 0, 0),
    getSelfHotLevelApi(config),
    getSelfPptApi(config)
  ]).then(result => {
    articleNum.value = result[0].data.data.total
    postNum.value = result[1].data.data.total
    threadNum.value = result[2].data.data.total
    hotLevel.value = result[3].data.data.Level
    powerpoints.list = result[4].data.data.powerpoints
  })
})
const clickIcon = () => {
  const a = document.createElement('a')
  a.href = `http://icon.mgaronya.com/${store.userInfo?.Icon}`
  a.click()
}

const addLabel = () => {
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
  const data = {
    label: labelText.value
  }
  createUserLabelApi(JSON.stringify(data), config).then(res => {
    if (res.data.code === 200) {
      showDialog.value = false
      getUserLabelApi(store.userInfo?.ID, config).then(res => {
        userInfo.Labels = res.data.data.labels
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
        store.userInfo = userInfo
      })

      ElMessage.success({
        message: '创建成功',
        offset: 80
      })
    }
  })
}

const onAfterEnter = () => {
  const el = document.querySelector('#textarea') as HTMLElement
  el.focus()
}
</script>
<template>
  <div class="w-full h-full flex flex-col items-center justify-center">
    <img
      @click="clickIcon"
      :src="`http://icon.mgaronya.com/${userInfo.Icon}`"
      class="w-32 h-32 rounded-full hover:shadow-lg hover:cursor-pointer hover:border-transparent transition-all ease-in-out"
    />
    <p class="flex items-center">
      <span class="text-xl font-bold p-4">{{ userInfo.Name }}</span>
      <levelCard :hot-level="hotLevel"></levelCard>
    </p>
    <p
      v-if="userInfo.Labels.length === 0"
      class="text-blue-500 hover:cursor-pointer"
      @click="showDialog = true"
    >
      +快来添加自己的座右铭吧！
    </p>
    <TransitionGroup name="list">
      <p v-for="item in userInfo.Labels">{{ item }}</p>
    </TransitionGroup>
    <Transition @after-enter="onAfterEnter">
      <alertCard v-if="showDialog" @close-dialog="showDialog = false">
        <div class="p-4 pb-8 flex flex-col justify-center items-center">
          <div>
            <textarea
              class="bg-white rounded p-2 input-focus"
              v-model="labelText"
              name=""
              id="textarea"
              cols="30"
              rows="2"
            ></textarea>
          </div>
          <div>
            <button class="btn-red-large mt-4" @click="addLabel">确定</button>
          </div>
        </div>
      </alertCard>
    </Transition>
  </div>

  <!-- <div class="numCtn w-full flex justify-center items-center">
    <span class="" @click="router.push('/article')"
      >文章：{{ articleNum }}</span
    >
    <span class="" @click="router.push('/post')">帖子：{{ postNum }}</span>
    <span class="" @click="router.push('/thread')">跟帖：{{ threadNum }}</span>
  </div> -->
</template>
<style scoped lang="less">
.numCtn {
  span {
    @apply px-8 text-gray-700 hover:cursor-pointer hover:underline hover:text-blue-500 transition-all duration-300 ease-in-out select-none;
  }
}
.infolist {
  div {
    @apply m-4 p-4 rounded bg-gray-100 hover:cursor-pointer hover:shadow-md transition-all duration-500 ease-in-out;
  }
}
</style>
