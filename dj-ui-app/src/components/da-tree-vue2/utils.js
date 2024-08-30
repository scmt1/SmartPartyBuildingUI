/** 未选 */
export const unCheckedStatus = 0
/** 半选 */
export const halfCheckedStatus = 1
/** 选中 */
export const isCheckedStatus = 2

/**
 * 深拷贝内容
 * @param obj 拷贝对象
 * @author crlang(https://crlang.com)
 */
export function deepClone(obj) {
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }
  let res
  if (obj instanceof Array) {
    res = []
  } else {
    res = {}
  }
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      res[key] = deepClone(obj[key])
    }
  }
  return res
}

/**
 * 获取所有指定的节点
 * @param type
 * @param value
 */
export function getAllNodes(list, type, value) {
  if (!list || list.length === 0) {
    return []
  }

  const res = []
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item[type] === value) {
      res.push(item)
    }
  }

  return res
}

/**
 * 获取所有指定的key值
 * @param type
 * @param value
 */
export function getAllNodeKeys(list, type, value) {
  if (!list || list.length === 0) {
    return []
  }

  const res = []
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item[type] === value) {
      res.push(item.key)
    }
  }

  return res
}
