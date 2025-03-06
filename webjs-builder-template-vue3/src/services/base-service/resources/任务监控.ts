import { request } from '@/utils';
import type { comTaskMonitorDTO, ComTaskWithCloudFileDTO, ComTaskWithExportFileDTO, CreateImportFileTaskDTO, CreateTaskDTO, ExecuteExportFileTaskSuccessDTO, ExecuteImportFileTaskFailDTO, ExecuteImportFileTaskSuccessDTO, ExecuteTaskBeginDTO, ExecuteTaskFailDTO, ExecuteTaskSuccessDTO, NotifySendEmailTaskDTO, Result«boolean», Result«comTaskMonitorDTO», Result«int», Result«PageInfo«comTaskMonitorDTO»» } from '../interfaces';

/**
 * 保存
 * @param data 数据
 */
export function insertUsingPOST(
  data: comTaskMonitorDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 查询详情
 * @param id id
 */
export function getByIdUsingGET_2(
  id: number,
) {
  return request<OptimizeModel<Result«comTaskMonitorDTO»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/detail/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * notifySendEmail
 * @param data 数据
 */
export function notifySendEmailUsingPOST(
  data: NotifySendEmailTaskDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/email/send`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * executeTaskBegin
 * @param data 数据
 */
export function executeTaskBeginUsingPOST(
  data: ExecuteTaskBeginDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/execute/begin`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * executeTaskFail
 * @param data 数据
 */
export function executeTaskFailUsingPOST(
  data: ExecuteTaskFailDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/execute/fail`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * executeTaskSuccess
 * @param data 数据
 */
export function executeTaskSuccessUsingPOST(
  data: ExecuteTaskSuccessDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/execute/success`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * executeExportFileTaskSuccess
 * @param data 数据
 */
export function executeExportFileTaskSuccessUsingPOST(
  data: ExecuteExportFileTaskSuccessDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/export/file/execute/success`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * executeImportFileTaskFail
 * @param data 数据
 */
export function executeImportFileTaskFailUsingPOST(
  data: ExecuteImportFileTaskFailDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/import/file/execute/fail`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * executeImportFileTaskSuccess
 * @param data 数据
 */
export function executeImportFileTaskSuccessUsingPOST(
  data: ExecuteImportFileTaskSuccessDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/import/file/execute/success`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 查询列表
 * @param params 参数
 */
export function queryUsingGET_2(
  params: {
    /** createBy */
    createBy?: number;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** platformCode */
    platformCode?: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«comTaskMonitorDTO»»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 运营端查询列表
 * @param params 参数
 */
export function operationQueryUsingGET(
  params: {
    /** createBy */
    createBy?: number;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** platformCode */
    platformCode?: number;
    /** 排序 */
    sort?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«comTaskMonitorDTO»»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/operation/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * exportFileWithSubscribeRocket
 * @param data 数据
 */
export function exportFileWithSubscribeRocketUsingPOST(
  data: ComTaskWithExportFileDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/rocket/add/exportFile/withSubscribe`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * saveFileWithSubscribeRocket
 * @param data 数据
 */
export function saveFileWithSubscribeRocketUsingPOST(
  data: ComTaskWithCloudFileDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/rocket/add/saveFile/withSubscribe`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * createTaskRocket
 * @param data 数据
 */
export function createTaskRocketUsingPOST(
  data: CreateTaskDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/rocket/create`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * createImportFileTaskRocket
 * @param data 数据
 */
export function createImportFileTaskRocketUsingPOST(
  data: CreateImportFileTaskDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/rocket/import/file/create`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * updateTaskAndSendSubscribe
 * @param data 数据
 */
export function updateTaskAndSendSubscribeUsingPUT(
  data: ComTaskWithCloudFileDTO,
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/update`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 更新
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_3(
  id: number,
  data: comTaskMonitorDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/com/task/monitor/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}