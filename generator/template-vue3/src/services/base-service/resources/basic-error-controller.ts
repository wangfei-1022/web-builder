import { request } from '@/utils';

/**
 * error
 */
export function errorUsingGET(
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/error`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * error
 */
export function errorUsingPUT(
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/error`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * error
 */
export function errorUsingPOST(
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/error`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * error
 */
export function errorUsingDELETE(
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/error`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * error
 */
export function errorUsingOPTIONS(
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/error`,
    method: 'OPTIONS',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * error
 */
export function errorUsingHEAD(
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/error`,
    method: 'HEAD',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * error
 */
export function errorUsingPATCH(
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/error`,
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}