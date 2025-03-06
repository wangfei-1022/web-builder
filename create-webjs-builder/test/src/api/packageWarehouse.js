import request from '@/utils/request'

// VITE-SP
export function removeGridApi() { }
export function removeLockGridApi() { }


// 订单列表
export function getOrderListApi(params) {
  return request({
    url: `/api/ilw-service/ilw/parcel/query`,
    method: 'get',
    params
  })
}

// 批量导入订单
export function uploadReportApi(data) {
  return request({
    url: `/api/ilw-service/ilw/parcel/uploadWeightDeclare`,
    method: 'POST',
    data
  })
}

// 小包仓库导入修改渠道模板
export function updateChannelApi(data) {
  return request({
    url: `/api/ilw-service/ilw/parcel/uploadUpdateProduct`,
    method: 'POST',
    data
  })
}

// 按查询条件导出入库详情
export function exportOrderDetailApi(params) {
  return request({
    url: `/api/ilw-service/ilw/parcel/syncExportInboundDataList`,
    method: 'get',
    params
  })
}

// 订单导出
export function exportOrderSearchApi(params) {
  return request({
    url: '/api/ilw-service/ilw/parcel/syncExportDataList',
    method: 'get',
    params
  })
}

// 导出称重图片
export function exportOrderImagesApi(params) {
  return request({
    url: '/api/ilw-service/ilw/parcel/syncExportParcelWeightImage',
    method: 'get',
    params
  })
}

// 订单详情
export function getOrderDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/parcel/detail/${id}`,
    method: 'get'
  })
}

// 入库管理 - 上传入库信息
export function sendPackageInfoApi(data) {
  return request({
    url: `/api/ilw-service/ilw/parcel/syncInbound`,
    method: 'post',
    data
  })
}

// 出库管理 - 获取箱型数据
export function getBoxInfoApi(boxNo) {
  return request({
    url: `/api/ilw-service/ilw/box/detailByBoxNo/${boxNo}`,
    method: 'get'
  })
}

// 出库管理 - 发送订单号
export function sendOrderNoApi(data) {
  return request({
    url: `/api/ilw-service/ilw/parcel/outbound`,
    method: 'post',
    data
  })
}

// 撤销出库
export function revokeOutboundApi(id) {
  return request({
    url: `/api/ilw-service/ilw/parcel/cancelOutbound/${id}`,
    method: 'post'
  })
}

// 打印标签
export function printOutboundTagApi(id, data) {
  return request({
    url: `/api/ilw-service/ilw/box/labelAndUpdate/${id}`,
    method: 'put',
    data
  })
}

// 获取渠道列表
export function getProductListApi() {
  return request({
    url: '/api/ilw-service/ilw/product/queryAll',
    method: 'get'
  })
}

// 导出渠道代码
export function exportProductListApi() {
  return request({
    url: '/api/ilw-service/ilw/product/export',
    method: 'get'
  })
}

// 获取箱型
export function getBoxTypeApi(params) {
  return request({
    url: '/api/ilw-service/ilw/packing/model/query',
    method: 'get',
    params
  })
}

// 装箱列表
export function getBoxListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/box/query',
    method: 'get',
    params
  })
}

// 一键导出
export function batchOutBoundApi(data) {
  return request({
    url: '/api/ilw-service/ilw/box/batchOutbound',
    method: 'put',
    data
  })
}

// 箱子绑定批次
export function containerBindBatchApi(data) {
  return request({
    url: '/api/ilw-service/ilw/batch/boxBindingBatch',
    method: 'post',
    data
  })
}

// 解绑批次
export function submitUnbindBatchApi(data) {
  return request({
    url: '/api/ilw-service/ilw/batch/boxUnbindingBatch',
    method: 'post',
    data
  })
}

// 打印箱标签
export function printBoxTagsApi(data) {
  return request({
    url: '/api/ilw-service/ilw/box/label',
    method: 'post',
    data
  })
}

// 推送尾程箱唛
export function sendThirdPartBoxTagsApi(data) {
  return request({
    url: '/api/ilw-service/ilw/box/pushLastMile',
    method: 'post',
    data
  })
}

// 打印尾程箱唛
export function printThirdPartTagApi(data) {
  return request({
    url: '/api/ilw-service/ilw/box/print/lastMileLabel',
    method: 'post',
    data
  })
}

// 导出
export function exportBoxApi(params) {
  return request({
    url: '/api/ilw-service/ilw/box/export',
    method: 'get',
    params
  })
}

// 导出箱校验图片
export function exportBoxImagesApi(params) {
  return request({
    url: '/api/ilw-service/ilw/box/syncExportBoxImage',
    method: 'get',
    params
  })
}

// 装箱列表详情
export function getBoxListDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/box/detailByBoxId/${id}`,
    method: 'get'
  })
}

