import request from '@/utils/request'

// 基础数据-获取收款单位收款信息
export function getMemberBankInfoApi(memberId) {
  return request({
    url: `/api/fms-service/fms/member/supplier/collect/bank/${memberId}`,
    method: 'get'
  })
}

// 基础数据-获取收款单位-联系人
export function getMemberContactApi(memberId) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/last/contact/${memberId}`,
    method: 'get'
  })
}


// 付款申请-提交
export function submitPaymentApplyApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/apply`,
    method: 'post',
    data
  })
}

// 付款申请-审批同意
export function payablePaymentApprovalAgreeApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/approval/agree`,
    method: 'post',
    data
  })
}

// 付款申请-审批拒绝
export function payablePaymentApprovalRejectApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/approval/reject`,
    method: 'post',
    data
  })
}

// 付款列表-申请人-待支付
export function getPayablePaymentUnpayApplyApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/topay/applier`,
    method: 'get',
    params
  })
}


// 付款列表-申请人-审批中
export function getPayablePaymentApplyingApplyApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/inapproval/applier`,
    method: 'get',
    params
  })
}


// 付款列表-申请人-全部
export function getPayablePaymentAllApplyApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/applier`,
    method: 'get',
    params
  })
}


// 付款列表-申请人-待支付-合计
export function getPayablePaymentUnpayApplyTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/topay/applier`,
    method: 'get',
    params
  })
}


// 付款列表-申请人-审批中-合计
export function getPayablePaymentApplyingApplyTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/inapproval/applier`,
    method: 'get',
    params
  })
}

// 付款列表-申请人-全部-合计
export function getPayablePaymentAllApplyTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/applier`,
    method: 'get',
    params
  })
}

// 付款列表-申请人-Count
export function getPayablePaymentApplyCountApi(countType) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/count/${countType}/applier`,
    method: 'get'
  })
}

// 付款列表-财务-待支付
export function getPayablePaymentUnpayFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/topay/treasurer`,
    method: 'get',
    params
  })
}

// 付款列表-财务-审批中
export function getPayablePaymentApplyingFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/inapproval/treasurer`,
    method: 'get',
    params
  })
}


// 付款列表-财务-全部
export function getPayablePaymentAllFinanceApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/treasurer`,
    method: 'get',
    params
  })
}


// 付款列表-财务-待支付-合计
export function getPayablePaymentUnpayFinanceTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/topay/treasurer`,
    method: 'get',
    params
  })
}

// 付款列表-财务-审批中-合计
export function getPayablePaymentApplyingFinanceTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/inapproval/treasurer`,
    method: 'get',
    params
  })
}

// 付款列表-财务-全部-合计
export function getPayablePaymentAllFinanceTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/treasurer`,
    method: 'get',
    params
  })
}

// 付款列表-财务-Count
export function getPayablePaymentFinanceCountApi(countType) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/count/${countType}/treasurer`,
    method: 'get'
  })
}

// 审批管理---------------
// 付款列表-审批管理-待审批
export function getPayablePaymentUnapprovalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/toWait/approval`,
    method: 'get',
    params
  })
}

// 付款列表-审批管理-已审批
export function getPayablePaymentApprovalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/agree/approval`,
    method: 'get',
    params
  })
}

// 付款列表-审批管理-审批拒绝
export function getPayablePaymentApprovalRejectApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/reject/approval`,
    method: 'get',
    params
  })
}

// 付款列表-审批管理-全部
export function getPayablePaymentApprovalAllApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/approval`,
    method: 'get',
    params
  })
}

// 付款列表-审批管理-待审批-合计
export function getPayablePaymentUnapprovalTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/toWait/approval`,
    method: 'get',
    params
  })
}

// 付款列表-审批管理-已审批-合计
export function getPayablePaymentApprovalTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/agree/approval`,
    method: 'get',
    params
  })
}

