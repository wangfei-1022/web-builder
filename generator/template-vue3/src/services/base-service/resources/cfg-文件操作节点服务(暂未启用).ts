import { request } from '@/utils';
import type { CfgDocumentNode, Result } from '../interfaces';

/**
 * 数据同步api
 * @param data 数据
 */
export function synDataUsingPOST(
  data: CfgDocumentNode,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/document/node/syndata`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}