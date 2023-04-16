<script setup lang="ts">
import { ref, reactive, onBeforeMount, defineEmits, defineProps } from 'vue'
import { getUserBoardApi } from '../../api/guestbook'
import { Message } from '../../stores/store'
import messageCard from '../messageCard.vue'
import { userinfoApi } from '../../api/user'
import alertCard from '../alertCard.vue'
import { ElMessage } from 'element-plus'

const { userId } = defineProps(['userId'])
const messageList = reactive({
  list: [] as Array<Message>
})
const loading = ref<boolean>(true)
const showNone = ref<boolean>(false)
const showDialog = ref<boolean>(false)
const leaveMsg = ref<string>('')
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}

onBeforeMount(() => {
  getUserBoardApi(userId, config).then(async res => {
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

const onAfterEnter = () => {
  const el = document.getElementById('textarea') as HTMLElement
  el.focus()
}

const updateMsg = (val: any) => {
  leaveMsg.value = messageList.list[val.index].content
  showDialog.value = true
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
        message: '留言更新成功',
        offset: 80
      })
      showDialog.value = false
    }
  })
}
</script>
<template>
  <div class="p-4" style="min-width: 800px">
    <el-skeleton :rows="5" :loading="loading" animated></el-skeleton>
    <TransitionGroup name="list">
      <messageCard
        v-for="(item, index) in messageList.list"
        mode="user"
        :key="index"
        :message="item"
        :index="index"
        @update-msg="updateMsg"
      ></messageCard>
    </TransitionGroup>
    <div v-if="showNone">空空如也~</div>
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
            <button class="btn-red-large mt-4" @click="leaveMessage">
              确定
            </button>
          </div>
        </div>
      </alertCard>
    </Transition>
  </div>
</template>
<style scoped lang="less">
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}
</style>
