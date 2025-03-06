import request from '@/utils/request'
/**
 * 获取预报单列表
 * @returns {*}
 */

export function getSeaBlListApi(params) {
  return request({
    url: `/api/sit-service/sea/import/bl/pages`,
    method: 'get',
    params
  })
}
/**
 * 获取预报单提交
 * @returns {*}
 */

export function submitSeaBlListApi(data) {
  return request({
    url: `/api/sit-service/sea/import/bl/${data.id}/submit`,
    method: 'put',
    data
  })
}
/**
 * 获取预报单提交
 * @returns {*}
 */

export function submitDataSeaBlListApi(data) {
  return request({
    url: `/api/sit-service/sea/import/bl/${data.id}/updateAndSubmit`,
    method: 'put',
    data
  })
}
/**
 * 新增编辑预报单数据
 * @returns {*}
 */

export function saveSeaBlApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/bl/${data.id}` : `/api/sit-service/sea/import/mbl/dbl`,
    method: data.id ? 'put' : 'post',
    data
  })
}
/**
 * 预报单详情
 * @returns {*}
 */

export function detailSeaBlApi(id) {
  return request({
    url: `/api/sit-service/sea/import/bl/detail/${id}`,
    method: 'get'
  })
}
/**
 * 检验提单号是否重复
 * @returns {*}
 */

export function checkBlNoApi(params) {
  return request({
    url: `/api/sit-service/sea/import/bl/checkBlNo`,
    method: 'get',
    params
  })
}
/**
 * 预报单撤销
 * @returns {*}
 */

export function cancelSeaBlApi(id) {
  return request({
    url: `/api/sit-service/sea/import/bl/${id}/cancel`,
    method: 'put'
  })
}

/**
 * 提单商品_查询列表
 * @returns {*}
 */

export function getGoodsByBlIdApi(params) {
  return request({
    url: `/api/sit-service/sea/import/bl/goods/pages`,
    method: 'get',
    params
  })
}
/**
 * 提单商品_查询列表
 * @returns {*}
 */

export function saveDoByBlIdApi(data) {
  return request({
    url: `/api/sit-service/sea/import/bl/do/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 提单商品-维护
 * @returns {*}
 */

export function saveGoodsByBlIdApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/bl/goods/${data.id}` : `/api/sit-service/sea/import/bl/goods`,
    method: data.id ? 'put' : 'post',
    data
  })
}

/**
 * 批量修改箱型
 * @returns {*}
 */
export function batchUpdateContainerTypeListApi(blId, data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/batch/ctnType/${blId}`,
    method: 'put',
    data
  })
}

/**
 * 提单商品-均摊
 * @returns {*}
 */

export function avgGoodsByBlIdApi(id) {
  return request({
    url: `/api/sit-service/sea/import/bl/goods/${id}/avg`,
    method: 'put'
  })
}
/**
 * 提单商品-均摊
 * @returns {*}
 */

export function delGoodsByIdApi(id) {
  return request({
    url: `/api/sit-service/sea/import/bl/goods/${id}`,
    method: 'delete'
  })
}


/**
 * 集装箱_查询列表
 * @returns {*}
 */

export function getCtnByBlIdApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/goods/detail/pages`,
    method: 'get',
    params
  })
}
/**
 * 集装箱_修改箱型
 * @returns {*}
 */

export function saveCtnTypeApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/${data.id}/ctnType`,
    method: 'put',
    data
  })
}
/**
 * 托盘明细_查询列表
 * @returns {*}
 */

export function getTrayByBlIdApi(params) {
  return request({
    url: `/api/sit-service/sea/import/tray/goods/detail/pages`,
    method: 'get',
    params
  })
}
/**
 * 海运进口日志_查询列表
 * @returns {*}
 */

export function getOpLogApi(params) {
  return request({
    url: `/api/sit-service/sea/import/op/log/pages`,
    method: 'get',
    params
  })
}
/**
 * 海运进口日志_查询列表
 * @returns {*}
 */

