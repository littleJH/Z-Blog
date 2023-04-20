<script setup lang="ts">
import { useStore, UserInfo } from '../../stores/store'
import router from '../../router/router'
import { ElMessage } from 'element-plus'
import { onBeforeMount, reactive, ref } from 'vue'

const store = useStore()
const userInfo =
  localStorage.getItem('userInfo') !== null
    ? JSON.parse(localStorage.getItem('userInfo') as string)
    : ''
const infoList = reactive<Array<UserInfo>>([])
const config = {
  headers: {
    Authorization: 'Bearer ' + localStorage.getItem('token')
  }
}
onBeforeMount(async () => {
  Object.keys(userInfo).forEach(key => {
    if (userInfo[key] === '') {
      infoList.push({
        label: key,
        value: '待完善',
        color: '#DC2626'
      })
    } else {
      infoList.push({
        label: key,
        value: userInfo[key],
        color: '#D1D5DB'
      })
    }
  })
})
const logoutClick = () => {
  router.push('/login')
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  store.userInfo = null
  ElMessage.success({
    message: '欢迎再次登录！',
    offset: 80
  })
}

const modifyInfo = () => {
  router.push('/personal/modify')
}

const clickIcon = () => {
  const a = document.createElement('a')
  a.href = `http://icon.mgaronya.com/${store.userInfo?.Icon}`
  a.click()
}
</script>
<template>
  <div class="flex flex-col items-center">
    <div class="h-32">
      <img
        :src="`http://icon.mgaronya.com/${userInfo?.Icon}`"
        class="w-32 h-32 rounded-full hover:shadow-lg hover:cursor-pointer hover:border-transparent transition-all ease-in-out"
        @click="clickIcon"
      />
    </div>
    <div class="mt-8">{{ userInfo.Labels[0] }}</div>
    <div>
      <div class="py-8 my-8 px-16 rounded bg-gray-50 shadow-md">
        <el-timeline hide-timestamp="true" center>
          <el-timeline-item
            v-for="(item, index) in infoList"
            :key="index"
            :color="item.color"
          >
            <div v-if="item.label === 'Sex'">
              <span class="">{{ item.label }}</span>
              <span>：</span>
              <!-- <div class="py-2 w-64">
                <el-input type="text" disabled :value="item.value"></el-input>
              </div> -->
              <span v-if="!item.value">男</span>
              <span v-else>女</span>
            </div>
            <div v-else-if="item.label === 'Icon'">
              <span class="">{{ item.label }}</span>
              <span>：</span>
              <div class="py-2 w-64">
                <img
                  :src="`http://icon.mgaronya.com/${item.value}`"
                  class="w-12 h-12 rounded"
                />
              </div>
            </div>
            <div v-else-if="item.label === 'Labels'" class="max-w-xs">
              <span>座右铭：</span>
              <span v-for="label in item.value">{{ label }}</span>
            </div>
            <div v-else>
              <span class="">{{ item.label }}</span>
              <span>：</span>
              <!-- <div class="py-2 w-64">
              <el-input type="text" disabled :value="item.value" />
            </div> -->
              <span>{{ item.value }}</span>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div class="h-8 w-full my-8 flex justify-center items-center">
        <button class="btn-blue-large" @click="modifyInfo">修改资料</button>
        <button class="btn-red-large" @click="logoutClick">退出登录</button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
