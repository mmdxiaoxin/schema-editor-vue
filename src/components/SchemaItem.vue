<template>
  <schema-basic
    v-model:schema-key="key"
    v-model:schema-type="type"
    v-model:schema-value="value"
    @toolAction="handleToolAction"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SchemaBasic from './basic/SchemaBasic.vue'

const key = ref('someKey')
const type = ref('String')
const value = ref('someValue')

const handleToolAction = (action: string) => {
  console.log('工具栏操作:', action)
  // 在这里根据不同的 action 执行操作
}
</script>

<style scoped></style>