// 仓库列表
export function getWarehouseListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/warehouse/query',
    method: 'get',
    params
  })
}

// 新建仓库
export function createWarehouseApi(data) {
  return request({
    url: '/api/ilw-service/ilw/warehouse',
    method: 'post',
    data
  })
}

// 更新仓库
export function modifyWarehouseApi(data) {
  return request({
    url: `/api/ilw-service/ilw/warehouse/${data.id}`,
    method: 'put',
    data
  })
}

// 启用仓库
export function enableWarehouseApi(id) {
  return request({
    url: `/api/ilw-service/ilw/warehouse/enable/${id}`,
    method: 'put'
  })
}

// 禁用仓库
export function disableWarehouseApi(id) {
  return request({
    url: `/api/ilw-service/ilw/warehouse/disable/${id}`,
    method: 'put'
  })
}

// 仓库人员列表
export function getEmployeeListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/warehouse/person/pages',
    method: 'get',
    params
  })
}

// 创建仓库人员
export function createEmployeeApi(data) {
  return request({
    url: '/api/ilw-service/ilw/warehouse/person/save',
    method: 'post',
    data
  })
}

// 修改仓库人员
export function modifyEmployeeApi(data) {
  return request({
    url: '/api/ilw-service/ilw/warehouse/person/update',
    method: 'put',
    data
  })
}

// 仓库人员下拉列表
export function employeeDropdownListApi() {
  return request({
    url: '/api/sys-service/sys/user/selections/ilwWarehousePersonList',
    method: 'get'
  })
}

// 快进快出
export function quicklyInQuicklyOutApi(data) {
  return request({
    url: '/api/ilw-service/ilw/parcel/inboundBox',
    method: 'post',
    data
  })
}

// 差异重量列表
export function getWeightDiscrepancyApi(params) {
  return request({
    url: '/api/ilw-service/ilw/member/setting/query',
    method: 'get',
    params
  })
}

// 新建差异重量配置
export function createWeightDiscrepancyApi(data) {
  return request({
    url: '/api/ilw-service/ilw/member/setting/save',
    method: 'post',
    data
  })
}

// 修改差异重量配置
export function modifyWeightDiscrepancyApi(data) {
  return request({
    url: '/api/ilw-service/ilw/member/setting/update',
    method: 'put',
    data
  })
}

// 扣件类型下拉
export function getLockTypeListApi() {
  return request({
    url: '/api/ilw-service/ilw/lock/info/selections/lockType',
    method: 'get'
  })
}

// 新建时的扣件类型下拉
export function getCreateLockTypeListApi() {
  return request({
    url: '/api/ilw-service/ilw/lock/info/allowAdd/lockType',
    method: 'get'
  })
}

// 扣件列表
export function getDistrainListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/lock/info/query',
    method: 'get',
    params
  })
}

// 扣件放行
export function distrainPassApi(data) {
  return request({
    url: '/api/ilw-service/ilw/lock/info/pass',
    method: 'put',
    data
  })
}

// 扣件退回
export function distrainReturnApi(data) {
  return request({
    url: '/api/ilw-service/ilw/lock/info/back',
    method: 'put',
    data
  })
}

// 扣件销毁
export function destrainDropApi(data) {
  return request({
    url: '/api/ilw-service/ilw/lock/info/destruction',
    method: 'put',
    data
  })
}

// 扣件跟进
export function distrainFollowApi(data) {
  return request({
    url: '/api/ilw-service/ilw/lock/info/follow',
    method: 'put',
    data
  })
}

// 新增扣件
export function createDistrainApi(data) {
  return request({
    url: '/api/ilw-service/ilw/lock/info/save',
    method: 'post',
    data
  })
}

// 扣件导出
export function exportDistrainApi(params) {
  return request({
    url: '/api/ilw-service/ilw/lock/info/export',
    method: 'get',
    params
  })
}

// 二次称重请求接口
export function secondaryMatchApi(data) {
  return request({
    url: '/api/ilw-service/ilw/parcel/secondInbound',
    method: 'post',
    data
  })
}

// 揽收操作
export function receivedPackageApi(data) {
  return request({
    url: '/api/ilw-service/ilw/parcel/syncReceived',
    method: 'post',
    data
  })
}

// 解除封箱
export function recoveryBoxApi(boxNo) {
  return request({
    url: `/api/ilw-service/ilw/box/reset/${boxNo}`,
    method: 'put'
  })
}

// 待办事项列表
export function getScheduleListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/schedule/query',
    method: 'get',
    params
  })
}

