import { defineStore } from 'pinia'
import type { FlatSchema, Schema, SchemaCollapse } from '../types/schema'
import { flattenSchema, handleSchema } from '../utils'

export const useSchemaStore = defineStore('schema', {
  state: (): {
    schema: Schema
    collapse: SchemaCollapse
  } => ({
    schema: {} as Schema,
    collapse: {},
  }),
  getters: {
    flattenSchema(state): FlatSchema[] {
      return flattenSchema(state.schema)
    },
  },
  actions: {
    initSchema(schema: Schema) {
      this.schema = handleSchema(schema)
    },
    AddChild(keyPath: string[]) {},
    AddItem(keyPath: string[]) {},
    DeleteItem(keyPath: string[]) {},
    ChangeType(keyPath: string[], type: string) {},
    ChangeRequired(keyPath: string[], required: boolean) {},
    ChangeEnum(keyPath: string[], value: string[]) {},
    ChangeEnumDesc(keyPath: string[], value: string) {},
    ChangeFormat(keyPath: string[], value: string) {},
    ChangeTitle(keyPath: string[], value: string) {},
    ChangeDescription(keyPath: string[], value: string) {},
    ChangeDefault(keyPath: string[], value: any) {},
    ChangeMaximum(keyPath: string[], value: number) {},
    ChangeExclusiveMaximum(keyPath: string[], value: boolean) {},
    ChangeMinimum(keyPath: string[], value: number) {},
    ChangeExclusiveMinimum(keyPath: string[], value: boolean) {},
    ChangeMaxLength(keyPath: string[], value: number) {},
    ChangeMinLength(keyPath: string[], value: number) {},
    ChangePattern(keyPath: string[], value: string) {},
    ChangeMaxItems(keyPath: string[], value: number) {},
    ChangeMinItems(keyPath: string[], value: number) {},
    ChangeUniqueItems(keyPath: string[], value: boolean) {},
    ChangeMaxProperties(keyPath: string[], value: number) {},
    ChangeMinProperties(keyPath: string[], value: number) {},
    ChangeDependencies(keyPath: string[], value: string) {},
    ChangeAdditionalProperties(keyPath: string[], value: boolean) {},
    ChangePatternProperties(keyPath: string[], value: string) {},
    ChangeProperties(keyPath: string[], value: string) {},
    ChangeItems(keyPath: string[], value: string) {},
  },
})
