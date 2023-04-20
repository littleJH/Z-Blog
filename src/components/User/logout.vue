<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useStore } from '../../stores/store'
import router from '../../router/router'

const store = useStore()
const logout = () => {
  router.push('/login')
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  store.userInfo = null
  ElMessage.success({
    message: '欢迎再次登录！',
    offset: 80
  })
}
</script>
<template>
  <Transition
    enter-active-class="animate__animated animate__fadeInDownBig"
    leave-active-class="animate__animated animate__fadeOutUpBig"
  >
    <div class="absolute top-0 flex justify-center items-center">
      <div
        class="flex flex-col justify-center bg-blue-200 bg-opacity-50 shadow-2xl dark:bg-indigo-900 dark:bg-opacity-30 dark:text-white"
        style="width: 300px; height: 200px"
      >
        <div class="w-full my-4 h-8 text-center text-2xl">退出登录？</div>
        <div class="h-8 my-4 w-full flex justify-center">
          <button @click="logout" class="btn-blue">确定</button>
        </div>
      </div>
    </div>
  </Transition>
</template>
<style scoped lang="less"></style>
