<script setup lang="ts">
import { defineProps, reactive, ref, onMounted } from 'vue'
import {
  userinfoApi,
  userArticlesApi,
  userPostsApi,
  userThreadsApi
} from '../../api/user'
import { getUserBoardApi } from '../../api/guestbook'
import { User } from '../../stores/store'
import router from '../../router/router'
import alertCard from '../alertCard.vue'
import { ElMessage } from 'element-plus'
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

const { userId } = defineProps(['userId'])
const userInfo = reactive<User>({} as User)
const route = useRoute()
const total = reactive({
  articles: 0,
  posts: 0,
  threads: 0,
  messages: 0
})
const btn1 = ref<string>('+好友')
const showDialog = ref<boolean>(false)
const leaveMsg = ref<string>('')
const activeNav = ref<
  'userArticleList' | 'userPostList' | 'userThreadList' | 'userMsgBoard'
>('userArticleList')
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  activeNav.value = route.name as any
  Promise.all([
    userArticlesApi(userId, config, 0, 0),
    userPostsApi(userId, config, 0, 0),
    userThreadsApi(userId, config, 0, 0),
    getUserBoardApi(userId, config, 0, 0),
    userinfoApi(userId, config)
  ]).then(res => {
    total.articles = res[0].data.data.total
    total.posts = res[1].data.data.total
    total.threads = res[2].data.data.total
    total.messages = res[3].data.data.total
    Object.assign(userInfo, res[4].data.data.user)
  })
})

const toArticle = () => {
  activeNav.value = 'userArticleList'
  router.push({
    name: 'userArticleList',
    params: {
      userId: userId
    }
  })
}

const toPost = () => {
  activeNav.value = 'userPostList'
  router.push({
    name: 'userPostList',
    params: {
      userId: userId
    }
  })
}

const toThread = () => {
  activeNav.value = 'userThreadList'
  router.push({
    name: 'userThreadList',
    params: {
      userId: userId
    }
  })
}

const toBoard = () => {
  activeNav.value = 'userMsgBoard'
  router.push({
    name: 'userMsgBoard',
    params: {
      userId: userId
    }
  })
}

// const showInput = () => {
//   showSearch.value = true
//   const el = document.getElementById('searchInput') as HTMLElement
//   el.classList.remove('w-0')
//   el.classList.add('w-56', 'border-b', 'border-solid', 'border-gray-500')
//   el.focus()
// }

const doSearth = () => {}
const addFriend = async () => {
  const { sendApplyingApi } = await import('../../api/friend')
  sendApplyingApi(userId, config).then(res => {
    if (res.data.code === 200) {
      btn1.value = '已发送'
    } else if (res.data.code === 400) {
      ElMessage.info({
        message: '你们已经是好友了',
        offset: 80
      })
    }
  })
}

const onAfterEnter = () => {
  const el = document.getElementById('textarea') as HTMLElement
  el.focus()
}

const leaveMessage = async () => {
  if (leaveMsg.value === '') {
    const el = document.getElementById('textarea') as HTMLElement
    el.classList.add('ring-2', 'ring-red-500')
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-red-500')
    }, 1000)
    return
  }
  const { leaveMsgApi } = await import('../../api/guestbook')
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
  const data = {
    content: leaveMsg.value
  }
  leaveMsgApi(userId, JSON.stringify(data), config).then(res => {
    console.log(res)
    if (res.data.code === 200) {
      ElMessage.success({
        message: '留言成功',
        offset: 80
      })
      showDialog.value = false
    }
  })
}
</script>
<template>
  <div class="ct-bg">
    <div class="max-w-screen-lg" style="min-width: 800px">
      <!-- user card -->
      <div class="my-8 p-4 shadow-md bg-white dark:bg-deepBlack">
        <div class="flex justify-start">
          <img
            :src="`http://icon.mgaronya.com/${userInfo.Icon}`"
            class="inline-block h-24 w-24 mx-4 rounded-full hover:cursor-pointer"
            alt=""
          />
          <div
            class="info flex flex-col justify-center text-gray-700 dark:text-gray-400"
          >
            <p class="h-12 flex items-center">
              <span class="text-xl font-bold">{{ userInfo.Name }}</span>
              <el-divider direction="vertical"></el-divider>
              <span>{{ userInfo.Email }}</span>
            </p>
            <p class="h-12 flex items-center">
              <button @click="addFriend" class="btn-blue-large">
                {{ btn1 }}
              </button>
              <button @click="showDialog = true" class="btn-red-large">
                留言
              </button>
            </p>
          </div>
        </div>
      </div>
      <!-- main body -->
      <div
        class="my-8 p-4 min-h-min shadow-md bg-white dark:bg-deepBlack"
        style="min-height: 300px"
      >
        <div class="navBar relative flex items-center min-h-max">
          <span
            id="article"
            @click="toArticle"
            :class="{ activeNav: activeNav === 'userArticleList' }"
            >文章({{ total.articles }})</span
          >
          <span
            id="post"
            @click="toPost"
            :class="{ activeNav: activeNav === 'userPostList' }"
            >帖子({{ total.posts }})</span
          >
          <span
            id="thread"
            @click="toThread"
            :class="{ activeNav: activeNav === 'userThreadList' }"
            >跟帖({{ total.threads }})</span
          >
          <span
            id="board"
            @click="toBoard"
            :class="{ activeNav: activeNav === 'userMsgBoard' }"
            >留言板({{ total.messages }})</span
          >
          <div class="absolute top-0 right-0 flex justify-center items-center">
            <input
              id="searchInput"
              type="text"
              placeholder="search something..."
              class="w-56 h-10 p-2 mr-4 bg-white bg-opacity-0 text-xl outline-none border-b border-solid border-gray-500"
              @keyup.enter.native="doSearth"
            />

            <div class="h-10 w-10 flex justify-center items-center">
              <svg
                t="1680336024935"
                class="icon h-8 w-8 hover:cursor-pointer hover:h-10 hover:w-10 transition-all duration-500 ease-in-out"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="14315"
                data-spm-anchor-id="a313x.7781069.0.i7"
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
            </div>
          </div>
        </div>
        <!-- body -->
        <div class="">
          <RouterView :userId="userId"></RouterView>
        </div>
      </div>
    </div>
  </div>
  <Transition @after-enter="onAfterEnter">
    <alertCard v-if="showDialog" @close-dialog="showDialog = false">
      <div class="p-4 pb-8 flex flex-col justify-center items-center">
        <div>
          <textarea
            class="bg-white rounded p-2 input-focus"
            v-model="leaveMsg"
            name=""
            id="textarea"
            cols="30"
            rows="3"
          ></textarea>
        </div>
        <div>
          <button class="btn-red-large mt-4" @click="leaveMessage">确定</button>
        </div>
      </div>
    </alertCard>
  </Transition>
</template>
<style scoped lang="less">
.info {
  span {
    @apply px-2;
  }
}
</style>