export function importTrayExcelApi(data) {
  return request({
    url: `/api/sit-service/sea/import/tray/goods/detail/excel/import/${data.blId}`,
    method: 'post',
    data
  })
}
/**
 * 提单_查询文件列表
 * @returns {*}
 */

export function getFilePagesApi(id) {
  return request({
    url: `/api/sit-service/sea/import/bl/${id}/file/pages`,
    method: 'get'
  })
}
/**
 * 提单_查询文件保存
 * @returns {*}
 */

export function saveFileApi(data) {
  return request({
    url: `/api/sit-service/sea/import/bl/file/save`,
    method: 'post',
    data
  })
}
/**
 * 提单_查询文件删除
 * @returns {*}
 */
export function delFileApi(data) {
  return request({
    url: `/api/sit-service/sea/import/bl/file/deleteAndAddByBlIdFileCode`,
    method: 'post',
    data
  })
}
/**
 * 海运进口-报关单_查询列表
 * @returns {*}
 */

export function getSeaCustomsLitsApi(params) {
  return request({
    url: `/api/sit-service/sea/import/customs/pages`,
    method: 'get',
    params
  })
}
/**
 * 海运进口-报关单_保存
 * @returns {*}
 */

export function saveSeaCustomsApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/customs/${data.id}` : `/api/sit-service/sea/import/customs`,
    method: data.id ? 'put' : 'post',
    data
  })
}
/**
 * 海运进口-报关单_提交
 * @returns {*}
 */

export function submitSeaCustomsApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/customs/${data.id}/updateSubmit` : `/api/sit-service/sea/import/customs/submit`,
    method: data.id ? 'put' : 'post',
    data
  })
}
/**
 * 海运进口-报关单_确认
 * @returns {*}
 */

export function confirmSeaCustomsApi(id) {
  return request({
    url: `/api/sit-service/sea/import/customs/${id}/submit`,
    method: 'put'
  })
}
/**
 * 海运进口-报关单_详情
 * @returns {*}
 */

export function detailSeaCustomsApi(id) {
  return request({
    url: `/api/sit-service/sea/import/customs/detail/${id}`,
    method: 'get'
  })
}
/**
 * 海运进口-报关单_删除
 * @returns {*}
 */

export function deleteSeaCustomsApi(id) {
  return request({
    url: `/api/sit-service/sea/import/customs/${id}`,
    method: 'delete'
  })
}
/**
 * 海运进口-报关单删除箱子
 * @returns {*}
 */

export function deleteSeaCustomsCntApi(id) {
  return request({
    url: `/api/sit-service/sea/import/customs/ctn/${id}`,
    method: 'delete'
  })
}

/**
 * 海运进口-报关单撤销
 * @returns {*}
 */

export function cancelSeaCustomsCntApi(id) {
  return request({
    url: `/api/sit-service/sea/import/customs/${id}/cancel`,
    method: 'put'
  })
}
/**
 * 海运进口-报关单撤销
 * @returns {*}
 */

export function finishSeaCustomsApi(data) {
  return request({
    url: `/api/sit-service/sea/import/customs/${data.id}/finish`,
    method: 'put',
    data
  })
}
/**
 * 海运进口-报关单箱子导入
 * @returns {*}
 */

export function importSeaCustomsCntApi(data, customsId) {
  return request({
    url: `/api/sit-service/sea/import/customs/ctn/excel/import/${customsId}`,
    method: 'post',
    data
  })
}
/**
 * 海运进口-报关单分配柜子
 * @returns {*}
 */

export function saveCustomsCntApi(data) {
  return request({
    url: `/api/sit-service/sea/import/customs/${data.id}/distribution/ctn`,
    method: 'put',
    data
  })
}
/**
 * 海运进口-报关单_列表状态统计
 * @returns {*}
 */

export function getStateCountCustomsApi() {
  return request({
    url: `/api/sit-service/sea/import/customs/state/count`,
    method: 'get'
  })
}
/**
 * 海运进口-集装箱_查询报关单可分配的箱子
 * @returns {*}
 */

