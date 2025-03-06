import request from '@/utils/request'
import URL from './urlTranslator'

export function getCustomerList() { // 工作号详情页-委托单位下拉框的列表
  return request({
    url: `${URL.sys.customerList}`,
    method: 'get'
  })
}
export function getCustomerContactList(customerId) {
  return request({
    url: `${URL.sys.customerContactList}/${customerId}`,
    method: 'get'
  })
}
export function getSeaPortList() {
  return request({
    url: `${URL.sys.seaPortList}`,
    method: 'get'
  })
}

export function getJobNoList() {
  return request({
    url: `${URL.oms.seaExportJob}`,
    method: 'get'
  })
}
export function getSeaExportJob(seJobId) {
  return request({
    url: `${URL.oms.seaExportJob}/${seJobId}`,
    method: 'get'
  })
}
export function saveSeaExportJob(data, seJobId) {
  return request({
    url: `${URL.oms.seaExportJob}/${seJobId}`,
    method: 'put',
    data
  })
}

export function downloadElectronicFileApi(id) {
  return request({
    url: `/api/mdm-service/cloud/url/fileId?fileId=${id}`,
    method: 'get'
  })
}

export function saveSeaExportJobOfConsol(data, seJobId) {
  return request({
    url: `${URL.oms.seaExportJobOfConsol}/${seJobId}`,
    method: 'put',
    data
  })
}
export function copySeaExportJob(data) {
  return request({
    url: `${URL.oms.seaExportJobCopy}`,
    method: 'post',
    data
  })
}
export function getRuleListForJobNoCopyAndSave(params) {
  return request({
    url: `${URL.cfg.ruleList}`,
    method: 'get',
    params
  })
}

export function getJobNoListRowDataOfConsol(params) {
  return request({
    url: `${URL.oms.seaExportJobOfConsol}`,
    method: 'get',
    params
  })
}
export function getSelectableSlave(params) {
  return request({
    url: `${URL.oms.seaExportSelectableSlave}`,
    method: 'get',
    params
  })
}
export function appendSlave(data) {
  return request({
    url: `${URL.oms.seaExportAppendSlave}`,
    method: 'post',
    data
  })
}
export function removeSlave(data) {
  return request({
    url: `${URL.oms.seaExportRemoveSlave}`,
    method: 'put',
    data
  })
}
export function createSlave(data) {
  return request({
    url: `${URL.oms.seaExportCreateSlave}`,
    method: 'post',
    data
  })
}
export function deleteSlave(id) {
  return request({
    url: `${URL.oms.seaExportJob}/${id}`,
    method: 'delete'
  })
}

export function getJobPanorama(seJobId) {
  return request({
    url: `${URL.oms.seaExportJobPanorama}/${seJobId}`,
    method: 'get'
  })
}
export function getJobPanoramaProfit(seJobId) {
  return request({
    url: `${URL.oms.seaExportJobPanoramaProfit}/${seJobId}`,
    method: 'get'
  })
}
export function getJobPanoramaState(seJobId) {
  return request({
    url: `${URL.oms.seaExportJobPanoramaState}/${seJobId}`,
    method: 'get'
  })
}
export function singleSubmitSeaExportJob(seJobId) {
  return request({
    url: `${URL.oms.seaExportJobSubmit}/${seJobId}`,
    method: 'put'
  })
}
export function singleSeaExportJobReviewAccept(seJobId) {
  return request({
    url: `${URL.oms.seaExportJobSingleReviewAccept}/${seJobId}`,
    method: 'put'
  })
}
export function singleSeaExportJobReviewReject(seJobId) {
  return request({
    url: `${URL.oms.seaExportJobSingleReviewReject}/${seJobId}`,
    method: 'put'
  })
}

export function createSeaExportJob() {
  return request({
    url: `${URL.oms.seaExportJobInit}`,
    method: 'post'
  })
}
export function createSeaExportJobOfConsol() {
  return request({
    url: `${URL.oms.seaExportJobOfConsolInit}`,
    method: 'post'
  })
}

export function getContainerList(params) {
  return request({
    url: `${URL.oms.seaExportJobEncasementContainer}`,
    method: 'get',
    params
  })
}
export function getContainerById(id) {
  return request({
    url: `${URL.oms.seaExportJobEncasementContainer}/${id}`,
    method: 'get'
  })
}
export function updateSeContainer(data) {
  return request({
    url: `${URL.oms.seaExportJobEncasementContainer}/${data.id}`,
    method: 'put',
    data
  })
}
export function removePreManifest(data) {
  return request({
    url: `${URL.oms.seaExportJobEncasementRemovePreManifest}`,
    method: 'put',
    data
  })
}
export function getLadingNoList(params) {
  return request({
    url: `${URL.oms.seaExportJobEncasementLadingNoLeft}`,
    method: 'get',
    params
  })
}

