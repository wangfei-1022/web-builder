// 小包
import request from '@/utils/request'

// 理赔-保险公司-列表
export function getInsuranceClaimListApi(params) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/insurer/list`,
    method: 'get',
    params
  })
}


// 理赔-保险公司-推送-保险理赔发起
export function pushInsuranceClaimApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/insurer/push/insurer`,
    method: 'post',
    data
  })
}

// 理赔-保险公司-推送补充资料
export function pushInsuranceClaimFixedApi(data) {
  return request({
    url: `/api/ilp-service/omc/ilp/claim/insurer/push/insurer/addon`,
    method: 'post',
    data
  })
}
