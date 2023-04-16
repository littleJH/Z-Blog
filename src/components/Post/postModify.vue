<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import router from '../../router/router'
import AlertCard from '../alertCard.vue'
import { updatePost, deletePost } from '../../api/post'
import { createPostLabelApi, deletePostLabelApi } from '../../api/label'
import { getPostLikeListApi, getPostLikedApi } from '../../api/like'
import { getPostFavListApi, getPostFavoritedApi } from '../../api/favorite'
import { setPostLevelApi } from '../../api/visible'

const post = JSON.parse(localStorage.getItem('post') as string)
const title = ref<string>(post.title)
const localText = localStorage.getItem('postModifyText')
const labels = ref<Array<string>>(post.labels)
const showDialog = ref<boolean>(false)
const confirmDeleteText = ref<string>('')
const postModifyText = ref<string>(
  localText === null ? post.content : localText
)
const editorHeight = ref<number>()
const visiableLevel = ref<string>(post.level)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
onMounted(() => {
  editorHeight.value =
    window.innerHeight -
    10 * parseFloat(getComputedStyle(document.documentElement).fontSize)
})

const textChange = () => {
  localStorage.setItem('postModifyText', postModifyText.value)
}

const textSave = () => {}

const confirmDelete = () => {
  if (confirmDeleteText.value !== title.value) {
    const el = document.getElementById('confirmInput') as HTMLElement
    el.classList.add('ring-2', 'ring-red-500')
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-red-500')
    }, 1000)
    return
  }
  deletePost(post.id, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  }).then(res => {
    console.log(res.data)
    if (res.data.code === 200) {
      ElMessage.success({
        message: '已删除该文章',
        offset: 80
      })
      router.push('/post')
    }
  })
}

const doPublish = () => {
  if (title.value === '') {
    const el = document.getElementById('inputTitle') as HTMLElement
    el.classList.add('ring-2', 'ring-red-500')
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-red-500')
    }, 1000)
    ElMessage.warning({
      message: '您还没有起一个标题',
      offset: 80
    })
    return
  }
  if (postModifyText.value === '') {
    const el = document.getElementById('mdBody') as HTMLElement
    el.classList.add('ring-2', 'ring-red-500')
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-red-500')
    }, 1000)
    return
  }

  const data = JSON.stringify({
    title: title.value,
    content: postModifyText.value,
    res_long: marked(postModifyText.value)
  })
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
  updatePost(post.id, data, config).then(async res => {
    if (res.data.code === 200) {
      const post = res.data.data.post
      setPostLevelApi(post.id, visiableLevel.value, config).then(res => {
        console.log(res)
      })
      for (let item of labels.value) {
        await createPostLabelApi(
          post.id,
          JSON.stringify({ label: item }),
          config
        )
      }
      ElMessage.success({
        message: '发布成功',
        duration: 5000
      })
      post.labels = labels.value
      Promise.all([
        getPostLikedApi(post.id, config),
        getPostFavoritedApi(post.id, config),
        getPostLikeListApi(post.id, config),
        getPostFavListApi(post.id, config)
      ]).then(res => {
        post.likeFlag = res[0].data.data.flag
        post.favoriteFlag = res[1].data.data.flag
        post.likeNum = res[2].data.data.total
        post.favNum = res[3].data.data.total
        localStorage.removeItem('postModifyText')
        localStorage.setItem('post', JSON.stringify(post))
        router.push({
          name: 'post',
          params: {
            id: post.id
          }
        })
      })
    }
  })
}

const removeLabel = (value: any) => {
  value = value.replaceAll('+', '%2B')
  deletePostLabelApi(post.id, value, config).then(res => {
    console.log(res.data)
  })
}
</script>
<template>
  <div class="ct-bg">
    <!-- header -->
    <div id="header" class="pr-8 h-16 w-full flex items-center">
      <button class="btn-gray-auto mr-2" @click="showDialog = true">
        删除这篇帖子
      </button>
      <input
        id="inputTitle"
        v-model="title"
        placeholder="标题"
        type="text"
        class="h-12 flex-grow text-2xl mr-8 rounded px-4 input-focus"
      />

      <span class="rounded transition-all duration-500 ease-in-out">
        <el-select
          v-model="labels"
          multiple
          collapse-tags
          collapse-tags-tooltip
          filterable
          allow-create
          size="large"
          placeholder="选择或自定义标签"
          @remove-tag="removeLabel"
        >
          <el-option label="HTML" value="HTML"></el-option>
          <el-option label="JavaScript" value="JavaScript"></el-option>
          <el-option label="C++" value="C++"></el-option>
        </el-select>
      </span>
      <span class="ml-4">
        <el-select
          placeholder="所有人可见"
          size="large"
          v-model="visiableLevel"
        >
          <el-option label="所有人可见" value="1"></el-option>
          <el-option label="好友圈可见" value="2"></el-option>
          <el-option label="仅自己可见" value="3"></el-option>
        </el-select>
      </span>
      <button class="btn-red-large ml-4" @click="doPublish">发布</button>
    </div>
    <div class="w-full px-8">
      <v-md-editor
        :height="`${editorHeight}px`"
        v-model="postModifyText"
        @change="textChange"
        @save="textSave"
      >
      </v-md-editor>
    </div>
  </div>
  <Transition
    enter-active-class="animate__animated animate__fadeInDownBig"
    leave-active-class="animate__animated animate__fadeOutUpBig"
  >
    <AlertCard v-if="showDialog" @close-dialog="showDialog = false">
      <div class="min-h-max min-w-max pb-8 flex flex-col items-center text-lg">
        <p>
          <span>请键入标题</span>
        </p>
        <p>
          <span class="font-bold">“{{ title }}”</span>
        </p>
        <p>
          <span>以确认删除</span>
        </p>
        <input
          id="confirmInput"
          v-model="confirmDeleteText"
          class="rounded p-2 mx-16 input-focus"
          type="text"
        />
        <button class="btn-red-large" @click="confirmDelete">确认</button>
      </div>
    </AlertCard>
  </Transition>
</template>
<style scoped lang="less"></style>
