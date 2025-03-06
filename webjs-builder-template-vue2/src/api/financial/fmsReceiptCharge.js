import request from '@/utils/request'

export function setEstimateEntryBillDate(data) {
  return request({
    url: `/api/fms-service/omc/fms/charge/ar/entry/date`,
    method: 'put',
    data
  })
}
