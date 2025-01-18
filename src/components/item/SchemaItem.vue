<template>
  <!-- 根节点 -->
  <div v-if="props.item.keyPath.length === 0">
    <schema-basic
      item-name="ROOT"
      name-disabled
      :hasValue="hasValue"
      :hasSubset="hasSubset"
      :has-add-item="hasAddItem"
      :has-add-subset="hasAddSubset"
      :has-delete="false"
      :item-type="itemType"
      :item-value="itemValue"
      v-model:is-expanded="isExpand"
      @update:item-type="updateType"
      @toolAction="handleToolAction"
    />
  </div>
  <!-- 普通节点 -->
  <div v-else :style="`margin-left: ${tabLeft}`" style="display: flex">
    <schema-basic
      :hasValue="hasValue"
      :hasSubset="hasSubset"
      :has-add-item="hasAddItem"
      :has-add-subset="hasAddSubset"
      :item-name="itemName"
      :item-type="itemType"
      :item-value="itemValue"
      v-model:is-expanded="isExpand"
      @update:item-type="updateType"
      @toolAction="handleToolAction"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, shallowRef, watch } from 'vue'
import SchemaBasic from '../basic/SchemaBasic.vue'
import type { FlatSchema } from '../types/schema'
import { useSchemaStore } from '../stores/schema'

export interface SchemaItemProps {
  item: FlatSchema
}

const props = withDefaults(defineProps<SchemaItemProps>(), {})

const itemName = ref(props.item.name)
watch(
  () => props.item.name,
  (val) => {
    itemName.value = val
  },
)
const itemType = ref(props.item.type)
watch(
  () => props.item.type,
  (val) => {
    itemType.value = val
  },
)
const itemValue = ref(props.item.value)
watch(
  () => props.item.value,
  (val) => {
    itemValue.value = val
  },
)
const itemKeyPath = shallowRef(props.item.keyPath)
watch(
  () => props.item.keyPath,
  (val) => {
    itemKeyPath.value = val
  },
)
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
const hasAddItem = computed(() => {
  if (itemKeyPath.value.length === 0) {
    return false
  } else {
    return true
  }
})
const hasAddSubset = computed(() => {
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

// 切换类型
const updateType = (type: string) => {
  schemaStore.ChangeType(itemKeyPath.value, type)
}

// 工具栏操作
const handleToolAction = (action: string) => {
  switch (action) {
    case 'addItem':
      schemaStore.AddItem(itemKeyPath.value)
      break
    case 'addSubset':
      schemaStore.AddChild(itemKeyPath.value)
      break
    case 'delete':
      schemaStore.DeleteItem(itemKeyPath.value)
      break
  }
}

const tabLeft = computed(() => `${props.item.keyPath.length * 20}px`)
</script>

<style scoped></style>
