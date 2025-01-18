import type { FlatSchema, Schema } from '@/components/types/schema'
import { cloneDeep } from 'lodash-es'

// 扁平化的函数，生成稳定的唯一标识符
export const flattenSchema = (schema: Schema, parentKey: string[] = []): FlatSchema[] => {
  let result: FlatSchema[] = []

  // 当前节点
  const keyPathString = parentKey.join('.')
  const flatNode: FlatSchema = {
    id: keyPathString || 'ROOT', // 使用稳定的 keyPathString 作为 ID
    keyPath: parentKey,
    keyPathString,
    name: parentKey.length > 0 ? parentKey[parentKey.length - 1] : 'ROOT',
    title: schema.title,
    type: schema.type,
    properties: schema.properties,
    required: schema.required,
    description: schema.description,
    default: schema.default,
    mock: schema.mock,
    minLength: schema.minLength,
    maxLength: schema.maxLength,
    minimum: schema.minimum,
    maximum: schema.maximum,
    pattern: schema.pattern,
    enum: schema.enum,
    enumDesc: schema.enumDesc,
    format: schema.format,
    exclusiveMinimum: schema.exclusiveMinimum,
    exclusiveMaximum: schema.exclusiveMaximum,
    items: Array.isArray(schema.items) ? undefined : schema.items, // 如果 items 是数组，则当前节点不需要 items 字段
    minItems: schema.minItems,
    maxItems: schema.maxItems,
    uniqueItems: schema.uniqueItems,
  }

  result.push(flatNode)

  // 如果有子属性（properties），递归扁平化
  if (schema.properties) {
    for (const key in schema.properties) {
      if (schema.properties[key]) {
        result = result.concat(flattenSchema(schema.properties[key]!, [...parentKey, key]))
      }
    }
  }

  // 如果有子项（items），递归扁平化
  if (schema.items) {
    if (Array.isArray(schema.items)) {
      schema.items.forEach((item, index) => {
        result = result.concat(flattenSchema(item, [...parentKey, `items[${index}]`]))
      })
    } else {
      result = result.concat(flattenSchema(schema.items, [...parentKey, 'items']))
    }
  }

  return result
}

export function getDefaultSchema(type: string): Schema {
  switch (type) {
    case 'string':
      return {
        type: 'string',
      }
    case 'number':
      return {
        type: 'number',
      }
    case 'array':
      return {
        type: 'array',
        items: {
          type: 'string',
        },
      }
    case 'object':
      return {
        type: 'object',
        properties: {},
      }
    case 'boolean':
      return {
        type: 'boolean',
      }
    case 'integer':
      return {
        type: 'integer',
      }
    default:
      throw new Error(`Unsupported type: ${type}`)
  }
}

export const handleSchema = (schema: Schema): Schema => {
  const clonedSchema = cloneDeep(schema)

  // 如果没有 type 和 properties，则默认为 string 类型
  if (!clonedSchema.type && !clonedSchema.properties) {
    clonedSchema.type = 'string'
  }

  // 如果没有 type，但有 properties，则推断为 object 类型
  if (!clonedSchema.type && clonedSchema.properties) {
    clonedSchema.type = 'object'
  }

  // 处理 object 类型的 schema
  if (clonedSchema.type === 'object') {
    clonedSchema.properties = clonedSchema.properties || {}

    Object.entries(clonedSchema.properties).forEach(([key, property]) => {
      if (property) {
        // 如果子属性缺失 type 且有 properties，则推断为 object 类型
        if (!property.type && property.properties) {
          property.type = 'object'
        }

        // 递归处理子属性
        clonedSchema.properties![key] = handleSchema(property)
      }
    })
  }
  // 处理 array 类型的 schema
  else if (clonedSchema.type === 'array') {
    if (!clonedSchema.items) {
      // 如果 items 缺失，默认设置为单一对象类型的 string
      clonedSchema.items = { type: 'string' }
    }

    if (Array.isArray(clonedSchema.items)) {
      // 如果 items 是数组，递归处理每个 item
      clonedSchema.items = clonedSchema.items.map((item) => handleSchema(item))
    } else {
      // 如果 items 是单一对象，递归处理
      clonedSchema.items = handleSchema(clonedSchema.items)
    }
  }

  return clonedSchema
}
