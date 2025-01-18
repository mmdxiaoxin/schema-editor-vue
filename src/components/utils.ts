import type { FlatSchema, Schema } from '@/components/types/schema'
import { cloneDeep } from 'lodash-es'

// 扁平化的函数，加入索引参数
export const flattenSchema = (
  schema: Schema,
  parentKey: string[] = [],
  index = { value: 0 },
): FlatSchema[] => {
  let result: FlatSchema[] = []

  // 当前节点
  const flatNode: FlatSchema = {
    id: index.value++,
    keyPath: parentKey,
    keyPathString: parentKey.join('.'),
    name: parentKey.length > 0 ? parentKey[parentKey.length - 1] : 'ROOT',
    title: schema.title,
    type: schema.type,
    value: schema.value,
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
    items: schema.items,
    minItems: schema.minItems,
    maxItems: schema.maxItems,
    uniqueItems: schema.uniqueItems,
  }

  result.push(flatNode)

  // 如果有子属性（properties），递归扁平化
  if (schema.properties) {
    for (const key in schema.properties) {
      if (schema.properties[key]) {
        result = result.concat(
          flattenSchema(
            schema.properties[key]!,
            [...parentKey, key], // 通过数组扩展 parentKey 构造路径
            index,
          ),
        )
      }
    }
  }

  // 如果有子项（items），递归扁平化
  if (schema.items) {
    result = result.concat(flattenSchema(schema.items, [...parentKey, '[]'], index))
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

  if (clonedSchema && !clonedSchema.type && !clonedSchema.properties) {
    clonedSchema.type = 'string'
  }

  if (
    !clonedSchema.type &&
    clonedSchema.properties &&
    typeof clonedSchema.properties === 'object'
  ) {
    clonedSchema.type = 'object'
  }

  if (clonedSchema.type === 'object') {
    if (!clonedSchema.properties) {
      clonedSchema.properties = {}
    }

    if (clonedSchema.properties && typeof clonedSchema.properties === 'object') {
      Object.keys(clonedSchema.properties).forEach((key) => {
        const property = clonedSchema.properties![key]
        if (
          property &&
          !property.type &&
          property.properties &&
          typeof property.properties === 'object'
        ) {
          property.type = 'object'
        }
        if (property && (property.type === 'array' || property.type === 'object')) {
          clonedSchema.properties![key] = handleSchema(property)
        }
      })
    }
  } else if (clonedSchema.type === 'array') {
    if (!clonedSchema.items) {
      clonedSchema.items = { type: 'string' }
    }
    clonedSchema.items = handleSchema(clonedSchema.items)
  }

  return clonedSchema
}
