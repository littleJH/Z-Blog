<script setup lang="ts">
import {
  getFriendListApi,
  deleteFriendApi,
  acceptAppliedApi
} from '../../../api/friend'
import { userinfoApi } from '../../../api/user'
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { User } from '../../../stores/store'
import UserCard from '../../userCard.vue'
import alertCard from '../../alertCard.vue'

const friendList = reactive({
  list: [] as Array<User>
})
const showNone = ref<boolean>(false)
const showDialog = ref<boolean>(false)
const loading = ref<boolean>(true)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
onBeforeMount(() => {
  getFriendListApi(config).then(async res => {
    console.log(res)
    const list = [] as Array<User>
    for (let item of res.data.data.friends) {
      await userinfoApi(item, config).then(result => {
        result.data.data.user.ID = item
        list.push(result.data.data.user)
      })
    }
    friendList.list = list
    loading.value = false
    if (friendList.list.length === 0) showNone.value = true
  })
})

const deleteFriend = (index: number) => {
  deleteFriendApi(friendList.list[index].ID, config).then(res => {
    if (res.data.code === 200) {
      friendList.list.splice(index, 1)
    }
  })
}
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated></el-skeleton>
  <TransitionGroup name="list" tag="div">
    <div
      v-for="(item, index) in friendList.list"
      :key="item.ID"
      class="flex items-center justify-center"
    >
      <div class="flex-grow">
        <UserCard :user="item"></UserCard>
      </div>
      <span class="w-12 h-12 flex justify-center items-center">
        <svg
          @click="showDialog = true"
          t="1680750464826"
          class="icon h-8 w-8 hover:h-12 hover:w-12 hover:cursor-pointer transition-all duration-500 ease-in-out"
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
      </span>
      <Transition
        enter-active-class="animate__animated animate__fadeInDownBig"
        leave-active-class="animate__animated animate__fadeOutUpBig"
      >
        <alertCard v-if="showDialog" @close-dialog="showDialog = false">
          <div class="p-4 pb-8 flex flex-col justify-center items-center">
            <p class="mb-4">
              <span>确认删除</span>
              <span class="font-bold">{{ item.Name }}？</span>
            </p>
            <button class="btn-red-large" @click="deleteFriend(index)">
              确认
            </button>
          </div>
        </alertCard>
      </Transition>
    </div>
  </TransitionGroup>

  <div class="mt-8 flex justify-center" v-if="showNone">空空如也~</div>
</template>
<style scoped lang="less"></style>
