import request from '@/utils/request'
// 异常接口日志-列表
export function getInterfaceLogListApi(params) {
  return request({
    url: `/api/ovl-service/ovl/interface/log/pages`,
    method: 'get',
    params
  })
}
// 异常接口日志-列表详情
export function detailInterfaceLogApi(id) {
  return request({
    url: `/api/ovl-service/ovl/interface/log/detail/${id}`,
    method: 'get'
  })
}
