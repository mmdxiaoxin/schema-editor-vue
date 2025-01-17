<template>
  <RecycleScroller
    class="scroller"
    :items="schemaStore.flattenSchema"
    :item-size="32"
    :buffer="5"
    key-field="id"
    v-slot="{ item }"
    style="height: 100vh; overflow-y: auto"
  >
    <SchemaItem :item="item" />
  </RecycleScroller>
</template>

<script setup lang="ts">
import type { Schema } from '@/components/types/schema'
import SchemaItem from './item/SchemaItem.vue'
import { useSchemaStore } from './stores/schema'

export interface SchemaEditorProps {
  initData?: Schema
}

// Props
const props = defineProps<SchemaEditorProps>()

const defaultSchema: Schema = {
  type: 'object',
  properties: {},
}

const schemaStore = useSchemaStore()
schemaStore.initSchema(props.initData || defaultSchema)
</script>

<style scoped></style>
