<script setup lang="ts">
import alertCard from './alertCard.vue'
import { userinfoApi } from '../api/user'
import { ref, reactive, onBeforeMount, defineProps, defineEmits } from 'vue'
import { User } from '../stores/store'
import UserCard from './userCard.vue'

const { list, total } = defineProps(['list', 'total'])
const emit = defineEmits(['closeDialog'])
console.log(list)
const showNone = ref<boolean>(false)
const userList = reactive({
  list: [] as Array<User>
})
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(async () => {
  if (list.likeList.length === 0) showNone.value = true
  const arr = [] as Array<User>
  for (let item of list.likeList) {
    await userinfoApi(item, config).then(res => {
      arr.push(res.data.data.user)
    })
  }
  userList.list = arr
})

const close = () => {
  emit('closeDialog')
}
</script>
<template>
  <div class="">
    <alertCard @close-dialog="close">
      <template v-slot:header> 点赞·收藏列表 </template>
      <template #default>
        <TransitionGroup name="list" tag="div">
          <div v-for="(item, index) in userList.list" :key="index">
            <UserCard :user="item"></UserCard>
          </div>
        </TransitionGroup>
        <div v-if="showNone" class="mx-24 my-12">空空如也~</div>
      </template>
    </alertCard>
  </div>
</template>
<style scoped lang="less"></style>
