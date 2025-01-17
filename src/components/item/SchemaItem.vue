<template>
  <div v-if="props.item.keyPath.length === 0">
    <schema-basic
      item-name="ROOT"
      v-model:item-type="props.item.type"
      v-model:item-value="props.item.title"
      v-model:is-expanded="isExpand"
      @toolAction="handleToolAction"
    />
  </div>
  <div v-else :style="`margin-left: ${tabLeft}`" style="display: flex">
    <schema-basic
      v-model:item-name="props.item.keyPath[props.item.keyPath.length - 1]"
      v-model:item-type="props.item.type"
      v-model:item-value="props.item.title"
      v-model:is-expanded="isExpand"
      @toolAction="handleToolAction"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SchemaBasic from '../basic/SchemaBasic.vue'
import type { FlatSchema } from '../types/schema'

export interface SchemaItemProps {
  item: FlatSchema
}

const isExpand = ref(false)

const handleToolAction = (action: string) => {
  console.log(action)
}

const props = withDefaults(defineProps<SchemaItemProps>(), {})

const tabLeft = computed(() => `${props.item.keyPath.length * 20}px`)
</script>

<style scoped></style>
