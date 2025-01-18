import { defineStore } from 'pinia'
import type { FlatSchema, Schema } from '../types/schema'
import { flattenSchema, getDefaultSchema, handleSchema } from '../utils'
import { clone } from 'lodash-es'

export const useSchemaStore = defineStore('schema', {
  state: (): {
    schema: Schema
    collapse: string[]
    childCounter: number
    siblingCounter: number
  } => ({
    schema: {} as Schema,
    collapse: [],
    childCounter: 0,
    siblingCounter: 0,
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
      if (!Array.isArray(keyPath)) {
        console.warn('Invalid keyPath:', keyPath)
        return
      }

      const childName = `child_${this.childCounter++}`
      const clonedSchema = clone(this.schema)

      // 根节点特殊处理
      if (keyPath.length === 0) {
        if (!clonedSchema.properties) {
          clonedSchema.properties = {} // 初始化根节点的 properties
        }
        clonedSchema.properties[childName] = getDefaultSchema('string')
        console.log('Updated Schema (Root Node):', clonedSchema)
        this.schema = clonedSchema // 响应式更新
        return
      }

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
    AddItem(keyPath: string[]) {
      // 检查 keyPath 是否有效
      if (!Array.isArray(keyPath) || keyPath.length === 0) {
        console.warn('Invalid keyPath:', keyPath)
        return
      }

      const siblingName = `sibling_${this.siblingCounter++}` // 为新兄弟节点生成唯一名称
      const clonedSchema = clone(this.schema)

      // 递归解析 keyPath，找到目标节点的父级
      let parentField = clonedSchema
      for (let i = 0; i < keyPath.length - 1; i++) {
        const key = keyPath[i]
        if (key === '[]') {
          if (Array.isArray(parentField)) {
            parentField = parentField[0] // 如果是数组，取第一个元素
          } else {
            console.warn('Invalid array path in keyPath:', keyPath)
            return
          }
        } else if (parentField && typeof parentField === 'object' && parentField.properties) {
          parentField = parentField.properties[key]
        } else {
          console.warn('Invalid object path in keyPath:', keyPath)
          return
        }
      }

      console.log('Parent Field:', parentField)

      // 确保父级字段有效并是一个对象
      if (
        parentField &&
        typeof parentField === 'object' &&
        parentField.properties &&
        keyPath[keyPath.length - 1]
      ) {
        const siblingSchema = getDefaultSchema('string') // 默认类型为 string 的兄弟节点
        parentField.properties[siblingName] = siblingSchema
      } else {
        console.warn('Cannot add sibling to non-object field:', parentField)
        return
      }

      console.log('Updated Schema:', clonedSchema)
      this.schema = clonedSchema // 响应式更新
    },
    DeleteItem(keyPath: string[]) {
      // 检查 keyPath 是否有效
      if (!Array.isArray(keyPath) || keyPath.length === 0) {
        console.warn('Invalid keyPath:', keyPath)
        return
      }

      const clonedSchema = clone(this.schema)

      // 递归解析 keyPath，找到目标节点的父级
      let parentField = clonedSchema
      for (let i = 0; i < keyPath.length - 1; i++) {
        const key = keyPath[i]
        if (key === '[]') {
          if (Array.isArray(parentField)) {
            parentField = parentField[0] // 如果是数组，取第一个元素
          } else {
            console.warn('Invalid array path in keyPath:', keyPath)
            return
          }
        } else if (parentField && typeof parentField === 'object' && parentField.properties) {
          parentField = parentField.properties[key]
        } else {
          console.warn('Invalid object path in keyPath:', keyPath)
          return
        }
      }

      const targetKey = keyPath[keyPath.length - 1] // 要删除的键
      console.log('Parent Field:', parentField)

      // 确保父级字段有效并包含目标节点
      if (
        parentField &&
        typeof parentField === 'object' &&
        (parentField.properties || parentField.items)
      ) {
        if (parentField.properties && targetKey in parentField.properties) {
          delete parentField.properties[targetKey]
        } else if (
          Array.isArray(parentField.items) &&
          Number(targetKey) < parentField.items.length
        ) {
          parentField.items.splice(Number(targetKey), 1)
        } else {
          console.warn('Cannot delete non-existent field:', targetKey)
          return
        }
      } else {
        console.warn('Cannot delete field from non-object field:', parentField)
        return
      }

      console.log('Updated Schema After Deletion:', clonedSchema)
      this.schema = clonedSchema // 响应式更新
    },
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
    ChangeType(keyPath: string[], type: string) {
      // 检查 keyPath 是否有效
      if (!Array.isArray(keyPath) || keyPath.length === 0) {
        console.warn('Invalid keyPath:', keyPath)
        return
      }

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

      console.log('Current Field Before Type Change:', currentField)

      // 确保当前字段有效并是一个对象
      if (currentField && typeof currentField === 'object') {
        // 根据新的类型生成默认 schema
        const newSchema = getDefaultSchema(type)

        // 保留公共属性并清空子项
        currentField.type = newSchema.type
        currentField.title = newSchema.title || currentField.title
        currentField.description = newSchema.description || currentField.description
        currentField.default = newSchema.default || undefined

        // 清空子项
        if ('properties' in currentField) {
          delete currentField.properties
        }
        if ('items' in currentField) {
          delete currentField.items
        }

        // 如果新类型是 object 或 array，初始化相应子项
        if (type === 'object') {
          currentField.properties = newSchema.properties || {}
        } else if (type === 'array') {
          currentField.items = newSchema.items || getDefaultSchema('string')
        }
      } else {
        console.warn('Cannot change type of non-object field:', currentField)
        return
      }

      console.log('Updated Schema After Type Change:', clonedSchema)
      this.schema = clonedSchema // 响应式更新
    },
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
