<script setup lang="ts">
import { defineProps } from 'vue'
import router from '../router/router'

const { label } = defineProps(['label'])
</script>
<template>
  <span
    @click.stop="
      router.push({
        name: 'search',
        query: {
          text: label,
          mode: 'label'
        }
      })
    "
    class="py-1 px-2 ml-2 text-xs bg-blue-100 text-black rounded text-center hover:shadow-md hover:cursor-pointer transition-all ease-in-out"
    >{{ label }}
  </span>
</template>
<style scoped lang="less"></style>
