import { request } from '@/utils';

/**
 * downloadExcelTemplateFile
 * @param params 参数
 */
export function downloadExcelTemplateFileUsingGET(
  params?: {
    /** templateName */
    templateName?: string;
  },
) {
  return request<void>({
    url: `${__BASE_SERVICE__}/template/excel/download`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}