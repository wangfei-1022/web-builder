import { request } from '@/utils';

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/archaius`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_1(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/beans`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_2(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/caches`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingDELETE(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/caches`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_3(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/caches/${cache}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingDELETE_1(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/caches/${cache}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_4(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/conditions`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_5(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/configprops`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_6(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/env`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_7(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/env/${toMatch}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_8(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/features`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_9(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/health`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_10(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/health/**`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_11(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/heapdump`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_12(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/info`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_13(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/logfile`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_14(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/loggers`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_15(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/loggers/${name}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingPOST(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/loggers/${name}`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_16(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/mappings`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_17(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/metrics`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_18(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/metrics/${requiredMetricName}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_19(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/nacosconfig`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_20(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/nacosdiscovery`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingPOST_1(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/refresh`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_21(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/scheduledtasks`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_22(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/sentinel`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_23(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/service-registry`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingPOST_2(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/service-registry`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * handle
 * @param data 数据
 */
export function handleUsingGET_24(
  data: any,
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator/threaddump`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}