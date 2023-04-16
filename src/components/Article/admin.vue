<script setup lang="ts">
import { ref } from 'vue'
import { reactive } from 'vue'
import { defineProps, defineEmits } from 'vue'
import userCard from '../userCard.vue'

const { articleList } = defineProps(['articleList'])
const emit = defineEmits(['delete', ''])
</script>
<template>
  <div class="w-20 h-96 bg-white shadow-md">
    <div v-for="(item, index) in articleList">
      <p>{{ item.title }}</p>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
