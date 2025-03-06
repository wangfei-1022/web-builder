import request from '@/utils/request'

// 新建规则
export function createRulesApi(data) {
  return request({
    url: '/api/shipping-service/sea/flash/policy',
    method: 'post',
    data
  })
}

// 规则详情
export function getRulesDetailApi(id) {
  return request({
    url: `/api/shipping-service/sea/flash/policy/detail/${id}`,
    method: 'get'
  })
}

// 更新规则
export function updateRulesApi(id, data) {
  return request({
    url: `/api/shipping-service/sea/flash/policy/${id}`,
    method: 'put',
    data
  })
}

// 删除规则
export function deleteRulesApi(id) {
  return request({
    url: `/api/shipping-service/sea/flash/policy/${id}`,
    method: 'delete'
  })
}

// 停止任务
export function stopRulesApi(id) {
  return request({
    url: `/api/shipping-service/sea/flash/policy/end/${id}`,
    method: 'put'
  })
}

// 关注
export function favoriteApi(id) {
  return request({
    url: `/api/shipping-service/sea/flash/policy/${id}/focus`,
    method: 'put'
  })
}

// 取消关注
export function cancelFavoriteApi(id) {
  return request({
    url: `/api/shipping-service/sea/flash/policy/${id}/cancel/focus`,
    method: 'put'
  })
}

// 规则管理列表
export function getrulesListApi(params) {
  return request({
    url: '/api/shipping-service/sea/flash/policy/list',
    method: 'get',
    params
  })
}

// 获取子规则列表
export function getSubtaskListApi(policyId) {
  return request({
    url: `/api/shipping-service/sea/flash/policy/${policyId}/container/list`,
    method: 'get'
  })
}

// 获取部门人员列表
export function getEmployeeListApi(params) {
  return request({
    url: '/api/sys-service/sys/department/user',
    method: 'get',
    params
  })
}

// 获取线上订舱列表
export function getBookingOnlineListApi(params) {
  return request({
    url: '/api/shipping-service/sea/booking/list',
    method: 'get',
    params
  })
}

// 分配/取消分配
export function allocationApi(id, data) {
  return request({
    url: `/api/shipping-service/sea/booking/distribution/${id}`,
    method: 'put',
    data
  })
}

// 港口信息
export function getPortInfoApi(cityName) {
  return request({
    url: `/api/shipping-service/sea/flash/policy/select/sea/third/party/port/${cityName}`,
    method: 'get'
  })
}
// 航线信息
export function getSEALINEApi(cityName) {
  return request({
    url: `/api/mdm-service/dmn/term/item/dropdownlist?termCode=SEALINE`,
    method: 'get'
  })
}
// 合约管理-保存
export function addContractApi(data) {
  return request({
    url: `/api/sea-service/sea/contract`,
    method: 'post',
    data
  })
}
// 合约管理-更新
export function updataContractApi(data) {
  return request({
    url: `/api/sea-service/sea/contract/${data.id}`,
    method: 'put',
    data
  })
}
// 合约管理-查询列表
export function contractPagesApi(params) {
  return request({
    url: `/api/sea-service/sea/contract/pages`,
    method: 'get',
    params
  })
}
// 合约管理-查询详情
export function contractDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/contract/detail/${id}`,
    method: 'get'
  })
}
// 合约管理-失效
export function contractDisableApi(id) {
  return request({
    url: `/api/sea-service/sea/contract/disable/${id}`,
    method: 'PUT'
  })
}
// 合约管理-生效
export function contractEnableApi(id) {
  return request({
    url: `/api/sea-service/sea/contract/enable/${id}`,
    method: 'PUT'
  })
}
// 合约管理-删除
export function contractDelApi(id) {
  return request({
    url: `/api/sea-service/sea/contract/${id}`,
    method: 'DELETE'
  })
}
// 仓位申请-周期列表
export function cycleListApi() {
  return request({
    url: `/api/sea-service/sea/space/apply/sale/cycleList`,
    method: 'GET'
  })
}
// 仓位申请-周期列表 all
export function applyManageApi() {
  return request({
    url: `/api/sea-service/sea/space/applyManage/cycleHistories`,
    method: 'GET'
  })
}
// 仓位申请-约号列表
export function contractListApi() {
  return request({
    url: `/api/sea-service/sea/contract/contractList`,
    method: 'GET'
  })
}
// 仓位申请-新增
export function applySaleApi(data) {
  return request({
    url: `/api/sea-service/sea/space/apply/sale`,
    method: 'post',
    data
  })
}
// 仓位申请-更新
export function updataApplySaleApi(data) {
  return request({
    url: `/api/sea-service/sea/space/apply/sale/${data.id}`,
    method: 'PUT',
    data
  })
}
// 仓位申请-查询列表-销售
export function applySalePagesApi(params) {
  return request({
    url: `/api/sea-service/sea/space/apply/sale/pages`,
    method: 'GET',
    params
  })
}
// 仓位申请-查询列表-产品
export function applyProPagesApi(params) {
  return request({
    url: `/api/sea-service/sea/space/applyManage/pages`,
    method: 'GET',
    params
  })
}
// 仓位申请-查询详情
export function applySaleDetailApi(id) {
  return request({
    url: `/api/sea-service/sea/space/apply/sale/detail/${id}`,
    method: 'GET'
  })
}
// 舱位申请-删除
export function applySaleDelApi(id) {
  return request({
    url: `/api/sea-service/sea/space/apply/sale/${id}`,
    method: 'DELETE'
  })
}
// 仓位申请-导出
export function applyProExportlApi(params) {
  return request({
    url: `/api/sea-service/sea/space/applyManage/export`,
    method: 'GET',
    params
  })
}
// 仓位申请-导出
export function contractWeekApi(params) {
  return request({
    url: `/api/sea-service/sea/contract/weeks`,
    method: 'GET',
    params
  })
}
