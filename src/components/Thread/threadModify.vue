<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { updateThread } from '../../api/thread'
import { getPostApi } from '../../api/post'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import router from '../../router/router'
import { Thread } from '../../stores/store'

const thread = JSON.parse(localStorage.getItem('thread') as string) as Thread
const localText = localStorage.getItem('threadModifyText')
const threadModifyText = ref<string>(
  localText === null ? thread.content : localText
)
const editorHeight = ref<number>()

onMounted(() => {
  editorHeight.value =
    window.innerHeight -
    10 * parseFloat(getComputedStyle(document.documentElement).fontSize)
})

const textChange = () => {
  localStorage.setItem('threadModifyText', threadModifyText.value)
}

const textSave = () => {}

const doPublish = () => {
  if (threadModifyText.value === '') {
    ElMessage.warning({
      message: '您还没有写一些内容',
      offset: 80
    })
    return
  }

  const data = JSON.stringify({
    content: threadModifyText.value,
    res_long: marked(threadModifyText.value)
  })
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
  updateThread(thread.id, data, config).then(async res => {
    if (res.data.code === 200) {
      ElMessage.success({
        message: '发布成功',
        offset: 80
      })
      await getPostApi(res.data.data.thread.post_id, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      }).then(result => {
        thread.post = result.data.data.post
      })
      localStorage.removeItem('threadModifyText')
      localStorage.setItem('thread', JSON.stringify(thread))
      router.push({
        name: 'thread',
        params: {
          id: res.data.data.thread.id
        }
      })
    }
  })
}

const getPost = () => {
  const url = router.resolve({
    name: 'post',
    params: {
      id: thread.id
    }
  }).href
  window.open(url)
}
</script>
<template>
  <div class="ct-bg">
    <!-- header -->
    <div id="header" class="px-8 h-16 w-full flex justify-end items-center">
      <p class="text-2xl font-bold flex-grow truncate">
        原帖：{{ thread.post.title }}
      </p>
      <button
        class="btn-gray-auto px-4 m-0 bg-gray-300 text-black hover:bg-gray-400 hover:text-black"
        @click="getPost"
      >
        查看原帖
      </button>

      <button class="btn-red-large ml-4" @click="doPublish">发布</button>
    </div>
    <div class="w-full px-8">
      <v-md-editor
        :height="`${editorHeight}px`"
        v-model="threadModifyText"
        @change="textChange"
        @save="textSave"
      >
      </v-md-editor>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
