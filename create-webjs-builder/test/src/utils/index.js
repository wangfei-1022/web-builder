import lodash from 'lodash'
import moment from 'moment'
import { encode, decode } from 'js-base64'
/**
 * Created by jiachenpan on 16/11/18.
 */

export function decodeToken(token) {
  let userInfo = {}
  try {
    let tokenJson = decode(token.split('.')[1])
    userInfo = JSON.parse(JSON.parse(tokenJson).payload)
  } catch (err) {
    console.log(err)
  }
  return userInfo
}

export function parseTimeZoneStr(time, zoneStr, cFormat) {
  let zone = zoneStr.split(':')[0]
  if (isNaN(Number(zone))) {
    return parseTime(time, cFormat)
  }
  return parseTime(time, cFormat, Number(zone))
}

export function parseTimeZone(time, zone, cFormat) {
  return parseTime(time, cFormat, zone)
}

export function parseTime(time, cFormat, zone) {
  if (!time) {
    return null
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time, 10)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    if (typeof zone === 'number') {
      time = time + (zone + new Date().getTimezoneOffset() / 60) * 60 * 60 * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time, 10) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url === null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {Sting} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) {
      s++
    } else if (code > 0x7ff && code <= 0xffff) {
      s += 2
    }
    if (code >= 0xDC00 && code <= 0xDFFF) {
      i--
    }
  }
  return s
}

/**
 * @param {Sting} input value
 * @returns {number} output value
 */
export function byteUNICODELength(str) {
  // returns the byte length of an utf8 string
  let s = 0
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code < 0x100) {
      s++
    } else {
      s += 2
    }
  }
  return s
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) {
    return ''
  }
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) {
        return ''
      }
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/\=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 将mergeObj的数据合并至obj中，mergeObj中多余的属性也会被合并到obj中；
 * 常用于合并服务端传回的数据
 * @param {Object} obj 结构实体
 * @param {Object} mergeObj 数据实体
 * @param {Boolean} noEditMergeObj 不对mergeObj进行修改，默认会移除其中属性，出于性能考虑
 */
export const mergeMethod = function (obj, mergeObj, noEditMergeObj) {
  let _mergeObj = mergeObj
  if (noEditMergeObj) {
    _mergeObj = deepCloneMethod(mergeObj)
  }
  for (const key in obj) {
    ``
    // 只判定自身属性和合并对象值存在的情况
    if (!obj.hasOwnProperty(key) || _mergeObj[key] === undefined) {
      continue
    }
    // 判断obj子元素是否为对象/数组，如果是则递归
    if (obj[key] && typeof obj[key] === 'object' && _mergeObj[key]) {
      // 数组直接赋值
      if (_mergeObj[key] instanceof Array) {
        obj[key] = _mergeObj[key]
      } else {
        mergeMethod(obj[key], _mergeObj[key], noEditMergeObj)
      }
    } else {
      // 如果不是，直接赋值
      obj[key] = _mergeObj[key]
    }
    // 移除合并对象
    delete _mergeObj[key]
  }
  // 将_mergeObj中多余属性合并过来
  for (const key in _mergeObj) {
    obj[key] = mergeObj[key]
  }
  return obj
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }
]

// 获取相对今天的时间 如getDay(0)// 当天日期 getDay(-7)// 7天前日期
export function getDayRelativeToday(day) {
  const today = new Date()
  const targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday_milliseconds) // 注意，这行是关键代码
  const tYear = today.getFullYear()
  let tMonth = today.getMonth()
  let tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}
// 格式化月
function doHandleMonth(month) {
  let m = month
  if (month.toString().length === 1) {
    m = '0' + month
  }
  return m
}
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) {
          context = args = null
        }
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) {
      timeout = setTimeout(later, wait)
    }
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 深拷贝对象，可以正确序列化日期
 * @param {*} obj
 */
export const deepCloneMethod = function (obj) {
  const objClone = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 判断ojb子元素是否为对象，如果是，递归复制
        if (obj[key] && typeof obj[key] === 'object') {
          // 深拷贝日期类型
          if (obj[key] instanceof Date) {
            objClone[key] = new Date(obj[key].valueOf())
            // console.log('deepClone', objClone[key])
          } else {
            objClone[key] = deepCloneMethod(obj[key])
          }
        } else {
          // 如果不是，简单复制
          objClone[key] = obj[key]
        }
      }
    }
  }
  return objClone
}

export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536, 10) + ''
  return (+(randomNum + timestamp)).toString(32)
}

