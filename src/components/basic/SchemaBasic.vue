<template>
  <div class="schema-basic" :style="{ marginLeft: indentation * 20 + 'px' }">
    <div v-if="hasName" class="schema-basic__name">
      <el-input placeholder="name" v-model="itemName" :disabled="nameDisabled" />
    </div>
    <div class="schema-basic__type">
      <el-select v-model="itemType" placeholder="type" :disabled="typeDisabled">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div v-if="hasValue" class="schema-basic__value">
      <el-input placeholder="value" v-model="itemValue" :disabled="valueDisabled" />
    </div>
    <div class="schema-basic__semi">:</div>
    <div class="schema-basic__toolbar">
      <el-button
        v-if="hasSubset"
        :icon="isExpanded ? CaretBottom : CaretRight"
        text
        circle
        @click="toggleExpand"
      />
      <el-button :icon="Edit" text circle @click="onToolAction('edit')" />
      <el-button v-if="hasAddItem" text circle @click="onToolAction('addItem')">
        <AddItem />
      </el-button>
      <el-button v-if="hasAddSubset" text circle @click="onToolAction('addSubset')">
        <AddSubset />
      </el-button>
      <el-button v-if="hasDelete" :icon="Delete" text circle @click="onToolAction('delete')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CaretBottom, CaretRight, Delete, Edit } from '@element-plus/icons-vue'
import AddItem from '../icons/AddItem.vue'
import AddSubset from '../icons/AddSubset.vue'

export interface SchemaBasicProps {
  hasName?: boolean
  hasValue?: boolean
  hasSubset?: boolean
  hasAddItem?: boolean
  hasAddSubset?: boolean
  hasDelete?: boolean
  nameDisabled?: boolean
  typeDisabled?: boolean
  valueDisabled?: boolean
  indentation?: number
}

// Props
withDefaults(defineProps<SchemaBasicProps>(), {
  hasName: true,
  hasValue: true,
  hasSubset: true,
  hasAddItem: true,
  hasAddSubset: true,
  hasDelete: true,
  nameDisabled: false,
  typeDisabled: false,
  valueDisabled: false,
  indentation: 0,
})

// Model
const itemName = defineModel<string>('itemName')
const itemType = defineModel<string>('itemType')
const itemValue = defineModel('itemValue')
const isExpanded = defineModel<boolean>('isExpanded')

// Emits
const emit = defineEmits(['toolAction'])

// 选项列表
const options = [
  { label: 'string', value: 'string' },
  { label: 'number', value: 'number' },
  { label: 'boolean', value: 'boolean' },
  { label: 'object', value: 'object' },
  { label: 'array', value: 'array' },
]

// 切换展开状态
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 工具栏按钮的操作方法
const onToolAction = (action: string) => {
  emit('toolAction', action)
}
</script>

<style lang="scss" scoped>
.schema-basic {
  display: flex;
  align-items: center;

  &__semi {
    padding: 0 5px;
    color: var(--el-color-info);
  }

  &__type {
    min-width: 100px;
  }

  &__toolbar {
    display: flex;
  }
}
</style>
