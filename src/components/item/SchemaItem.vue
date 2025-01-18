<template>
  <!-- 根节点 -->
  <div v-if="props.item.keyPath.length === 0">
    <schema-basic
      item-name="ROOT"
      name-disabled
      :hasValue="hasValue"
      :hasSubset="hasSubset"
      v-model:item-type="itemType"
      v-model:item-value="itemValue"
      v-model:is-expanded="isExpand"
      @toolAction="handleToolAction"
    />
  </div>
  <!-- 普通节点 -->
  <div v-else :style="`margin-left: ${tabLeft}`" style="display: flex">
    <schema-basic
      :hasValue="hasValue"
      :hasSubset="hasSubset"
      v-model:item-name="itemName"
      v-model:item-type="itemType"
      v-model:item-value="itemValue"
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

const itemName = ref(props.item.keyPath[props.item.keyPath.length - 1])
const itemType = ref(props.item.type)
const itemValue = ref(props.item.value)
const hasValue = computed(() => {
  switch (itemType.value) {
    case 'object':
    case 'array':
      return false
    default:
      return true
  }
})
const hasSubset = computed(() => {
  switch (itemType.value) {
    case 'object':
    case 'array':
      return true
    default:
      return false
  }
})

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
