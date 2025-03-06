import request from '@/utils/request'

export function getAuthListApi(params) {
  return request({
    url: '/api/member-service/mem/member/info/list',
    method: 'get',
    params
  })
}

export function getAuthDetailApi(params) {
  return request({
    url: '/api/member-service/mem/qualification/examine/detailForOperation',
    method: 'get',
    params
  })
}

export function submitAuthApi(data) {
  return request({
    url: '/api/member-service/mem/qualification/examine/review',
    method: 'post',
    data
  })
}

/**
 * 查询全部的用户 不带子账户
 * @param {*} params
 * @returns
 */

export function getSelectionsApi(params) {
  return request({
    url: '/api/member-service/mem/member/info/selections',
    method: 'get',
    params
  })
}

// 获取会员类型
export function getMemberTypeApi(params) {
  return request({
    url: '/api/member-service/mem/member/info/type/select',
    method: 'get',
    params
  })
}

// 获取省市区
export function getReginInfoApi(params) {
  return request({
    url: '/api/mdm-service/dmn/administrative/division',
    method: 'get',
    params
  })
}

/* 公司名称唯一性*/
export function companyIsUniqueApi(params) {
  return request({
    url: `/api/member-service/mem/member/info/enterprise/country/${params.country}/name/${params.name}/exists`,
    method: 'get',
    params
  })
}

/* 社会信用统一代码唯一性*/
export function creditCodeIsUniqueApi(params) {
  return request({
    url: `/api/member-service/mem/member/info/enterprise/country/${params.country}/identify/${params.creditCode}/exists`,
    method: 'get',
    params
  })
}

/* 手机号唯一性*/
export function mobileIsUniqueApi(params) {
  return request({
    url: `/api/member-service/mem/user/mobile/${params.mobile}/userId`,
    method: 'get',
    params
  })
}

/* 邮箱唯一性*/
export function emailIsUniqueApi(params) {
  return request({
    url: `/api/member-service/mem/user/email/${params.email}/userId`,
    method: 'get',
    params
  })
}

/* 身份证唯一性*/
export function idCardIsUniqueApi(params) {
  return request({
    url: `/api/member-service/mem/member/info/individual/country/${params.country}/identify/${params.identify}/exists`,
    method: 'get',
    params
  })
}

/* 新增企业会员*/
export function addCompanyApi(data) {
  return request({
    url: '/api/member-service/omc/member/user/enterprise',
    method: 'post',
    data
  })
}

/* 更新企业会员*/
export function updateCompanyApi(data) {
  return request({
    url: `/api/member-service/omc/member/user/enterprise/${data.id}`,
    method: 'put',
    data
  })
}

/* 新增个人会员*/
export function addPersonalApi(data) {
  return request({
    url: '/api/member-service/omc/member/user/individual',
    method: 'post',
    data
  })
}

/* 更新个人会员*/
export function updatePersonalApi(data) {
  return request({
    url: `/api/member-service/omc/member/user/individual/${data.id}`,
    method: 'put',
    data
  })
}

/* 天眼查获取列表*/
export function getCompanyListByTianYanChaApi(params) {
  return request({
    url: '/api/mdm-service/dmn/third/party/enterprise/list/select',
    method: 'get',
    params
  })
}

/* 天眼查获取详情*/
export function getCompanyDetailByTianYanChaApi(params) {
  return request({
    url: `/api/mdm-service/dmn/third/party/enterprise/chineseName/${params.companyName}`,
    method: 'get',
    params
  })
}

/* 企业库获取列表*/
export function getCompanyListByOwnApi(params) {
  return request({
    url: '/api/mdm-service/dmn/enterprise/list/select',
    method: 'get',
    params
  })
}

/* 企业库获取详情*/
export function getCompanyDetailByOwnApi(params) {
  return request({
    url: `/api/mdm-service/dmn/enterprise/chineseName/${params.companyName}`,
    method: 'get',
    params
  })
}


/* 新增企业会员*/
export function addMemberCompanyApi(data) {
  return request({
    url: '/api/member-service/omc/member/user/enterprise',
    method: 'post',
    data
  })
}


/* 更新企业会员*/
export function updateMemberCompanyApi(data) {
  return request({
    url: '/api/member-service/omc/member/user/enterprise/{id}',
    method: 'post',
    data
  })
}

/* 企业会员详情*/
export function getCompanyDetailApi(id) {
  return request({
    url: `/api/member-service/omc/member/user/enterprise/${id}`,
    method: 'get'
  })
}

/* 新增个人会员*/
export function addMemberPersonalApi(data) {
  return request({
    url: '/api/member-service/omc/member/user/individual',
    method: 'post',
    data
  })
}


/* 更新个人会员*/
export function updateMemberPersonalApi(data) {
  return request({
    url: '/api/member-service/omc/member/user/individual/{id}',
    method: 'post',
    data
  })
}

/* 个人会员详情*/
export function getPersonalDetailApi(id) {
  return request({
    url: `/api/member-service/omc/member/user/individual/${id}`,
    method: 'get'
  })
}

/* 发送邮箱激活*/
export function sendEmailApi(id) {
  return request({
    url: `/api/member-service/omc/member/user/${id}/email/mail`,
    method: 'put'
  })
}

/* 发送短信激活*/
export function sendMobileApi(id) {
  return request({
    url: `/api/member-service/omc/member/user/${id}/mobile/sms`,
    method: 'put'
  })
}

/* 授权登录*/
export function getAuthLoginApi(id) {
  return request({
    url: `/api/member-service/omc/member/user/member/${id}/system/url`,
    method: 'get'
  })
}

// 变更会员名称
export function changeMemberNameApi(data) {
  return request({
    url: `/api/member-service/omc/member/user/enterprise/name/${data.id}`,
    method: 'PUT',
    data
  })
}


