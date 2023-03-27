<script setup lang="ts">
import articleList from '../components/Article/articleList.vue'
import { useStore } from '../stores'

const userid = useStore().userInfo?.user_id
</script>
<template>
  <div class="ct-bg">
    <div class="shadow-lg">
      <articleList :userid="userid"></articleList>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
