export interface Schema {
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
  items?: Schema | Schema[]
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
}

export interface FlatSchema {
  id: string
  name: string
  keyPath: string[]
  keyPathString: string
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
