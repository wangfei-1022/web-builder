import request from '@/utils/request'
/**
 * 获取州省郡列表
 * @param {*} params
 * @returns
 */
export function getDivisionPageListApi(params) {
  return request({
    url: `/api/mdm-service/dmn/administrative/division/page`,
    method: 'get',
    params
  })
}
/**
 * 州省郡信息新增
 * @param {*} params
 * @returns
 */
export function saveDivisionApi(data) {
  return request({
    url: `/api/mdm-service/dmn/administrative/division`,
    method: 'post',
    data
  })
}