export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) {
    ele.className += ' ' + cls
  }
}
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

export function formatDate(date) {
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  let d = date.getDate()
  d = d < 10 ? '0' + d : d
  const h = date.getHours()
  let minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute : minute
  let second = date.getSeconds()
  second = minute < 10 ? '0' + second : second
  return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
}

export function getMonthLastDay(year, month) {
  const tempYear = year
  const tempMonth = month
  // 取当前的年份
  let new_year = year
  // 取下一个月的第一天，方便计算（最后一天不固定）
  let new_month = month++
  if (month > 12) {
    // 月份减
    new_month -= 12
    // 年份增
    new_year++
  }
  // 取当年当月中的第一天
  const new_date = new Date(new_year, new_month, 1)
  // 获取当月最后一天日期
  return tempYear + '-' + tempMonth + '-' + (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate()
}

export function toSimulateRefreshingCurrentActiveTag(obj, intermediate) {
  const visitedViews = obj.$store.state.tagsView.visitedViews
  // 当前处于激活状态的tagView对象
  const activeView = visitedViews.find(route => route.path === obj.$route.path)
  obj.$store.dispatch('tagsView/delView', activeView).then(() => {
    obj.$router.push(intermediate)
  })
}
export function toSimulateRefreshingListBackingTo(obj, name) {
  const visitedViews = obj.$store.state.tagsView.visitedViews
  const target = visitedViews.find(route => route.name === name)
  // console.log(target)
  if (target) {
    obj.$store.dispatch('tagsView/delView', target).then(() => {
      obj.$router.push({ name })
    })
  } else {
    obj.$router.push({ name })
  }
}
export function toSimulateRefreshingPageBackingTo(obj, name, query) {
  const visitedViews = obj.$store.state.tagsView.visitedViews
  const target = visitedViews.find(route => route.name === name)
  // console.log(target)
  if (target) {
    obj.$store.dispatch('tagsView/delView', target).then(() => {
      obj.$router.push({ name, query })
    })
  } else {
    obj.$router.push({ name, query })
  }
}

/**
 *
 * @param obj 被操作的对象实体 即this
 * @param targetRouter 目标路由 》》tag
 */
export function toCloseCurrentActiveTag(obj, targetRouter) {
  const visitedViews = obj.$store.state.tagsView.visitedViews
  // 当前处于激活状态的tagView对象
  const activeView = visitedViews.find(route => route.path === obj.$route.path)
  obj.$store.dispatch('tagsView/delView', activeView).then(({ visitedViews }) => {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
      obj.$router.push(targetRouter || latestView)
    } else {
      obj.$router.push(targetRouter || '/')
    }
  })
}

/*
 * 刷新指定Tag页
 */
export function toRefreshTag(obj, fullPath) {
  obj.$store.dispatch('tagsView/delCachedView', obj).then(() => {
    obj.$nextTick(() => {
      obj.$router.replace({
        path: '/redirect' + fullPath
      })
    })
  })
}
// 判断是否是数字
export function isNumber(val) {
  // if (val === '' || parseFloat(val).toString() !== 'NaN') { // 是数字 }
  const regExp = /(^-?[0-9]+\.?[0-9]+$)|(^-?[0-9]+$)/ // 正则判断数字
  return regExp.test(val + '')
}
// 截取 小数位
export function cutOutDecimalNum(value, decimalNum) {
  console.log('==cutOutDecimalNum value', value)
  const regStr = `([0-9]+[.]{1}[0-9]{${decimalNum}})[0-9]*$`
  const regExp = new RegExp(regStr)
  const result = (value + '').replace(regExp, '$1')
  console.log('==cutOutDecimalNum result', result)
  return result
}

/**
 * 对数字四舍五入(常见的)
 * @param value 语义上的数字
 * @param decimalNum 小数位数
 * @returns {String|string|*}
 */
export function roundDecimalNum(value, decimalNum = 2) {
  const num = lodash.round(value, decimalNum).toFixed(decimalNum)
  return num
}
/**
 * 数字格式转换成千分位
 *@param{Object}num
 *@param{Object}isFixDecimal 是否固定两位小数
 */
