<template>
  <div class="schema-basic">
    <div class="schema-basic__key">
      <el-input placeholder="key" v-model="key" />
    </div>
    <div>:</div>
    <div class="schema-basic__type">
      <el-select v-model="type" placeholder="type">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <div class="schema-basic__value">
      <el-input placeholder="value" v-model="value" />
    </div>
    <div class="schema-basic__toolbar">
      <el-button :icon="Edit" text circle />
      <el-button text circle>
        <AddItem />
      </el-button>
      <el-button text circle>
        <AddSubsets />
      </el-button>
      <el-button :icon="Delete" text circle />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import AddItem from '../icons/AddItem.vue'
import AddSubsets from '../icons/AddSubset.vue'

const key = ref('')
const type = ref('')
const value = ref('')

const options = [
  { label: 'String', value: 'String' },
  { label: 'Number', value: 'Number' },
  { label: 'Boolean', value: 'Boolean' },
  { label: 'Object', value: 'Object' },
  { label: 'Array', value: 'Array' },
]
</script>

<style lang="scss" scoped>
.schema-basic {
  display: flex;
  align-items: center;

  &__key,
  &__type,
  &__value,
  &__toolbar {
  }

  &__type {
    min-width: 100px;
  }
}
</style>
