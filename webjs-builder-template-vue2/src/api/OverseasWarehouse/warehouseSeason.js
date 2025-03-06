import request from '@/utils/request'
// 获取仓库旺季时间-列表
export function getWarehousePeakSeasonListApi(params) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/peak/season/time/list/pages`,
    method: 'get',
    params
  })
}
// 获取仓库旺季时间-提交
export function submitWarehousePeakSeasonListApi(data) {
  return request({
    url: data.id ? `/api/ovl-service/omc/ovl/warehouse/peak/season/time/${data.id}/submit` : `/api/ovl-service/omc/ovl/warehouse/peak/season/time/submit`,
    method: data.id ? 'put' : 'post',
    data
  })
}
// 获取仓库旺季时间-详情
export function detailWarehousePeakSeasonApi(id) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/peak/season/time/detail/${id}`
  })
}
// 更新状态生效
export function updateStatusActiveApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/peak/season/time/${data.id}/active`,
    method: 'put'
  })
}

// 更新状态生效
export function updateStatusInactiveApi(data) {
  return request({
    url: `/api/ovl-service/omc/ovl/warehouse/peak/season/time/${data.id}/inactive`,
    method: 'put'
  })
}

