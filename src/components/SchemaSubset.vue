<template>
  <schema-basic
    v-model:schema-key="key"
    v-model:schema-type="type"
    v-model:schema-value="value"
    v-model:is-expanded="isExpand"
    @toolAction="handleToolAction"
    style="margin-left: 20px"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SchemaBasic from './basic/SchemaBasic.vue'

const key = ref('subKey')
const type = ref('String')
const value = ref('subValue')
const isExpand = ref(true)

const handleToolAction = (action: string) => {
  console.log('工具栏操作:', action)
  // 在这里根据不同的 action 执行操作
}
</script>

<style scoped></style>
