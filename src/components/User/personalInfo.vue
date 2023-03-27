<script setup lang="ts">
import { useStore, User } from '../../stores/index'
import { useFileDialog } from '@vueuse/core'
import router from '../../router'
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const { files, open } = useFileDialog()
const store = useStore()
const infoForm = reactive<User>({})
const logoutClick = () => {
  router.push('/user/login')
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  store.userInfo = null
  ElMessage.success({
    message: '欢迎再次登录！',
    duration: 5000
  })
}

const modifyInfo = () => {
  router.push('/user/modify')
}
</script>
<template>
  <div class="ct-bg">
    <div
      class="shadow-lg bg-white min-w-min flex flex-col items-center justify-center px-8"
    >
      <div class="h-32">
        <img
          :src="`http://icon.mgaronya.com/${store.userInfo?.Icon}`"
          class="w-32 h-32 rounded-full hover:w-36 hover:h-36 hover:border-transparent"
        />
      </div>
      <el-divider></el-divider>
      <div class="mt-4">
        <el-timeline hide-timestamp="true" center>
          <el-timeline-item
            v-for="(item, index) in store.infoList"
            :key="index"
            :color="item.color"
          >
            <div v-if="item.label === 'Sex'">
              <span class="">{{ item.label }}</span>
              <span>：</span>
              <div class="py-2 w-64">
                <el-input type="text" disabled :value="item.value"></el-input>
              </div>
            </div>
            <div v-else-if="item.label === 'Icon'">
              <span class="">{{ item.label }}</span>
              <span>：</span>
              <div class="py-2 w-64">
                <img
                  :src="`http://icon.mgaronya.com/${item.value}`"
                  class="w-12 h-12 transition-all duration-500 ease-in-out hover:w-16 hover:h-16 hover:border-transparent"
                />
              </div>
            </div>
            <div v-else>
              <span class="">{{ item.label }}</span>
              <span>：</span>
              <div class="py-2 w-64">
                <el-input type="text" disabled :value="item.value" />
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
        <div class="h-8 w-full mb-8 flex justify-center items-center">
          <button class="btn-blue" @click="modifyInfo">修改资料</button>
          <button class="btn-red" @click="logoutClick">退出登录</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="pcss">
span {
  @apply transition-all duration-500 ease-in-out dark:text-white
}
</style>
