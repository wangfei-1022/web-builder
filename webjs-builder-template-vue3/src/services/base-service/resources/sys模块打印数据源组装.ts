import { request } from '@/utils';
import type { Result«Map«string,List«ReportPnrPartnerVO»»», 打印报表数据源条件参数 } from '../interfaces';

/**
 * 客商资料数据源
 * @param data 数据
 */
export function getBillDataUsingPOST(
  data: 打印报表数据源条件参数,
) {
  return request<OptimizeModel<Result«Map«string,List«ReportPnrPartnerVO»»»>>({
    url: `${__BASE_SERVICE__}/sys/report/pnr/partner`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}