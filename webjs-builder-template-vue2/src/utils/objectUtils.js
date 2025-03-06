/**
 * 判断对象是否为null或者undefined
 * @param {*} obj
 */
export function isNullOrUndefined(obj) {
  return typeof obj === 'undefined' || obj === null
}
/**
*  判断对象是否为空
*
* @param obj
* @returns {boolean}
*/
export function isEmptyObject(obj) {
  if (isNullOrUndefined(obj) || obj === '') {
    return true
  }
  // 兼容arra自定义属性
  if (typeof obj === 'object') {
    if (objectIsArray(obj)) {
      return obj.length === 0
    }
    if (obj instanceof Date) {
      return false
    }
    for (let name in obj) {
      return false
    }
  } else {
    return false
  }
  return true
}
/**
*  判断对象不为空
*
* @param obj
* @returns {boolean}
*/
export function isNotEmptyObject(obj) {
  return !isEmptyObject(obj)
}
/**
* 将空对象转换成空串
* @param {*} obj
* @returns @code (typeof (obj) === 'undefined' || obj === null) return '' else return obj
*/
export function convertEmpty(obj) {
  return isNullOrUndefined(obj) ? '' : obj
}

/**
* 判断对象是否为函数
* @param obj
* @returns {boolean}
*/
export function objectIsFunction(obj) {
  return typeof obj === 'function' && typeof obj.nodeType !== 'number'
}
/**
* 判断对象是否为数组
* @param obj
* @returns {boolean}
*/
export function objectIsArray(obj) {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

/**
* 判断是否为单纯的对象
* @param obj
*/
function isPlainObject(obj) {
  let proto, ctor, toString, hasOwn, fnToString
  let class2type = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Object]': 'object'
  }
  toString = class2type.toString
  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false
  }
  proto = Object.getPrototypeOf(obj)
  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true
  }
  hasOwn = class2type.hasOwnProperty
  fnToString = hasOwn.toString
  // Objects with prototype are plain iff they were constructed by a global Object function
  ctor = hasOwn.call(proto, 'constructor') && proto.constructor
  return typeof ctor === 'function' && fnToString.call(ctor) === fnToString.call(Object)
}

/**
* 对象继承
* @returns {Object|{}|default|any}
*/
export function extendObjects() {
  let options
  let name
  let src
  let copy
  let copyIsArray
  let clone
  let target = arguments[0] || {}
  let i = 1
  const length = arguments.length
  let deep = false

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target

    // Skip the boolean and the target
    target = arguments[i] || {}
    i++
  }
  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !objectIsFunction(target)) {
    target = {}
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    options = arguments[i]
    if (options !== null) {
      // Extend the base object
      for (name in options) {
        src = target[name]
        copy = options[name]

        // Prevent never-ending loop
        if (target === copy) {
          continue
        }

        // Recurse if we're merging plain objects or arrays
        copyIsArray = Array.isArray(copy)
        if (deep && copy && (isPlainObject(copy) || copyIsArray)) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && Array.isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }

          // Never move original objects, clone them
          target[name] = extendObjects(deep, clone, copy)

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }
  return target
}
/**
* 对象属性copy，将source中的属性copy到target对象中，如果target对象中不存在该属性，不拷贝
* @param {*} target
* @param {*} source
* @param ignoreFields 忽略字段
*/
export function copyProperties(target, source, ignoreFields) {
  if (isEmptyObject(source) || isEmptyObject(target)) {
    return
  }
  const hasIgnore = ignoreFields && ignoreFields.length > 0
  for (const key in target) {
    if (hasIgnore && ignoreFields.indexOf(key) !== -1) { // 如果是忽略字段，不copy
      continue
    }
    if (target.hasOwnProperty(key) && source.hasOwnProperty(key)) {
      const valObj = source[key]
      if (valObj && typeof valObj === 'object') {
        target[key] = extendObjects(true, objectIsArray(valObj) ? [] : {}, valObj)
      } else {
        target[key] = valObj
      }
    }
  }
  return target
}

/**
* 将num转换为百分比
* @param num
* @returns {string} num%
*/
export function toPercent(num) {
  return (Math.round(num * 10000) / 100).toFixed(2) + '%'
}
/**
* 判断两个对象是否相等
* @param {*} a
* @param {*} b
*/
export const objEquals = (a, b) => {
  if (a === b) {return true}
  if (!(a instanceof Array)) {return false}
  if (!(b instanceof Array)) {return false}
  if (a.length !== b.length) {return false}
  for (let i = 0; i !== a.length; ++i) {
    if (a[i] !== b[i]) {return false}
  }
  return true
}
/**
* 清空对象属性
*/
export function clearObj(obj) {
  if (isNullOrUndefined(obj) || obj === '') {
    return
  }
  if (typeof obj === 'object') {
    if (objectIsArray(obj)) {
      obj.length = 0
    } else {
      for (const key in obj) {
        if (objectIsArray(obj[key])) {
          obj[key] = []
          continue
        }
        obj[key] = null
      }
    }
  }
}

/**
* 检测图片是否存在
* @param url
*/
export function isImageExist(url) {
  return new Promise(resolve => {
    let img = new Image()
    img.onload = function() {
      if (this.complete === true) {
        resolve(true)
        img = null
      }
    }
    img.onerror = function() {
      resolve(false)
      img = null
    }
    img.src = url
  })
}

export default {
  isEmpty: isEmptyObject,
  isFunction: objectIsFunction,
  extends: extendObjects,
  copyProps: copyProperties,
  isNotEmpty: isNotEmptyObject,
  isArray: objectIsArray
}