// 创建待办事项
export function createScheduleApi(data) {
  return request({
    url: '/api/ilw-service/ilw/schedule/save',
    method: 'post',
    data
  })
}

// 待办事项详情
export function getScheduleDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/schedule/detail/${id}`,
    method: 'get'
  })
}

// 跟进
export function followScheduleDetailApi(id, data) {
  return request({
    url: `/api/ilw-service/ilw/schedule/follow/${id}`,
    method: 'put',
    data
  })
}

// 获取电子秤重量接口
export function getBalanceWeightApi(params) {
  return request({
    ilwTools: true,
    url: `/getBalanceWeight`,
    method: 'get',
    params
  })
}

// 调用小工具语音播报
export function sendReportDataApi(data) {
  return request({
    ilwTools: true,
    url: `/play`,
    method: 'post',
    data
  })
}

// 传给小工具称重数据
export function sendDataResultToItoolsApi(data) {
  return request({
    ilwTools: true,
    url: '/ilwWcsResult',
    method: 'post',
    data
  })
}

// 代操作 - 揽收
export function agentParcelRecivedApi(data) {
  return request({
    url: '/api/ilw-service/ilw/agent/parcel/received',
    method: 'post',
    data
  })
}

// 代操作 - 列表
export function getAgentParcelRecivedListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/agent/parcel/query',
    method: 'get',
    params
  })
}

// 代操作 - 导出
export function exportAgentParcelRecivedListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/agent/parcel/export',
    method: 'get',
    params
  })
}

// 代操作 - 批量删除
export function delectAgentParcelRecivedApi(data) {
  return request({
    url: '/api/ilw-service/ilw/agent/parcel/batchDelete',
    method: 'delete',
    data
  })
}

// 代操作 - 导入
export function importAgentParcelRecivedApi(data) {
  return request({
    url: '/api/ilw-service/ilw/agent/parcel/upload',
    method: 'post',
    data
  })
}

// 换箱接口
export function orderSwapBoxApi(data) {
  return request({
    url: '/api/ilw-service/ilw/parcel/swapBox',
    method: 'post',
    data
  })
}

// 一票一箱
export function boxPerOrderApi(data) {
  return request({
    url: `/api/ilw-service/ilw/parcel/inBoxPerOrder`,
    method: 'post',
    data
  })
}

// 外部大包管理列表
export function getLargePackageListApi(params) {
  return request({
    url: `/api/ilw-service/ilw/box/prediction/query`,
    method: 'get',
    params
  })
}

// 外部大包详情列表
export function getLargePackageDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/box/prediction/detail/${id}`,
    method: 'get'
  })
}

// 外部大包称重
export function sendLargePackageInfoApi(data) {
  return request({
    url: `/api/ilw-service/ilw/box/prediction/weightBySteelyard`,
    method: 'post',
    data
  })
}

// 格口列表
export function getGirdListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/gird/query',
    method: 'get',
    params
  })
}

