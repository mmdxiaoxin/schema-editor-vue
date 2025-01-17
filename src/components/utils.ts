import type Schema from '@/components/types/schema'

export interface FlatSchema {
  id: number
  keyPath: string[]
  title?: string
  type: string
  properties?: Record<string, Schema>
  required?: string[]
  description?: string
  default?: boolean | string
  mock?: string | { mock: string }
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  pattern?: string
  enum?: string[] | number[]
  enumDesc?: string
  format?: string
  exclusiveMinimum?: boolean
  exclusiveMaximum?: boolean
  items?: Schema
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
}

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
