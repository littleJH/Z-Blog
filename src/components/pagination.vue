<script setup lang="ts">
import { ref } from 'vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps(['total', 'pageNum', 'pageSize'])
const pageNum = ref(props.pageNum)
const pageSize = props.pageSize ? props.pageSize : 20
const emit = defineEmits(['pageChange'])

const pageChange = (page: any) => {
  pageNum.value = page
  emit('pageChange', {
    page
  })
}
</script>
<template>
  <div class="flex justify-center mt-8">
    <el-pagination
      background
      layout="prev, pager, next"
      :hide-on-single-page="props.total <= pageSize"
      :total="total"
      :page-size="pageSize"
      :current-page="pageNum"
      @current-change="pageChange"
    />
  </div>
</template>
<style scoped lang="less"></style>
