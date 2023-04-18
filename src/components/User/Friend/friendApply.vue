<script setup lang="ts">
import { ref, reactive, onBeforeMount } from 'vue'
import {
  getFriendAppliedApi,
  acceptAppliedApi,
  refuseAppliedApi
} from '../../../api/friend'
import { userinfoApi } from '../../../api/user'
import { User } from '../../../stores/store'
import UserCard from '../../../components/userCard.vue'

const showNone = ref<boolean>(false)
const loading = ref<boolean>(true)
const applyList = reactive({
  list: [] as Array<User>
})
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
onBeforeMount(() => {
  getFriendAppliedApi(config).then(async res => {
    console.log(res)
    const list = [] as Array<User>
    for (let item of res.data.data.friends) {
      await userinfoApi(item, config).then(result => {
        console.log(result)
        result.data.data.user.ID = item
        list.push(result.data.data.user)
      })
    }
    applyList.list = list
    loading.value = false
    if (applyList.list.length === 0) showNone.value = true
  })
})

const deleteApply = (index: number) => {
  refuseAppliedApi(applyList.list[index].ID, config).then(res => {
    if (res.data.code === 200) {
      applyList.list.splice(index, 1)
    }
  })
}
const acceptApply = (index: number) => {
  acceptAppliedApi(applyList.list[index].ID, config).then(res => {
    if (res.data.code === 200) {
      applyList.list.splice(index, 1)
    }
  })
}
</script>
<template>
  <el-skeleton :rows="4" :loading="loading" animated></el-skeleton>
  <TransitionGroup name="list" tag="div">
    <div
      v-for="(item, index) in applyList.list"
      :key="item.ID"
      class="flex items-center"
    >
      <div class="flex-grow">
        <UserCard :user="item"></UserCard>
      </div>
      <span>
        <svg
          @click="deleteApply(index)"
          t="1680747567574"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="8245"
          width="32"
          height="32"
        >
          <path
            d="M512 949.333333C270.933333 949.333333 74.666667 753.066667 74.666667 512S270.933333 74.666667 512 74.666667 949.333333 270.933333 949.333333 512 753.066667 949.333333 512 949.333333z m-151.466667-292.266666c10.666667 10.666667 29.866667 12.8 42.666667 2.133333l2.133333-2.133333 104.533334-102.4 102.4 102.4 2.133333 2.133333c12.8 10.666667 32 8.533333 42.666667-2.133333 12.8-12.8 12.8-32 0-44.8L554.666667 509.866667l102.4-102.4 2.133333-2.133334c10.666667-12.8 8.533333-32-2.133333-42.666666s-29.866667-12.8-42.666667-2.133334l-2.133333 2.133334-102.4 102.4-102.4-102.4-2.133334-2.133334c-12.8-10.666667-32-8.533333-42.666666 2.133334-12.8 12.8-12.8 32 0 44.8l102.4 102.4-102.4 102.4-2.133334 2.133333c-10.666667 12.8-10.666667 32 0 42.666667z"
            fill="#EF4444"
            p-id="8246"
          ></path>
        </svg>
      </span>
      <span>
        <svg
          @click="acceptApply(index)"
          t="1680747433510"
          class="icon"
          viewBox="0 0 1098 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6581"
          width="32"
          height="32"
        >
          <path
            d="M476.808045 0.000043C213.401753 0.106685-0.031993 213.68973 0 477.074693S213.551052 953.98938 476.94668 954.021373s476.957344-213.412417 477.085315-476.808045A477.010665 477.010665 0 0 0 476.808045 0.000043z m273.761252 353.369671L441.861388 661.853674a43.1901 43.1901 0 0 1-62.023117 0L202.214984 484.251715a43.864079 43.864079 0 1 1 62.033781-62.033782l147.21959 147.21959 277.89897-276.86454a43.861946 43.861946 0 1 1 62.023117 62.033781z m0 0"
            p-id="6582"
            fill="#3B82F6"
          ></path>
        </svg>
      </span>
    </div>
  </TransitionGroup>

  <div class="mt-8 flex justify-center" v-if="showNone">空空如也~</div>
</template>
<style scoped lang="less">
span {
  @apply h-12 w-12 flex justify-center items-center;
}
svg {
  @apply h-8 w-8 hover:cursor-pointer hover:h-12 hover:w-12 transition-all ease-in-out duration-500;
}
</style>
