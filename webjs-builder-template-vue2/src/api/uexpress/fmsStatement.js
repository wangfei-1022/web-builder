import request from '@/utils/request'

export function getStatementListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/account/log/list`,
    method: 'get',
    params
  })
}

export function exportStatementListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/settlement/account/log/list/syncExport`,
    method: 'get',
    params
  })
}
