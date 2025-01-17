<template>
  <RecycleScroller
    class="scroller"
    :items="schemaStore.flattenSchema"
    :item-size="32"
    key-field="id"
    v-slot="{ item }"
  >
    <SchemaItem :item="item" />
  </RecycleScroller>
</template>

<script setup lang="ts">
import type { Schema } from '@/components/types/schema'
import SchemaItem from './item/SchemaItem.vue'
import { useSchemaStore } from './stores/schema'

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

const schemaStore = useSchemaStore()
schemaStore.initSchema(schemaData)
</script>

<style scoped></style>
