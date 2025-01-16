export type JsonValue =
  | string // 字符串
  | number // 数字
  | boolean // 布尔值
  | null // null
  | JsonObject // 对象类型
  | JsonArray // 数组类型

// 定义 JSON 对象类型
export interface JsonObject {
  [key: string]: JsonValue // 键为字符串，值为 JsonValue 类型
}

// 定义 JSON 数组类型
export interface JsonArray extends Array<JsonValue> {}
