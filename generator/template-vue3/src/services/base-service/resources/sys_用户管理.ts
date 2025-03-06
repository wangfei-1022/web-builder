import { request } from '@/utils';
import type { Result, Result«boolean», Result«List«long»», Result«List«string»», Result«List«SysPrivilege»», Result«List«SysUserDropdownDTO»», Result«List«SysUserDTO»», Result«List«可以授权数据权限的用户»», Result«List«用户分配角色列表&明细页实体»», Result«List«用户列表及详细信息»», Result«List«用户职能实体»», Result«List«菜单树形»», Result«Map«long,SysUserDropdownDTO»», Result«PageInfo«用户列表及详细信息»», Result«string», Result«SysUserDropdownDTO», Result«用户详细实体», Result«用户详细页及保存入参实体», 分配入参实体:用户分配角色,角色分配用户,角色分配权限,用户分配工作号编码规则, 用户密码修改入参, 用户详细页及保存入参实体 } from '../interfaces';

/**
 * 用户查询列表
 * @param params 参数
 */
export function queryUsingGET_50(
  params: {
    /** BActive */
    BActive?: boolean;
    /** 中文名 */
    chineseName?: string;
    /** 创建日期截止日 */
    createTimeEnd?: number;
    /** 创建日期起始日 */
    createTimeStart?: number;
    /** 所属部门Id */
    departmentId?: number;
    /** 邮箱 */
    email?: string;
    /** 英文名 */
    englishName?: string;
    /** 手机号 */
    mobile?: string;
    /** 所属分公司Id */
    officeId?: number;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 排序 */
    sort?: string;
    /** 租户Id */
    tenantId?: number;
    /** 用户名 */
    userName?: string;
  },
) {
  return request<OptimizeModel<Result«PageInfo«用户列表及详细信息»»>>({
    url: `${__BASE_SERVICE__}/sys/user`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 用户新增保存
 * @param data 数据
 */
export function saveUsingPOST_35(
  data: 用户详细页及保存入参实体,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/user`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 用户禁用状态设置
 * @param params 参数
 */
export function activeDisableUsingPUT_16(
  params: {
    /** 用户id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/user/activedisable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 用户启用状态设置
 * @param params 参数
 */
export function activeEnableUsingPUT_17(
  params: {
    /** 用户id */
    id: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/user/activeenable`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 用户分配角色
 * @param data 数据
 */
export function assignRoleUsingPOST(
  data: 分配入参实体:用户分配角色,角色分配用户,角色分配权限,用户分配工作号编码规则,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/user/assign-role`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 根据用户id查询用户已有的角色code
 * @param params 参数
 */
export function getUserAssignedRoleListUsingGET(
  params: {
    /** userId */
    userId: number;
  },
) {
  return request<OptimizeModel<Result«List«string»»>>({
    url: `${__BASE_SERVICE__}/sys/user/assigned/roleList`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 部门下用户列表
 * @param departmentId departmentId
 */
export function listByDepartmentUsingGET(
  departmentId: number,
) {
  return request<OptimizeModel<Result«List«用户列表及详细信息»»>>({
    url: `${__BASE_SERVICE__}/sys/user/bydepartment`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 用户管理_获取当前用户目录树
 */
export function currentUserMenuTreeUsingGET(
) {
  return request<OptimizeModel<Result«List«菜单树形»»>>({
    url: `${__BASE_SERVICE__}/sys/user/current/menu/tree`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 用户密码修改-当前登录用户
 * @param data 数据
 */
export function modifyCurrentUserPasswordUsingPOST(
  data: 用户密码修改入参,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/user/current/modifypassword`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 根据邮箱获取用户详情-内部系统feign调用
 * @param email email
 */
export function detailForOmcByEmailUsingGET(
  email: string,
) {
  return request<OptimizeModel<Result«用户详细实体»>>({
    url: `${__BASE_SERVICE__}/sys/user/detail/email/${email}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 用户查询详情
 * @param name name
 */
export function detailForOmcUsingGET_1(
  name: string,
) {
  return request<OptimizeModel<Result«用户详细实体»>>({
    url: `${__BASE_SERVICE__}/sys/user/detail/name/${name}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 用户查询详情
 * @param userId userId
 */
export function detailForOmcUsingGET(
  userId: number,
) {
  return request<OptimizeModel<Result«用户详细实体»>>({
    url: `${__BASE_SERVICE__}/sys/user/detail/${userId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 用户类型list
 */
export function getDutyListUsingGET(
) {
  return request<OptimizeModel<Result«List«用户职能实体»»>>({
    url: `${__BASE_SERVICE__}/sys/user/dutylist`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 根据用户id获取邮箱
 * @param userId userId
 */
export function getEmailByUserIdUsingGET_1(
  userId: number,
) {
  return request<OptimizeModel<Result«string»>>({
    url: `${__BASE_SERVICE__}/sys/user/email/${userId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 给指定系统用户发送生日祝福邮件
 * @param params 参数
 */
export function getEmailByUserIdUsingGET(
  params?: {
    /** backgroundImgUrl */
    backgroundImgUrl?: string;
    /** emailCC */
    emailCC?: string | string[];
    /** userNames */
    userNames?: string | string[];
  },
) {
  return request<OptimizeModel<Result«boolean»>>({
    url: `${__BASE_SERVICE__}/sys/user/happy/birthday`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 用户密码修改
 * @param data 数据
 */
export function modifyPasswordUsingPOST(
  data: 用户密码修改入参,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/user/modifypassword`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 可以授权数据权限的用户列表
 * @param params 参数
 */
export function queryPermissionDepartmentUsingGET_1(
  params: {
    /** 维度 */
    permissionDimension: string;
    /** 权限code */
    privilegeCode: string;
    /** range */
    range?: string;
    /** 权限ID */
    roleId: number;
  },
) {
  return request<OptimizeModel<Result«List«可以授权数据权限的用户»»>>({
    url: `${__BASE_SERVICE__}/sys/user/permssion-users`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 当前用户的所有功能权限list
 */
export function queryCurrentUserPrivilegeUsingGET(
) {
  return request<OptimizeModel<Result«List«SysPrivilege»»>>({
    url: `${__BASE_SERVICE__}/sys/user/privilege`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 用户密码重置
 * @param userId 用户id
 */
export function restPasswordUsingPUT(
  userId: number,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/user/resetpassword/${userId}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 角色列表,标识属于当前用户的角色
 * @param userId userId
 */
export function roleListUsingGET(
  userId: number,
) {
  return request<OptimizeModel<Result«List«用户分配角色列表&明细页实体»»>>({
    url: `${__BASE_SERVICE__}/sys/user/rolelist/${userId}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 所有下拉列表
 * @param params 参数
 */
export function getAllUsersUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«SysUserDropdownDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/user/selections/all`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 客服下拉列表
 * @param params 参数
 */
export function getCustomerServiceListUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«SysUserDropdownDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/user/selections/customerService`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 所有Permission用户ID列表
 * @param duty duty
 */
export function getAllSalesIdsUsingGET(
  duty: string,
) {
  return request<OptimizeModel<Result«List«long»»>>({
    url: `${__BASE_SERVICE__}/sys/user/selections/duty/${duty}/ids/all`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 小包仓库人员下拉列表
 * @param params 参数
 */
export function getIlwWarehousePersonListUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«SysUserDropdownDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/user/selections/ilwWarehousePersonList`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 产品下拉列表
 * @param params 参数
 */
export function getProductManagerListUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«SysUserDropdownDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/user/selections/productManager`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 销售下拉列表
 * @param params 参数
 */
export function getSalesListUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«SysUserDropdownDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/user/selections/sales`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 销售与产品下拉列表
 * @param params 参数
 */
export function getSalesAndProductManagerListUsingGET(
  params?: {
    /** keyword */
    keyword?: string;
  },
) {
  return request<OptimizeModel<Result«List«SysUserDropdownDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/user/selections/salesAndProductManager`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据邮箱获取用户列表
 * @param params 参数
 */
export function getUserDropdownByEmailsUsingGET(
  params?: {
    /** 用户emails */
    emails?: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«SysUserDropdownDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/user/userDropdownByEmails`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 下拉框用户信息
 * @param params 参数
 */
export function getUserDropdownByIdUsingGET(
  params?: {
    /** userId */
    userId?: number;
  },
) {
  return request<OptimizeModel<Result«SysUserDropdownDTO»>>({
    url: `${__BASE_SERVICE__}/sys/user/userDropdownByUserId`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 下拉框用户列表
 * @param params 参数
 */
export function getUserDropdownByIdsUsingGET(
  params?: {
    /** 用户ids */
    userIds?: number | number[];
  },
) {
  return request<OptimizeModel<Result«Map«long,SysUserDropdownDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/user/userDropdownByUserIds`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 根据权限查询用户列表
 * @param params 参数
 */
export function getUsersByPrivilegeCodesUsingGET(
  params: {
    /** codes */
    codes: string | string[];
  },
) {
  return request<OptimizeModel<Result«List«SysUserDTO»»>>({
    url: `${__BASE_SERVICE__}/sys/user/usersByPrivilegeCodes`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 用户查询详情
 * @param id ID
 */
export function detailUsingGET_22(
  id: number,
) {
  return request<OptimizeModel<Result«用户详细页及保存入参实体»>>({
    url: `${__BASE_SERVICE__}/sys/user/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 用户修改保存
 * @param id id
 * @param data 数据
 */
export function updateUsingPUT_44(
  id: number,
  data: 用户详细页及保存入参实体,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/sys/user/${id}`,
    method: 'PUT',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}