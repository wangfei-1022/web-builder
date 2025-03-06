import request from '@/utils/request'
import URL from './urlTranslator'

export function getEdiTypeList(jobId) {
  const params = { jobId }
  return request({
    url: URL.sys.ediTypeList,
    method: 'get',
    params
  })
}
export function getEdiTemplateListByType(templateType) {
  const params = { templateType }
  return request({
    url: `${URL.sys.edi}`,
    method: 'get',
    params
  })
}

export function getEdiChannelListByType(type, jobId) {
  const params = { jobId }
  return request({
    url: `${URL.sys.ediChannelListByType}/${type}`,
    method: 'get',
    params
  })
}
export function getEdiModeListByChannel(type) {
  return request({
    url: `${URL.sys.ediModeListByChannel}` + (type ? `/${type}` : ''),
    method: 'get'
  })
}
export function getEdiTemplateListByMode(typeChannelId, templateMode) {
  const params = { typeChannelId, templateMode }
  return request({
    url: `${URL.sys.ediTemplateListByMode}`,
    method: 'get',
    params
  })
}
export function getEdiTemplateContent(id, data) {
  return request({
    url: `${URL.sys.ediTemplateContent}/${id}`,
    method: 'post',
    data
  })
}
export function viewEdiTemplateContent(data) {
  return request({
    url: `${URL.sys.viewEdiTemplateContent}`,
    method: 'post',
    data
  })
}
export function sendEdiTemplate(data) {
  return request({
    url: `${URL.sys.sendEdiTemplate}`,
    method: 'post',
    data
  })
}
export function saveEdiTemplateContent(data) {
  return request({
    url: `${URL.sys.ediTemplateContent}`,
    method: 'post',
    data
  })
}

export function saveEdi(data, id) {
  return request({
    url: `${URL.sys.edi}` + (id ? `/${id}` : ''),
    method: id ? 'put' : 'post',
    data
  })
}

export function delEdi(id) {
  return request({
    url: `${URL.sys.edi}/${id}`,
    method: 'delete'
  })
}

export function downloadEdi(data) {
  return request({
    url: `${URL.sys.ediDownload}`,
    method: 'post',
    responseType: 'blob', // {responseType: 'arraybuffer'} 否则下载下来的文件打不开！！！
    data
  })
}