// 格口详情
export function getGirdDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/gird/detail/${id}`,
    method: 'get'
  })
}

// 格口详情渠道配置导入
export function uploadGirdProductApi(data) {
  return request({
    url: '/api/ilw-service/ilw/gird/uploadGirdProduct',
    method: 'post',
    data
  })
}

// 渠道分拣格口配置导入
export function uploadGirdSortApi(data) {
  return request({
    url: '/api/ilw-service/ilw/gird/uploadGirdProductSortCode',
    method: 'post',
    data
  })
}

// 新建格口配置保存
export function saveGirdDetailApi(data) {
  return request({
    url: '/api/ilw-service/ilw/gird/save',
    method: 'post',
    data
  })
}

// 更新格口配置保存
export function updateGirdDetailApi(data) {
  return request({
    url: `/api/ilw-service/ilw/gird/${data.id}`,
    method: 'put',
    data
  })
}

// 格口绑定仓库
export function bindGirdWarehouseApi(data) {
  return request({
    url: '/api/ilw-service/ilw/gird/bindingWarehouse',
    method: 'post',
    data
  })
}

// 格口解绑仓库
export function unbindGirdWarehouseApi(girdId) {
  return request({
    url: `/api/ilw-service/ilw/gird/unbindingWarehouse/${girdId}`,
    method: 'post'
  })
}

// 导出配置方案
export function exportGirdInfoApi(girdId) {
  return request({
    url: `/api/ilw-service/ilw/gird/export/${girdId}`,
    method: 'get'
  })
}

// 格口列表 - 删除格口
// 删除格口.
export function deleteGridConfigApi(_id) {
  return request({
    url: `/api/ilw-service/ilw/gird/${_id}`,
    method: 'delete'
  })
}

// 应用管理 - 列表
export function getApplicationListApi(params) {
  return request({
    url: `/api/ilw-service/ilw/app/query`,
    method: 'get',
    params
  })
}

// 应用管理 - 上传应用
export function uploadApplicationApi(data) {
  return request({
    url: `/api/ilw-service/ilw/app`,
    method: 'post',
    data
  })
}

// 应用管理 - 下载应用
export function getApplicationUrlApi(id) {
  return request({
    url: `/api/ilw-service/ilw/app/detail/${id}`,
    method: 'get'
  })
}

// 司机管理 - 司机列表
export function getDirverListApi(params) {
  return request({
    url: `/api/ilw-service/ilw/driver/query`,
    method: 'get',
    params
  })
}

// 司机管理 - 新建
export function createDriverApi(data) {
  return request({
    url: `/api/ilw-service/ilw/driver`,
    method: 'post',
    data
  })
}

// 司机管理 - 更新
export function modifyDriverApi(data) {
  return request({
    url: `/api/ilw-service/ilw/driver/${data.id}`,
    method: 'put',
    data
  })
}

// 司机管理 - 导入文件
export function importDriverInfoApi(data) {
  return request({
    url: `/api/ilw-service/ilw/driver/upload`,
    method: 'post',
    data
  })
}

// 司机管理 - 删除
export function deleteDriverInfoApi(id) {
  return request({
    url: `/api/ilw-service/ilw/driver/${id}`,
    method: 'delete'
  })
}

// 司机下拉列表
export function getDriverDropdownApi(params) {
  return request({
    url: '/api/ilw-service/ilw/driver/dropdown',
    method: 'get',
    params
  })
}

// 快递单 - 列表
export function getLogisticsListApi(params) {
  return request({
    url: '/api/ilw-service/ilw/logistics/query',
    method: 'get',
    params
  })
}

// 快递单 - 新建
export function saveLogisticsApi(data) {
  return request({
    url: '/api/ilw-service/ilw/logistics',
    method: 'post',
    data
  })
}

// 快递单 - 保存编辑
export function modifyLogisticsApi(data) {
  return request({
    url: `/api/ilw-service/ilw/logistics/${data.id}`,
    method: 'put',
    data
  })
}

// 快递单 - 导入
export function importLogisticsApi(data) {
  return request({
    url: '/api/ilw-service/ilw/logistics/upload',
    method: 'post',
    data
  })
}

// 快递单 - 删除
export function deleteLogisticsApi(id) {
  return request({
    url: `/api/ilw-service/ilw/logistics/${id}`,
    method: 'delete'
  })
}

// 快递单 - 更新状态
export function upgradeLogisticsStatusApi(data) {
  return request({
    url: `/api/ilw-service/ilw/logistics/updateState`,
    method: 'put',
    data
  })
}

// 快递单 - 绑定母单
export function bindParentLogisticsApi(data) {
  return request({
    url: `/api/ilw-service/ilw/logistics/binding`,
    method: 'post',
    data
  })
}

// 快递单 - 解绑母单
export function unbindParentLogisticsApi(childId) {
  return request({
    url: `/api/ilw-service/ilw/logistics/unbinding/${childId}`,
    method: 'post'
  })
}

// 快递单 - 快递单详情
export function getLogisticsDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/logistics/detail/${id}`,
    method: 'get'
  })
}

// 快递单 - 解绑包裹
export function unbindParcelApi(parcelId) {
  return request({
    url: `/api/ilw-service/ilw/logistics/unbindLogisticsByParcelId/${parcelId}`,
    method: 'post'
  })
}

// 换单操作
export function printTransferredOrderApi(orderNo) {
  return request({
    url: `/api/ilw-service/ilw/parcel/print/trackLabel?orderNo=${orderNo}`,
    method: 'get'
  })
}

// 泡货免扣件列表
export function getBubbleListApi(params) {
  return request({
    url: `/api/ilw-service/ilw/member/exemption/bubble/pages`,
    method: 'get',
    params
  })
}

// 泡货免扣件详情
export function getBubbleDetailApi(id) {
  return request({
    url: `/api/ilw-service/ilw/member/exemption/bubble/detail/${id}`,
    method: 'get'
  })
}

// 新增泡货免扣件
export function createBubbleApi(data) {
  return request({
    url: `/api/ilw-service/ilw/member/exemption/bubble/batchSave`,
    method: 'post',
    data
  })
}

// 删除泡货免扣减客户
export function deleteBubbleApi(data) {
  return request({
    url: `/api/ilw-service/ilw/member/exemption/bubble/batchDelete`,
    method: 'delete',
    data
  })
}

// 扫描暂扣件
export function distrainScanApi(data) {
  return request({
    url: `/api/ilw-service/ilw/parcel/updateLockInfo`,
    method: 'post',
    data
  })
}
