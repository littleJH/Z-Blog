<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits(['closeDialog'])

const closeDialog = () => {
  emit('closeDialog')
}
</script>
<template>
  <div class="fixed z-100 w-full h-full flex justify-center items-center">
    <div class="min-h-max min-w-max bg-gray-200 rounded shadow-md">
      <div class="min-h-max min-w-max">
        <span class="pt-4 px-4 hover:cursor-pointer flex">
          <span class="flex-grow font-bold text-sm">
            <slot name="header"></slot>
          </span>
          <span @click="closeDialog">
            <svg
              t="1679998149958"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2788"
              width="12"
              height="12"
            >
              <path
                d="M85.241081 0.027676L0 85.158054l426.205405 426.426811L0 937.873297l85.241081 85.241081 426.205405-426.177729 426.150055 426.205405 85.241081-85.241081-426.205406-426.316108 426.205406-426.067027-85.241081-85.241081-426.17773 426.205405z"
                fill="#2c2c2c"
                p-id="2789"
              ></path>
            </svg>
          </span>
        </span>
      </div>
      <div class="p-8">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less"></style>
