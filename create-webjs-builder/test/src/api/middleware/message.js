import request from '@/utils/request'

/** message module**/
/* 获取列表*/
export function getMessageListApi(params) {
  return request({
    url: '/api/comm-service/nfy/notify/message',
    method: 'get',
    params
  })
}

/* 获取未读消息数量*/
export function getUnreadNmberApi(data) {
  return request({
    url: '/api/comm-service/nfy/notify/message/unread/number',
    method: 'get',
    data
  })
}

/* 获取未读消息数量*/
export function getUnreadNumberByTypeApi(data) {
  return request({
    url: '/api/comm-service/nfy/notify/message/notify/type',
    method: 'get',
    data
  })
}

/* 批量标记已读*/
export function setMessageReadApi(data) {
  return request({
    url: '/api/comm-service/nfy/notify/message/read/messages',
    method: 'put',
    data
  })
}

/* 获取单条详情*/
export function getMessageDetailApi(id) {
  return request({
    url: `/api/comm-service/nfy/notify/message/read/${id}/message`,
    method: 'put'
  })
}

/** message module**/

/** receiver module**/
export function getReceiverListApi(params) {
  return request({
    url: '/api/comm-service/omc/nfy/receiver/receivers',
    method: 'get',
    params
  })
}

export function addReceiverApi(data) {
  return request({
    url: '/api/comm-service/omc/nfy/receiver',
    method: 'post',
    data
  })
}
export function resendEmailApi(data) {
  return request({
    url: `/api/comm-service/omc/nfy/receiver/checkEmail/${data.id}`,
    method: 'get',
    data
  })
}

export function deleteReceiverApi(data) {
  return request({
    url: `/api/comm-service/omc/nfy/receiver/${data.id}`,
    method: 'delete',
    data
  })
}

export function editReceiverApi(data) {
  return request({
    url: `/api/comm-service/omc/nfy/receiver/${data.id}`,
    method: 'put',
    data
  })
}

/** receiver module**/

/** subscribe module**/

/* 获取订阅配置列表*/
export function getSubscribeListApi(data) {
  return request({
    url: '/api/comm-service/omc/nfy/user/reception/config/types/tree',
    method: 'get',
    data
  })
}

/* 获取某个接收人配置*/
export function getUserReceiverApi(data) {
  return request({
    url: `/api/comm-service/omc/nfy/user/reception/config/${data.id}/receivers`,
    method: 'get',
    data
  })
}

/* 获取接收人配置*/
export function getAllReceiverApi(data) {
  return request({
    url: '/api/comm-service/omc/nfy/receiver/active/receivers',
    method: 'get',
    data
  })
}

/* 设置接收人*/
export function updateReceiverApi(data) {
  return request({
    url: '/api/comm-service/omc/nfy/user/reception/config/receivers',
    method: 'put',
    data
  })
}

/* 批量设置接收人*/
export function updateBatchReceiverApi(data) {
  return request({
    url: '/api/comm-service/omc/nfy/user/reception/config/batch/receivers',
    method: 'put',
    data
  })
}

/* 站内信*/
export function updateSubscribeSysStatusApi(data) {
  return request({
    url: '/api/comm-service/omc/nfy/user/reception/config/msg/on-off',
    method: 'put',
    data
  })
}

/* 短信*/
export function updateSubscribeSmsStatusApi(data) {
  return request({
    url: '/api/comm-service/omc/nfy/user/reception/config/mobile/on-off',
    method: 'put',
    data
  })
}

/* 邮件*/
export function updateSubscribeEmailStatusApi(data) {
  return request({
    url: '/api/comm-service/omc/nfy/user/reception/config/email/on-off',
    method: 'put',
    data
  })
}

/* 邮件认证回调*/
export function identificationEmailStatusApi(data) {
  return request({
    url: `/api/comm-service/omc/nfy/receiver/email/activate/${data.id}?token=${data.token}`,
    method: 'put',
    data
  })
}

/** subscribe module**/
