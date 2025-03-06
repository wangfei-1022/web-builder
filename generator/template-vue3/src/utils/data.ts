import { cloneDeep } from 'lodash';

/**
 * 是否为有效值
 * @param value 值
 */
export function isValid(value: any) {
  switch (typeof value) {
    case 'string':
      return value.length > 0;
    case 'number':
      return !Number.isNaN(value);
    case 'boolean':
      return true;
    case 'object':
      if (value === null) {
        return false;
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (value instanceof Date) {
        return !Number.isNaN(value.valueOf());
      }
      if (value?.constructor === Object) {
        return Object.keys(value).length > 0;
      }
      return true;
    default:
      return false;
  }
}

/** 优化属性 */
type OptimizeProp<T, U> = T extends null | undefined ? U : T;
/**
 * 优化对象
 * @param object 对象
 * @param invalidProp 无效属性，不传或传入 `undefined` 则删除属性，其它则赋值为传入值
 */
export function optimizeObject<
  DataType extends Record<string, any>,
  InvalidPropType = undefined
>(
  object: DataType,
  invalidProp?: InvalidPropType,
): { [Prop in keyof DataType]: OptimizeProp<DataType[Prop], InvalidPropType>; } {
  if (!(object instanceof Object)) return object;
  const result: any = cloneDeep(object);
  Object.keys(result).forEach(key => {
    if (key.startsWith('_')) {
      delete result[key];
    } else {
      if (
        result[key]?.constructor === Object ||
        result[key]?.constructor === Array
      ) {
        result[key] = optimizeObject(result[key], invalidProp);
      }
      if (!isValid(result[key])) {
        if (invalidProp === undefined) {
          delete result[key];
        } else {
          result[key] = invalidProp;
        }
      }
    }
  });
  return result;
}

/**
 * 获取比较值
 * @param value 值
 */
function getCompareValue(value: any): any {
  if (value instanceof Object) {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.map(item => getCompareValue(item)).sort().join();
    }
    if (value.id) {
      return value.id;
    }
    return JSON.stringify(value);
  }
  if (/^\d{4}(-\d{2}){2}T\d{2}(:\d{2}){2}(\.\d{3})?Z?$/.test(value)) {
    return new Date(value).toISOString();
  }
  return value;
}

/**
 * 获取对象更新
 * @param object 对象
 * @param raw 源对象
 */
export function getObjectUpdate<
  FormType extends Record<string, any>,
  DataType extends Record<string, any>,
  >(
    object: FormType,
    raw: DataType,
): { [Key in Extract<keyof FormType, keyof DataType>]?: FormType[Key]; } | null {
  const optimizedObject = optimizeObject(object, null);
  const update: any = {};
  Object.keys(optimizedObject)
    .filter(key => key in raw)
    .forEach(key => {
      if (getCompareValue(raw[key]) !== getCompareValue(optimizedObject[key])) {
        update[key] = optimizedObject[key];
      }
    });
  return isValid(update) ? update : null;
}

/**
 * 获取实体更新
 * @param object 对象
 * @param raw 源实体
 */
export function getEntityUpdate<
  FormType extends Record<string, any>,
  DataType extends Record<string, any>,
  >(
    object: FormType,
    raw: DataType,
): { [Key in Extract<'id' | 'tenantId', keyof DataType>]: DataType[Key]; } & { [Key in Extract<keyof FormType, keyof DataType>]?: FormType[Key]; } | null {
  const update: any = getObjectUpdate(object, raw);
  if (update) {
    update.id = raw.id;
    if (raw.tenantId) {
      update.tenantId = raw.tenantId;
    }
  }
  return update;
}

/**
 * 解析json字符串
 * @param value 值
 */
export function parseJsonString<ResultType = any>(value: any) {
  try {
    return JSON.parse(value) as ResultType;
  } catch (error) { }
}

/**
 * 获取错误信息
 * @param error 错误对象
 */
export function getErrorMessage(error: any): string {
  const errorData = error?.response?.data ?? error;
  // 错误数据是信息时, 返回信息
  if (typeof errorData === 'string') return errorData;
  // 错误数据是模型验证错误时, 返回第一条较验信息
  if (errorData.violations) return errorData.violations[0].message;
  // 错误数据是自定义错误时, 返回明细
  if (errorData.detail) return errorData.detail;
  // 错误数据是自定义错误时, 返回标题
  if (errorData.title) return errorData.title;
  // 错误数据是请求错误时, 返回错误信息
  if (errorData.errMsg) return errorData.errMsg;
  // 错误数据是其它时, 返回信息
  if (errorData.message) return errorData.message;
  // 错误数据是未知时，返回序列化对象字符串或未知错误
  return JSON.stringify(errorData) || '未知错误';
}