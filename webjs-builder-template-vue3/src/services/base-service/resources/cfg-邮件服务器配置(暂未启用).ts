import { request } from '@/utils';
import type { CfgMailServer, Result, Result«CfgMailServer» } from '../interfaces';

/**
 * 新增/编辑
 * @param data 数据
 */
export function saveUsingPOST_2(
  data: CfgMailServer,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cfg/mail/server`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 根据tenantId查询详情(一个租户下只有一条邮件服务器配置信息)
 */
export function detailUsingGET_1(
) {
  return request<OptimizeModel<Result«CfgMailServer»>>({
    url: `${__BASE_SERVICE__}/cfg/mail/server/detail`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}