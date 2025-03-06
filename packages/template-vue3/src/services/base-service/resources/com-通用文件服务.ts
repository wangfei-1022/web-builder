import { request } from '@/utils';
import type { ComDelAndAddFileByEntityIdFileCodeDTO, Result, Result«Array«byte»», Result«CloudFileVerboseVO», Result«ComFileElectronDTO», Result«int», Result«List«CloudFileSupplierVO»», Result«List«CloudFileVerboseVO»», Result«List«CloudFileVO»», Result«List«ComFileElectronDTO»», Result«List«string»», Result«List«文件批量保存request»», Result«long», Result«PageInfo«ComFileElectronDTO»», Result«string», 文件批量保存request0, 文件批量删除DTO, 根据entityId更新请求, 根据单据列表批量获取文件, 根据单据获取文件, 第三方 通用文件上传请求DTO } from '../interfaces';

/**
 * 根据云存储文件名下载云文件
 * @param params 参数
 */
export function getFileInputStreamUsingGET(
  params?: {
    /** cloudFileName */
    cloudFileName?: string;
  },
) {
  return request<OptimizeModel<Result«Array«byte»»>>({
    url: `${__BASE_SERVICE__}/cloud/download/cloudFileName`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * queryCloudFileAppointBucketName
 * @param data 数据
 */
export function queryCloudFileAppointBucketNameUsingPOST(
  data: 根据单据获取文件,
) {
  return request<OptimizeModel<Result«List«CloudFileVerboseVO»»>>({
    url: `${__BASE_SERVICE__}/cloud/file/appointBucket/query`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 根据云存储文件名获取云存储url
 * @param params 参数
 */
export function getCloudFileUrlByUsingGET(
  params?: {
    /** cloudFileName */
    cloudFileName?: string;
  },
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/cloud/url/cloudFileName`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据云存储文件名获取云存储url
 * @param params 参数
 */
export function getCloudFileUrlByUsingGET_1(
  params: {
    /** cloudFileNames */
    cloudFileNames: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«CloudFileVO»»>>({
    url: `${__BASE_SERVICE__}/cloud/url/cloudFileNames`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据文件id获取云存储的url
 * @param params 参数
 */
export function getCloudFileUrlByFilesIdUsingGET(
  params?: {
    /** fileId */
    fileId?: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cloud/url/fileId`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据文件entityIds获取云存储的urls
 * @param params 参数
 */
export function getCloudFileUrlsByEntityIdUsingGET(
  params: {
    /** entityIds */
    entityIds: number | number[];
  },
) {
  return request<OptimizeModel<Result«List«文件批量保存request»»>>({
    url: `${__BASE_SERVICE__}/cloud/urls/entityIds`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据文件ids获取云存储的urls
 * @param params 参数
 */
export function getCloudFileUrlsByFilesIdsUsingGET(
  params: {
    /** fileIds */
    fileIds: number | number[];
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/cloud/urls/fileIds`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * getCloudFileVerboseByEntityId
 * @param entityId entityId
 */
export function getCloudFileVerboseByEntityIdUsingGET_1(
  entityId: number,
) {
  return request<OptimizeModel<Result«List«CloudFileSupplierVO»»>>({
    url: `${__BASE_SERVICE__}/cloud/verbose/entityId/${entityId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * getCloudFileVerboseByEntityId
 * @param entityId entityId
 * @param entityType entityType
 */
export function getCloudFileVerboseByEntityIdUsingGET(
  entityId: number,
  entityType: string,
) {
  return request<OptimizeModel<Result«List«CloudFileVerboseVO»»>>({
    url: `${__BASE_SERVICE__}/cloud/verbose/entityType/${entityType}/entityId/${entityId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 查询电子文件列表
 * @param params 参数
 */
export function queryElectronFilesUsingGET(
  params: {
    /** 文件类型代码 */
    documentTypeCode?: string;
    /** 业务实体id */
    entityId?: number;
    /** 业务实体类型 */
    entityType?: string;
    /** 业务实体对应文件类型 */
    fieldCode?: string;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 所属从Id */
    slaveId?: number;
    /** 排序 */
    sort?: string;
    /** 租户id */
    tenantId?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«ComFileElectronDTO»»>>({
    url: `${__BASE_SERVICE__}/com/file`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据文件entityIds及entityType批量获取文件信息
 * @param data 数据
 */
export function getComFileBatchUsingPOST(
  data: 根据单据列表批量获取文件,
) {
  return request<OptimizeModel<Result«List«文件批量保存request»»>>({
    url: `${__BASE_SERVICE__}/com/file/batch`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 文件根据条件批量删除
 * @param data 数据
 */
export function batchDeleteFileUsingDELETE(
  data: 文件批量删除DTO,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/file/batchDelete`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: '*/*',
    },
    data,
  });
}

/**
 * batchQueryComFile
 * @param data 数据
 */
export function batchQueryComFileUsingPOST(
  data: 根据单据列表批量获取文件,
) {
  return request<OptimizeModel<Result«List«ComFileElectronDTO»»>>({
    url: `${__BASE_SERVICE__}/com/file/batchQuery`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 文件批量保存
 * @param data 数据
 */
export function comFileBatchSaveUsingPOST(
  data: 文件批量保存request0[],
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/file/batchSave`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * deleteByEntityId
 * @param entityId entityId
 */
export function deleteByEntityIdUsingDELETE(
  entityId: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/com/file/byEntityId/${entityId}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * deleteByEntityId
 * @param entityIds entityIds
 */
export function deleteByEntityIdUsingDELETE_1(
  entityIds: string,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/com/file/byEntityIds`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 文件批量删除后再保存
 * @param data 数据
 */
export function delAndAddFileUsingPUT(
  data: 文件批量保存request0[],
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/com/file/delAndAddFile`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 文件根据entityId批量删除后再保存
 * @param data 数据
 */
export function delAndAddFileByEntityIdUsingPUT(
  data: number,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/com/file/delAndAddFileByEntityId`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 文件根据entityId和filecode批量删除后再保存
 * @param data 数据
 */
export function delAndAddFileByEntityIdFileCodeUsingPUT(
  data: ComDelAndAddFileByEntityIdFileCodeDTO,
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/com/file/delAndAddFileByEntityIdFileCode`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * detailsByIds
 * @param params 参数
 */
export function detailsByIdsUsingGET(
  params: {
    /** ids */
    ids: number | number[];
  },
) {
  return request<OptimizeModel<Result«List«ComFileElectronDTO»»>>({
    url: `${__BASE_SERVICE__}/com/file/details/ids`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 通过id获取文件详细信息
 * @param id id
 */
export function detailsByIdUsingGET(
  id: number,
) {
  return request<OptimizeModel<Result«ComFileElectronDTO»>>({
    url: `${__BASE_SERVICE__}/com/file/details/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 根据文件entityId和类型获取文件信息
 * @param entityId entityId
 * @param entityType entityType
 */
export function getComFileByEntityIdUsingGET(
  entityId: number,
  entityType: string,
) {
  return request<OptimizeModel<Result«List«文件批量保存request»»>>({
    url: `${__BASE_SERVICE__}/com/file/entityId/${entityType}/${entityId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 单个文件保存(返回file主键id)
 * @param data 数据
 */
export function comFileSaveUsingPOST(
  data: 文件批量保存request0,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/file/save`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * saveBatchOrIgnoreOrDelete
 * @param entityId entityId
 * @param entityType entityType
 * @param data 数据
 */
export function saveBatchOrIgnoreOrDeleteUsingPOST_1(
  entityId: number,
  entityType: string,
  data: 文件批量保存request0[],
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/com/file/saveBatchOrIgnoreOrDelete/entityType/${entityType}/${entityId}`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * saveBatchOrIgnoreOrDelete
 * @param entityId entityId
 * @param data 数据
 */
export function saveBatchOrIgnoreOrDeleteUsingPOST(
  entityId: number,
  data: 文件批量保存request0[],
) {
  return request<OptimizeModel<Result«int»>>({
    url: `${__BASE_SERVICE__}/com/file/saveBatchOrIgnoreOrDelete/${entityId}`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 删除
 * @param id id
 */
export function deleteUsingDELETE_2(
  id: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/com/file/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取文件上传路径
 */
export function getOssPathUsingGET(
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/oss/xpath`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 获取文件上传路径集合
 * @param params 参数
 */
export function getOssPathsUsingGET(
  params?: {
    /** num */
    num?: number;
  },
) {
  return request<OptimizeModel<Result«List«string»»>>({
    url: `${__BASE_SERVICE__}/oss/xpaths`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 第三方通用文件上传-返回上传文件id绑定业务id
 * @param id id
 * @param data 数据
 */
export function thirdUploadBindUsingPUT(
  id: number,
  data: 根据entityId更新请求,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/third/upload/bind/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 第三方通用文件上传-返回上传文件id
 * @param data 数据
 */
export function thirdUploadUsingPOST(
  data: 第三方 通用文件上传请求DTO,
) {
  return request<OptimizeModel<Result«long»>>({
    url: `${__BASE_SERVICE__}/third/upload/file`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 通用文件上传(只上传云存储)
 * @param data 数据
 */
export function fileUploadUsingPOST(
  data: Blob,
) {
  return request<OptimizeModel<Result«CloudFileVerboseVO»>>({
    url: `${__BASE_SERVICE__}/web/upload/file`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
      contentType: 'multipart/form-data',
    },
    data,
  });
}