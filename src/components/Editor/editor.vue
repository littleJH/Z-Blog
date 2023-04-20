<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { createArticleApi } from '../../api/article'
import { createPost } from '../../api/post'
import { createArticleLabelApi, createPostLabelApi } from '../../api/label'
import { setArticleLevelApi, setPostLevelApi } from '../../api/visible'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import router from '../../router/router'
import { useFileSystemAccess } from '@vueuse/core'
import { Article, Post } from '../../stores/store'

const editorMdText = JSON.parse(localStorage.getItem('editorMdText') as string)
const title = ref<string>(editorMdText === null ? '' : editorMdText.title)
const content = ref<string>(editorMdText === null ? '' : editorMdText.content)
const editorHeight = ref<number>()
const publishMode = ref<string>('')
const labels = ref<Array<string>>([])
const visiableLevel = ref<string>('1')

const res = useFileSystemAccess({
  dataType: 'Text',
  types: [
    {
      description: 'text',
      accept: {
        'text/plain': ['.txt', '.md']
      }
    }
  ],
  excludeAcceptAllOption: true
})

const onOpen = async () => {
  await res.open()
  content.value = res.data.value as string
  title.value = res.fileName.value.slice(0, res.fileName.value.lastIndexOf('.'))
}
const onSave = async () => {
  res.data.value = content.value
  await res.save()
}
onMounted(() => {
  editorHeight.value =
    window.innerHeight -
    10 * parseFloat(getComputedStyle(document.documentElement).fontSize)
  window.onresize = () => [
    (editorHeight.value =
      window.innerHeight -
      10 * parseFloat(getComputedStyle(document.documentElement).fontSize))
  ]
})

const change = () => {
  localStorage.setItem(
    'editorMdText',
    JSON.stringify({
      title: title.value,
      content: content.value
    })
  )
}

const doPublish = () => {
  if (title.value === '') {
    const el = document.getElementById('inputTitle') as HTMLElement
    el.classList.add('ring-2', 'ring-red-500')
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-red-500')
    }, 1000)

    return
  }
  if (content.value === '') {
    const el = document.getElementById('mdBody') as HTMLElement
    el.classList.add('ring-2', 'ring-red-500')
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-red-500')
    }, 1000)

    return
  }

  if (publishMode.value === '') {
    const el = document.getElementById('selectMode') as HTMLElement
    el.classList.add('ring-2', 'ring-red-500')
    setTimeout(() => {
      el.classList.remove('ring-2', 'ring-red-500')
    }, 1000)
    return
  }

  const data = JSON.stringify({
    title: title.value,
    content: content.value,
    res_long: marked(content.value)
  })
  const config = {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    }
  }
  if (publishMode.value === 'article') {
    createArticleApi(data, config).then(res => {
      if (res.data.code === 200) {
        const article = res.data.data.article as Article
        setArticleLevelApi(article.id, visiableLevel.value, config)
        if (labels.value.length === 0) {
          router.push({
            name: 'article',
            params: {
              id: res.data.data.article.id
            }
          })
        } else {
          labels.value.forEach(item => {
            createArticleLabelApi(
              article.id,
              JSON.stringify({
                label: item
              }),
              config
            ).then(result => {
              router.push({
                name: 'article',
                params: {
                  id: res.data.data.article.id
                }
              })
            })
          })
        }

        ElMessage.success({
          message: '发布成功',
          offset: 80
        })
        Object.assign(article, labels.value)
        localStorage.setItem('article', JSON.stringify(article))
        localStorage.removeItem('editorMdText')
      }
    })
  } else if (publishMode.value === 'post') {
    createPost(data, config).then(res => {
      if (res.data.code === 200) {
        const post = res.data.data.post as Post
        const formData = new FormData()
        formData.append('Level', visiableLevel.value)
        setPostLevelApi(post.id, formData, config)
        if (labels.value.length === 0) {
          router.push({
            name: 'post',
            params: {
              id: res.data.data.post.id
            }
          })
        } else {
          labels.value.forEach(item => {
            createPostLabelApi(
              post.id,
              JSON.stringify({ label: item }),
              config
            ).then(result => {
              router.push({
                name: 'post',
                params: {
                  id: res.data.data.post.id
                }
              })
            })
          })
        }

        ElMessage.success({
          message: '发布成功',
          offset: 80
        })
        Object.assign(post, labels.value)
        localStorage.removeItem('editorMdText')
        localStorage.setItem('post', JSON.stringify(post))
      }
    })
  }
}
</script>
<template>
  <div class="ct-bg">
    <!-- header -->
    <div id="header" class="px-8 h-16 w-full flex items-center">
      <input
        id="inputTitle"
        v-model="title"
        placeholder="标题"
        type="text"
        class="h-12 flex-grow text-2xl mr-8 rounded px-4 input-focus"
        @change="change"
      />
      <span class="mx-2">
        <el-tooltip content="打开本地文件(.txt、.md)">
          <svg
            t="1680057481742"
            class="icon hover:cursor-pointer"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1476"
            width="32"
            height="32"
            @click="onOpen"
          >
            <path
              d="M160.4 908.8c-22.7 0-41.1-18-41.7-40.4l81.8-457.2V410c0-22.9 18.7-41.5 41.8-41.5h674.5c22.6 0 41.1 18 41.8 40.4l-81.8 457.2v1.2c0 22.9-18.7 41.5-41.8 41.5H160.4z"
              fill="#F5A623"
              p-id="1477"
            ></path>
            <path
              d="M200.6 313.4h654.5v-64.8c0-29.4-22.1-53.2-49.4-53.2H435.3l-74.1-79.8h-247c-27.3 0-49.4 23.8-49.4 53.2v638.3l80.8-440.4c0.1-29.4 24.8-53.3 55-53.3"
              fill="#F5A623"
              p-id="1478"
            ></path>
          </svg>
        </el-tooltip>
      </span>
      <span class="mr-4">
        <el-tooltip content="保存">
          <svg
            t="1680057672022"
            class="icon hover:cursor-pointer"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4304"
            width="32"
            height="32"
            @click="onSave"
          >
            <path
              d="M292.571429 121.904762v243.809524h438.857142V145.578667l170.666667 175.225904V828.952381a73.142857 73.142857 0 0 1-73.142857 73.142857h-97.52381V536.380952H292.571429v365.714286H195.047619a73.142857 73.142857 0 0 1-73.142857-73.142857V195.047619a73.142857 73.142857 0 0 1 73.142857-73.142857h97.52381z m365.714285 512v268.190476H365.714286V633.904762h292.571428z m-48.761904 48.761905h-195.04762v73.142857h195.04762v-73.142857z m48.761904-560.761905v170.666667H365.714286V121.904762h292.571428z"
              p-id="4305"
              fill="#F5A623"
            ></path>
          </svg>
        </el-tooltip>
      </span>
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

      <span id="selectMode" class="ml-4">
        <el-select v-model="publishMode" placeholder="发布为" size="large">
          <el-option label="发布为文章" value="article"> </el-option>
          <el-option label="发布为帖子" value="post"></el-option>
        </el-select>
      </span>

      <button class="btn-red-large ml-4" @click="doPublish">发布</button>
    </div>
    <div class="w-full px-8">
      <div id="mdBody" class="transition-all duration-500 ease-in-out rounded">
        <v-md-editor
          :height="`${editorHeight}px`"
          v-model="content"
          left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code"
          @change="change"
          @save="onSave"
        >
        </v-md-editor>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
