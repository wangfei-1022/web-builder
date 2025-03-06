import { request } from '@/utils';
import type { Result«Map«string,object»» } from '../interfaces';

/**
 * healthCheck
 */
export function healthCheckUsingGET(
) {
  return request<OptimizeModel<Result«Map«string,object»»>>({
    url: `${__BASE_SERVICE__}/_health/checking`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * forwardingToSwagger
 */
export function forwardingToSwaggerUsingGET(
) {
  return request<void>({
    url: `${__BASE_SERVICE__}/swagger-ui.html`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}