import { defineStore } from 'pinia'
import type { FlatSchema, Schema } from '../types/schema'
import { flattenSchema, getDefaultSchema, handleSchema } from '../utils'
import { clone } from 'lodash-es'

export const useSchemaStore = defineStore('schema', {
  state: (): {
    schema: Schema
    collapse: string[]
    childCounter: number
  } => ({
    schema: {} as Schema,
    collapse: [],
    childCounter: 0,
  }),
  getters: {
    flattenSchema(state): FlatSchema[] {
      const flattened = flattenSchema(state.schema)
      return flattened.filter((item) => {
        // 如果是根节点（keyPathString为空字符串），直接保留
        if (item.keyPathString === '') {
          return true
        }

        // 针对 collapse 中的根节点进行特殊处理
        const isRootCollapsed = state.collapse.includes('')
        if (isRootCollapsed && item.keyPathString !== '') {
          return false // 根节点收缩时，过滤掉所有非根节点
        }

        // 检查当前项的 keyPathString 是否以 collapse 中任何一个值作为前缀
        return !state.collapse.some(
          (collapsedPath) =>
            collapsedPath !== '' && item.keyPathString.startsWith(`${collapsedPath}.`),
        )
      })
    },
  },
  actions: {
    initSchema(schema: Schema) {
      this.schema = handleSchema(schema)
    },
    AddChild(keyPath: string[]) {
      // 检查 keyPath 是否有效
      if (!Array.isArray(keyPath) || keyPath.length === 0) {
        console.warn('Invalid keyPath:', keyPath)
        return
      }

      const childName = `child_${this.childCounter++}`
      const clonedSchema = clone(this.schema)

      // 递归解析 keyPath，找到目标节点
      let currentField = clonedSchema
      for (const key of keyPath) {
        if (key === '[]') {
          if (Array.isArray(currentField)) {
            currentField = currentField[0] // 如果是数组，取第一个元素
          } else {
            console.warn('Invalid array path in keyPath:', keyPath)
            return
          }
        } else if (currentField && typeof currentField === 'object' && currentField.properties) {
          currentField = currentField.properties[key]
        } else {
          console.warn('Invalid object path in keyPath:', keyPath)
          return
        }
      }

      console.log('Current Field:', currentField)

      // 确保当前字段有效并是一个对象
      if (currentField && typeof currentField === 'object') {
        if (!currentField.properties) {
          currentField.properties = {}
        }
        currentField.properties[childName] = getDefaultSchema('string')
      } else {
        console.warn('Cannot add child to non-object field:', currentField)
        return
      }

      console.log('Updated Schema:', clonedSchema)
      this.schema = clonedSchema // 响应式更新
    },
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
