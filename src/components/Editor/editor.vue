<script setup lang="ts">
const userInfo = JSON.parse(localStorage.getItem('userInfo') as string)
</script>
<template>
  <div class="ct-bg">
    <!-- header -->
    <div class="h-16 w-full flex items-center">
      <input
        placeholder="请输入文章标题"
        type="text"
        class="h-full flex-grow"
      />
      <button class="btn-blue">发布</button>
      <img
        :src="`http://icon.mgaronya.com/${userInfo.Icon}`"
        class="h-12 w-12 rounded-full shadow-md"
        alt=""
      />
    </div>
  </div>
</template>
<style scoped lang="less"></style>
