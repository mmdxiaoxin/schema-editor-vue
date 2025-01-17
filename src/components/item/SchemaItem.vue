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
import { computed, ref, watch } from 'vue'
import SchemaBasic from '../basic/SchemaBasic.vue'
import type { FlatSchema } from '../types/schema'
import { useSchemaStore } from '../stores/schema'

export interface SchemaItemProps {
  item: FlatSchema
}

const props = withDefaults(defineProps<SchemaItemProps>(), {})
const schemaStore = useSchemaStore()

// 展开收起
const isCollapse = ref(false)
const isExpand = computed({
  get: () => !isCollapse.value,
  set: (value: boolean) => {
    isCollapse.value = !value
  },
})
watch(
  () => isCollapse.value,
  (val) => {
    schemaStore.ChangeCollapse(props.item.keyPathString, val)
    console.log(schemaStore.collapse)
  },
)

const handleToolAction = (action: string) => {
  console.log(action)
}

const tabLeft = computed(() => `${props.item.keyPath.length * 20}px`)
</script>

<style scoped></style>
