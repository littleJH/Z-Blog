<script setup lang="ts">
import { defineProps } from 'vue'
import router from '../router/router'
import levelCard from './levelCard.vue'

const { user } = defineProps(['user'])

const toUserpage = () => {
  router.push({
    name: 'userArticleList',
    params: {
      userId: user.ID
    }
  })
}
</script>
<template>
  <div
    @click="toUserpage()"
    class="p-2 flex items-center justify-start rounded hover:bg-red-100 hover:cursor-pointer hover:shadow-md transition-all ease-in-out"
  >
    <img
      class="h-16 w-16 mr-4 rounded-full border border-gray-300"
      :src="`http://icon.mgaronya.com/${user.Icon}`"
      alt=""
    />
    <div class="flex-grow">
      <p class="flex items-center">
        <span class="font-bold">{{ user.Name }}</span>
        <span>
          <svg
            v-if="!user.Sex"
            t="1681033499431"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2646"
            width="16"
            height="16"
          >
            <path
              d="M750.336 213.333H640A42.667 42.667 0 0 1 640 128h213.333A42.667 42.667 0 0 1 896 170.667V384a42.667 42.667 0 0 1-85.333 0V273.664l-144.811 144.81a298.667 298.667 0 1 1-60.33-60.33l144.81-144.81z m-323.67 597.334a213.333 213.333 0 1 0 0-426.667 213.333 213.333 0 0 0 0 426.667z"
              p-id="2647"
              fill="#1296db"
            ></path>
          </svg>
          <svg
            v-else
            t="1681033599496"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3754"
            width="16"
            height="16"
          >
            <path
              d="M712.8 548.8c53.6-53.6 83.2-125 83.2-200.8 0-75.9-29.5-147.2-83.2-200.8C659.2 93.6 587.8 64 512 64s-147.2 29.5-200.8 83.2C257.6 200.9 228 272.1 228 348c0 63.8 20.9 124.4 59.4 173.9 7.3 9.4 15.2 18.3 23.7 26.9 8.5 8.5 17.5 16.4 26.8 23.7 39.6 30.8 86.3 50.4 136.1 57V736H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h114v140c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V812h114c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H550V629.5c61.5-8.2 118.2-36.1 162.8-80.7zM512 556c-55.6 0-107.7-21.6-147.1-60.9C325.6 455.8 304 403.6 304 348s21.6-107.7 60.9-147.1C404.2 161.5 456.4 140 512 140s107.7 21.6 147.1 60.9C698.4 240.2 720 292.4 720 348s-21.6 107.7-60.9 147.1C619.7 534.4 567.6 556 512 556z"
              fill="#EF4444"
              p-id="3755"
            ></path>
          </svg>
        </span>
        <span v-if="user.Address">
          <span class="divider-vertical h-2"></span>
          <span>{{ user.Address }}</span>
        </span>

        <levelCard :hot-level="user.HotLevel"></levelCard>
        <slot></slot>
      </p>
      <p class="">
        <span>{{ user.Email }}</span>
      </p>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
