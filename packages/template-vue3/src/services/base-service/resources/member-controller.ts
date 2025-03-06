import { request } from '@/utils';
import type { memInfoQualificationReviewDTO, Result, Result«PageInfo«memMemberInfoDTO»» } from '../interfaces';

/**
 * query
 * @param params 参数
 */
export function queryUsingGET_28(
  params: {
    /** 审核结果;0-未提交;1-待审核;2-审核通过;3-审核失败 */
    auditingStatus?: number;
    /** 会员中文名;会员实际的中文名，可以重名 */
    chineseName?: string;
    /** 创建时间结束 */
    createTimeEnd?: number;
    /** 创建时间开始 */
    createTimeStart?: number;
    /** 主键 */
    id?: number;
    /** 主键列表 */
    ids?: number | number[];
    /** 关键字查询 包含手机号/中文名/英文名/邮箱 */
    keyword?: string;
    /** 关键字查询 包含手机号/中文名/英文名/邮箱 */
    keywordName?: string;
    /** 手机;界面不允许直接修改，要通过绑定功能才能修改 */
    mobile?: string;
    /** 关键字查询 中文名/英文名 */
    name?: string;
    /** 中文名 不能为空 */
    nameNotEmpty?: boolean;
    /** 页码 */
    pageNum: number;
    /** 页尺 */
    pageSize: number;
    /** 注册时间 REGISTER_DATE-结束时间 */
    registeredDateEnd?: number;
    /** 注册时间 REGISTER_DATE-开始时间 */
    registeredDateStart?: number;
    /** 排序 */
    sort?: string;
    /** 租户类型 0 未定，未认证时，类型为0  1 个人，仅有一个用户（子账号） 2 企业，允许有多个用户（子账号） */
    type?: number;
  },
) {
  return request<OptimizeModel<Result«PageInfo«memMemberInfoDTO»»>>({
    url: `${__BASE_SERVICE__}/mem/member/info/list`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * detailForOperation
 * @param params 参数
 */
export function detailForOperationUsingGET(
  params?: {
    /** memberId */
    memberId?: number;
  },
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/mem/qualification/examine/detailForOperation`,
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    params,
  });
}

/**
 * review
 * @param data 数据
 */
export function reviewUsingPOST(
  data: memInfoQualificationReviewDTO,
) {
  return request<OptimizeModel<Result>>({
    url: `${__BASE_SERVICE__}/mem/qualification/examine/review`,
    method: 'POST',
    headers: {
      authorization: `Bearer ${localStorage.getItem(__TOKEN_STORAGE_KEY__)}`,
    },
    data,
  });
}