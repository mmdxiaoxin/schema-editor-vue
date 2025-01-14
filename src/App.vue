<template>
  <div>
    <h1>JSON Editor</h1>
    <SchemaItem />
    <pre>{{ jsonData }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import JSONEditor from './components/JSONEditor.vue'
import SchemaBasic from './components/basic/SchemaBasic.vue'
import SchemaItem from './components/SchemaItem.vue'

export default defineComponent({
  components: { JSONEditor, SchemaBasic, SchemaItem },
  setup() {
    const jsonData = reactive([
      {
        key: 'root',
        value: '',
        children: [
          { key: 'child1', value: 'value1' },
          { key: 'child2', value: 'value2' },
        ],
      },
    ])

    const updateJson = (updatedData: any) => {
      console.log('Updated JSON Data:', updatedData)
    }

    return { jsonData, updateJson }
  },
})
</script>
