<template>
  <div class="schema-basic">
    <div class="schema-basic__key">
      <el-input placeholder="key" :value="itemKey" @update:value="updateItemKey" />
    </div>
    <div class="schema-basic__type">
      <el-select :value="type" @update:value="updateType" placeholder="type">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="schema-basic__value">
      <el-input placeholder="value" :value="value" @update:value="updateValue" />
    </div>
    <div class="schema-basic__semi">:</div>
    <div class="schema-basic__toolbar">
      <el-button :icon="CaretRight" text circle @click="onToolAction('toggle')" />
      <el-button :icon="Edit" text circle @click="onToolAction('edit')" />
      <el-button text circle @click="onToolAction('addItem')">
        <AddItem />
      </el-button>
      <el-button text circle @click="onToolAction('addSubsets')">
        <AddSubsets />
      </el-button>
      <el-button :icon="Delete" text circle @click="onToolAction('delete')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { CaretRight, Delete, Edit } from '@element-plus/icons-vue'
import AddItem from '../icons/AddItem.vue'
import AddSubsets from '../icons/AddSubset.vue'

// Props
const props = defineProps({
  itemKey: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
})

// Emits
const emit = defineEmits(['update:itemKey', 'update:type', 'update:value', 'toolAction'])

// 选项列表
const options = [
  { label: 'String', value: 'String' },
  { label: 'Number', value: 'Number' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'Object', value: 'Object' },
  { label: 'Array', value: 'Array' },
]

// 更新 itemKey 的方法
const updateItemKey = (val: string) => {
  emit('update:itemKey', val)
}

// 更新 type 的方法
const updateType = (val: string) => {
  emit('update:type', val)
}

// 更新 value 的方法
const updateValue = (val: string) => {
  emit('update:value', val)
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
