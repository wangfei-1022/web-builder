import request from '@/utils/request'

// 产品-状态
export function getProductStatusApi() {
  return request({
    url: '/api/edi-service/opn/product/status',
    method: 'get'
  })
}

// 产品-列表
export function getProductListApi(params) {
  return request({
    url: '/api/edi-service/opn/product/pages',
    method: 'get',
    params
  })
}

// 产品-新建
export function addProductApi(data) {
  return request({
    url: '/api/edi-service/opn/product',
    method: 'post',
    data
  })
}

// 产品-更新
export function updateProductApi(data) {
  return request({
    url: `/api/edi-service/opn/product/updatename/${data.id}`,
    method: 'put',
    data
  })
}

// 产品-发布
export function publishProductApi(id) {
  return request({
    url: `/api/edi-service/opn/product/release/${id}`,
    method: 'put'
  })
}

// 产品-下线
export function offlineProductApi(id) {
  return request({
    url: `/api/edi-service/opn/product/offline/${id}`,
    method: 'put'
  })
}


// 接口-状态
export function getInterfaceStatusApi() {
  return request({
    url: '/api/edi-service/opn/product/api/status',
    method: 'get'
  })
}

// 接口-列表
export function getInterfaceListApi(params) {
  return request({
    url: '/api/edi-service/opn/product/api/pages',
    method: 'get',
    params
  })
}


// 接口-新建
export function addInterfaceApi(data) {
  return request({
    url: '/api/edi-service/opn/product/api',
    method: 'post',
    data
  })
}


// 接口-获取产品
export function getInterfaceProductApi(params) {
  return request({
    url: '/api/edi-service/opn/product/list',
    method: 'get',
    params
  })
}

// 接口-新建版本
export function addInterfaceVersionApi(data) {
  return request({
    url: '/api/edi-service/opn/api/version',
    method: 'post',
    data
  })
}

// 接口-更新版本
export function updateInterfaceVersionApi(data) {
  return request({
    url: `/api/edi-service/opn/api/version/${data.apiId}`,
    method: 'PUT',
    data
  })
}

// 接口-发布
export function publishInterfaceApi(id) {
  return request({
    url: `/api/edi-service/opn/product/api/release/${id}`,
    method: 'put'
  })
}

// 接口-下线
export function offlineInterfaceApi(id) {
  return request({
    url: `/api/edi-service/opn/product/api/offline/${id}`,
    method: 'put'
  })
}

// 接口-查看
export function getInterfaceDetailApi(params) {
  return request({
    url: `/api/edi-service/opn/api/version/list`,
    method: 'get',
    params
  })
}
// 接口限流选项列表
export function getInterfacelimitTypeApi(params) {
  return request({
    url: `/api/edi-service/opn/product/api/rate-limit-type`,
    method: 'get',
    params
  })
}

/** *****************************签约管理*********************************** */
// 签约待审核列表
export function getProductAuditListApi(params) {
  return request({
    url: '/api/edi-service/opn/omc/product/sign/audit/pages',
    method: 'get',
    params
  })
}
// 签约已审核列表
export function getProductAuditedListApi(params) {
  return request({
    url: '/api/edi-service/opn/omc/product/sign/audited/pages',
    method: 'get',
    params
  })
}
// 签约审核
export function auditSignApi(data) {
  return request({
    url: `/api/edi-service/opn/omc/product/sign/audit`,
    method: 'post',
    data
  })
}
// 签约失效
export function invalidateSignApi(id) {
  return request({
    url: `/api/edi-service/opn/omc/product/sign/invalidate/${id}`,
    method: 'post'
  })
}
// 签约限制等级
export function getLimitTypeSignApi() {
  return request({
    url: `/api/edi-service/opn/omc/product/sign/limit-type`,
    method: 'get'
  })
}
// 签约限制等级
export function getUserListByNameApi(params) {
  return request({
    url: `/api/edi-service/opn/omc/product/sign/getUserListByName`,
    method: 'get',
    params
  })
}