// 付款列表-审批管理-审批拒绝-合计
export function getPayablePaymentApprovalRejectTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/reject/approval`,
    method: 'get',
    params
  })
}

// 付款列表-审批管理-全部-合计
export function getPayablePaymentApprovalAllTotalApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/total/approval`,
    method: 'get',
    params
  })
}

// 付款列表-审批管理-Count
export function getPayablePaymentApprovalCountApi(countType) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/count/${countType}/approval`,
    method: 'get'
  })
}
// 审批管理---------------

// 付款列表-详情
export function getPayablePaymentDetailApi(instructionId) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/detail/${instructionId}`,
    method: 'get'
  })
}

// 付款列表-详情-费用详情
export function getPaymentChargeDetailApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/charge/list`,
    method: 'get',
    params
  })
}

// 付款申请-完成付款
export function paymentFinishApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/finish`,
    method: 'post',
    data
  })
}

// 付款申请-拒绝付款
export function paymentRejectApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/reject`,
    method: 'post',
    data
  })
}

// 付款申请列表-财务-获取文件信息
export function getPaymentFileApi(id) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/file/info/${id}`,
    method: 'get'
  })
}

// 付款申请列表-财务-单个申请-批量下载文件
export function downloadFileBatchByApplyApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/files/download/batch`,
    method: 'post',
    data
  })
}

// 付款申请-财务-上传水单
export function uploadCertiferFileApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/upload/certifer/file`,
    method: 'post',
    data
  })
}

// 申请审批-同意
export function approvalApplyAgreeApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/apply/approval/agree`,
    method: 'put',
    data
  })
}

// 申请审批-同意
export function approvalApplyAgreeNoExceptionApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/apply/approval/agree/noexception`,
    method: 'put',
    data
  })
}

// 申请审批-拒绝
export function approvalApplyRejectApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/apply/approval/reject`,
    method: 'put',
    data
  })
}

// 申请审批-同意-批量
export function approvalApplyAgreeBatchApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/apply/approval/agree/batch`,
    method: 'put',
    data
  })
}


// 申请审批-同意
export function approvalApplyAgreeV1Api(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/process/agree`,
    method: 'POST',
    data
  })
}

// 申请审批-同意
export function approvalApplyAgreeV1NoExceptionApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/process/agree/noexception`,
    method: 'POST',
    data
  })
}

// 申请审批-拒绝
export function approvalApplyRejectV1Api(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/process/reject`,
    method: 'POST',
    data
  })
}

// 申请审批-同意-批量
export function approvalApplyAgreeBatchV1Api(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/process/agree/batch`,
    method: 'POST',
    data
  })
}

// 审批中-导出
export function payablePaymentApprovalExportApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/list/export/easy/excel`,
    method: 'POST',
    data
  })
}

// 审批中-撤回
export function payablePaymentApprovalRecallApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/apply/cancel`,
    method: 'POST',
    data
  })
}

// 审批中-催办
export function payablePaymentApprovalUrgingApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/apply/approval/remind`,
    method: 'POST',
    data
  })
}

// 付款申请-获取批量下载文件类型
export function getDownloadFileBatchByIdsFileTypeApi() {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/file/info/batch`,
    method: 'get'
  })
}

// 付款申请-批量下载文件
export function downloadFileBatchByIdsApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/files/download/batch/ids`,
    method: 'POST',
    data
  })
}

// 付款申请-获取默认邮箱
export function getPaymentMemonotifyEmailApi(params) {
  return request({
    url: `/api/fms-service/omc/fms/settlement/linkman/ap/payment/memonotify/selects`,
    method: 'GET',
    params
  })
}


// 付款申请-重新提交工作流
export function paymentApprovalRepushApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/instruction/ap/payment/approval/push`,
    method: 'POST',
    data
  })
}

// 付款申请-复制申请
export function getPaymentApplyCopyInitApi(data) {
  return request({
    url: `/api/fms-service/omc/fms/composite/instruction/copy/init`,
    method: 'POST',
    data
  })
}
