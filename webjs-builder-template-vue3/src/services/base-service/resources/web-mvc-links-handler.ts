import { request } from '@/utils';

/**
 * links
 */
export function linksUsingGET(
) {
  return request<OptimizeModel<any>>({
    url: `${__BASE_SERVICE__}/actuator`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}