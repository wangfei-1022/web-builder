import request from '@/utils/request'

// 汇率-获取年度汇率月份
export function getRateByYearApi(data) {
  return request({
      url: `/api/fms-service/omc/fms/exchangerate/month/list/${data.officeId}/${data.year}`,
      method: 'get'
  })
}

// 汇率-新增
export function addRateApi(data) {
  return request({
      url: `/api/fms-service/omc/fms/exchangerate/new`,
      method: 'post',
      data
  })
}

// 汇率-更新
export function updateRateApi(data) {
  return request({
      url: `/api/fms-service/omc/fms/exchangerate/update/${data.id}`,
      method: 'post',
      data
  })
}

// 汇率-调整汇率
export function adjustRateApi(data) {
  return request({
      url: `/api/fms-service/omc/fms/exchangerate/adjustrate`,
      method: 'post',
      data
  })
}

// 汇率-发布
export function publishRateApi(id) {
  return request({
      url: `/api/fms-service/omc/fms/exchangerate/publish/${id}`,
      method: 'post'
  })
}

// 汇率-删除
export function deleteRateApi(id) {
  return request({
      url: `/api/fms-service/omc/fms/exchangerate/delete/${id}`,
      method: 'delete'
  })
}
