<script setup lang="ts">
import { getSelfBoardApi, deleteMsgApi } from '../../../api/guestbook'
import { ref, reactive, onBeforeMount, defineEmits } from 'vue'
import { Message } from '../../../stores/store'
import messageCard from '../../messageCard.vue'
import { userinfoApi } from '../../../api/user'

const messageList = reactive({
  list: [] as Array<Message>
})
const emit = defineEmits(['deleteMsg'])
const loading = ref<boolean>(true)
const showNone = ref<boolean>(false)
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getSelfBoardApi(config).then(async res => {
    console.log(res)
    const list = [] as Array<Message>
    for (let item of res.data.data.guestbooks) {
      await userinfoApi(item.author, config).then(result => {
        item.userInfo = result.data.data.user
        list.push(item)
      })
    }
    messageList.list = res.data.data.guestbooks
    if (messageList.list.length === 0) showNone.value = true
    loading.value = false
  })
})

const deleteMsg = (index: any) => {
  deleteMsgApi(messageList.list[index].id, config).then(res => {
    if (res.data.code === 200) {
      messageList.list.splice(index, 1)
      emit('deleteMsg')
    }
  })
}
</script>
<template>
  <el-skeleton :rows="6" :loading="loading" animated></el-skeleton>
  <TransitionGroup name="list">
    <messageCard
      v-for="(item, index) in messageList.list"
      mode="self"
      :key="index"
      :message="item"
      :index="index"
      @delete-msg="deleteMsg(index)"
    ></messageCard>
  </TransitionGroup>
  <div v-if="showNone" class="show-none">空空如也~</div>
</template>
<style scoped lang="less"></style>
