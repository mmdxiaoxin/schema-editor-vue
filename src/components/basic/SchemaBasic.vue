<template>
  <div class="schema-basic">
    <div class="schema-basic__key">
      <el-input placeholder="key" v-model="schemaKey" @update:value="updateSchemaKey" />
    </div>
    <div class="schema-basic__type">
      <el-select v-model="schemaType" @update:value="updateSchemaType" placeholder="type">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="schema-basic__value">
      <el-input placeholder="value" v-model="schemaValue" @update:value="updateSchemaValue" />
    </div>
    <div class="schema-basic__semi">:</div>
    <div class="schema-basic__toolbar">
      <el-button :icon="CaretRight" text circle @click="onToolAction('toggle')" />
      <el-button :icon="Edit" text circle @click="onToolAction('edit')" />
      <el-button text circle @click="onToolAction('addItem')">
        <AddItem />
      </el-button>
      <el-button text circle @click="onToolAction('addSubset')">
        <AddSubset />
      </el-button>
      <el-button :icon="Delete" text circle @click="onToolAction('delete')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue'
import { CaretRight, Delete, Edit } from '@element-plus/icons-vue'
import AddItem from '../icons/AddItem.vue'
import AddSubset from '../icons/AddSubset.vue'

// Model
const schemaKey = defineModel('schemaKey')
const schemaType = defineModel('schemaType')
const schemaValue = defineModel('schemaValue')

// Emits
const emit = defineEmits([
  'update:schemaKey',
  'update:schemaType',
  'update:schemaValue',
  'toolAction',
])

// 选项列表
const options = [
  { label: 'String', value: 'String' },
  { label: 'Number', value: 'Number' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'Object', value: 'Object' },
  { label: 'Array', value: 'Array' },
]

// 更新 key 的方法
const updateSchemaKey = (val: string) => {
  emit('update:schemaKey', val)
}

// 更新 type 的方法
const updateSchemaType = (val: string) => {
  emit('update:schemaType', val)
}

// 更新 value 的方法
const updateSchemaValue = (val: string) => {
  emit('update:schemaValue', val)
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
    gap: 10px;
  }
}
</style>
