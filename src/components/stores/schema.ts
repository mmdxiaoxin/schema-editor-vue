import { defineStore } from 'pinia'
import type { FlatSchema, Schema } from '../types/schema'
import { flattenSchema, handleSchema } from '../utils'

export const useSchemaStore = defineStore('schema', {
  state: (): {
    schema: Schema
    collapse: string[]
  } => ({
    schema: {} as Schema,
    collapse: [],
  }),
  getters: {
    flattenSchema(state): FlatSchema[] {
      const flattened = flattenSchema(state.schema)
      return flattened.filter((item) => {
        // 检查当前项的 keyPathString 是否以 collapse 中任何一个值作为前缀
        return !state.collapse.some((collapsedPath) =>
          item.keyPathString.startsWith(`${collapsedPath}.`),
        )
      })
    },
  },
  actions: {
    initSchema(schema: Schema) {
      this.schema = handleSchema(schema)
    },
    AddChild(keyPath: string[]) {},
    AddItem(keyPath: string[]) {},
    DeleteItem(keyPath: string[]) {},
    ChangeCollapse(keyPathString: string, value: boolean) {
      if (value) {
        this.collapse.push(keyPathString)
      } else {
        const index = this.collapse.indexOf(keyPathString)
        if (index > -1) {
          this.collapse.splice(index, 1)
        }
      }
    },
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
