import i18n from '../lang'
/**
 * Created by jiachenpan on 16/11/18.
 */
// 常用的一些正则
export const commonReg = {
  english: /^[\s]|[0-9A-Za-z\s\`\~\!\#\$\%\^\&\*\(\)\_\[\]{\}\\\|\;\'\'\:\"\"\,\.\/\<\>\?]+$/,
  englishAndNumber: /^[A-Za-z\d]+$/,
  pureNumber: /^\d+$/,
  pureNumberAndBlank: /^[\d ]+$/, // 数字和空格
  pureEnglish: /^[A-Za-z]+$/,
  isNumber: /^[+]?(([1-9]\d*)|([1-9]\d*\.\d*)|(0\.\d*)|(0))$/, // 带小数的数字
  englishArea: /^[A-Za-z\s\!\#\$\%]+$/, // 英文区域地域
  englishAndNumberArea: /^[A-Za-z\d\s\!\#\$\%]+$/, // 英文和数字区域地域
  chineseRepace: /[\u4E00-\u9FA5]/ // 只能输入中文正则
}
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

export function validUpperCase(str) {
  const reg = /^[A-Z_-]+$/
  return reg.test(str)
}

export function validUpperCaseStrict(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

export function validateEmail(email) {
  const reg = /^((([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6}\;))*(([A-Za-z0-9_\.-]+)@([\dA-Za-z\.-]+)\.([A-Za-z\.]{2,6})))$/
  return reg.test(email)
}

export function validSo(val) {
  const reg = /^[A-Za-z0-9].*[0-9]{4}$/
  return reg.test(val)
}
// 正则匹配英文和数字，且开头不能为"0"
export function englishNumbers(val) {
  const reg = /^[a-zA-Z1-9][a-zA-Z0-9]*$/
  return reg.test(val)
}

// 正则匹配英文和数字
export function validateNumOrEnglish(val) {
  const reg = /^[a-zA-Z0-9]*$/
  return reg.test(val)
}

export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// 税号
export function validateTaxNum(val) {
  const reg = /^[a-zA-Z0-9()]{6,20}$/
  return reg.test(val)
}

// 身份证
export function validateIdentity(val) {
  const reg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return reg.test(val)
}

// 座机
export function validateCorporateTelephone(val) {
  const reg = /^[()0-9-\s]+$/
  return reg.test(val)
}

// 手机号码格式校验
export function validateMobile(val) {
  const reg = /^1[3|4|5|6|7|8][0-9]{9}$/
  return reg.test(val)
}

/**
 * 校验是否为正整数
 * @param str
 */
export function validatePInt(str) {
  const reg = new RegExp('^[0-9]\\d*$')
  return reg.test(str)
}
/**
 * 校验是否为数字
 * @param str
 */
export function validateNumber(str) {
  const reg = new RegExp(/^[+]?(([1-9]\d*)|([1-9]\d*\.\d*)|(0\.\d*)|(0))$/)
  return reg.test(str)
}
// 校验最多输入四位小数
export function validDecima4(value) {
  let reg = /^\d+(\.\d{1,4})?$/
  return reg.test(value)
}

// 校验最多输入二位小数
export function validDecima2(value) {
  let reg = /^\d+(\.\d{1,2})?$/
  return reg.test(value)
}

// 国家邮编的一些正则
export const zipCodeReg = {
  CA: /^[a-zA-Z][0-9][a-zA-Z][0-9][a-zA-Z][0-9]$/,
  US: /^\d{3}([0-9]*)[-]?([0-9]+)$/,
  FR: /^\d{5}$/,
  DE: /^\d{5}$/,
  PL: /^\d{5}$/,
  GB: /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/
}

export function validateZipCode(country, value) {
  value = value.replace(/\s+/g, "")
  if (!country || !zipCodeReg[country]) {
    return true
  }
  return zipCodeReg[country].test(value)
}
// 大于0的数字
export function validNumerGreaterZero(value) {
  let reg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/
  return reg.test(value)
}
/**
 * 校验只能输入大写英文字母
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function upperCaseValid(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!validUpperCase(value)) {
    callback(new Error(!rule.message ? '只能输入大写英文字母或者下划线' : rule.message))
  }
  callback()
}
/*
**
 * 校验只能输入大写英文字母
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function upperCaseStrict(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!validUpperCaseStrict(value)) {
    callback(new Error(!rule.message ? '只能输入大写英文字母' : rule.message))
  }
  callback()
}

/*
**
 * 校验只能输入字母和数字
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function checkNumOrEnglish(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!validateNumOrEnglish(value)) {
    callback(new Error(!rule.message ? '只能输入英文或数字' : rule.message))
  }
  callback()
}
/**
 * 校验是否为正整数
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function pIntValidator(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!validatePInt(value)) {
    callback(new Error(!rule.message ? '只能输入正整数' : rule.message))
  }
  callback()
}
/**
 * 校验是否为数字
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function isNumber(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!validateNumber(value)) {
    callback(new Error(!rule.message ? '请输入正确的数字' : rule.message))
  }
  callback()
}
/**
 * 校验SO规则
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validSoNumber(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!validSo(value)) {
    callback(new Error(!rule.message ? '请输入正确格式的SO' : rule.message))
  }
  callback()
}
// 验证箱号格式
export function validContainerNo(value) {
  const Charcode = '0123456789A?BCDEFGHIJK?LMNOPQRSTU?VWXYZ'
  const regex = /^[A-Z]{4}\d{7}$/
  if (!regex.test(value)) {
    return false
  }
  let num = 0
  for (let i = 0; i < 10; i++) {
    let idx = Charcode.indexOf(value[i])
    idx = idx * Math.pow(2, i)
    num += idx
  }
  num = num % 11 % 10
  return parseInt(value[10], 10) === num
}
// 验证箱号格式53HC
export function validContainerNo53HC(value) {
  const regex = /^[A-Z]{4}\d{6}$/
  if (!regex.test(value)) {
    return false
  } else {
    return true
  }
}
/**
 * 英文和数字，且开头不能为"0"
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export function validEnglishNumbers(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!englishNumbers(value)) {
    callback(new Error(!rule.message ? '请输入英文和数字，且开头不能为"0"' : rule.message))
  }
  callback()
}
/**
 * 校验小数不超过4位
 * @param {*} value
 */
export function checkDecima4(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!validDecima4(value)) {
    return callback(new Error(!rule.message ? '请输入数字且小数点最多保留4位' : rule.message))
  }
  callback()
}
/**
 * 校验小数不超过2位
 * @param {*} value
 */
export function checkDecima2(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!validDecima2(value)) {
    return callback(new Error(!rule.message ? '请输入数字且小数点最多保留2位' : rule.message))
  }
  callback()
}
/**
 * 校验小数不超过2位
 * @param {*} value
 */
export function checkEmail(rule, value, callback) {
  if (!value) {
    callback()
  }
  if (!validEmail(value)) {
    return callback(new Error(!rule.message ? i18n.t('common.validateObj.emailFormatInvalid') : rule.message))
  }
  callback()
}

/*
* 通用电话号码验证
*
*/
export function checkCommonPhone(rule, value, callback) {
  const _reg = /^([+0-9-()]+)$/
  if (value) {
    if (!_reg.test(value)) {
      return callback(new Error(i18n.t('common.validateObj.telephoneFormatInvalid')))
    }
  } else {
    return callback(new Error(i18n.t('common.validateObj.telephoneEmptyInvalid')))
  }
  callback()
}

// 手机号码
export function checkCommonMobile(rule, value, callback) {
  if (value) {
    if (!validateMobile(value)) {
      return callback(new Error(i18n.t('common.validateObj.mobileFormatInvalid')))
    }
  } else {
    return callback(new Error(i18n.t('common.validateObj.mobileEmptyInvalid')))
  }
  callback()
}

/*
*非空Email验证
*
*/
export function noEmptyEmail(rule, value, callback) {
  if (value) {
    if (!validEmail(value)) {
      return callback(new Error(i18n.t('common.validateObj.emailFormatInvalid')))
    } else {
      callback()
    }
  } else {
    return callback(new Error(i18n.t('common.validateObj.emailEmptyInvalid')))
  }
}
/*
*非空Email验证
*
*/
export function checkNumerGreaterZero(rule, value, callback) {
  if (value) {
    if (!validNumerGreaterZero(value)) {
      return callback(new Error('请输入大于0的数字'))
    } else {
      callback()
    }
  } else {
    return callback(new Error('请输入大于0的数字'))
  }
}

/*
* 车牌号验证
* 新能源 + 燃油
*/
export function checkPlateNo(rule, value, callback) {
  const reg = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[a-zA-Z](([DF]((?![IO])[a-zA-Z0-9](?![IO]))[0-9]{4})|([0-9]{5}[DF]))|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1})$/
  if (value) {
    if (!reg.test(value)) {
      return callback(new Error(i18n.t('common.validateObj.plateNoErr')))
    } else {
      callback()
    }
  } else {
    return callback(new Error(i18n.t('common.validateObj.plateNoErr')))
  }
}

/**
* 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
* @param num1加数1 | num2加数2
*/
export function numAdd(num1, num2) {
  let baseNum = 0
  let baseNum1 = 0
  let baseNum2 = 0
  try {
    baseNum1 = num1.toString().split(".")[1].length
  } catch (e) {
    baseNum1 = 0
  }
  try {
    baseNum2 = num2.toString().split(".")[1].length
  } catch (e) {
    baseNum2 = 0
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
  return (num1 * baseNum + num2 * baseNum) / baseNum
}

/**
* 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
* @param num1被减数 | num2减数x
*/
export function numSub(num1, num2) {
  let baseNum = 0
  let baseNum1 = 0
  let baseNum2 = 0
  let precision = 100
  try {
    baseNum1 = num1.toString().split(".")[1].length
  } catch (e) {
    baseNum1 = 0
  }

  try {
    baseNum2 = num2.toString().split(".")[1].length
  } catch (e) {
    baseNum2 = 0
  }

  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
  precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision)
}

/**
* 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
* @param num1被乘数 | num2乘数
*/
export function numMulti(num1, num2) {
  let baseNum = null
  try {
    baseNum += num1.toString().split(".")[1].length
  } catch (e) {
    //
  }

  try {
    baseNum += num2.toString().split(".")[1].length
  } catch (e) {
    //
  }

  return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum)
}

/**
* 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
* @param num1被除数 | num2除数
*/
export function numDiv(num1, num2) {
  let baseNum1 = 0
  let baseNum2 = 0
  let baseNum3 = null
  let baseNum4 = null
  try {
    baseNum1 = num1.toString().split(".")[1].length
  } catch (e) {
    baseNum1 = 0
  }

  try {
    baseNum2 = num2.toString().split(".")[1].length
  } catch (e) {
    baseNum2 = 0
  }

  baseNum3 = Number(num1.toString().replace(".", ""))
  baseNum4 = Number(num2.toString().replace(".", ""))
  return baseNum3 / baseNum4 * Math.pow(10, baseNum2 - baseNum1)
}

export default {
  pInt: pIntValidator,
  validUpperCase: upperCaseValid,
  upperCaseStrict,
  isNumber,
  validContainerNo,
  validSoNumber,
  checkDecima4,
  validateMobile,
  checkDecima2,
  checkEmail,
  noEmptyEmail,
  checkCommonPhone,
  checkCommonMobile,
  checkNumerGreaterZero,
  checkPlateNo
}

