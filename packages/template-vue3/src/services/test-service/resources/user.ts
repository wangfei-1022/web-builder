import { request } from '@/utils';
import type { BodyIdsDto, UserCreateDto, UserListDto, UserUpdateDto } from '../interfaces';

/**
 * 新增用户表
 * @param data 数据
 */
export function createUserList(
  data: UserCreateDto,
) {
  return request<OptimizeModel<any>>({
    url: `${__TEST_SERVICE__}/user/create`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 用户表列表（query）
 * @param data 数据
 */
export function UserController_queryList(
  data: UserListDto,
) {
  return request<OptimizeModel<any>>({
    url: `${__TEST_SERVICE__}/user/list`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 用户表列表
 * @param params 参数
 */
export function UserController_list(
  params: {
    /** 页码 */
    page: number;
    /** psize */
    psize: number;
  },
) {
  return request<OptimizeModel<any>>({
    url: `${__TEST_SERVICE__}/user/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 用户表列表-全部
 * @param params 参数
 */
export function getAllUserLists(
  params?: {
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
    /** 性别 */
    gender?: number;
    /** 手机号 */
    phone?: string;
    /** 头像 */
    avatar?: string;
    /** 昵称 */
    nickname?: string;
    /** 签名 */
    desc?: string;
  },
) {
  return request<OptimizeModel<any>>({
    url: `${__TEST_SERVICE__}/user/all`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * 某个用户表信息
 * @param id id
 */
export function UserController_details(
  id: number,
) {
  return request<OptimizeModel<any>>({
    url: `${__TEST_SERVICE__}/user/details/${id}`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 修改用户表信息
 * @param id id
 * @param data 数据
 */
export function partialUpdateUserList(
  id: number,
  data: UserUpdateDto,
) {
  return request<OptimizeModel<any>>({
    url: `${__TEST_SERVICE__}/user/update/${id}`,
    method: 'PATCH',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}

/**
 * 删除用户表
 * @param id id
 */
export function deleteUserList(
  id: number,
) {
  return request<OptimizeModel<any>>({
    url: `${__TEST_SERVICE__}/user/remove/${id}`,
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
  });
}

/**
 * 删除多个用户表
 * @param data 数据
 */
export function UserController_removes(
  data: BodyIdsDto,
) {
  return request<OptimizeModel<any>>({
    url: `${__TEST_SERVICE__}/user/removes`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}