import request from '@/utils/request'
/**
 * 获取提单列表数据
 * @param {*} params
 * @returns
 */
export function getContainerTransferListApi(params) {
  return request({
    url: `/api/ctn-service/ctn/container/node/list`,
    method: 'get',
    params
  })
}

export function downloadContainerTransferApi(params) {
  return request({
    url: `/api/ctn-service/ctn/container/node/export`,
    method: 'get',
    params
  })
}