export function formatNumberToThousands(num, isFixDecimal = true) {
  if (num === null || num === undefined) {
    return ''
  }
  if (!isNumber(num)) {
    return num // 原样返回
  }
  if (isFixDecimal) {
    num = roundDecimalNum(num - 0, 2)
  }
  num = num + ''
  if (/^.*\..*$/.test(num)) { // 带小数点
    const pointIndex = num.lastIndexOf('.')
    let intPart = num.substring(0, pointIndex)
    const pointPart = num.substring(pointIndex + 1, num.length)
    intPart = intPart + ''
    const re = /(-?\d+)(\d{3})/
    while (re.test(intPart)) {
      intPart = intPart.replace(re, '$1,$2')
    }
    num = intPart + '.' + pointPart
  } else {
    num = num + ''
    const re = /(-?\d+)(\d{3})/
    while (re.test(num)) {
      num = num.replace(re, '$1,$2')
    }
  }
  return num
}



/**
 * 去除千分位
 *@param{Object}num
 */

export function formatThousandsToNumber(num) {
  const oldNum = num
  if ((num + '').trim() === '') {
    return ''
  }
  num = (num + '').replace(/,/gi, '')
  // 去除逗号后，判断是否是数字
  if (isNumber(num)) {
    return num
  } else {
    return oldNum // 不是数字 // 原样返回
  }
}

/** 设置数字到千分位并保留两位小数 默认两位*/
export function toThousandsAndFixDecimalFilter(num, decimalNum = 2) {
  if (num === null || num === '') {
    num = 0
  }
  if (isNumber(num)) {
    return formatNumberToThousands(roundDecimalNum(num - 0, decimalNum), Number(decimalNum) === 2)
  } else {
    return num
  }
}
// 小写金额转大写
export function lowerAmountToUpper(money) {
  // 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  const cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  const cnDecUnits = ['角', '分', '毫', '厘']
  // 整数金额时后面跟的字符
  const cnInteger = '整'
  // 整型完以后的单位
  const cnIntLast = '元'
  // 最大处理的数字
  const maxNum = 999999999999999.9999
  // 金额整数部分
  let integerNum
  // 金额小数部分
  let decimalNum
  // 输出的中文金额字符串
  let chineseStr = ''
  // 分离金额后用的数组，预定义
  let parts
  if (money === '') {
    return ''
  }
  money = parseFloat(money)
  if (money >= maxNum) {
    // 超出最大处理数字
    return ''
  }
  if (money === 0) {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  // 转换为字符串
  money = money.toString()
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    const IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n, 10)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 小数部分
  if (decimalNum !== '') {
    const decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
}
// 下载文件
export function downloadFile(res) {
  // blob 的方式下载
  const blob = new Blob([res.data], { type: 'application/actet-stream;charset=utf-8' })
  const contentDisposition = res.headers['content-disposition'] // 从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  const patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  const result = patt.exec(contentDisposition)
  // 文件名
  const filename = result[1]
  const downloadElement = document.createElement('a')
  const href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.style.display = 'none'
  downloadElement.href = href
  downloadElement.download = filename // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}

/**
 * 半角转全角
 * @param txtstring
 * @returns {string}
 * @constructor
 */
export function toDBC(txtstring) {
  let tmp = ''
  for (let i = 0; i < txtstring.length; i++) {
    if (txtstring.charCodeAt(i) === 32) {
      tmp = tmp + String.fromCharCode(12288)
    }
    if (txtstring.charCodeAt(i) < 127) {
      tmp = tmp + String.fromCharCode(txtstring.charCodeAt(i) + 65248)
    } else {
      tmp += String.fromCharCode(txtstring.charCodeAt(i))
    }
  }
  return tmp
}

/**
 * 全角转半角
 * @param str
 * @returns {string}
 * @constructor
 */
export function toCDB(str) {
  let tmp = ''
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 12288) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256)
      continue
    }
    if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i))
    }
  }
  return tmp
}

/**
 * 显示指定时区数据
 * time 时间戳
 * timeZone 时区
 */
export function getTimeByTimeZone(time, timeZone) {
  let d = new Date(time)
  let localTime = d.getTime()
  let localOffset = d.getTimezoneOffset() * 60000 // 获得当地时间偏移的毫秒数,这里可能是负数
  let utc = localTime + localOffset// utc即GMT时间
  let offset = timeZone // 时区，北京市+8  美国华盛顿为 -5
  let localSecondTime = utc + 3600000 * offset // 本地对应的毫秒数
  let date = localSecondTime
  return date
}
/**
 * 显示指定时区数据
 * time 时间戳
 * timeZone 时区
 */