export function getCustomsCntsApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/distributable/customs/ctns`,
    method: 'get',
    params
  })
}

/**
 * 海运进口-集装箱_查询报关单可分配的SKU
 * @returns {*}
 */
export function getCustomsSKUApi(params) {
  return request({
    url: `/api/sit-service/sea/import/bl/goods/getList`,
    method: 'get',
    params
  })
}

/**
 * 提柜管理 - 查询列表
 * @returns {*}
 */

export function getCntPickupListApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/pages`,
    method: 'get',
    params
  })
}
/**
 * 提柜管理 - 保存
 * @returns {*}
 */

export function saveCntPickupApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/ctn/pickup/${data.id}` : `/api/sit-service/sea/import/ctn/pickup`,
    method: data.id ? 'put' : 'post',
    data
  })
}
/**
 * 提柜管理 - 提交
 * @returns {*}
 */

export function submitCntPickupApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/ctn/pickup/update/confirm/${data.id}` : `/api/sit-service/sea/import/ctn/pickup/draf/confirm`,
    method: data.id ? 'put' : 'post',
    data
  })
}
/**
 * 提柜管理 - 确认
 * @returns {*}
 */

export function confirmCntPickupApi(id) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/confirm/${id}`,
    method: 'put'
  })
}
/**
 * 提柜管理 - 退回
 * @returns {*}
 */

export function backCntPickupApi(id) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/back/${id}`,
    method: 'put'
  })
}
/**
 * 提柜管理 - 详情
 * @returns {*}
 */

export function detailCntPickupApi(id) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/detail/${id}`,
    method: 'get'
  })
}
/**
 * 提柜管理 - 删除
 * @returns {*}
 */

export function delCntPickupApi(id) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/${id}`,
    method: 'delete'
  })
}
/**
 * 提柜管理 - 集装箱_查询可提柜箱列表
 * @returns {*}
 */

export function getCtnPickupApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/detail/getCanPickupByCtnNo`,
    method: 'get',
    params
  })
}
/**
 * 提柜管理_导入
 * @returns {*}
 */

export function importCtnPickupApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/excel/import`,
    method: 'post',
    data
  })
}
/**
 * 提柜批量确认
 * @returns {*}
 */

export function batchConfirmPickupCtnApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/batchConfirm`,
    method: 'put',
    data
  })
}
/**
 * 还柜管理 - 查询列表
 * @returns {*}
 */

export function getCtnReturnListApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/return/pages`,
    method: 'get',
    params
  })
}
/**
 * 还柜管理 - 保存
 * @returns {*}
 */
export function saveCtnReturnApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/ctn/return/${data.id}` : `/api/sit-service/sea/import/ctn/return`,
    method: data.id ? 'put' : 'post',
    data
  })
}
/**
 * 还柜管理 - 提交
 * @returns {*}
 */
export function submitCtnReturnApi(data) {
  return request({
    url: data.id ? `/api/sit-service/sea/import/ctn/return/update/confirm/${data.id}` : `/api/sit-service/sea/import/ctn/return/draf/confirm`,
    method: data.id ? 'put' : 'post',
    data
  })
}
/**
 * 还柜管理 - 详情
 * @returns {*}
 */
export function detailCtnReturnApi(id) {
  return request({
    url: `/api/sit-service/sea/import/ctn/return/detail/${id}`,
    method: 'get'
  })
}
/**
 * 还柜管理 - 确认
 * @returns {*}
 */
export function confirmCtnReturnApi(id) {
  return request({
    url: `/api/sit-service/sea/import/ctn/return/confirm/${id}`,
    method: 'put'
  })
}
/**
 * 还柜管理 - 退回
 * @returns {*}
 */
export function backCtnReturnApi(id) {
  return request({
    url: `/api/sit-service/sea/import/ctn/return/back/${id}`,
    method: 'put'
  })
}
/**
 * 还柜管理 - 退回
 * @returns {*}
 */
export function delCtnReturnApi(id) {
  return request({
    url: `/api/sit-service/sea/import/ctn/return/${id}`,
    method: 'delete'
  })
}
/**
 * 还柜管理 -导入
 * @returns {*}
 */
export function importCtnReturnApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/return/excel/import`,
    method: 'post',
    data
  })
}
/**
 * 还柜管理 - 批量确认
 * @returns {*}
 */
export function batchConfirmCtnReturnApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/return/confirm/batch`,
    method: 'put',
    data
  })
}
/**
 * 还柜管理 -集装箱_查询可还柜箱号信息
 * @returns {*}
 */
export function getCtnReturnApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/detail/getCanReturnByCtnNo`,
    method: 'get',
    params
  })
}
/**
 * 集装箱_查询列表
 * @returns {*}
 */
export function getSeaImportCtnListApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pages`,
    method: 'get',
    params
  })
}
/**
 * 集装箱_状态统计
 * @returns {*}
 */
export function getSeaImportCtnCountApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/state/count`,
    method: 'get',
    params
  })
}
/**
 * 集装箱_统计预警天数
 * @returns {*}
 */
export function getSeaImportCtnDateCountApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/date/count`,
    method: 'get',
    params
  })
}
/**
 * 集装箱_状态
 * @returns {*}
 */
export function getSeaCtnStateApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/state/selections`,
    method: 'get',
    params
  })
}
/**
 * 集装箱_修改进口信息
 * @returns {*}
 */
export function updateSeaCtnInfoApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/${data.id}/update`,
    method: 'put',
    data
  })
}
/**
 * 集装箱_修改备注
 * @returns {*}
 */
export function updateSeaCtnRemarkApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/${data.id}/remark`,
    method: 'put',
    data
  })
}
/**
 * 集装箱_异常
 * @returns {*}
 */
export function exceptionSeaCtnApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/${data.id}/exception`,
    method: 'put',
    data
  })
}
/**
 * 集装箱_撤销异常
 * @returns {*}
 */
export function cancelExceptionSeaCtnApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/${data.id}/cancel/exception`,
    method: 'put'
  })
}
/**
 * 集装箱-批量查询运费、保费信息
 * @returns {*}
 */
export function getSeaCtnListApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/list/ids`,
    method: 'post',
    data
  })
}
/**
 * 集装箱-批量更新运费、保费信息
 * @returns {*}
 */
export function saveSeaCtnInfoApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/batch`,
    method: 'put',
    data
  })
}
/**
 * 集装箱_查询操作日志
 * @returns {*}
 */
export function getSeaCtnLogApi(id) {
  return request({
    url: `/api/sit-service/sea/import/ctn/${id}/opLog`,
    method: 'get'
  })
}
/**
 * 集装箱_提柜提交并确认
 * @returns {*}
 */
export function saveOrUpdatePickupApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/confirm/saveOrUpdate`,
    method: 'post',
    data
  })
}
/**
 * 集装箱_还柜提交并确认
 * @returns {*}
 */
export function saveOrUpdateReturnApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/return/confirm/saveOrUpdate`,
    method: 'post',
    data
  })
}
/**
 * 集装箱_导出
 * @returns {*}
 */
export function exportCtnInfoApi(params) {
  return request({
    url: `/api/sit-service/sea/import/ctn/export`,
    method: 'get',
    params
  })
}
/**
 * 集装箱_入库预约
 * @returns {*}
 */
export function appointInboundApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/inbound/appoint`,
    method: 'post',
    data
  })
}
/**
 * 提柜管理_是否已创建入库单
 * @returns {*}
 */
export function checkInboundIsCreatedApi(data) {
  return request({
    url: `/api/sit-service/sea/import/ctn/pickup/inbound/isCreated`,
    method: 'post',
    data
  })
}
/**
 * 提单_更新ETA,ATA
 * @returns {*}
 */
export function updateEtaAtaApi(data) {
  return request({
    url: `/api/sit-service/sea/import/bl/${data.id}/updateEtaAta`,
    method: 'put',
    data
  })
}
