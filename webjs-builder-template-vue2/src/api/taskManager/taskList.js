import request from '@/utils/request'

/**
 * 获取货品列表
 * @returns {*}
 */

 export function getTaskListApi(params) {
  return request({
    url: `/api/mdm-service/com/task/monitor/operation/list`,
    method: 'get',
    params
  })
}
