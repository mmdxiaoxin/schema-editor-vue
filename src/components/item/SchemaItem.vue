<template>
  <!-- 根节点 -->
  <div class="schema-item" v-if="props.item.keyPath.length === 0">
    <schema-basic
      item-name="ROOT"
      name-disabled
      :hasValue="false"
      :hasSubset="hasSubset"
      :has-add-item="hasAddItem"
      :has-add-subset="hasAddSubset"
      :has-delete="false"
      :item-type="itemType"
      v-model:is-expanded="isExpand"
      @update:item-type="updateType"
      @toolAction="handleToolAction"
    />
  </div>
  <!-- 普通节点 -->
  <div class="schema-item" v-else>
    <schema-basic
      :hasValue="false"
      :hasSubset="hasSubset"
      :has-add-item="hasAddItem"
      :has-add-subset="hasAddSubset"
      :item-name="itemName"
      :item-type="itemType"
      :indentation="indentation"
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
const itemKeyPath = shallowRef(props.item.keyPath)
watch(
  () => props.item.keyPath,
  (val) => {
    itemKeyPath.value = val
  },
)
const indentation = computed(() => props.item.keyPath.length)
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
</script>

<style lang="scss" scoped>
.schema-item {
  &:hover {
    background-color: var(--el-color-primary-light-8);
  }
}
</style>
