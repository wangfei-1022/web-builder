/** UserEntity */
export type UserEntity = {
  /** id */
  id: number;
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 性别 */
  gender: number;
  /** 手机号 */
  phone?: string | null;
  /** 头像 */
  avatar?: string | null;
  /** 昵称 */
  nickname?: string | null;
  /** 签名 */
  desc?: string | null;
  /** 创建时间 */
  createdAt: string;
  /** 修改时间 */
  updatedAt: string;
};

/** UserCreateDto */
export type UserCreateDto = {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 性别 */
  gender: number;
  /** 手机号 */
  phone?: string | null;
  /** 头像 */
  avatar?: string | null;
  /** 昵称 */
  nickname?: string | null;
  /** 签名 */
  desc?: string | null;
};

/** UserListWhereDto */
export type UserListWhereDto = {
  /** 用户名 */
  username?: string | null;
  /** 密码 */
  password?: string | null;
  /** 性别 */
  gender?: number | null;
  /** 手机号 */
  phone?: string | null;
  /** 头像 */
  avatar?: string | null;
  /** 昵称 */
  nickname?: string | null;
  /** 签名 */
  desc?: string | null;
};

/** UserListDto */
export type UserListDto = {
  /** where */
  where?: UserListWhereDto | null;
  /** limit */
  limit?: Limit | null;
};

/** UserUpdateDto */
export type UserUpdateDto = {
  /** 用户名 */
  username?: string | null;
  /** 密码 */
  password?: string | null;
  /** 性别 */
  gender?: number | null;
  /** 手机号 */
  phone?: string | null;
  /** 头像 */
  avatar?: string | null;
  /** 昵称 */
  nickname?: string | null;
  /** 签名 */
  desc?: string | null;
};

/** RListDto */
export type RListDto = {
  /** 通用状态码[200:正常, 400: 客户端参数错误, 500: 服务器内部错误] */
  code: number;
  /** 业务状态码(0为标准状态,其它见方法提示) */
  status: number;
  /** 业务详细信息(可为空) */
  msg: string;
  /** data */
  data: any;
  /** total */
  total: number;
};

/** OmcTerminalDto */
export type OmcTerminalDto = {
  /** 类型 */
  type?: number | null;
  /** Code */
  code: number;
  /** 名称 */
  name?: number | null;
  /** 港口名称 */
  portCode?: number | null;
  /** 港口名称 */
  portName?: number | null;
  /** 业务详细信息(可为空) */
  msg: string;
  /** data */
  data: any;
  /** total */
  total: number;
};