export function getTimeByQueryTimeZone(time, timeZone) {
  let d = new Date(time)
  let localTime = d.getTime()
  let currentZone = -new Date().getTimezoneOffset() / 60
  let offset = currentZone - timeZone // 时区，北京市+8  美国华盛顿为 -5
  let localSecondTime = localTime + 3600000 * offset // 本地对应的毫秒数
  let date = localSecondTime
  return date
}
// 处理转时区时间
export function handlerTimeStr(time, zone) {
  let timeStr = time ? getTimeByTimeZone(Number(time), zone) : null
  let str = ''
  let a = `GMT${Math.abs(zone) >= 10 ? zone > 0 ? `+${zone}` : `-${zone}` : zone >= 0 ? `+0${Math.abs(zone)}` : `-0${Math.abs(zone)}`}00`
  if (timeStr) {
    str = moment(Number(timeStr)).format('YYYY-MM-DD HH:mm:ss')
    str += ' '
    str += a
  }
  return str
}

/**
 * 币种显示
 * @param {*} currency
 * @returns
 */
export function formatCurrency(currency) {
  let accountsAymbol = {
    CNY: '¥', // 人民币
    HKD: 'HK$', // 港币
    EUR: '€', // 欧元
    USD: '$', // 美元
    GBP: '£', // 英镑
    AUD: '$' // 澳元
  }
  return accountsAymbol[currency]
}
/**
 * 币种名称显示
 * @param {*} currency
 * @returns
 */
export function formatCurrencyName(currency) {
  let accountsAymbol = {
    CNY: '人民币', // 人民币
    HKD: '港币', // 港币
    EUR: '欧元', // 欧元
    USD: '美元', // 美元
    GBP: '英镑', // 英镑
    AUD: '澳元' // 澳元
  }
  return accountsAymbol[currency]
}

export function addFloatNum(n1, n2) {
  let num1 = Number(n1 || 0)
  let num2 = Number(n2 || 0)
  let sq1, sq2, m;
  try {
    sq1 = num1.toString().split(".")[1].length;
  } catch (e) {
    sq1 = 0;
  }
  try {
    sq2 = num2.toString().split(".")[1].length;
  } catch (e) {
    sq2 = 0;
  }
  m = Math.pow(10, Math.max(sq1, sq2));
  let n = sq1 >= sq2 ? sq1 : sq2;
  return ((num1 * m + num2 * m) / m).toFixed(n);
}

export function fileAssetType(fileName) {
  if (!fileName) {
    return ''
  }
  let index = fileName.lastIndexOf(".");
  let ext = fileName.substr(index + 1);
  if (ext.indexOf('?') >= 0) {
    let arr = ext.split('?')
    ext = arr[0]
  }
  return ext
}

export function isAssetTypeAnImage(fileName) {
  if (!fileName) {
    return false
  }
  // 获取最后一个.的位置
  let index = fileName.lastIndexOf(".");
  // 获取后缀
  let ext = fileName.substr(index + 1);
  if (ext.indexOf('?') >= 0) {
    let arr = ext.split('?')
    ext = arr[0]
  }
  return [
    'png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].
    indexOf(ext.toLowerCase()) !== -1;
}

export function getFileName(path) {
  let name = path.split(/[/\\]/).pop();
  return name.split('?')[0]
}

// 笛卡尔积
// elemetns [[1,2],[3,4]]
export function descartes(elements) {
  if (!Array.isArray(elements)) {
    throw new TypeError();
  }
  let end = elements.length - 1;
  let result = [];

  function addTo(curr, start) {
    let first = elements[start];
    let last = start === end;
    for (let i = 0; i < first.length; ++i) {
      let copy = curr.slice();
      copy.push(first[i]);
      if (last) {
        result.push(copy);
      } else {
        addTo(copy, start + 1);
      }
    }
  }

  if (elements.length) {
    addTo([], 0);
  } else {
    result.push([]);
  }
  return result;
}

export function isObjectEqual(obj1, obj2) {
    for (let prop in obj1) {
      if (obj1.hasOwnProperty(prop) && obj2.hasOwnProperty(prop)) {
        if (obj1[prop] !== obj2[prop]) {
          return false;
        }
      } else {
        return false;
      }
    }
    return true;
  }

export function getByteLength(str) {
    var s = 0;
    for (var i = 0; i < str.length; i++) {
        if (/[\u0391-\uFFE5]/.test(str.charAt(i))) { // 匹配中文字符（包括一些全角字符）
            s += 2;
        } else {
            s += 1;
        }
    }
    return s;
}