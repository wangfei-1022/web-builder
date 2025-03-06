// set function parseTime,formatTime to filter
export { parseTimeZoneStr, parseTimeZone, parseTime, formatTime, toThousandsAndFixDecimalFilter as _toThousandsAndFixDecimalFilter, formatCurrency, formatCurrencyName } from '@/utils'
import { parseTime, formatNumberToThousands, handlerTimeStr } from '@/utils/index'

import moment from 'moment'
import { isEmptyObject } from '../utils/objectUtils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function parseDate(time) {
  return parseTime(time, '{y}-{m}-{d}')
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

// 千分位
export function numberToThousands(num, isFixDecimal = true) {
  return formatNumberToThousands(num, isFixDecimal)
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
/**
 *
 * @param {*} date 时间戳
 * @param {*} fmt 目标字符串格式 默认 YYYY-MM-DD HH:mm
 * @returns
 */
export function formatDate(date, fmt, defaultVal) {
  if (isEmptyObject(date)) {
    return defaultVal || null
  }
  date = Number(date)
  fmt = fmt || 'YYYY-MM-DD HH:mm'
  return moment(date).format(fmt)
}
/**
 *
 * @param {*} date 时间戳
 * @param {*} zone 时区 默认当前时区
 * @param {*} defaultVal
 * @returns
 */
export function formatDateStr(date, zone, defaultVal) {
  if (isEmptyObject(date)) {
    return defaultVal || null
  }
  let currentZone = -new Date().getTimezoneOffset() / 60
  zone = zone || currentZone
  return handlerTimeStr(date, zone)
}
