<template>
  <div :style="`margin-left: ${tabLeft}`">
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
import type { FlatSchema } from '../utils'

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
