<script setup lang="ts">
import { defineProps, ref, defineEmits } from 'vue'
import { Message } from '../stores/store'
import router from '../router/router'
import { useStore } from '../stores/store'

const props = defineProps(['message', 'index', 'mode'])
const emit = defineEmits(['deleteMsg', 'updateMsg'])
const store = useStore()
const message = props.message as Message
const toUserpage = () => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: message.user_id
    }
  })
}

const modifyMsg = async () => {
  emit('updateMsg', { index: props.index })
  const { updateMsgApi } = await import('../api/guestbook')
}
</script>
<template>
  <div class="bg-white p-2 dark:bg-deepBlack">
    <div class="flex items-center mb-4">
      <div class="flex-grow flex items-center">
        <div class="">
          <img
            class="rounded-full w-12 h-12 border border-gray-300 hover:cursor-pointer hover:shadow-md transition-all duration-500 ease-in-out"
            @click="toUserpage"
            :src="`http://icon.mgaronya.com/${message.userInfo.Icon}`"
            alt=""
          />
        </div>
        <div class="ml-4">
          <p class="font-bold">{{ message.userInfo.Name }}</p>
          <p class="text-gray-500 text-xs">{{ message.created_at }}</p>
        </div>
      </div>
      <div>
        <span class="w-8 h-8 flex justify-center items-center">
          <svg
            v-if="props.mode === 'self'"
            @click="emit('deleteMsg')"
            t="1680750464826"
            class="icon h-6 w-6 hover:h-8 hover:w-8 hover:cursor-pointer transition-all duration-500 ease-in-out"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2905"
            width="32"
            height="32"
          >
            <path
              d="M632.917333 572.672l165.290667 165.248a42.624 42.624 0 0 1-60.288 60.288l-165.248-165.290667a42.624 42.624 0 0 1 60.245333-60.245333z m-346.88 225.536a42.624 42.624 0 0 1-60.245333-60.288L451.754667 512 225.792 286.08a42.624 42.624 0 1 1 60.288-60.288L512 451.754667l225.92-225.962667a42.624 42.624 0 1 1 60.288 60.288L286.08 798.208z"
              fill="#EF4444"
              p-id="2906"
            ></path>
          </svg>
          <svg
            v-if="
              mode === 'user' && message.userInfo.Name === store.userInfo?.Name
            "
            @click="modifyMsg"
            t="1679904819720"
            class="icon h-6 w-6 hover:h-8 hover:w-8 hover:cursor-pointer transition-all duration-500 ease-in-out"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3437"
            width="24"
            height="24"
          >
            <path
              d="M300.8 723.2c0 12.8 0 19.2 6.4 25.6 6.4 6.4 12.8 6.4 19.2 6.4h6.4l172.8-44.8 448-448c19.2-19.2 32-51.2 0-83.2l-64-64c-32-32-64-32-96 6.4l-448 435.2-44.8 166.4zM825.6 160c6.4-6.4 19.2-6.4 25.6 0l44.8 44.8c6.4 6.4 6.4 19.2 0 25.6l-44.8 44.8-70.4-70.4 44.8-44.8zM736 249.6l70.4 70.4-313.6 313.6-70.4-70.4L736 249.6zM384 608l64 64-83.2 19.2L384 608z m544-204.8c-25.6 0-38.4 12.8-38.4 25.6v409.6c0 19.2-19.2 38.4-38.4 38.4H166.4c-19.2 0-38.4-19.2-38.4-38.4V179.2c0-19.2 19.2-38.4 38.4-38.4h448c12.8 0 25.6-12.8 25.6-32s-12.8-32-32-32H160c-51.2 0-96 44.8-96 96v678.4c0 51.2 44.8 96 96 96h704c51.2 0 96-44.8 96-96v-416c0-19.2-12.8-32-32-32z"
              fill="#000"
              p-id="3438"
            ></path>
          </svg>
        </span>
      </div>
    </div>
    <p
      class="text-gray-700 mb-4 bg-gray-100 rounded p-4 dark:bg-shallowBlack dark:text-gray-300"
    >
      {{ message.content }}
    </p>
  </div>
</template>
<style scoped lang="less"></style>
