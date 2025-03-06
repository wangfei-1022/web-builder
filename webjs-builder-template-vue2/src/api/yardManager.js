import request from '@/utils/request'
/**
 * 获取提单列表数据
 * @param {*} params
 * @returns
 */

// 堆场信息列表
export function getYardListApi(params) {
  return request({
    url: '/api/mdm-service/dmn/container/yard/list',
    method: 'get',
    params
  })
}

// 新增堆场信息
export function createYardApi(data) {
  return request({
    url: '/api/mdm-service/dmn/container/yard/save',
    method: 'post',
    data
  })
}

// 堆场信息详情
export function getYardDetailApi(id) {
  return request({
    url: `/api/mdm-service/dmn/container/yard/detail/${id}`,
    method: 'get'
  })
}

// 更新堆场信息
export function updateYardApi(id, data) {
  return request({
    url: `/api/mdm-service/dmn/container/yard/update/${id}`,
    method: 'put',
    data
  })
}
