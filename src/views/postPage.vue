<script setup lang="ts">
import postList from '../components/Post/postList.vue'
import { useStore } from '../stores'

const userId = useStore().userInfo?.user_id
</script>
<template>
  <div class="ct-bg">
    <div class="shadow-lg">
      <postList :userId="userId"></postList>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
