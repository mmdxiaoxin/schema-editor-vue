<template>
  <RecycleScroller class="scroller" :items="list" :item-size="32" key-field="id" v-slot="{ item }">
    <SchemaItem :item="item" />
  </RecycleScroller>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SchemaItem from './item/SchemaItem.vue'
import type Schema from '@/components/types/schema'
import { flattenSchema } from './utils'

const schemaData: Schema = {
  title: 'Root Schema',
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' },
      },
    },
  },
}

const initData = flattenSchema(schemaData)

const list = ref(initData)
</script>

<style scoped></style>
