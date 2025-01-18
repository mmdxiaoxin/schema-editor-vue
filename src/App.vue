<template>
  <div>
    <h1>JSON Editor</h1>
    <SchemaEditor :init-data="schemaData" />
  </div>
</template>

<script lang="ts" setup>
import SchemaEditor from './components/SchemaEditor.vue'
import type { Schema } from './components/types/schema'
import commonData from '@/test/common.json'
import largeData from '@/test/large.json'

const schemaData: Schema = commonData
</script>
