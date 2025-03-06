import request from '@/utils/request'
import URL from './urlTranslator'

export function getChargeById(id) {
  return request({
    url: `${URL.act.charge}/${id}`,
    method: 'get'
  })
}

export function getChargePayableList(jobId, filterType) {
  const params = { filterType }
  return request({
    url: `${URL.act.chargePayableList}/${jobId}`,
    method: 'get',
    params
  })
}

export function getChargeReceivableList(jobId, filterType) {
  const params = { filterType }
  return request({
    url: `${URL.act.chargeReceivableList}/${jobId}`,
    method: 'get',
    params
  })
}

export function getChargeSubstitutePayableList(jobId, filterType) {
  const params = { filterType }
  return request({
    url: `${URL.act.chargeSubstitutePayableList}/${jobId}`,
    method: 'get',
    params
  })
}

export function getChargeSubstituteReceivableList(jobId, filterType) {
  const params = { filterType }
  return request({
    url: `${URL.act.chargeSubstituteReceivableList}/${jobId}`,
    method: 'get',
    params
  })
}

export function saveCharge(data, id) {
  return request({
    url: `${URL.act.charge}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delCharge(id) {
  return request({
    url: `${URL.act.charge}/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除费用
 * @param id
 */
export function batchDelCharge(chargeIds, jobId) {
  const params = { chargeIds, jobId }
  return request({
    url: `${URL.act.chargeBatchDel}`,
    method: 'delete',
    params
  })
}

export function acceptCharge(id) {
  return request({
    url: `${URL.act.chargeAccept}/${id}`,
    method: 'put'
  })
}
export function cancelAcceptCharge(id) {
  return request({
    url: `${URL.act.chargeCancelAccept}/${id}`,
    method: 'put'
  })
}
export function submitCharge(id) {
  return request({
    url: `${URL.act.chargeSubmit}/${id}`,
    method: 'put'
  })
}

export function cancelSubmitCharge(id) {
  return request({
    url: `${URL.act.chargeCancelSubmit}/${id}`,
    method: 'put'
  })
}

// 应付
export function allAcceptArCharge(jobId) {
  return request({
    url: `${URL.act.chargeAllAcceptAr}/${jobId}`,
    method: 'put'
  })
}
export function allCancelAcceptArCharge(jobId) {
  return request({
    url: `${URL.act.chargeAllCancelAcceptAr}/${jobId}`,
    method: 'put'
  })
}
export function allSubmitArCharge(jobId) {
  return request({
    url: `${URL.act.chargeAllSubmitAr}/${jobId}`,
    method: 'put'
  })
}

export function allCancelSubmitArCharge(jobId) {
  return request({
    url: `${URL.act.chargeAllCancelSubmitAr}/${jobId}`,
    method: 'put'
  })
}

// 应收
export function allAcceptApCharge(jobId) {
  return request({
    url: `${URL.act.chargeAllAcceptAp}/${jobId}`,
    method: 'put'
  })
}
export function allCancelAcceptApCharge(jobId) {
  return request({
    url: `${URL.act.chargeAllCancelAcceptAp}/${jobId}`,
    method: 'put'
  })
}
export function allSubmitApCharge(jobId) {
  return request({
    url: `${URL.act.chargeAllSubmitAp}/${jobId}`,
    method: 'put'
  })
}

export function allCancelSubmitApCharge(jobId) {
  return request({
    url: `${URL.act.chargeAllCancelSubmitAp}/${jobId}`,
    method: 'put'
  })
}

export function getChargeUnitDropDown() {
  return request({
    url: `${URL.act.chargeUnitDropDown}`,
    method: 'get'
  })
}

export function getChargeDialogInitData(jobId, arApType) {
  const params = { jobId, arApType }
  return request({
    url: `${URL.act.chargeDialogInitData}`,
    method: 'get',
    params
  })
}
// 根据jobId&单位获取数量
export function getChargeUnitNumByUnit(jobId, unitType) {
  const params = { jobId, unitType }
  return request({
    url: `${URL.act.chargeUnitNumByUnit}`,
    method: 'get',
    params
  })
}
// 根据jobId&源币种获取汇率
export function getChargeRateBySourceCurrency(jobId, sourceCurrency) {
  const params = { jobId, sourceCurrency }
  return request({
    url: `${URL.act.chargeRateBySourceCurrency}`,
    method: 'get',
    params
  })
}

export function getWentDutchTypeList() {
  return request({
    url: `${URL.act.wentDutchTypeList}`,
    method: 'get'
  })
}
export function getWentDutchList(data) {
  return request({
    url: `${URL.act.wentDutchList}`,
    method: 'post',
    data
  })
}

export function getChargeFilterType(jobId) {
  return request({
    url: `${URL.act.chargeFilterType}?jobId=${jobId}`,
    method: 'get'
  })
}
export function getChargeSummaryAmount(jobId, filterType) {
  const params = { jobId, filterType }
  return request({
    url: `${URL.act.chargeSummaryAmount}`,
    method: 'get',
    params
  })
}
// ---费用操作 start
export function batchAcceptJobCharge(jobIds) {
  const data = { jobIds }
  return request({
    url: `${URL.act.jobChargeBatchAccept}`,
    method: 'put',
    data
  })
}
export function batchCancelAcceptJobCharge(jobIds) {
  const data = { jobIds }
  return request({
    url: `${URL.act.jobChargeBatchCancelAccept}`,
    method: 'put',
    data
  })
}
export function batchSubmitJobCharge(jobIds) {
  const data = { jobIds }
  return request({
    url: `${URL.act.jobChargeBatchSubmit}`,
    method: 'put',
    data
  })
}
export function batchCancelSubmitJobCharge(jobIds) {
  const data = { jobIds }
  return request({
    url: `${URL.act.jobChargeBatchCancelSubmit}`,
    method: 'put',
    data
  })
}
// ---费用操作 end
// ---业务job操作 start
export function batchAcceptJob(jobIdList) {
  const data = { jobIdList }
  return request({
    url: `${URL.act.jobBatchAccept}`,
    method: 'put',
    data
  })
}
export function batchCancelAcceptJob(jobIdList) {
  const data = { jobIdList }
  return request({
    url: `${URL.act.jobBatchCancelAccept}`,
    method: 'put',
    data
  })
}
export function batchSubmitJob(jobIdList) {
  const data = { jobIdList }
  return request({
    url: `${URL.act.jobBatchSubmit}`,
    method: 'put',
    data
  })
}
export function batchCancelSubmitJob(jobIdList) {
  const data = { jobIdList }
  return request({
    url: `${URL.act.jobBatchCancelSubmit}`,
    method: 'put',
    data
  })
}

export function batchRejectSubmitJob(jobIdList) {
  const data = { jobIdList }
  return request({
    url: `${URL.act.jobBatchRejectSubmit}`,
    method: 'put',
    data
  })
}
// ---业务job操作 end
export function getChargeSchemeListByJobs(jobIds) {
  const data = { jobIds }
  return request({
    url: `${URL.act.chargeSchemeListByJobs}`,
    method: 'post',
    data
  })
}
export function showChargeListBySchemeAndJob(jobId, schemeId) {
  const data = { jobId, schemeId }
  return request({
    url: `${URL.act.chargeListShowBySchemeAndJob}`,
    method: 'post',
    data
  })
}
export function commitChargeListByScheme(jobIds, schemeId) {
  const data = { jobIds, schemeId }
  return request({
    url: `${URL.act.chargeListCommitByScheme}`,
    method: 'post',
    data
  })
}

// 抄录费用
export function copyCharge(data) {
  return request({
    url: `${URL.act.chargeTabCopyCharge}`,
    method: 'post',
    data
  })
}