export function getContainerDetailList(params) {
  return request({
    url: `${URL.oms.seaExportJobEncasementContainerDetail}`,
    method: 'get',
    params
  })
}
export function getContainerDetailPiece(id) {
  return request({
    url: `${URL.oms.seaExportJobEncasementContainerDetail}/${id}`,
    method: 'get'
  })
}
export function saveContainerDetailPiece(data, id) {
  return request({
    url: `${URL.oms.seaExportJobEncasementContainerDetail}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}
export function deleteOneContainerDetailPiece(id) {
  return request({
    url: `${URL.oms.seaExportJobEncasementContainerDetail}/${id}`,
    method: 'delete'
  })
}
export function resetContainer(data) { // 重置装箱
  return request({
    url: `${URL.oms.seaExportJobEncasementResetContainer}`,
    method: 'put',
    data
  })
}
export function autoLoadContainer(data) { // 自动装箱
  return request({
    url: `${URL.oms.seaExportJobEncasementAutoLoadContainer}`,
    method: 'post',
    data
  })
}

export function clearContainer(data) { // 清除装箱
  return request({
    url: `${URL.oms.seaExportJobEncasementClearContainer}`,
    method: 'post',
    data
  })
}
export function autoDistribute(data) { // 自动均摊
  return request({
    url: `${URL.oms.seaExportJobEncasementAutoDistribute}`,
    method: 'put',
    data
  })
}
export function execEncase(data) {
  return request({
    url: `${URL.oms.seaExportJobEncasementExecEncase}`,
    method: 'post',
    data
  })
}

export function getPreManifestList(seJobId, jobId) {
  return request({
    url: `${URL.oms.seaExportJobPreManifest}`,
    method: 'get',
    params: { seJobId, jobId }
  })
}
export function getPreManifestById(id) {
  return request({
    url: `${URL.oms.seaExportJobPreManifest}/${id}`,
    method: 'get'
  })
}
export function savePreManifest(data, id) {
  return request({
    url: `${URL.oms.seaExportJobPreManifest}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

// 单个新增的保存
export function saveSeaExportJobPreManifest4OneAdd(data) {
  return request({
    url: `${URL.oms.seaExportJobPreManifest4OneAdd}`,
    method: 'post',
    data
  })
}
export function deletePreManifest(id) {
  return request({
    url: `${URL.oms.seaExportJobPreManifest}/${id}`,
    method: 'delete'
  })
}
export function addPreManifest(data) {
  return request({
    url: `${URL.oms.seaExportJobEncasementLadingNo}`,
    method: 'post',
    data
  })
}

export function getManifestList(seJobId, jobId) {
  return request({
    url: `${URL.oms.seaExportJobManifest}`,
    method: 'get',
    params: { seJobId, jobId }
  })
}
export function getManifestById(id) {
  return request({
    url: `${URL.oms.seaExportJobManifest}/${id}`,
    method: 'get'
  })
}
export function saveManifest(data, id) {
  return request({
    url: `${URL.oms.seaExportJobManifest}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}
export function deleteManifest(id) {
  return request({
    url: `${URL.oms.seaExportJobManifest}/${id}`,
    method: 'delete'
  })
}

export function getTruckList(jobId) {
  return request({
    url: `${URL.oms.seaExportJobTruck}`,
    method: 'get',
    params: { jobId }
  })
}
export function getTruckById(id) {
  return request({
    url: `${URL.oms.seaExportJobTruck}/${id}`,
    method: 'get'
  })
}
export function saveTruck(data, id) {
  return request({
    url: `${URL.oms.seaExportJobTruck}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}
export function deleteTruck(id) {
  return request({
    url: `${URL.oms.seaExportJobTruck}/${id}`,
    method: 'delete'
  })
}
export function getChoosableContainer(jobId) {
  return request({
    url: `${URL.oms.seaExportJobTruckChoosableContainer}`,
    method: 'get',
    params: { jobId }
  })
}

export function getHblTabInfo(params) {
  return request({
    url: `${URL.oms.seaExportJobHbl}`,
    methods: 'get',
    params
  })
}
export function getHblById(id, seJobId, jobId) {
  return request({
    url: `${URL.oms.seaExportJobHblDetail}/${id}`,
    methods: 'get',
    params: { jobId, seJobId }
  })
}
export function saveHbl(data, id) {
  const url = id ? `${URL.oms.seaExportJobHblDetail}/${id}` : `${URL.oms.seaExportJobHblAdd4Seperated}`
  return request({
    url,
    method: id ? 'put' : 'post',
    data
  })
}
export function deleteHbl(id, params) {
  return request({
    url: `${URL.oms.seaExportJobHblDetail}/${id}`,
    method: 'delete',
    params
  })
}
export function switchHblMode(data) {
  return request({
    url: `${URL.oms.seaExportJobHblSwitchHBlMode}`,
    method: 'put',
    data
  })
}
export function addJobToHbl(data) {
  return request({
    url: `${URL.oms.seaExportJobHblJob}`,
    method: 'post',
    data
  })
}
export function removeJobFromHbl(data) {
  return request({
    url: `${URL.oms.seaExportJobHblJobToBeRemoved}`,
    method: 'put',
    data
  })
}

export function getMblTabInfo(params) {
  return request({
    url: `${URL.oms.seaExportJobMbl}`,
    methods: 'get',
    params
  })
}
export function getMblById(id, seJobId, jobId) {
  return request({
    url: `${URL.oms.seaExportJobMblDetail}/${id}`,
    methods: 'get',
    params: { jobId, seJobId }
  })
}
export function saveMbl(data, id) {
  const url = id ? `${URL.oms.seaExportJobMblDetail}/${id}` : `${URL.oms.seaExportJobMblDetail}`
  return request({
    url,
    method: id ? 'put' : 'post',
    data
  })
}
export function deleteMbl(id, params) {
  return request({
    url: `${URL.oms.seaExportJobMblDetail}/${id}`,
    method: 'delete',
    params
  })
}
export function switchMblMode(data) {
  return request({
    url: `${URL.oms.seaExportJobMblSwitchMBlMode}`,
    method: 'put',
    data
  })
}
export function addJobToMbl(data) {
  return request({
    url: `${URL.oms.seaExportJobMblJob}`,
    method: 'post',
    data
  })
}
export function removeJobFromMbl(data) {
  return request({
    url: `${URL.oms.seaExportJobMblJobToBeRemoved}`,
    method: 'put',
    data
  })
}

export function getWarehouseDetail(jobId) {
  return request({
    url: `${URL.oms.seaExportJobWarehouseDetail}`,
    method: 'get',
    params: { jobId }
  })
}
export function saveWarehouseDetail(data, id) {
  const url = `${URL.oms.seaExportJobWarehouseDetailSpecifiedForEditing}` + (id ? `/${id}` : '')
  const method = id ? 'put' : 'post'
  return request({ url, method, data })
}
export function getWarehouseInRecordList(jobId) {
  return request({
    url: `${URL.oms.seaExportJobWarehouseInRecord}`,
    method: 'get',
    params: { jobId }
  })
}
export function saveWarehouseInRecord(data, id) {
  return request({
    url: `${URL.oms.seaExportJobWarehouseInRecord}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}
export function deleteWarehouseInRecord(id) {
  return request({
    url: `${URL.oms.seaExportJobWarehouseInRecord}/${id}`,
    method: 'delete'
  })
}

export function getDangerousCargo(params) {
  return request({
    url: `${URL.oms.seaExportJobDangerousCargo}`,
    method: 'get',
    params
  })
}
export function getDangerousCargoById(id) {
  return request({
    url: `${URL.oms.seaExportJobDangerousCargo}/${id}`,
    method: 'get'
  })
}
export function saveDangerousCargo(data, id) {
  return request({
    url: `${URL.oms.seaExportJobDangerousCargo}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}
export function deleteDangerousCargo(id) {
  return request({
    url: `${URL.oms.seaExportJobDangerousCargo}/${id}`,
    method: 'delete'
  })
}

export function focusOnJob(data) {
  return request({
    url: `${URL.oms.seaExportJobFocusBatch}`,
    method: 'post',
    data
  })
}
export function unFocusOnJob(params) {
  return request({
    url: `${URL.oms.seaExportJobFocusBatch}`,
    method: 'delete',
    params
  })
}

export function batchSubmit(data) {
  return request({
    url: `${URL.oms.seaExportJobBatchSubmit}`,
    method: 'put',
    data
  })
}
export function batchUnSubmit(data) {
  return request({
    url: `${URL.oms.seaExportJobBatchUnSubmit}`,
    method: 'put',
    data
  })
}
export function batchVerify(data) {
  return request({
    url: URL.oms.seaExportJobBatchVerify,
    method: 'put',
    data
  })
}
export function batchVerifyFailed(data) {
  return request({
    url: URL.oms.seaExportJobBatchVerifyFailed,
    method: 'put',
    data
  })
}
export function batchUnVerify(data) {
  return request({
    url: `${URL.oms.seaExportJobBatchUnVerify}`,
    method: 'put',
    data
  })
}

export function batchUpdate(data) { // 批量修改业务数据
  return request({
    url: `${URL.oms.seaExportJobBatchUpdate}`,
    method: 'put',
    data
  })
}

export function getElectronicFile(params) {
  return request({
    url: '/api/mdm-service/com/file',
    method: 'get',
    params
  })
}
export function getDocumentTypeCodeTree(params) {
  return request({
    url: '/api/mdm-service/dmn/document/treelist',
    method: 'get',
    params
  })
}
export function saveElectronicFile(data) {
  return request({
    url: `/api/mdm-service/com/file/batchSave`,
    method: 'post',
    data
  })
}
export function deleteElectronicFile(id) {
  return request({
    url: `/api/mdm-service/com/file/${id}`,
    method: 'delete'
  })
}

export function fillClipboard(seJobId) {
  return request({
    url: `${URL.oms.seaExportJobClipboard}/${seJobId}`,
    method: 'get'
  })
}
export function getClipboardConfig(params) {
  return request({
    url: `${URL.oms.seaExportJobClipboardConfig}`,
    method: 'get',
    params
  })
}
export function saveClipboardConfig(data) {
  return request({
    url: `${URL.oms.seaExportJobClipboardConfig}`,
    method: 'post',
    data
  })
}

export function getVoyageInfo(params) {
  return request({
    url: URL.sys.voyageInfo,
    method: 'get',
    params
  })
}

export function getDmnTermItemList(params) {
  return request({
    url: URL.sys.dmnTermItemList,
    method: 'get',
    params
  })
}

export function getContainerTypeList() {
  return request({
    url: `${URL.sys.containerTypeList}`,
    method: 'get'
  })
}

export function genTransportNo(jobId) {
  return request({
    url: URL.oms.genTransportNo + `/${jobId}`,
    method: 'get'
  })
}

export function placeChosenContainer({ id, seContainerIdList }) {
  return request({
    url: `${URL.oms.placeChosenContainer}/${id}`,
    method: 'put',
    data: seContainerIdList
  })
}

export function removeChosenContainer({ id, seContainerIdList }) {
  return request({
    url: `${URL.oms.removeChosenContainer}/${id}`,
    method: 'put',
    data: seContainerIdList
  })
}

export function deleteJob(id) {
  return request({
    url: `${URL.oms.seaExportJob}/${id}`,
    method: 'delete'
  })
}

export function cancelJob(id) {
  return request({
    url: `${URL.oms.seaExportJobCancel}/${id}`,
    method: 'put'
  })
}

export function doImportUploadedTitle(id) {
  return request({
    url: `${URL.oms.uploadedTitle}/${id}`,
    method: 'get'
  })
}
export function doImportUploadedList(id) {
  return request({
    url: `${URL.oms.uploadedList}/${id}`,
    method: 'get'
  })
}
export function confirmUploadedData(id) {
  return request({
    url: `${URL.oms.uploadedConfirm}/${id}`,
    method: 'post'
  })
}
export function saveEncasementUploadFileInfo(data) {
  return request({
    url: `${URL.oms.encasementUploadFileInfoSave}`,
    method: 'post',
    data
  })
}
export function getImportHistory(params) {
  return request({
    url: `${URL.oms.encasementUploadFileHistory}`,
    method: 'get',
    params
  })
}
export function encasementUploadFileHandle(fileImportId) {
  return request({
    url: `${URL.oms.encasementUploadFileHandle}/${fileImportId}`,
    method: 'post'
  })
}
export function getConfigParams(data) {
  return request({
    url: `${URL.sys.configParams}`,
    method: 'post',
    data
  })
}

export function getSelectableJobNoForBlPane(params) {
  return request({
    url: `${URL.oms.seaExportSelectableJobNoForBlPane}`,
    method: 'get',
    params
  })
}

export function getBillConfirmUrl(id) {
  return request({
    url: `${URL.oms.billConfirmUrl}/${id}`,
    method: 'get'
  })
}

export function getContainerNoValidationResult(containerNo) {
  return request({
    url: `${URL.oms.seaExportJobEncasementContainerValidation}`,
    method: 'get',
    params: { containerNo }
  })
}

export function getContainerDeleteValidationResult(params) {
  return request({
    url: `${URL.oms.containerDeleteValidation}`,
    method: 'get',
    params
  })
}

export function saveTypeAndQuant(data) {
  return request({
    url: `${URL.oms.containerSaveTypeAndQuant}`,
    method: 'post',
    data
  })
}

export function bookingSoNoDeleteValidation(permanifestId) {
  return request({
    url: `${URL.oms.bookingSoNoDeleteValidation}`,
    method: 'get',
    params: { permanifestId }
  })
}

export function bookingSoNoDialogSave(data) {
  return request({
    url: `${URL.oms.bookingSoNoDialogSave}`,
    method: 'post',
    data
  })
}

export function quickAddSoNo(data) {
  return request({
    url: `${URL.oms.quickAddSoNo}`,
    method: 'post',
    data
  })
}
// 船期信息-根据航线获取港口列表
export function getCode5ListByRouteCodeListApi(params) {
  return request({
    url: `/api/mdm-service/dmn/seaport/getCode5ListByRouteCodeList`,
    method: 'get',
    params
  })
}
