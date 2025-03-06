/** AuthUserLoginRequest */
export type AuthUserLoginRequest = {
  /** 图片验证码 */
  captchaCode?: string | null;
  /** 图片验证码uuid */
  captchaUUID?: string | null;
  /** 用户名 */
  loginName: string;
  /** 微信openId */
  openId?: string | null;
  /** 密码 */
  password: string;
};

/** Auth发送验证码 */
export type Auth发送验证码 = {
  /** 图片验证码 */
  captchaCode?: string | null;
  /** 图片验证码uuid */
  captchaUUID?: string | null;
  /** 号码或邮件 */
  loginName: string;
};

/** Id列表请求对象 */
export type BaseIdListRequest = {
  /** ids */
  ids: number[];
};

/** CaptchaResultDTO */
export type CaptchaResultDTO = {
  /** 验证码Base64串 */
  codeBase64?: string | null;
  /** 验证码唯一id */
  uuid?: string | null;
};

/** 文件操作节点 */
export type CfgDocumentNode = {
  /** 主键id */
  id?: number | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 文件操作类型;1上传文件2导出文件 */
  documentOpType?: number | null;
  /** 文件类型代码 */
  documentTypeCode?: string | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** CfgGridSchemeCmd */
export type CfgGridSchemeCmd = {
  /** 是否默认0否1是 */
  defaultFlag?: boolean | null;
  /** 模块code */
  moduleCode?: string | null;
  /** 模块name */
  moduleName?: string | null;
  /** 方案内容 */
  schemeContent?: string | null;
  /** 方案名称 */
  schemeName?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
};

/** CfgGridSchemeUpdateCmd */
export type CfgGridSchemeUpdateCmd = {
  /** id */
  id?: number | null;
  /** 方案内容 */
  schemeContent?: string | null;
  /** 方案名称 */
  schemeName?: string | null;
};

/** 编码规则 */
export type CfgIdentifierRule = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** bactive */
  bactive?: boolean | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 编码类型;1-工作单号;2-工作号;;3-账单号;4-收付申请号.... */
  identifierType: number;
  /** 分公司id */
  officeId: number;
  /** 数据操作url */
  optUrl?: string | null;
  /** 重置方式; 0-不重置;1-按年重置;2-按月重置;3-按天重置 */
  resetType: number;
  /** 编号代码 */
  ruleCode?: string | null;
  /** 规则表达式 */
  ruleExpression: string;
  /** 编码规则说明 */
  ruleRemark?: string | null;
  /** 编号简称 */
  shortName?: string | null;
  /** 起始号, 默认为1 */
  startSeq?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 邮件服务器 */
export type CfgMailServer = {
  /** 主键id */
  id?: number | null;
  /** stmp验证用户名 */
  authSender?: string | null;
  /** smtp验证密码 */
  authSenderPwd?: string | null;
  /** 是否使用安全套接字层 */
  bSmtpSsl?: boolean | null;
  /** bsmtpSsl */
  bsmtpSsl?: boolean | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remarks?: string | null;
  /** 默认回信地址 */
  returnMail?: string | null;
  /** 发送方邮件 */
  senderMail?: string | null;
  /** 发送方名称 */
  senderName?: string | null;
  /** smtp邮件服务器 */
  smtpHost?: string | null;
  /** smtp端口 */
  smtpPort?: string | null;
  /** 发送服务器smtp超时值 */
  smtpTimeOut?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 用户邮件 */
  userEmail?: string | null;
};

/** cargo参数 */
export type CfgParameter = {
  /** 主键id */
  id?: number | null;
  /** 中文名 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 配置值;配置多个值时以逗号分隔 */
  configValue?: string | null;
  /** 配置值描述 */
  configValueDesc?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名 */
  englishName?: string | null;
  /** 录入方式 */
  inputMode?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 参数类型 */
  parameterType?: string | null;
  /** 备注说明 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 参数配置 */
export type CfgParameterConfig = {
  /** 主键id */
  id?: number | null;
  /** 配置值 */
  configValue?: string | null;
  /** 配置值描述 */
  configValueDesc?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 分公司 */
  officeId?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 参数代码 */
  parameterCode: string;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 系统参数列表实体 */
export type CfgParameterConfigListVO = {
  /** 参数中文名称 */
  chineseName: string;
  /** configId */
  configId: number;
  /** 配置值 */
  configValue: string;
  /** 配置值描述 */
  configValueDesc: string;
  /** 参数英文名称 */
  englishName: string;
  /** 录入方式 */
  inputMode: number;
  /** officeId */
  officeId: number;
  /** 参数代码 */
  parameterCode: string;
  /** 参数类型 */
  parameterType: string;
  /** 参数类型描述 */
  parameterTypeDesc: string;
  /** 备注 */
  remark: string;
  /** 更新人 */
  updateByName: string;
  /** 更新时间 */
  updateTime: number;
};

/** cargo参数项 */
export type CfgParameterItem = {
  /** 主键id */
  id?: number | null;
  /** 中文名 */
  chineseName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名 */
  englishName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 参数类型code */
  parameterCode?: string | null;
  /** 备注说明 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 值 */
  value?: string | null;
};

/** 上传人信息 */
export type CloudFileSupplierVO = {
  /** 云服务器文件名称(唯一id+后缀) */
  cloudFileName: string;
  /** 文件类型代码;文件归类，在界面上显示文件归档时显示文件的类型，如job上的历史文件的类型 */
  documentTypeCode: string;
  /** 业务实体id;关联的业务实体id，如job的历史文件 */
  entityId: number;
  /** 业务实体类型 */
  entityType: string;
  /** 业务实体类型 */
  entityTypeName: string;
  /** 业务实体对应文件类型代码 */
  fieldCode: string;
  /** 文件大小 */
  fileSize: number;
  /** 源文件名 */
  originFileName: string;
  /** 文件来源默认 upload */
  sourceType: string;
  /** 上传人Id */
  uploadBy: number;
  /** 上传人名 */
  uploadByName: string;
  /** 上传时间 */
  uploadTime: number;
  /** 云服务器路径有效期24小时 */
  url: string;
};

/** 云服务文件属性 */
export type CloudFileVO = {
  /** 云服务器文件名称(唯一id+后缀) */
  cloudFileName: string;
  /** 文件大小 */
  fileSize: number;
  /** 源文件名 */
  originFileName: string;
  /** 云服务器路径有效期24小时 */
  url: string;
};

/** 上传人信息 */
export type CloudFileVerboseVO = {
  /** 云服务器文件名称(唯一id+后缀) */
  cloudFileName: string;
  /** 文件大小 */
  fileSize: number;
  /** 源文件名 */
  originFileName: string;
  /** 上传人Id */
  uploadBy: number;
  /** 上传人名 */
  uploadByName: string;
  /** 上传时间 */
  uploadTime: number;
  /** 云服务器路径有效期24小时 */
  url: string;
};

/** ComDelAndAddFileByEntityIdFileCodeDTO */
export type ComDelAndAddFileByEntityIdFileCodeDTO = {
  /** 需要保存的数据 */
  batchEditRequestList?: 文件批量保存request0[] | null;
  /** deleteDTO */
  deleteDTO?: 文件批量删除DTO | null;
};

/** 电子文件列表实体 */
export type ComFileElectronDTO = {
  /** 文件id */
  id?: number | null;
  /** 云存储文件名称 */
  cloudFileName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 文件类型代码;文件归类，在界面上显示文件归档时显示文件的类型，如job上的历史文件的类型 */
  documentTypeCode?: string | null;
  /** 文件类型中文名 */
  documentTypeCodeDesc?: string | null;
  /** 业务实体id;关联的业务实体id，如job的历史文件 */
  entityId?: number | null;
  /** 业务实体类型 */
  entityType?: string | null;
  /** 业务实体对应文件类型代码 */
  fieldCode?: string | null;
  /** 文件名;上传时的【文件名】 */
  fileName?: string | null;
  /** 文件大小;文件的大小，单位为byte */
  fileSize?: number | null;
  /** 文件后缀 */
  fileSuffix?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 源文件名 */
  originFileName?: string | null;
  /** 文件来源:上传:upload;report;邮件附件:email;下载:download */
  sourceType?: string | null;
  /** 文件来源类型描述 */
  sourceTypeDesc?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 文件路径;云存储的路径 */
  url?: string | null;
};

/** com_船期表 */
export type ComSailingSchedule = {
  /** 主键id */
  id?: number | null;
  /** 船公司id */
  carrierId?: number | null;
  /** 船公司id */
  carrierName?: string | null;
  /** 截货日期 */
  closeCargoDate?: number | null;
  /** 截国内舱单日期 */
  closeCnManifestDate?: number | null;
  /** 截关日期 */
  closeCustomsDate?: number | null;
  /** 截单日期 */
  closeDocDate?: number | null;
  /** 截海外舱单日期 */
  closeEnManifestDate?: number | null;
  /** 截港日期 */
  closePortDate?: number | null;
  /** 截vgm日期 */
  closeVgmDate?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 港区 */
  dock?: string | null;
  /** 到港日期 */
  eta?: number | null;
  /** 开航日期 */
  etd?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 卸货港代码 */
  podCode?: string | null;
  /** 起运港代码 */
  polCode?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 船舶代码 */
  vesselCode?: string | null;
  /** 船名 */
  vesselName?: string | null;
  /** 航程 */
  voyageDays?: number | null;
  /** 航次 */
  voyageNo?: string | null;
};

/** com_船期表列表&详情页实体 */
export type ComSailingScheduleVO = any;

/** 云文件任务DTO */
export type ComTaskWithCloudFileDTO = {
  /** Json格式的业务信息，具体实现可由调用方式定义 */
  businessInfo?: string | null;
  /** channel */
  channel?: string | null;
  /** comTaskMonitorDTO */
  comTaskMonitorDTO?: comTaskMonitorDTO | null;
  /** ctnOrderType */
  ctnOrderType?: number | null;
  /** ctnParseFileType */
  ctnParseFileType?: number | null;
  /** excelComFileEditRequest */
  excelComFileEditRequest?: 文件批量保存request | null;
  /** failedMsgCode */
  failedMsgCode?: string | null;
  /** messageKey */
  messageKey?: string | null;
  /** 订单id */
  orderId?: number | null;
  /** 订单类型1.草稿2.提交审核 */
  orderType?: number | null;
  /** otherSubscribeCodeList */
  otherSubscribeCodeList?: string[] | null;
  /** parseFileTopic */
  parseFileTopic?: string | null;
  /** picComFileEditRequestList */
  picComFileEditRequestList?: 文件批量保存request[] | null;
  /** sendMsgCode */
  sendMsgCode?: string | null;
  /** successMsgCode */
  successMsgCode?: string | null;
};

/** 导出任务DTO */
export type ComTaskWithExportFileDTO = {
  /** channel */
  channel?: string | null;
  /** comTaskMonitorDTO */
  comTaskMonitorDTO?: comTaskMonitorDTO | null;
  /** exportFileName */
  exportFileName?: string | null;
  /** failedMsgCode */
  failedMsgCode?: string | null;
  /** messageKey */
  messageKey?: string | null;
  /** otherSubscribeCodeList */
  otherSubscribeCodeList?: string[] | null;
  /** parseFileTopic */
  parseFileTopic?: string | null;
  /** requestJson */
  requestJson?: string | null;
  /** sendMsgCode */
  sendMsgCode?: string | null;
  /** successMsgCode */
  successMsgCode?: string | null;
};

/** com_船舶信息 */
export type ComVessel = {
  /** 主键id */
  id?: number | null;
  /** 船舶呼号 */
  callSign?: string | null;
  /** 船公司id */
  carrierId?: number | null;
  /** 船公司id */
  carrierName?: string | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名称 */
  englishName?: string | null;
  /** feeder标志 */
  feeder?: boolean | null;
  /** 海关编码 */
  hsCode?: string | null;
  /** imo编号 */
  imoNo?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 船舶代码 */
  vesselCode?: string | null;
  /** 船舶类型 */
  vesselType?: number | null;
};

/** com_船舶信息列表&详细页实体 */
export type ComVesselVO = {
  /** 主键id */
  id: number;
  /** 船舶呼号 */
  callSign: string;
  /** 船公司id */
  carrierId: number;
  /** 船公司 */
  carrierName: string;
  /** 中文名称 */
  chineseName: string;
  /** 国家代码 */
  countryCode: string;
  /** 创建人 */
  createBy: number;
  /** 创建人 */
  createByName: string;
  /** 创建时间 */
  createTime: number;
  /** 英文名称 */
  englishName: string;
  /** feeder标志 */
  feeder: boolean;
  /** 海关编码 */
  hsCode: string;
  /** imo编号 */
  imoNo: string;
  /** 数据操作url */
  optUrl: string;
  /** 备注 */
  remark: string;
  /** 租户ID */
  tenantId: number;
  /** 更新人 */
  updateBy: number;
  /** 更新人 */
  updateByName: string;
  /** 更新时间 */
  updateTime: number;
  /** 船舶代码 */
  vesselCode: string;
  /** 船舶类型 */
  vesselType: number;
  /** 船舶类型 */
  vesselTypeDesc: string;
};

/** 云文件任务DTO */
export type CreateImportFileTaskDTO = {
  /** Json格式的业务信息，具体实现可由调用方式定义 */
  businessInfo?: string | null;
  /** channel */
  channel?: string | null;
  /** cloudFileVO */
  cloudFileVO?: CloudFileVO | null;
  /** 是否不使用事务消息默认使用 */
  doNotUseTransactionMQ?: boolean | null;
  /** failedMsgCode */
  failedMsgCode?: string | null;
  /** messageKey */
  messageKey?: string | null;
  /** parseFileTopic */
  parseFileTopic?: string | null;
  /** sendMsgCode */
  sendMsgCode?: string | null;
  /** successMsgCode */
  successMsgCode?: string | null;
  /** taskCode */
  taskCode?: string | null;
};

/** 云文件任务DTO */
export type CreateTaskDTO = {
  /** Json格式的业务信息，具体实现可由调用方式定义 */
  businessInfo?: string | null;
  /** channel */
  channel?: string | null;
  /** closeSubscribeFlag */
  closeSubscribeFlag?: boolean | null;
  /** failedMsgCode */
  failedMsgCode?: string | null;
  /** messageKey */
  messageKey?: string | null;
  /** sendMsgCode */
  sendMsgCode?: string | null;
  /** successMsgCode */
  successMsgCode?: string | null;
  /** taskCode */
  taskCode?: string | null;
  /** taskTopic */
  taskTopic?: string | null;
};

/** Credentials */
export type Credentials = {
  /** accessKeyId */
  accessKeyId?: string | null;
  /** accessKeySecret */
  accessKeySecret?: string | null;
  /** expiration */
  expiration?: string | null;
  /** securityToken */
  securityToken?: string | null;
};

/** 行政区划 */
export type DmnAdministrativeDivision = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 中文名 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 区划代码 */
  divisionCode?: string | null;
  /** 英文名 */
  englishName?: string | null;
  /** 行政区划等级 */
  level?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 上级code */
  parentCode?: string | null;
  /** 上级id */
  parentId?: number | null;
  /** 备注 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** DmnAdministrativeDivisionCreateDTO */
export type DmnAdministrativeDivisionCreateDTO = {
  /** 中文名 */
  chineseName: string;
  /** 代码 */
  code: string;
  /** 国家代码 */
  countryCode: string;
  /** 英文名 */
  englishName: string;
};

/** DmnAdministrativeDivisionDTO */
export type DmnAdministrativeDivisionDTO = {
  /** 中文名 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
  /** 英文名 */
  englishName?: string | null;
};

/** DmnAdministrativeDivisionListDTO */
export type DmnAdministrativeDivisionListDTO = {
  /** id */
  id?: number | null;
  /** 中文名 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 国家中文名 */
  countryChineseName?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
  /** 国家英文名 */
  countryEnglishName?: string | null;
  /** 英文名 */
  englishName?: string | null;
};

/** 港区 */
export type DmnBerth = {
  /** 主键id */
  id?: number | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 海港id */
  seaPortId?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dmn_企业代码类型 */
export type DmnCompanyCodeType = {
  /** 主键id */
  id?: number | null;
  /** 国家中文名 */
  countryChineseName?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
  /** 国家英文名 */
  countryEnglishName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 企业代码类型 */
  enterpriseCodeType?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dmn_集装箱箱型 */
export type DmnContainer = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** bactive */
  bactive?: boolean | null;
  /** 中文简称 */
  chineseName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文简称 */
  englishName?: string | null;
  /** 拆算40箱量 */
  feu?: number | null;
  /** 高_英制 */
  higthBritish?: number | null;
  /** 高_公制 */
  higthMetric?: number | null;
  /** 95码 */
  isoCode?: string | null;
  /** 可装票数 */
  jobNumber?: number | null;
  /** 长_英制 */
  lengthBritish?: number | null;
  /** 长_公制 */
  lengthMetric?: number | null;
  /** 最大体积 */
  maxVolumn?: number | null;
  /** 最大重量 */
  maxWeight?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 尺寸代码 */
  sizeCode?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 拆算20箱量 */
  teu?: number | null;
  /** 箱型中文名 */
  typeChineseName?: string | null;
  /** 箱型代码 */
  typeCode?: string | null;
  /** 箱型英文名 */
  typeEnglishName?: string | null;
  /** 箱型组代码 */
  typeGroupCode?: string | null;
  /** 箱型组名称 */
  typeGroupName?: string | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 皮重 */
  weight?: number | null;
  /** 宽_英制 */
  widthBritish?: number | null;
  /** 宽_公制 */
  widthMetric?: number | null;
};

/** DmnContainerDTO */
export type DmnContainerDTO = {
  /** 是否启用 */
  bActive?: boolean | null;
  /** 中文简称 */
  chineseName?: string | null;
  /** 英文简称 */
  englishName?: string | null;
  /** 拆算40箱量 */
  feu?: number | null;
  /** 高_英制 */
  higthBritish?: number | null;
  /** 高_公制 */
  higthMetric?: number | null;
  /** 95码 */
  isoCode?: string | null;
  /** 可装票数 */
  jobNumber?: number | null;
  /** 长_英制 */
  lengthBritish?: number | null;
  /** 长_公制 */
  lengthMetric?: number | null;
  /** 最大体积 */
  maxVolumn?: number | null;
  /** 最大重量 */
  maxWeight?: number | null;
  /** 尺寸代码 */
  sizeCode?: string | null;
  /** 拆算20箱量 */
  teu?: number | null;
  /** 箱型中文名 */
  typeChineseName?: string | null;
  /** 箱型代码 */
  typeCode?: string | null;
  /** 箱型英文名 */
  typeEnglishName?: string | null;
  /** 箱型组代码 */
  typeGroupCode?: string | null;
  /** 箱型组名称 */
  typeGroupName?: string | null;
  /** 皮重 */
  weight?: number | null;
  /** 宽_英制 */
  widthBritish?: number | null;
  /** 宽_公制 */
  widthMetric?: number | null;
};

/** 国家 */
export type DmnCountry = {
  /** 主键id */
  id?: number | null;
  /** 电话区号 */
  areaCod?: string | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 中文简称 */
  chineseShortname?: string | null;
  /** 两字码 */
  code2?: string | null;
  /** 三字码 */
  code3?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 币种代码 */
  currecyCode?: string | null;
  /** 域名后缀 */
  domainSuffix?: string | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 英文简称 */
  englishShortname?: string | null;
  /** 国旗文件id */
  flagFileId?: number | null;
  /** 数字码 */
  numericCode?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** DmnCountrySelectionDTO */
export type DmnCountrySelectionDTO = {
  /** 国家ID */
  id?: number | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 中文简称 */
  chineseShortname?: string | null;
  /** 两字码 */
  code2?: string | null;
  /** 三字码 */
  code3?: string | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 英文简称 */
  englishShortname?: string | null;
};

/** 币种 */
export type DmnCurrency = {
  /** 主键id */
  id?: number | null;
  /** 别名代码 */
  aliasCode?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 国家 */
  country?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 币种符号 */
  sign?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 币种DTO */
export type DmnCurrencyDTO = {
  /** id */
  id?: number | null;
  /** 别名代码 */
  aliasCode?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 国家 */
  country?: string | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 币种符号 */
  sign?: string | null;
};

/** 文件类型 */
export type DmnDocumentType = {
  /** 主键id */
  id?: number | null;
  /** 是否自定义 */
  bUserDefined?: boolean | null;
  /** buserDefined */
  buserDefined?: boolean | null;
  /** 子节点 */
  childNodes?: DmnDocumentType[] | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 代码 */
  code: string;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 上级文件类型id */
  parentCode: string;
  /** 上级文件类型id */
  parentId: number;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 文件类型 */
export type DmnDocumentTypeDTO = {
  /** 主键id */
  id?: number | null;
  /** 是否自定义 */
  bUserDefined?: boolean | null;
  /** 子节点 */
  childNodes?: DmnDocumentTypeDTO[] | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 上级文件类型id */
  parentCode?: string | null;
  /** 上级文件类型id */
  parentId?: number | null;
};

/** dmn_费用组 */
export type DmnFeeGroup = {
  /** 主键id */
  id?: number | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seq?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dmn_费用项 */
export type DmnFeeItem = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否佣金 */
  bCommission?: boolean | null;
  /** 中文名称 */
  chineseName: string;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 费用组id1 */
  feeGroupId1?: number | null;
  /** 费用组id2 */
  feeGroupId2?: number | null;
  /** 费用组id3 */
  feeGroupId3?: number | null;
  /** 费用组id4 */
  feeGroupId4?: number | null;
  /** 费用组id5 */
  feeGroupId5?: number | null;
  /** 费用助记码 */
  feeItemCode?: string | null;
  /** 计费方式 */
  feeMode?: number | null;
  /** 计费单位 */
  feeUnit?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seq?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dmn_费用项 */
export type DmnFeeItemDTO = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否佣金 */
  bCommission?: boolean | null;
  /** 中文名称 */
  chineseName: string;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 费用组id1 */
  feeGroupId1?: number | null;
  /** 费用组id2 */
  feeGroupId2?: number | null;
  /** 费用组id3 */
  feeGroupId3?: number | null;
  /** 费用组id4 */
  feeGroupId4?: number | null;
  /** 费用组id5 */
  feeGroupId5?: number | null;
  /** 费用助记码 */
  feeItemCode?: string | null;
  /** 计费方式 */
  feeMode?: number | null;
  /** 计费单位 */
  feeUnit?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seq?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 费用项下拉框 */
export type DmnFeeItemDropdownList = {
  /** id */
  id?: number | null;
  /** 是否佣金 */
  bCommission?: boolean | null;
  /** bcommission */
  bcommission?: boolean | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 费用助记码 */
  feeItemCode?: string | null;
  /** 计费方式 */
  feeMode?: number | null;
  /** 计费单位 */
  feeUnit?: string | null;
};

/** 费用项列表实体 */
export type DmnFeeItemVO = {
  /** 主键id */
  id: number;
  /** 是否启用 */
  bActive: boolean;
  /** 是否佣金 */
  bCommission: boolean;
  /** 中文名称 */
  chineseName: string;
  /** 代码 */
  code: string;
  /** 创建人 */
  createBy: number;
  /** 创建人名 */
  createByName: string;
  /** 创建时间 */
  createTime: number;
  /** 默认币种 */
  defaultCurrency: string;
  /** 英文名称 */
  englishName: string;
  /** 费用组id1 */
  feeGroupId1: number;
  /** 费用组id2 */
  feeGroupId2: number;
  /** 费用组id3 */
  feeGroupId3: number;
  /** 费用组id4 */
  feeGroupId4: number;
  /** 费用组id5 */
  feeGroupId5: number;
  /** 费用助记码 */
  feeItemCode: string;
  /** 计费方式 */
  feeMode: number;
  /** 计费单位 */
  feeUnit: string;
  /** 计费单位描述 */
  feeUnitDesc: string;
  /** 数据操作url */
  optUrl: string;
  /** 备注 */
  remark: string;
  /** 顺序号 */
  seq: number;
  /** 租户ID */
  tenantId: number;
  /** 更新人 */
  updateBy: number;
  /** 更新人名 */
  updateByName: string;
  /** 更新时间 */
  updateTime: number;
};

/** DmnHscode */
export type DmnHscode = {
  /** 主键id */
  id?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 申报要素 */
  declareFactor?: string | null;
  /** 消费税 */
  excise?: number | null;
  /** 出口税率 */
  expRate?: number | null;
  /** 货物名称 */
  goodsName?: string | null;
  /** hs编码 */
  hsCode?: string | null;
  /** 最惠国进口税率 */
  impRateMfn?: number | null;
  /** 普通进口税率 */
  impRateNormal?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 监管条件 */
  supervisedCondition?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 增值税率 */
  valueAddedRate?: number | null;
};

/** 负面商品清单 */
export type DmnNegativeList = {
  /** 主键id */
  id?: number | null;
  /** 可接受中文名称 */
  acceptableChineseName?: string | null;
  /** 可接受英文名称 */
  acceptableEnglishName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 负面清单类型：1负面清单一类 */
  negativeType?: boolean | null;
  /** 不可接受中文名称 */
  nonAcceptableChineseName?: string | null;
  /** 不可接受英文名称 */
  nonAcceptableEnglishName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** DmnRailwayStationVO */
export type DmnRailwayStationVO = {
  /** id */
  id: number;
  /** 中文全称 */
  chineseName: string;
  /** code */
  code: string;
  /** 国家代码 */
  countryCode: string;
  /** 英文全称 */
  englishName: string;
};

/** 海运航线 */
export type DmnSeaLine = {
  /** 主键id */
  id?: number | null;
  /** 中文名 */
  chineseName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名 */
  englishName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 海港 */
export type DmnSeaport = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否内陆港口 */
  bInland?: boolean | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 城市code */
  cityCode?: string | null;
  /** 城市描述 */
  cityDesc?: string | null;
  /** 三字码 */
  code3?: string | null;
  /** 五字码 */
  code5?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 经度 */
  latitude?: number | null;
  /** 航线code */
  lineCode?: string | null;
  /** 纬度 */
  longitude?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 辖区id */
  subdivisionId?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 时区 */
  timeZone?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 船公司 */
export type DmnShippingCompany = {
  /** 主键id */
  id?: number | null;
  /** 中文全称;如太平洋船务有限公司 */
  chineseName?: string | null;
  /** 中文简称;如太平洋船务 */
  chineseShortname?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文全称;如PacificInternationalLines; */
  englishName?: string | null;
  /** 英文简称;如PIL */
  englishShortname?: string | null;
  /** logo文件id;航空公司标在云存储上的文件id */
  logoFileId?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** SCAC代码 */
  scacCode?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 行业术语父子级DTO */
export type DmnTermAndItemVO = {
  /** id */
  id: number;
  /** children */
  children: DmnTermItemDTO[];
  /** 中文名称 */
  chineseName: string;
  /** 代码 */
  code: string;
  /** 英文名称 */
  englishName: string;
  /** 备注 */
  remark: string;
  /** 顺序号 */
  seqNo: number;
  /** 术语类型 */
  termType: string;
};

/** 行业术语细项 */
export type DmnTermItem = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否自定义;从平台复制过来的字段都是非自定义，不允许客户更改 */
  bUserDefined?: boolean | null;
  /** bactive */
  bactive?: boolean | null;
  /** buserDefined */
  buserDefined?: boolean | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 扩展字段 */
  externalJson?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 行业术语细项code */
  termCode: string;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 行业术语细项DTO */
export type DmnTermItemDTO = {
  /** id */
  id?: number | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 扩展字段 */
  externalJson?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 行业术语细项code */
  termCode?: string | null;
};

/** Edge */
export type Edge = {
  /** id */
  id?: string | null;
  /** 规则 */
  label?: string | null;
  /** 开始节点id */
  source?: string | null;
  /** 目标节点id */
  target?: string | null;
};

/** 云文件任务DTO */
export type ExecuteExportFileTaskSuccessDTO = {
  /** cloudFileVO */
  cloudFileVO?: CloudFileVO | null;
  /** executeEnd */
  executeEnd?: number | null;
  /** result */
  result?: string | null;
  /** successMsgCode */
  successMsgCode?: string | null;
  /** taskId */
  taskId?: number | null;
};

/** 云文件任务DTO */
export type ExecuteImportFileTaskFailDTO = {
  /** cloudFileVO */
  cloudFileVO?: CloudFileVO | null;
  /** executeEnd */
  executeEnd?: number | null;
  /** failMsgCode */
  failMsgCode?: string | null;
  /** result */
  result?: string | null;
  /** taskId */
  taskId?: number | null;
};

/** 云文件任务DTO */
export type ExecuteImportFileTaskSuccessDTO = {
  /** cloudFileVO */
  cloudFileVO?: CloudFileVO | null;
  /** executeEnd */
  executeEnd?: number | null;
  /** result */
  result?: string | null;
  /** successMsgCode */
  successMsgCode?: string | null;
  /** taskId */
  taskId?: number | null;
};

/** 云文件任务DTO */
export type ExecuteTaskBeginDTO = {
  /** executeBegin */
  executeBegin?: number | null;
  /** taskId */
  taskId?: number | null;
};

/** 云文件任务DTO */
export type ExecuteTaskFailDTO = {
  /** executeEnd */
  executeEnd?: number | null;
  /** failMsgCode */
  failMsgCode?: string | null;
  /** result */
  result?: string | null;
  /** taskId */
  taskId?: number | null;
};

/** 云文件任务DTO */
export type ExecuteTaskSuccessDTO = {
  /** executeEnd */
  executeEnd?: number | null;
  /** result */
  result?: string | null;
  /** successMsgCode */
  successMsgCode?: string | null;
  /** taskId */
  taskId?: number | null;
};

/** FeeItemCodesQuery */
export type FeeItemCodesQuery = {
  /** 业务类型代码 */
  businessTypeCode?: string | null;
  /** 费用项代码 */
  feeItemCodes?: string[] | null;
};

/** dmn_费用项 */
export type FeeItemDTO = {
  /** 主键id */
  id?: number | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 计费单位 */
  feeUnit?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** FeeItemNamesQuery */
export type FeeItemNamesQuery = {
  /** 业务类型代码 */
  businessTypeCode?: string | null;
  /** 费用项名称 */
  feeItemNames?: string[] | null;
};

/** 工作流_业务_审批日志 */
export type FlwFlowApproveEntityLogVO = any;

/** FlwFlowConfigInItVO */
export type FlwFlowConfigInItVO = {
  /** 干预人 */
  adminBy: number;
  /** 工作流代码 */
  flowCode: string;
  /** 所属公司id */
  officeId: number;
};

/** 工作流_配置_保存或修改 */
export type FlwFlowConfigVO = {
  /** id */
  id: number;
  /** 干预人 */
  adminBy: number;
  /** 干预人名称 */
  adminByCnName: string;
  /** 干预人名称 */
  adminByEnName: string;
  /** 是否有效 */
  bActive: boolean;
  /** bactive */
  bactive: boolean;
  /** 工作流代码 */
  flowCode: string;
  /** 节点配置集合 */
  flwNodeConfigList: FlwNodeConfigVO[];
  /** 所属公司中文名称 */
  officeCnName: string;
  /** 所属公司英文名称 */
  officeEnName: string;
  /** 所属公司id */
  officeId: number;
  /** 租户id */
  tenantId: number;
};

/** 工作流_实例_待审批列表 */
export type FlwFlowInstanceNodeVO = {
  /** id */
  id: number;
  /** 创建人 */
  createBy: number;
  /** 创建时间 */
  createTime: number;
  /** 当前审批人 */
  currentApproveUser: string;
  /** 业务实体id;关联的业务实体id，如job的历史文件 */
  entityId: number;
  /** 业务信息;以json形式保存 */
  entityInfo: string;
  /** 工作流代码 */
  flowCode: string;
  /** 流程状态;;1未开始：初始状态;2进行中：发起人已经提交流程;3已结束：流程已经到达终结点;4已作废：该节点已经中断作废; */
  flowState: number;
  /** 流程状态;1未开始;2进行中;3已结束;4已作废; */
  flowStateName: string;
  /** 节点参与人 */
  flwParticipantList: FlwParticipantVO[];
  /** 过程节点日志 */
  flwProcessLogList: FlwProcessLogVO[];
  /** 关联节点 */
  flwRelatedNodeList: FlwRelatedNodeVO[];
  /** 过程节点开始时间 */
  nodeBeginTime: number;
  /** 过程节点子工作流实例id */
  nodeChildInstanseId: number;
  /** 过程节点代码 */
  nodeCode: string;
  /** 过程节点结束时间 */
  nodeEndTime: number;
  /** 过程节点id */
  nodeId: number;
  /** 过程节点名称 */
  nodeName: string;
  /** 过程节点备注 */
  nodeRemarks: string;
  /** 过程节点结果描述 */
  nodeResultDesc: string;
  /** 过程节点状态;;0初始化：当流程产生时，创建节点，节点状态为初始化;1未开始：当业务信息满足节点条件，但工作流未到达该节点;2进行中：工作流到达该节点已经满足开始的条件时状态为进行中;3已结束：该节点已经完结;4已撤回：撤回后流程回到最初的节点，其它节点全部为初始化;5已中断：到此节点中断流程;6已失效：当业务信息不满足该节点时，节点状态设置为已失效; */
  nodeState: number;
  /** 过程节点状态;0初始化;1未开始;2进行中;3已结束;4已撤回;5已中断;6已失效; */
  nodeStateName: string;
  /** 过程节点更新时间 */
  nodeUpdateTime: number;
  /** 所属公司中文名称 */
  officeCnName: string;
  /** 所属公司英文名称 */
  officeEnName: string;
  /** 所属公司id */
  officeId: number;
  /** 参与人操作状态 */
  operateState: number;
  /** 参与人操作状态描述 */
  operateStateDesc: string;
  /** 发起人id */
  originatorId: number;
  /** 状态描述 */
  stateDesc: string;
  /** 租户id */
  tenantId: number;
};

/** 工作流_实例_提交 */
export type FlwFlowInstanceSubmitVO = {
  /** 业务实体id;关联的业务实体id，如job的历史文件 */
  entityId: number;
  /** 业务信息;以json形式保存 */
  entityInfo: string;
  /** 工作流代码 */
  flowCode: string;
  /** 所属公司id */
  officeId: number;
};

/** 路由待定的问题1、路由中上一节点需完成的时间设置2、预计流程如何 */
export type FlwNodeConfig = {
  /** 主键id */
  id?: number | null;
  /** 审批类型;;0单人审核一个人审核通过了节点就完成了;1会签审核要所有的人都审核通过才能完成;; */
  checkType?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 工作流配置id */
  flowConfigId?: number | null;
  /** 时间增量；相对于参照时间，后节点要完成的时间增量，比参照时间早则录负数，单位为小时，界面显示要折算为天小时; */
  increment?: number | null;
  /** 节点 */
  nodeCode?: string | null;
  /** nodeName */
  nodeName?: string | null;
  /** 节点类型;;0开始节点流程的开始节点，每个流程只有一个开始节点;100结束节点流程的结束节点，每个流程只有一个结束节点;1过程节点;; */
  nodeType?: number | null;
  /** 通知方式 0:站内通知 1:邮件通知 2:短信通知,{station:true,email:false,msg:false} */
  notifyMode?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 时间参照类型；后节点要完成的时间参照类型;1前节点开始时间;2前节点完成时间;3后节点开始时间;4ETD; */
  referenceType?: number | null;
  /** 回调url_同意 */
  returnUrlAccept?: string | null;
  /** 回调url_拒绝 */
  returnUrlReject?: string | null;
  /** 顺序号;界面按顺序显示 */
  seqNo?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 路由待定的问题1、路由中上一节点需完成的时间设置2、预计流程如何 */
export type FlwNodeConfigVO = {
  /** id */
  id: number;
  /** 节点参与人配置(审批人) */
  approveUserIds: string[];
  /** 节点参与人配置(审批人) */
  approveUserMaps: any[];
  /** 审批类型;;0单人审核一个人审核通过了节点就完成了;1会签审核要所有的人都审核通过才能完成;; */
  checkType: number;
  /** 工作流配置id */
  flowConfigId: number;
  /** 节点完成规则;表示节点满足这些规则后才能完成 */
  flwNodeRuleList: FlwNodeRuleVO[];
  /** 节点参与人配置 */
  flwParticipantConfigList: FlwParticipantConfigVO[];
  /** 路由-待定的问题;1、路由中上一节点需完成的时间设置;2、预计流程如何 */
  flwRouteList: FlwRouteVO[];
  /** 校验规则 */
  flwRouteRuleList: FlwRouteRuleVO[];
  /** 时间增量；相对于参照时间，后节点要完成的时间增量，比参照时间早则录负数，单位为小时，界面显示要折算为天小时; */
  increment: number;
  /** 下一节点数量 */
  nextNodeNum: number;
  /** 节点代码 */
  nodeCode: string;
  /** 节点名称 */
  nodeName: string;
  /** 节点类型;;0开始节点流程的开始节点，每个流程只有一个开始节点;100结束节点流程的结束节点，每个流程只有一个结束节点;1过程节点;; */
  nodeType: number;
  /** 通知方式 0:站内通知 1:邮件通知 2:短信通知,{station:true,email:false,msg:false} */
  notifyMode: string;
  /** 节点参与人配置(通知人) */
  notifyUserIds: string[];
  /** 节点参与人配置(通知人) */
  notifyUserMaps: any[];
  /** 时间参照类型；后节点要完成的时间参照类型;1前节点开始时间;2前节点完成时间;3后节点开始时间;4ETD; */
  referenceType: number;
  /** 回调url_同意 */
  returnUrlAccept: string;
  /** 回调url_拒绝 */
  returnUrlReject: string;
  /** 顺序号;界面按顺序显示 */
  seqNo: number;
  /** 租户id */
  tenantId: number;
};

/** 节点完成规则;表示节点满足这些规则后才能完成 */
export type FlwNodeRuleVO = {
  /** id */
  id: number;
  /** 节点动作代码 */
  nodeAction: string;
  /** 节点代码 */
  nodeCode: string;
  /** 节点配置id */
  nodeConfigId: number;
  /** 规则内容;条件关系;list1-条件;字段名;操作符:=,;值:允许空值;表达式关系;list2-表达式;校验项;操作符:=,大于,小于,不等于;参数list;值1;值2 */
  ruleContent: string;
  /** 规则说明 */
  ruleDesc: string;
  /** 租户id */
  tenantId: number;
};

/** 工作流图 */
export type FlwNodeRuteEdgeVO = {
  /** 流程线 */
  edges: Edge[];
  /** 级别 */
  levels: number[];
  /** 节点 */
  nodes: Node[];
};

/** 工作流类型-节点-平台级别 */
export type FlwNodeVO = {
  /** id */
  id: number;
  /** 是否子流程节点，如果是子流程节点，则要有对应流程 */
  bChildFlow: boolean;
  /** 是否自定义 */
  bUserDefined: boolean;
  /** bchildFlow */
  bchildFlow: boolean;
  /** buserDefined */
  buserDefined: boolean;
  /** 工作流代码 */
  flowCode: string;
  /** 节点动作;节点可操作的动作，以json格式保存;code:;name: */
  nodeActions: string;
  /** 节点代码 */
  nodeCode: string;
  /** 节点名称 */
  nodeName: string;
  /** 节点类型;;1开始节点流程的开始节点，每个流程只有一个开始节点;2结束节点流程的结束节点，每个流程只有一个结束节点;3过程节点;; */
  nodeType: number;
  /** 子流程代码 */
  subFlowCode: string;
  /** 租户id */
  tenantId: number;
};

/** 节点参与人配置 */
export type FlwParticipantConfigVO = {
  /** id */
  id: number;
  /** 配置类型;0人员 1部门 2人员职能(销售、操作、客服等) */
  configType: number;
  /** 配置值;;当配置类为“人员”时，配置值写人员的id;当配置类为“部门”时，配置值写部门的id;当配置类为“职能”时，配置值写职能的代码 */
  configValue: string;
  /** 职能类型;0处理者：要对该节点进行处理;1消费者：节点处理后要通知的消费者;2当处理者不能处理节点时，由干预人来干预处理，其权限与处理者一致，设置流程的干预人后会同步记入路由中 */
  dutyType: number;
  /** 节点配置id */
  nodeConfigId: number;
  /** 租户id */
  tenantId: number;
};

/** 参与人;下一个节点的参与人 */
export type FlwParticipantVO = {
  /** id */
  id: number;
  /** 职能类型;1处理者2消费者;1处理者：要对该节点进行处理;2消费者：节点处理后要通知的消费者 */
  dutyType: number;
  /** 节点动作代码 */
  nodeAction: string;
  /** 操作状态;0未处理1已处理2已拒绝;1处理者：要对该节点进行处理;2消费者：节点处理后要通知的消费者 */
  operateState: number;
  /** 操作时间 */
  operateTime: number;
  /** 参与人中文名称 */
  participantCnName: string;
  /** 参与人英文名称 */
  participantEnName: string;
  /** 参与人id */
  participantId: number;
  /** 过程节点id */
  processNodeId: number;
  /** 租户id */
  tenantId: number;
  /** 更新人 */
  updateBy: number;
  /** 更新时间 */
  updateTime: number;
};

/** 审批过程节点日志 */
export type FlwProcessLogVO = any;

/** 关联节点 */
export type FlwRelatedNodeVO = {
  /** id */
  id: number;
  /** 创建时间 */
  createTime: number;
  /** 过程节点id */
  processNodeId: number;
  /** 关联节点id */
  relatedNodeId: number;
  /** 过程节点状态;;0初始化：当流程产生时，创建节点，节点状态为初始化;1未开始：当业务信息满足节点条件，但工作流未到达该节点;2进行中：工作流到达该节点已经满足开始的条件时状态为进行中;3已结束：该节点已经完结;4已撤回：撤回后流程回到最初的节点，其它节点全部为初始化;5已中断：到此节点中断流程;6已失效：当业务信息不满足该节点时，节点状态设置为已失效; */
  relatedNodeState: number;
  /** 关联类型;1前节点2后节点 */
  relatedType: number;
  /** 租户id */
  tenantId: number;
  /** 更新时间 */
  updateTime: number;
};

/** 校验规则 */
export type FlwRouteRuleVO = {
  /** id */
  id: number;
  /** 路由id */
  routeId: number;
  /** 规则内容;条件关系;list1-条件;字段名;操作符:=,;值:允许空值;表达式关系;list2-表达式;校验项;操作符:=,大于,小于,不等于;参数list;值1;值2 */
  ruleContent: string;
  /** 规则说明 */
  ruleDesc: string;
  /** 租户id */
  tenantId: number;
};

/** 路由 ; ;待定的问题 ;1、路由中上一节点需完成的时间设置 ;2、预计流程如何 */
export type FlwRouteVO = {
  /** id */
  id: number;
  /** 校验规则 */
  flwRouteRuleList: FlwRouteRuleVO[];
  /** 后节点 */
  nextNode: string;
  /** 后节点 */
  nextNodeName: string;
  /** 节点配置id */
  nodeConfigId: number;
  /** 节点动作代码；走这条路由对应的动作代码 */
  preNodeAction: string;
  /** 节点动作名称:审批通过,撤回审批,拒绝审批,提交审批 */
  preNodeActionName: string;
  /** 路由名称 */
  routeName: string;
  /** 规则内容;条件关系;list1-条件;字段名;操作符:=,;值:允许空值;表达式关系;list2-表达式;校验项;操作符:=,大于,小于,不等于;参数list;值1;值2 */
  ruleContent: string;
  /** 规则说明 */
  ruleDesc: string;
  /** 顺序号;界面按顺序显示 */
  seqNo: number;
  /** 租户id */
  tenantId: number;
};

/** Link */
export type Link = {
  /** href */
  href?: string | null;
  /** templated */
  templated?: boolean | null;
};

/** ModelAndView */
export type ModelAndView = {
  /** empty */
  empty?: boolean | null;
  /** model */
  model?: {
  } | null;
  /** modelMap */
  modelMap?: any | null;
  /** reference */
  reference?: boolean | null;
  /** status */
  status?: string | null;
  /** view */
  view?: View | null;
  /** viewName */
  viewName?: string | null;
};

/** Node */
export type Node = {
  /** id */
  id?: string | null;
  /** 节点名称 */
  content?: string | null;
  /** level */
  level?: number | null;
  /** 下级节点数量 */
  nextNodeNum?: number | null;
  /** 节点code */
  nodeCode?: string | null;
  /** id对应数据库 */
  nodeId?: number | null;
};

/** 云文件任务DTO */
export type NotifySendEmailTaskDTO = {
  /** attachments */
  attachments?: CloudFileVO[] | null;
  /** ccEmails */
  ccEmails?: string[] | null;
  /** emailParams */
  emailParams?: {
  } | null;
  /** emailTemplateId */
  emailTemplateId?: number | null;
  /** failMsgCode */
  failMsgCode?: string | null;
  /** recipients */
  recipients?: string[] | null;
  /** successMsgCode */
  successMsgCode?: string | null;
  /** taskId */
  taskId?: number | null;
  /** topic */
  topic?: string | null;
};

/** PageInfo«CfgParameterConfigListVO» */
export type PageInfo«CfgParameterConfigListVO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: CfgParameterConfigListVO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«CfgParameterConfig» */
export type PageInfo«CfgParameterConfig» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: CfgParameterConfig[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«ComFileElectronDTO» */
export type PageInfo«ComFileElectronDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: ComFileElectronDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«ComSailingScheduleVO» */
export type PageInfo«ComSailingScheduleVO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: ComSailingScheduleVO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«ComVesselVO» */
export type PageInfo«ComVesselVO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: ComVesselVO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnAdministrativeDivisionDTO» */
export type PageInfo«DmnAdministrativeDivisionDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnAdministrativeDivisionDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnAdministrativeDivisionListDTO» */
export type PageInfo«DmnAdministrativeDivisionListDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnAdministrativeDivisionListDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnBerth» */
export type PageInfo«DmnBerth» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnBerth[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnContainer» */
export type PageInfo«DmnContainer» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnContainer[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnCountry» */
export type PageInfo«DmnCountry» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnCountry[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnCurrency» */
export type PageInfo«DmnCurrency» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnCurrency[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnFeeGroup» */
export type PageInfo«DmnFeeGroup» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnFeeGroup[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnFeeItemVO» */
export type PageInfo«DmnFeeItemVO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnFeeItemVO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnHscode» */
export type PageInfo«DmnHscode» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnHscode[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnNegativeList» */
export type PageInfo«DmnNegativeList» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnNegativeList[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«DmnSeaLine» */
export type PageInfo«DmnSeaLine» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: DmnSeaLine[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«PerUiConfig» */
export type PageInfo«PerUiConfig» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: PerUiConfig[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«comTaskMonitorDTO» */
export type PageInfo«comTaskMonitorDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: comTaskMonitorDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dataMqDlqMsg列表DTO» */
export type PageInfo«dataMqDlqMsg列表DTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dataMqDlqMsg列表DTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dmnAirlineCompanyDTO» */
export type PageInfo«dmnAirlineCompanyDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dmnAirlineCompanyDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dmnAirportDTO» */
export type PageInfo«dmnAirportDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dmnAirportDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dmnContainerOwnerDTO» */
export type PageInfo«dmnContainerOwnerDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dmnContainerOwnerDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dmnContainerYardDTO» */
export type PageInfo«dmnContainerYardDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dmnContainerYardDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dmnCustomAttributeDTO» */
export type PageInfo«dmnCustomAttributeDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dmnCustomAttributeDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dmnFeeItemBase列表DTO» */
export type PageInfo«dmnFeeItemBase列表DTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dmnFeeItemBase列表DTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dmnFeeItemBusiness列表DTO» */
export type PageInfo«dmnFeeItemBusiness列表DTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dmnFeeItemBusiness列表DTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dmnIndividual列表DTO» */
export type PageInfo«dmnIndividual列表DTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dmnIndividual列表DTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«dmnLogisticsCompanyDTO» */
export type PageInfo«dmnLogisticsCompanyDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: dmnLogisticsCompanyDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«memMemberInfoDTO» */
export type PageInfo«memMemberInfoDTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: memMemberInfoDTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«urlMap列表DTO» */
export type PageInfo«urlMap列表DTO» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: urlMap列表DTO[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«客商资料详细页信息» */
export type PageInfo«客商资料详细页信息» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: 客商资料详细页信息Res[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«汇率列表» */
export type PageInfo«汇率列表» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: 汇率列表[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«消息列表出参» */
export type PageInfo«消息列表出参» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: 消息列表出参[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«用户列表及详细信息» */
export type PageInfo«用户列表及详细信息» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: 用户列表及详细信息[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** PageInfo«编码规则列表及详细页» */
export type PageInfo«编码规则列表及详细页» = {
  /** endRow */
  endRow?: number | null;
  /** hasNextPage */
  hasNextPage?: boolean | null;
  /** hasPreviousPage */
  hasPreviousPage?: boolean | null;
  /** isFirstPage */
  isFirstPage?: boolean | null;
  /** isLastPage */
  isLastPage?: boolean | null;
  /** list */
  list?: 编码规则列表及详细页[] | null;
  /** navigateFirstPage */
  navigateFirstPage?: number | null;
  /** navigateLastPage */
  navigateLastPage?: number | null;
  /** navigatePages */
  navigatePages?: number | null;
  /** navigatepageNums */
  navigatepageNums?: number[] | null;
  /** nextPage */
  nextPage?: number | null;
  /** pageNum */
  pageNum?: number | null;
  /** pageSize */
  pageSize?: number | null;
  /** pages */
  pages?: number | null;
  /** prePage */
  prePage?: number | null;
  /** size */
  size?: number | null;
  /** startRow */
  startRow?: number | null;
  /** total */
  total?: number | null;
};

/** com_关注 */
export type PerFocus = {
  /** 主键id */
  id?: number | null;
  /** 业务id */
  businessId?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 关注人 */
  focusBy?: number | null;
  /** 关注时间 */
  focusTime?: number | null;
  /** 关注类型;1海出工作号 */
  focusType?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 界面配置方案 */
export type PerUiConfig = {
  /** 主键id */
  id?: number | null;
  /** 是否默认 */
  bDefault?: boolean | null;
  /** 配置人 */
  configBy?: number | null;
  /** 配置内容;存为jason格式 */
  configContent?: string | null;
  /** 配置模块;1海出列表2海出详情; */
  configModule?: number | null;
  /** 配置方案名称(默认为空) */
  configName?: string | null;
  /** 配置类型;1列表,2全景视图; */
  configType?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** Permission */
export type Permission = {
  /** 授权数据值 */
  authorizedDataValue?: string | null;
  /** 授权维度 */
  permissionDimension?: string | null;
  /** 功能权限code */
  privilegeCode?: string | null;
};

/** 客商地址信息 */
export type PnrAddressInfo = {
  /** 主键id */
  id?: number | null;
  /** 详细地址 */
  address?: string | null;
  /** 地址类型;1门点地址2仓库地址 */
  addressType?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 城市 */
  cityCode?: string | null;
  /** 联系人 */
  contact?: string | null;
  /** 国家 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 邮箱 */
  email?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 地图文件id */
  mapFileId?: string | null;
  /** 手机 */
  mobile?: string | null;
  /** 名称 */
  name?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId: number;
  /** 省份 */
  province?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 电话 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 邮政编码 */
  zipCode?: string | null;
};

/** 客商银行账户;账号+币种唯一 */
export type PnrBankAccount = {
  /** 主键id */
  id?: number | null;
  /** 账户名称 */
  accountName?: string | null;
  /** 银行账号 */
  accountNo: string;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 银行名称 */
  bankName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 账户币种 */
  currency: string;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId: number;
  /** 备注 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 客商收发通信息 */
export type PnrBlAddress = {
  /** 主键id */
  id?: number | null;
  /** 收货code */
  consigneeCode?: string | null;
  /** 收货人信息 */
  consigneeInfo?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 通知人code */
  notifyCode?: string | null;
  /** 通知人信息 */
  notifyInfo?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId: number;
  /** 发货人code */
  shipperCode?: string | null;
  /** 发货人信息 */
  shipperInfo?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 客商联系人 */
export type PnrContact = {
  /** 主键id */
  id?: number | null;
  /** 是否财务默认 */
  bAcDefault?: boolean | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否业务默认 */
  bOpDefault?: boolean | null;
  /** 出生日期 */
  birthDate?: number | null;
  /** 联系人中文名 */
  cnName?: string | null;
  /** 联系人类型;1销售2操作3财务 */
  contactType?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 部门 */
  deptartment?: string | null;
  /** 职务 */
  duty?: string | null;
  /** 邮箱;邮箱 */
  email?: string | null;
  /** 联系人英文名 */
  enName?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 手机 */
  mobile?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId: number;
  /** qq */
  qq?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 电话 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 微信号 */
  wechat?: string | null;
};

/** 客商资料联系人 */
export type PnrContactDTO = {
  /** 客商联系人Id */
  id?: number | null;
  /** 是否财务默认 */
  bAcDefault?: boolean | null;
  /** 是否业务默认 */
  bOpDefault?: boolean | null;
  /** bacDefault */
  bacDefault?: boolean | null;
  /** bopDefault */
  bopDefault?: boolean | null;
  /** 联系人中文名 */
  cnName?: string | null;
  /** 邮箱;邮箱 */
  email?: string | null;
  /** 联系人英文名 */
  enName?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 手机 */
  mobile?: string | null;
  /** 电话 */
  tel?: string | null;
};

/** pnr_合同信息 */
export type PnrContractInfo = {
  /** 主键id */
  id?: number | null;
  /** 审核人 */
  checkBy?: number | null;
  /** 审核状态;1新建2待审核3审核通过4已拒绝 */
  checkState?: number | null;
  /** 审核时间 */
  checkTime?: number | null;
  /** 合同号 */
  contractNo?: string | null;
  /** 合同类型;1出口协议2进口协议 */
  contractType?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 业务类型* */
  jobType: number;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId?: number | null;
  /** 合同有效期开始 */
  periodBegin: number;
  /** 合同有效期结束 */
  periodEnd: number;
  /** 备注 */
  remark?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 客商合同信息list&详细展示实体 */
export type PnrContractInfoVO = {
  /** 主键id */
  id: number;
  /** 审核人 */
  checkBy: number;
  /** 超限控制描述 */
  checkByName: string;
  /** 审核状态;1新建2待审核3审核通过4已拒绝 */
  checkState: number;
  /** 审核时间 */
  checkTime: number;
  /** 合同号 */
  contractNo: string;
  /** 合同类型;1出口协议2进口协议 */
  contractType: number;
  /** 创建人 */
  createBy: number;
  /** 创建人名 */
  createByName: string;
  /** 创建时间 */
  createTime: number;
  /** 业务类型* */
  jobType: number;
  /** 业务类型描述 */
  jobTypeDesc: string;
  /** 数据操作url */
  optUrl: string;
  /** 客商id */
  partnerId: number;
  /** 合同有效期开始 */
  periodBegin: number;
  /** 合同有效期结束 */
  periodEnd: number;
  /** 备注 */
  remark: string;
  /** 租户ID */
  tenantId: number;
  /** 更新人 */
  updateBy: number;
  /** 更新人名 */
  updateByName: string;
  /** 更新时间 */
  updateTime: number;
};

/** 客户 */
export type PnrCustomer = {
  /** 主键id */
  id?: number | null;
  /** 直接客户 */
  bDirectCustomer?: boolean | null;
  /** 同行客户 */
  bSameCustomer?: boolean | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 客户级别 */
  customerLevel?: string | null;
  /** 客户来源;1B2B2自拓 */
  customerSource?: number | null;
  /** 客户对接人 */
  linkman?: string | null;
  /** 对接人联系方式 */
  linkmanInfo?: string | null;
  /** 所属指定货代理id */
  nominatedAgentId?: number | null;
  /** 指定操作人员id */
  opBy?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId?: number | null;
  /** 指定销售人员id */
  salesBy?: number | null;
  /** 指定客服人员id */
  serviceBy?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 客商信控信息list&详细页保存展示实体 */
export type PnrCustomerCreditInfoVO = {
  /** 主键id */
  id: number;
  /** 超限控制;1拒接2扣单3扣货，可以多选 */
  controlMode: string;
  /** 超限控制描述 */
  controlModeDesc: string;
  /** 超限控制 */
  controlModes: number[];
  /** 创建人 */
  createBy: number;
  /** 创建人名 */
  createByName: string;
  /** 创建时间 */
  createTime: number;
  /** 账期日期类型*;1业务日期2开票日期 */
  creditDateType: number;
  /** 账期日期类型描述 */
  creditDateTypeDesc: string;
  /** 信用额度(本位币) */
  creditLine: number;
  /** 账期 */
  creditTerm: number;
  /** 账期单位;1天2月 */
  creditTermUnit: number;
  /** 账期单位描述 */
  creditTermUnitDesc: string;
  /** 额度预度 */
  creditWarning: number;
  /** 预警天数 */
  daysWarning: number;
  /** 业务类型* */
  jobType: number;
  /** 业务类型描述 */
  jobTypeDesc: string;
  /** 所属公司id */
  officeId: number;
  /** 所属公司名称 */
  officeName: string;
  /** 数据操作url */
  optUrl: string;
  /** 客商id */
  partnerId: number;
  /** 结算方式;1月结2付款3固定日期 */
  settlementMode: number;
  /** 结算方式描述 */
  settlementModeDesc: string;
  /** 租户ID */
  tenantId: number;
  /** 更新人 */
  updateBy: number;
  /** 更新人名 */
  updateByName: string;
  /** 更新时间 */
  updateTime: number;
};

/** 客户_服务人员 */
export type PnrCustomerPosition = {
  /** 主键id */
  id?: number | null;
  /** 是否默认 */
  bDefault?: boolean | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 业务类型* */
  jobType?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId: number;
  /** 岗位类型;1销售2客服3操作 */
  positionType?: number | null;
  /** 服务人员 */
  serviceBy?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 客商默认销售&客服人员实体 */
export type PnrCustomerPositionUserVO = {
  /** cs */
  cs: SysUserDropdownDTO;
  /** op */
  op: SysUserDropdownDTO;
  /** sale */
  sale: SysUserDropdownDTO;
};

/** 客户服务人员list实体 */
export type PnrCustomerPositionVO = {
  /** id */
  id: number;
  /** 是否默认 */
  bDefault: boolean;
  /** bdefault */
  bdefault: boolean;
  /** 业务类型* */
  jobType: number;
  /** 业务类型描述 */
  jobTypeDesc: string;
  /** 岗位类型;1销售2客服3操作 */
  positionType: number;
  /** 岗位类型描述 */
  positionTypeDesc: string;
  /** 服务人员 */
  serviceBy: number;
  /** 服务人员名称 */
  serviceByName: string;
};

/** 客商开票资料 */
export type PnrInvoiceInfo = {
  /** 主键id */
  id?: number | null;
  /** 地址 */
  address?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 银行账号 */
  bankAccount?: string | null;
  /** 开户银行 */
  bankName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 客户凭证代码 */
  customerVoucherCode?: string | null;
  /** 发票抬头 */
  invoiceTitle?: string | null;
  /** 发票类型;1普通增值税发票2专用增值税发票 */
  invoiceType?: number | null;
  /** 所属公司 */
  officeId?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId: number;
  /** 备注 */
  remark?: string | null;
  /** 寄票地址 */
  sendAddress?: string | null;
  /** 纳税人识别号 */
  taxNo?: string | null;
  /** 电话 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 供应商凭证代码 */
  vendorVoucherCode?: string | null;
};

/** 客商舱单信息 */
export type PnrManifestInfo = {
  /** 主键id */
  id?: number | null;
  /** 收货人地址 */
  consigneeAddress?: string | null;
  /** 收货人aeo企业编码 */
  consigneeAeoCode?: string | null;
  /** 收货人城市 */
  consigneeCity?: string | null;
  /** 收货人代码 */
  consigneeCode?: string | null;
  /** 联系人名称 */
  consigneeContact?: string | null;
  /** 联系人邮箱 */
  consigneeContactEmail?: string | null;
  /** 联系人传真 */
  consigneeContactFax?: string | null;
  /** 联系人电话 */
  consigneeContactTel?: string | null;
  /** 收货人国家 */
  consigneeCountry?: string | null;
  /** 收货人邮箱 */
  consigneeEmail?: string | null;
  /** 收货人传真 */
  consigneeFax?: string | null;
  /** 收货人名称 */
  consigneeName?: string | null;
  /** 收货人邮编 */
  consigneePostcode?: string | null;
  /** 收货人省份 */
  consigneeProvince?: string | null;
  /** 收货人电话 */
  consigneeTel?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 舱单类型;1预配舱单2反恐舱单 */
  manifestType?: number | null;
  /** 通知人地址 */
  notifyAddress?: string | null;
  /** 通知人aeo企业编码 */
  notifyAeoCode?: string | null;
  /** 通知人城市 */
  notifyCity?: string | null;
  /** 通知人代码 */
  notifyCode?: string | null;
  /** 通知人国家 */
  notifyCountry?: string | null;
  /** 通知人邮箱 */
  notifyEmail?: string | null;
  /** 通知人传真 */
  notifyFax?: string | null;
  /** 通知人名称 */
  notifyName?: string | null;
  /** 通知人邮编 */
  notifyPostcode?: string | null;
  /** 通知人省份 */
  notifyProvince?: string | null;
  /** 通知人电话 */
  notifyTel?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId: number;
  /** 发货人地址 */
  shipperAddress?: string | null;
  /** 发货人aeo企业编码 */
  shipperAeoCode?: string | null;
  /** 发货人城市 */
  shipperCity?: string | null;
  /** 发货人代码 */
  shipperCode?: string | null;
  /** 发货人国家 */
  shipperCountry?: string | null;
  /** 发货人邮箱 */
  shipperEmail?: string | null;
  /** 发货人传真 */
  shipperFax?: string | null;
  /** 发货人名称 */
  shipperName?: string | null;
  /** 发货人邮编 */
  shipperPostcode?: string | null;
  /** 发货人省份 */
  shipperProvince?: string | null;
  /** 发货人电话 */
  shipperTel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 客商资料 */
export type PnrPartner = {
  /** 主键id */
  id?: number | null;
  /** 客商简称 */
  abbreviation: string;
  /** 审核人 */
  acceptBy?: number | null;
  /** 审核日期 */
  acceptDate?: number | null;
  /** 审核状态 */
  acceptStatus?: number | null;
  /** 空运提单地址 */
  airBlAddress?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 航空公司 */
  bAirway?: boolean | null;
  /** 驳船公司 */
  bBarge?: boolean | null;
  /** 是否黑名单 */
  bBlacklist?: boolean | null;
  /** 订舱代理 */
  bBookingAgent?: boolean | null;
  /** 客户 */
  bCustomer?: boolean | null;
  /** 报关行 */
  bCustomsBroker?: boolean | null;
  /** 目的港代理 */
  bDestinationAgent?: boolean | null;
  /** 快递公司 */
  bExpress?: boolean | null;
  /** 保险公司 */
  bInsurance?: boolean | null;
  /** 国内代理 */
  bLocalAgent?: boolean | null;
  /** 指定货代理 */
  bNominatedAgent?: boolean | null;
  /** 其他 */
  bOther?: boolean | null;
  /** 是否共享 */
  bShare?: boolean | null;
  /** 船公司 */
  bShipowner?: boolean | null;
  /** 发货单位 */
  bShipper?: boolean | null;
  /** 船代 */
  bShippingAgent?: boolean | null;
  /** 场站 */
  bStation?: boolean | null;
  /** 车队 */
  bTrucks?: boolean | null;
  /** 仓库 */
  bWarehouse?: boolean | null;
  /** 客商中文地址 */
  chineseAddress?: string | null;
  /** 客商中文全名 */
  chineseName?: string | null;
  /** 城市 */
  cityCode?: string | null;
  /** 国家 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 客户凭证代码 */
  customerVoucherCode?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 客商英文地址 */
  englishAddress?: string | null;
  /** 客商英文全名 */
  englishName?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 集团代码 */
  groupCode?: string | null;
  /** 法人代表 */
  legalRepresentative?: string | null;
  /** 客商助记码 */
  mnemonic: string;
  /** 所属公司id */
  officeId?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 省份 */
  province?: string | null;
  /** 注册资金 */
  registeredCapital?: number | null;
  /** 社会信用代码 */
  registrationNum?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 海运提单地址 */
  seaBlAddress?: string | null;
  /** 电话;umn_20 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 网址 */
  url?: string | null;
  /** 供应商凭证代码 */
  vendorVoucherCode?: string | null;
  /** 邮政编码 */
  zipCode?: string | null;
};

/** 客商DTO实体 */
export type PnrPartnerDTO = {
  /** 主键id */
  id?: number | null;
  /** 客商简称 */
  abbreviation?: string | null;
  /** 审核人 */
  acceptBy?: number | null;
  /** 审核日期 */
  acceptDate?: number | null;
  /** 审核状态 */
  acceptStatus?: number | null;
  /** 空运提单地址 */
  airBlAddress?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 航空公司 */
  bAirway?: boolean | null;
  /** 驳船公司 */
  bBarge?: boolean | null;
  /** 是否黑名单 */
  bBlacklist?: boolean | null;
  /** 订舱代理 */
  bBookingAgent?: boolean | null;
  /** 客户 */
  bCustomer?: boolean | null;
  /** 报关行 */
  bCustomsBroker?: boolean | null;
  /** 目的港代理 */
  bDestinationAgent?: boolean | null;
  /** 快递公司 */
  bExpress?: boolean | null;
  /** 保险公司 */
  bInsurance?: boolean | null;
  /** 国内代理 */
  bLocalAgent?: boolean | null;
  /** 指定货代理 */
  bNominatedAgent?: boolean | null;
  /** 其他 */
  bOther?: boolean | null;
  /** 是否共享 */
  bShare?: boolean | null;
  /** 船公司 */
  bShipowner?: boolean | null;
  /** 发货单位 */
  bShipper?: boolean | null;
  /** 船代 */
  bShippingAgent?: boolean | null;
  /** 场站 */
  bStation?: boolean | null;
  /** 车队 */
  bTrucks?: boolean | null;
  /** 仓库 */
  bWarehouse?: boolean | null;
  /** 客商中文地址 */
  chineseAddress?: string | null;
  /** 客商中文全名 */
  chineseName?: string | null;
  /** 城市 */
  cityCode?: string | null;
  /** 国家 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 客户凭证代码 */
  customerVoucherCode?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 客商英文地址 */
  englishAddress?: string | null;
  /** 客商英文全名 */
  englishName?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 集团代码 */
  groupCode?: string | null;
  /** 法人代表 */
  legalRepresentative?: string | null;
  /** 客商助记码 */
  mnemonic?: string | null;
  /** 所属公司id */
  officeId?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 省份 */
  province?: string | null;
  /** 注册资金 */
  registeredCapital?: number | null;
  /** 社会信用代码 */
  registrationNum?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 海运提单地址 */
  seaBlAddress?: string | null;
  /** 电话;umn_20 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 网址 */
  url?: string | null;
  /** 供应商凭证代码 */
  vendorVoucherCode?: string | null;
  /** 邮政编码 */
  zipCode?: string | null;
};

/** 客商资料下拉框数据源&act模块使用到客商实体 */
export type PnrPartnerRelevantVO = {
  /** 客商id */
  id: number;
  /** 客商简称 */
  abbreviation: string;
  /** 客商中文全名 */
  chineseName: string;
  /** 客商英文全名 */
  englishName: string;
  /** 客商助记码 */
  mnemonic: string;
  /** 客商国内国外类型(对应费用上的费用类型) */
  partnerCoutryType: number;
};

/** 客商服务要求 */
export type PnrServiceRequire = {
  /** 主键id */
  id?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 业务类型* */
  jobType?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客商id */
  partnerId: number;
  /** 服务要求 */
  service?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 客商资料打印数据源 */
export type ReportPnrPartnerVO = {
  /** 客商地址信息 */
  addressInfoList: PnrAddressInfo[];
  /** 客商银行账户;账号+币种唯一 */
  bankAccountList: PnrBankAccount[];
  /** 客商联系人 */
  contactList: PnrContact[];
  /** customer */
  customer: PnrCustomer;
  /** 客商开票资料 */
  invoiceInfoList: PnrInvoiceInfo[];
  /** pnrPartner */
  pnrPartner: PnrPartner;
  /** 客商服务要求 */
  serviceRequireList: PnrServiceRequire[];
};

/** Result */
export type Result = {
  /** code */
  code?: string | null;
  /** content */
  content?: {
  } | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Array«byte»» */
export type Result«Array«byte»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: Blob | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«CaptchaResultDTO» */
export type Result«CaptchaResultDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: CaptchaResultDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«CfgMailServer» */
export type Result«CfgMailServer» = {
  /** code */
  code?: string | null;
  /** content */
  content?: CfgMailServer | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«CloudFileVerboseVO» */
export type Result«CloudFileVerboseVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: CloudFileVerboseVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«ComFileElectronDTO» */
export type Result«ComFileElectronDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: ComFileElectronDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«ComSailingScheduleVO» */
export type Result«ComSailingScheduleVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: ComSailingScheduleVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«ComVessel» */
export type Result«ComVessel» = {
  /** code */
  code?: string | null;
  /** content */
  content?: ComVessel | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Credentials» */
export type Result«Credentials» = {
  /** code */
  code?: string | null;
  /** content */
  content?: Credentials | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnAdministrativeDivisionDTO» */
export type Result«DmnAdministrativeDivisionDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnAdministrativeDivisionDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnBerth» */
export type Result«DmnBerth» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnBerth | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnContainerDTO» */
export type Result«DmnContainerDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnContainerDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnCountrySelectionDTO» */
export type Result«DmnCountrySelectionDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnCountrySelectionDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnCountry» */
export type Result«DmnCountry» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnCountry | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnFeeItemDTO» */
export type Result«DmnFeeItemDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnFeeItemDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnFeeItemVO» */
export type Result«DmnFeeItemVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnFeeItemVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnRailwayStationVO» */
export type Result«DmnRailwayStationVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnRailwayStationVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnSeaport» */
export type Result«DmnSeaport» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnSeaport | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnTermItemDTO» */
export type Result«DmnTermItemDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnTermItemDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«DmnTermItem» */
export type Result«DmnTermItem» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnTermItem | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«FlwFlowConfigVO» */
export type Result«FlwFlowConfigVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: FlwFlowConfigVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«FlwNodeConfig» */
export type Result«FlwNodeConfig» = {
  /** code */
  code?: string | null;
  /** content */
  content?: FlwNodeConfig | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«FlwNodeRuteEdgeVO» */
export type Result«FlwNodeRuteEdgeVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: FlwNodeRuteEdgeVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«CfgIdentifierRule»» */
export type Result«List«CfgIdentifierRule»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: CfgIdentifierRule[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«CfgParameterItem»» */
export type Result«List«CfgParameterItem»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: CfgParameterItem[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«CloudFileSupplierVO»» */
export type Result«List«CloudFileSupplierVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: CloudFileSupplierVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«CloudFileVO»» */
export type Result«List«CloudFileVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: CloudFileVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«CloudFileVerboseVO»» */
export type Result«List«CloudFileVerboseVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: CloudFileVerboseVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«ComFileElectronDTO»» */
export type Result«List«ComFileElectronDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: ComFileElectronDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«ComSailingScheduleVO»» */
export type Result«List«ComSailingScheduleVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: ComSailingScheduleVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«ComVesselVO»» */
export type Result«List«ComVesselVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: ComVesselVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnAdministrativeDivisionDTO»» */
export type Result«List«DmnAdministrativeDivisionDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnAdministrativeDivisionDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnAdministrativeDivision»» */
export type Result«List«DmnAdministrativeDivision»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnAdministrativeDivision[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnContainer»» */
export type Result«List«DmnContainer»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnContainer[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnCountrySelectionDTO»» */
export type Result«List«DmnCountrySelectionDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnCountrySelectionDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnCountry»» */
export type Result«List«DmnCountry»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnCountry[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnCurrencyDTO»» */
export type Result«List«DmnCurrencyDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnCurrencyDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnDocumentTypeDTO»» */
export type Result«List«DmnDocumentTypeDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnDocumentTypeDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnFeeItemDTO»» */
export type Result«List«DmnFeeItemDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnFeeItemDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnFeeItemDropdownList»» */
export type Result«List«DmnFeeItemDropdownList»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnFeeItemDropdownList[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnRailwayStationVO»» */
export type Result«List«DmnRailwayStationVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnRailwayStationVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnShippingCompany»» */
export type Result«List«DmnShippingCompany»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnShippingCompany[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnTermAndItemVO»» */
export type Result«List«DmnTermAndItemVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnTermAndItemVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnTermItemDTO»» */
export type Result«List«DmnTermItemDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnTermItemDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«DmnTermItem»» */
export type Result«List«DmnTermItem»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: DmnTermItem[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«FeeItemDTO»» */
export type Result«List«FeeItemDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: FeeItemDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«FlwFlowApproveEntityLogVO»» */
export type Result«List«FlwFlowApproveEntityLogVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: FlwFlowApproveEntityLogVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«FlwFlowConfigVO»» */
export type Result«List«FlwFlowConfigVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: FlwFlowConfigVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«FlwFlowInstanceNodeVO»» */
export type Result«List«FlwFlowInstanceNodeVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: FlwFlowInstanceNodeVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«FlwNodeVO»» */
export type Result«List«FlwNodeVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: FlwNodeVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PerUiConfig»» */
export type Result«List«PerUiConfig»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PerUiConfig[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrAddressInfo»» */
export type Result«List«PnrAddressInfo»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrAddressInfo[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrBankAccount»» */
export type Result«List«PnrBankAccount»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrBankAccount[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrBlAddress»» */
export type Result«List«PnrBlAddress»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrBlAddress[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrContactDTO»» */
export type Result«List«PnrContactDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrContactDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrContact»» */
export type Result«List«PnrContact»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrContact[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrContractInfoVO»» */
export type Result«List«PnrContractInfoVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrContractInfoVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrCustomerCreditInfoVO»» */
export type Result«List«PnrCustomerCreditInfoVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrCustomerCreditInfoVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrCustomerPositionVO»» */
export type Result«List«PnrCustomerPositionVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrCustomerPositionVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrInvoiceInfo»» */
export type Result«List«PnrInvoiceInfo»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrInvoiceInfo[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrManifestInfo»» */
export type Result«List«PnrManifestInfo»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrManifestInfo[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrPartnerDTO»» */
export type Result«List«PnrPartnerDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrPartnerDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrPartnerRelevantVO»» */
export type Result«List«PnrPartnerRelevantVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrPartnerRelevantVO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«PnrServiceRequire»» */
export type Result«List«PnrServiceRequire»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrServiceRequire[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«SeaLineDTO»» */
export type Result«List«SeaLineDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SeaLineDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«SysBankAccount»» */
export type Result«List«SysBankAccount»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysBankAccount[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«SysDepartment»» */
export type Result«List«SysDepartment»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysDepartment[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«SysOffice»» */
export type Result«List«SysOffice»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysOffice[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«SysPrivilege»» */
export type Result«List«SysPrivilege»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysPrivilege[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«SysRolePermission»» */
export type Result«List«SysRolePermission»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysRolePermission[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«SysUserDTO»» */
export type Result«List«SysUserDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysUserDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«SysUserDropdownDTO»» */
export type Result«List«SysUserDropdownDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysUserDropdownDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«auth用户VO»» */
export type Result«List«auth用户VO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: auth用户VO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«cfgGridSchemeDTO»» */
export type Result«List«cfgGridSchemeDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: cfgGridSchemeDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«dmnContainerYardDTO»» */
export type Result«List«dmnContainerYardDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnContainerYardDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«dmnCustomAttributeDTO»» */
export type Result«List«dmnCustomAttributeDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnCustomAttributeDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«dmnFeeItemBusiness列表DTO»» */
export type Result«List«dmnFeeItemBusiness列表DTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnFeeItemBusiness列表DTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«dmnFrequentCountryDTO»» */
export type Result«List«dmnFrequentCountryDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnFrequentCountryDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«dmnLogisticsCompanyDTO»» */
export type Result«List«dmnLogisticsCompanyDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnLogisticsCompanyDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«dmnSeaportDTO»» */
export type Result«List«dmnSeaportDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnSeaportDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«dmnShippingCompanyDTO»» */
export type Result«List«dmnShippingCompanyDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnShippingCompanyDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«dmn_箱主»» */
export type Result«List«dmn_箱主»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmn_箱主[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«long»» */
export type Result«List«long»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: number[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«mdmNumberSegmentDTO»» */
export type Result«List«mdmNumberSegmentDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: mdmNumberSegmentDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«mdmNumberStoreDTO»» */
export type Result«List«mdmNumberStoreDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: mdmNumberStoreDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«nfyReceiverDTO»» */
export type Result«List«nfyReceiverDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: nfyReceiverDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«nfyUserNotifyDTO»» */
export type Result«List«nfyUserNotifyDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: nfyUserNotifyDTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«string»» */
export type Result«List«string»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: string[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«sysPrivilegeDTO»» */
export type Result«List«sysPrivilegeDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: sysPrivilegeDTORes[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«下拉框value值对应为short类型»» */
export type Result«List«下拉框value值对应为short类型»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 下拉框value值对应为short类型[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«下拉框value值对应为string»» */
export type Result«List«下拉框value值对应为string»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 下拉框value值对应为string[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«代码下拉框数据源»» */
export type Result«List«代码下拉框数据源»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 代码下拉框数据源[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«代码项下拉框数据源»» */
export type Result«List«代码项下拉框数据源»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 代码项下拉框数据源[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«全部待审批数量»» */
export type Result«List«全部待审批数量»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 全部待审批数量[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«公司组织架构»» */
export type Result«List«公司组织架构»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 公司组织架构[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«可以授权数据权限的用户»» */
export type Result«List«可以授权数据权限的用户»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 可以授权数据权限的用户[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«基本的可选项数据DTO«int»»» */
export type Result«List«基本的可选项数据DTO«int»»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 基本的可选项数据DTO«int»[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«基本的可选项数据DTO«string»»» */
export type Result«List«基本的可选项数据DTO«string»»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 基本的可选项数据DTO«string»[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«工作流类型-平台级别»» */
export type Result«List«工作流类型-平台级别»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 工作流类型-平台级别[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«文件批量保存request»» */
export type Result«List«文件批量保存request»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 文件批量保存request[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«本地企业库下拉»» */
export type Result«List«本地企业库下拉»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 本地企业库下拉[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«港口下拉列表»» */
export type Result«List«港口下拉列表»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 港口下拉列表[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«港口下拉框数据源»» */
export type Result«List«港口下拉框数据源»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 港口下拉框数据源[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«物流公司下拉数据DTO»» */
export type Result«List«物流公司下拉数据DTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 物流公司下拉数据DTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«用户分配角色列表&明细页实体»» */
export type Result«List«用户分配角色列表&明细页实体»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 用户分配角色列表&明细页实体[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«用户列表及详细信息»» */
export type Result«List«用户列表及详细信息»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 用户列表及详细信息[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«用户接收配置(查询用)DTO»» */
export type Result«List«用户接收配置(查询用)DTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 用户接收配置(查询用)DTO[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«用户职能实体»» */
export type Result«List«用户职能实体»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 用户职能实体[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«第三方企业库下拉»» */
export type Result«List«第三方企业库下拉»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 第三方企业库下拉[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«菜单树形»» */
export type Result«List«菜单树形»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 菜单树形[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«行业术语项列表»» */
export type Result«List«行业术语项列表»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 行业术语项列表[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«费用方案列表实体»» */
export type Result«List«费用方案列表实体»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 费用方案列表实体[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«List«部门人员信息列表»» */
export type Result«List«部门人员信息列表»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 部门人员信息列表[] | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Map«long,SysOfficeNameInfoDTO»» */
export type Result«Map«long,SysOfficeNameInfoDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: any | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Map«long,SysUserDropdownDTO»» */
export type Result«Map«long,SysUserDropdownDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: any | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Map«long,业务模块客户属性信息»» */
export type Result«Map«long,业务模块客户属性信息»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: any | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Map«string,DmnCountrySelectionDTO»» */
export type Result«Map«string,DmnCountrySelectionDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: any | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Map«string,List«ReportPnrPartnerVO»»» */
export type Result«Map«string,List«ReportPnrPartnerVO»»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: any | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Map«string,long»» */
export type Result«Map«string,long»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: any | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Map«string,object»» */
export type Result«Map«string,object»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: {
  } | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«Map«string,string»» */
export type Result«Map«string,string»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: any | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«CfgParameterConfigListVO»» */
export type Result«PageInfo«CfgParameterConfigListVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«CfgParameterConfigListVO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«CfgParameterConfig»» */
export type Result«PageInfo«CfgParameterConfig»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«CfgParameterConfig» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«ComFileElectronDTO»» */
export type Result«PageInfo«ComFileElectronDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«ComFileElectronDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«ComSailingScheduleVO»» */
export type Result«PageInfo«ComSailingScheduleVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«ComSailingScheduleVO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«ComVesselVO»» */
export type Result«PageInfo«ComVesselVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«ComVesselVO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnAdministrativeDivisionDTO»» */
export type Result«PageInfo«DmnAdministrativeDivisionDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnAdministrativeDivisionDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnAdministrativeDivisionListDTO»» */
export type Result«PageInfo«DmnAdministrativeDivisionListDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnAdministrativeDivisionListDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnBerth»» */
export type Result«PageInfo«DmnBerth»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnBerth» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnContainer»» */
export type Result«PageInfo«DmnContainer»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnContainer» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnCountry»» */
export type Result«PageInfo«DmnCountry»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnCountry» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnCurrency»» */
export type Result«PageInfo«DmnCurrency»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnCurrency» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnFeeGroup»» */
export type Result«PageInfo«DmnFeeGroup»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnFeeGroup» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnFeeItemVO»» */
export type Result«PageInfo«DmnFeeItemVO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnFeeItemVO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnHscode»» */
export type Result«PageInfo«DmnHscode»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnHscode» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnNegativeList»» */
export type Result«PageInfo«DmnNegativeList»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnNegativeList» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«DmnSeaLine»» */
export type Result«PageInfo«DmnSeaLine»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«DmnSeaLine» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«PerUiConfig»» */
export type Result«PageInfo«PerUiConfig»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«PerUiConfig» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«comTaskMonitorDTO»» */
export type Result«PageInfo«comTaskMonitorDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«comTaskMonitorDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dataMqDlqMsg列表DTO»» */
export type Result«PageInfo«dataMqDlqMsg列表DTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dataMqDlqMsg列表DTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dmnAirlineCompanyDTO»» */
export type Result«PageInfo«dmnAirlineCompanyDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dmnAirlineCompanyDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dmnAirportDTO»» */
export type Result«PageInfo«dmnAirportDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dmnAirportDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dmnContainerOwnerDTO»» */
export type Result«PageInfo«dmnContainerOwnerDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dmnContainerOwnerDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dmnContainerYardDTO»» */
export type Result«PageInfo«dmnContainerYardDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dmnContainerYardDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dmnCustomAttributeDTO»» */
export type Result«PageInfo«dmnCustomAttributeDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dmnCustomAttributeDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dmnFeeItemBase列表DTO»» */
export type Result«PageInfo«dmnFeeItemBase列表DTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dmnFeeItemBase列表DTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dmnFeeItemBusiness列表DTO»» */
export type Result«PageInfo«dmnFeeItemBusiness列表DTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dmnFeeItemBusiness列表DTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dmnIndividual列表DTO»» */
export type Result«PageInfo«dmnIndividual列表DTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dmnIndividual列表DTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«dmnLogisticsCompanyDTO»» */
export type Result«PageInfo«dmnLogisticsCompanyDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«dmnLogisticsCompanyDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«memMemberInfoDTO»» */
export type Result«PageInfo«memMemberInfoDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«memMemberInfoDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«urlMap列表DTO»» */
export type Result«PageInfo«urlMap列表DTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«urlMap列表DTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«客商资料详细页信息»» */
export type Result«PageInfo«客商资料详细页信息»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«客商资料详细页信息» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«汇率列表»» */
export type Result«PageInfo«汇率列表»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«汇率列表» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«消息列表出参»» */
export type Result«PageInfo«消息列表出参»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«消息列表出参» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«用户列表及详细信息»» */
export type Result«PageInfo«用户列表及详细信息»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«用户列表及详细信息» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PageInfo«编码规则列表及详细页»» */
export type Result«PageInfo«编码规则列表及详细页»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PageInfo«编码规则列表及详细页» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PerUiConfig» */
export type Result«PerUiConfig» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PerUiConfig | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrAddressInfo» */
export type Result«PnrAddressInfo» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrAddressInfo | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrBankAccount» */
export type Result«PnrBankAccount» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrBankAccount | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrBlAddress» */
export type Result«PnrBlAddress» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrBlAddress | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrContact» */
export type Result«PnrContact» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrContact | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrContractInfoVO» */
export type Result«PnrContractInfoVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrContractInfoVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrCustomerCreditInfoVO» */
export type Result«PnrCustomerCreditInfoVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrCustomerCreditInfoVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrCustomerPositionUserVO» */
export type Result«PnrCustomerPositionUserVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrCustomerPositionUserVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrCustomerPositionVO» */
export type Result«PnrCustomerPositionVO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrCustomerPositionVO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrInvoiceInfo» */
export type Result«PnrInvoiceInfo» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrInvoiceInfo | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrManifestInfo» */
export type Result«PnrManifestInfo» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrManifestInfo | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrPartnerDTO» */
export type Result«PnrPartnerDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrPartnerDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«PnrServiceRequire» */
export type Result«PnrServiceRequire» = {
  /** code */
  code?: string | null;
  /** content */
  content?: PnrServiceRequire | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«SeaLineDTO» */
export type Result«SeaLineDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SeaLineDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«SysDepartmentDTO» */
export type Result«SysDepartmentDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysDepartmentDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«SysOfficeNameInfoDTO» */
export type Result«SysOfficeNameInfoDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysOfficeNameInfoDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«SysUserDropdownDTO» */
export type Result«SysUserDropdownDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: SysUserDropdownDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«auth用户VO» */
export type Result«auth用户VO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: auth用户VO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«boolean» */
export type Result«boolean» = {
  /** code */
  code?: string | null;
  /** content */
  content?: boolean | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«cfgGridSchemeDTO» */
export type Result«cfgGridSchemeDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: cfgGridSchemeDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«comTaskMonitorDTO» */
export type Result«comTaskMonitorDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: comTaskMonitorDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dataMqDlqMsg详情DTO» */
export type Result«dataMqDlqMsg详情DTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dataMqDlqMsg详情DTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnAirlineCompanyDTO» */
export type Result«dmnAirlineCompanyDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnAirlineCompanyDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnAirportDTO» */
export type Result«dmnAirportDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnAirportDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnContainerOwnerDTO» */
export type Result«dmnContainerOwnerDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnContainerOwnerDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnContainerYardDTO» */
export type Result«dmnContainerYardDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnContainerYardDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnCustomAttributeDTO» */
export type Result«dmnCustomAttributeDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnCustomAttributeDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnFeeItemBase详情DTO» */
export type Result«dmnFeeItemBase详情DTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnFeeItemBase详情DTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnFeeItemBusiness详情DTO» */
export type Result«dmnFeeItemBusiness详情DTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnFeeItemBusiness详情DTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnIndividual详情DTO» */
export type Result«dmnIndividual详情DTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnIndividual详情DTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnLogisticsCompanyDTO» */
export type Result«dmnLogisticsCompanyDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnLogisticsCompanyDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnSeaportDTO» */
export type Result«dmnSeaportDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnSeaportDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«dmnShippingCompanyDTO» */
export type Result«dmnShippingCompanyDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: dmnShippingCompanyDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«int» */
export type Result«int» = {
  /** code */
  code?: string | null;
  /** content */
  content?: number | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«long» */
export type Result«long» = {
  /** code */
  code?: string | null;
  /** content */
  content?: number | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«mdmNumberSegmentDTO» */
export type Result«mdmNumberSegmentDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: mdmNumberSegmentDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«nfyReceiverDTO» */
export type Result«nfyReceiverDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: nfyReceiverDTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«object» */
export type Result«object» = {
  /** code */
  code?: string | null;
  /** content */
  content?: {
  } | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«report业务所属公司数据源» */
export type Result«report业务所属公司数据源» = {
  /** code */
  code?: string | null;
  /** content */
  content?: report业务所属公司数据源 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«string» */
export type Result«string» = {
  /** code */
  code?: string | null;
  /** content */
  content?: string | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«sysPrivilegeDTO» */
export type Result«sysPrivilegeDTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: sysPrivilegeDTORes | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«urlMap详情DTO» */
export type Result«urlMap详情DTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: urlMap详情DTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«业务模块客户属性信息» */
export type Result«业务模块客户属性信息» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 业务模块客户属性信息 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«公司组织架构-可视化结构» */
export type Result«公司组织架构-可视化结构» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 公司组织架构-可视化结构 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«公司详情页实体» */
export type Result«公司详情页实体» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 公司详情页实体 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«客商合同信息» */
export type Result«客商合同信息» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 客商合同信息 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«客商资料详细页信息» */
export type Result«客商资料详细页信息» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 客商资料详细页信息Res | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«常用-最近-所有-下拉选项模型«DmnCountrySelectionDTO»» */
export type Result«常用-最近-所有-下拉选项模型«DmnCountrySelectionDTO»» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 常用-最近-所有-下拉选项模型«DmnCountrySelectionDTO» | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«当前登录用户redis存储用户详细信息» */
export type Result«当前登录用户redis存储用户详细信息» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 当前登录用户redis存储用户详细信息 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«我司地址,联系人信息及其他信息» */
export type Result«我司地址,联系人信息及其他信息» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 我司地址,联系人信息及其他信息 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«本地企业库详情» */
export type Result«本地企业库详情» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 本地企业库详情 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«消息详情» */
export type Result«消息详情» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 消息详情 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«用户Token» */
export type Result«用户Token» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 用户Token | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«用户token相关信息» */
export type Result«用户token相关信息» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 用户token相关信息 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«用户接收配置(编辑用)DTO» */
export type Result«用户接收配置(编辑用)DTO» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 用户接收配置(编辑用)DTO | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«用户详细实体» */
export type Result«用户详细实体» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 用户详细实体 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«用户详细页及保存入参实体» */
export type Result«用户详细页及保存入参实体» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 用户详细页及保存入参实体 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«第三方企业库详情» */
export type Result«第三方企业库详情» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 第三方企业库详情 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«结算单位发票税号地址及其他信息» */
export type Result«结算单位发票税号地址及其他信息» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 结算单位发票税号地址及其他信息 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«编码规则列表及详细页» */
export type Result«编码规则列表及详细页» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 编码规则列表及详细页 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** Result«编码规则详细页初始加载内容» */
export type Result«编码规则详细页初始加载内容» = {
  /** code */
  code?: string | null;
  /** content */
  content?: 编码规则详细页初始加载内容 | null;
  /** errorString */
  errorString?: string | null;
  /** errors */
  errors?: SubError[] | null;
  /** message */
  message?: string | null;
  /** messageId */
  messageId?: string | null;
  /** ok */
  ok?: boolean | null;
};

/** 海运航线DTO */
export type SeaLineDTO = {
  /** 航线code */
  code?: string | null;
  /** 港口code */
  code5?: string | null;
  /** 扩展字段 */
  externalJson?: string | null;
  /** jsonDTO */
  jsonDTO?: SeaLineExpandJsonDTO | null;
  /** 时区 */
  timeZone?: number | null;
};

/** 海运航线拓展字段Json */
export type SeaLineExpandJsonDTO = {
  /** 流向 */
  routeDirection?: number | null;
};

/** SendLastDeadLetterQueueMsgToDevParam */
export type SendLastDeadLetterQueueMsgToDevParam = {
  /** days */
  days?: number | null;
  /** emails */
  emails?: string[] | null;
};

/** SubError */
export type SubError = {
  /** code */
  code?: string | null;
  /** message */
  message?: string | null;
};

/** SubscribeActionConfigDTO */
export type SubscribeActionConfigDTO = {
  /** 主键id */
  id?: number | null;
  /** nfy_default_reception_config.id */
  defaultConfigId?: number | null;
  /** 邮件通知是否允许修改;0-不允许,1-允许 */
  emailEnable?: boolean | null;
  /** 是否发邮件 */
  emailFlag?: boolean | null;
  /** 站内信通知是否允许修改;0-不允许,1-允许 */
  messageEnable?: boolean | null;
  /** 是否发站内消息 */
  messageFlag?: boolean | null;
  /** 接收平台代码:1-运营;2-会员 */
  receivePlatformCode?: number | null;
  /** 接收人列表 */
  receivers?: receiverDTO[] | null;
  /** 短信通知是否允许修改;0-不允许,1-允许 */
  smsEnable?: boolean | null;
  /** 是否发短信 */
  smsFlag?: boolean | null;
  /** 订阅动作代码 */
  subscribeActionCode?: string | null;
  /** 订阅动作名称 */
  subscribeActionName?: string | null;
  /** 订阅者id */
  subscriberId?: number | null;
  /** 订阅者类型;1-运营;2-会员 */
  subscriberType?: number | null;
  /** 触发动作代码 */
  triggerActionCode?: string | null;
  /** 触发动作名称 */
  triggerActionName?: string | null;
  /** 是否发公众号 */
  wechatFlag?: boolean | null;
};

/** 公司银行账户 */
export type SysBankAccount = {
  /** 主键id */
  id?: number | null;
  /** 银行账号 */
  accountNo?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 银行中文地址 */
  bankChineseAddress?: string | null;
  /** 银行中文名 */
  bankChineseName?: string | null;
  /** 银行英文地址 */
  bankEnglishAddress?: string | null;
  /** 银行英文名 */
  bankEnglishName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 账户币种 */
  currency?: string | null;
  /** 所属公司ID */
  officeId: number;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 账户简称 */
  shortName?: string | null;
  /** 银行国际代码 */
  swiftCode?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 开户人中文名 */
  titleChineseName?: string | null;
  /** 开户人英文名 */
  titleEnglishName?: string | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 部门 */
export type SysDepartment = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 子节点 */
  childNodes?: SysDepartment[] | null;
  /** 中文名称 */
  chineseName: string;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名称 */
  englishName: string;
  /** 所属公司id */
  officeId: number;
  /** 数据操作url */
  optUrl?: string | null;
  /** 上级部门id */
  parentDepartmentId: number;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 状态 */
  status?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 员工数量 */
  userQuantity?: number | null;
};

/** 部门 */
export type SysDepartmentDTO = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 中文名称 */
  chineseName: string;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名称 */
  englishName: string;
  /** 所属公司id */
  officeId: number;
  /** 数据操作url */
  optUrl?: string | null;
  /** 上级部门id */
  parentDepartmentId: number;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 状态 */
  status?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 员工数量 */
  userQuantity?: number | null;
};

/** 公司 */
export type SysOffice = {
  /** 主键id */
  id?: number | null;
  /** 空运提单地址 */
  airBlAddress?: string | null;
  /** 默认空运港口 */
  airPort?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 子节点 */
  childNodes?: SysOffice[] | null;
  /** 中文地址 */
  chineseAddress?: string | null;
  /** 中文名 */
  chineseName: string;
  /** 城市ID */
  cityCode?: string | null;
  /** 国家ID */
  countryCode?: string | null;
  /** 区县ID */
  countyCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 邮箱 */
  email?: string | null;
  /** 英文地址 */
  englishAddress?: string | null;
  /** 英文名 */
  englishName?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 发票寄票地址 */
  invoiceAddress?: string | null;
  /** 发票开票抬头 */
  invoiceTitle?: string | null;
  /** 本位币 */
  localCurrency: string;
  /** 国内账单地址 */
  localDnAddress?: string | null;
  /** 代码 */
  officeCode: string;
  /** 数据操作url */
  optUrl?: string | null;
  /** 海外账单地址 */
  overseaDnAddress?: string | null;
  /** 上级公司id */
  parentOfficeId: number;
  /** 省州ID */
  province?: string | null;
  /** 海运提单地址 */
  seaBlAddress?: string | null;
  /** 默认海运港口 */
  seaPort?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 简称 */
  shortName?: string | null;
  /** 状态 */
  status?: number | null;
  /** 税号 */
  taxAccount?: string | null;
  /** 电话 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 网址 */
  url?: string | null;
  /** 员工数量 */
  userQuantity?: number | null;
  /** 邮编 */
  zipCode?: string | null;
};

/** 公司 */
export type SysOfficeNameInfoDTO = {
  /** 中文名 */
  chineseName: string;
  /** 英文名 */
  englishName?: string | null;
  /** 代码 */
  officeCode: string;
  /** 公司id */
  officeId: number;
  /** 简称 */
  shortName?: string | null;
};

/** 权限 */
export type SysPrivilege = {
  /** 主键id */
  id?: number | null;
  /** 是否控制数据集权限 */
  bDataPrivilege?: boolean | null;
  /** role--标志这个权限为身份,如操作客服;data---数据权限,查看同组编辑同组查看本公司编辑本公司查看集团编辑集团;其它---为功能权限 */
  category?: string | null;
  /** checked */
  checked?: boolean | null;
  /** childNodes */
  childNodes?: SysPrivilege[] | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 数据权限维度;多个用逗号隔开 */
  dataDimension?: string | null;
  /** 描述 */
  description?: string | null;
  /** 图标 */
  icon?: string | null;
  /** 名称 */
  name?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 顺序号 */
  orderIndex?: number | null;
  /** 上级权限ID */
  parentPrivilegeId?: number | null;
  /** 树形path */
  path?: string | null;
  /** 权限点 */
  point?: string | null;
  /** 权限组ID */
  privilegeGroupId?: number | null;
  /** 权限型 */
  shape?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 角色 */
export type SysRole = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否系统级角色 */
  bSystem?: boolean | null;
  /** 角色编码 */
  code: string;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 角色描述 */
  description?: string | null;
  /** 角色名称 */
  name: string;
  /** 数据操作url */
  optUrl?: string | null;
  /** 状态 */
  status?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** sys_角色数据权限 */
export type SysRolePermission = {
  /** 主键id */
  id?: number | null;
  /** 授权数据名称 */
  authorizedDataName?: string | null;
  /** 授权数据值：;特殊的值说明;current_person，本人，过滤时要替换为本人id;current_department，本部门，过滤时要替换为本部门id;current_office，本公司，过滤时要替换为本公司id;;设置功能权限时，自动赋上特殊值; */
  authorizedDataValue?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 授权维度; */
  permissionDimension?: string | null;
  /** 授权维度名称 */
  permissionDimensionName?: string | null;
  /** 权限代码 */
  privilegeCode?: string | null;
  /** 角色编码 */
  roleCode?: string | null;
  /** 角色id */
  roleId?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 用户DTO */
export type SysUserDTO = {
  /** 主键id */
  id?: number | null;
  /** 中文名 */
  chineseName?: string | null;
  /** 所属部门ID */
  departmentId?: number | null;
  /** 英文名 */
  englishName?: string | null;
  /** 所属公司ID */
  officeId?: number | null;
  /** 用户密码 */
  password?: string | null;
  /** 状态 */
  status?: number | null;
  /** 用户名 */
  userName?: string | null;
};

/** 用户下拉框数据源 */
export type SysUserDropdownDTO = {
  /** 用户id */
  id?: number | null;
  /** bactive */
  bactive?: boolean | null;
  /** 中文名 */
  chineseName?: string | null;
  /** 所属部门ID */
  departmentId?: number | null;
  /** 所属部门名称 */
  departmentName?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 英文名 */
  englishName?: string | null;
  /** 手机 */
  mobile?: string | null;
  /** 所属公司ID */
  officeId?: number | null;
  /** 所属公司名称 */
  officeName?: string | null;
  /** status */
  status?: number | null;
  /** 用户名 */
  userName?: string | null;
};

/** View */
export type View = {
  /** contentType */
  contentType?: string | null;
};

/** auth用户VO */
export type auth用户VO = {
  /** 主键ID */
  id: number;
  /** appId */
  appId: number;
  /** 中文名称 */
  chineseName: string;
  /** 邮件 */
  email: string;
  /** 英文名称 */
  englishName: string;
  /** 会员id */
  memberId: number;
  /** 会员名称 */
  memberName: string;
  /** 手机 */
  mobile: string;
  /** 状态 */
  status: number;
  /** 租户ID */
  tenantId: number;
  /** userType */
  userType: number;
  /** 用户名 */
  username: string;
};

/** auth用户会员信息更新DTO */
export type auth用户会员信息更新DTO = {
  /** 会员ID */
  memberId?: number | null;
  /** 会员名称 */
  memberName?: string | null;
};

/** auth用户密码更新DTO */
export type auth用户密码更新DTO = {
  /** 状态 */
  status?: number | null;
};

/** auth用户新增DTO */
export type auth用户新增DTO = {
  /** AuthID */
  id?: number | null;
  /** appId */
  appId?: number | null;
  /** 是否管理员 */
  bAdministrator?: boolean | null;
  /** 是否运营授权账号 */
  bAuthorizer?: boolean | null;
  /** 是否创建人 */
  bCreater?: boolean | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 邮件 */
  email?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 会员ID */
  memberId?: number | null;
  /** 会员名称 */
  memberName?: string | null;
  /** 手机 */
  mobile?: string | null;
  /** 密码 */
  password?: string | null;
  /** 状态 */
  status?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 用户名称 */
  userName?: string | null;
};

/** auth用户更新DTO */
export type auth用户更新DTO = {
  /** 中文名称 */
  chineseName?: string | null;
  /** 邮件 */
  email?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 会员名称 */
  memberName?: string | null;
  /** 手机 */
  mobile?: string | null;
  /** 租户ID */
  tenantId?: number | null;
};

/** cfgGridSchemeDTO */
export type cfgGridSchemeDTO = {
  /** id */
  id?: number | null;
  /** 是否默认0否1是 */
  defaultFlag?: boolean | null;
  /** 模块code */
  moduleCode?: string | null;
  /** 模块name */
  moduleName?: string | null;
  /** 方案内容 */
  schemeContent?: string | null;
  /** 方案名称 */
  schemeName?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 用户id */
  userId?: number | null;
};

/** comTaskMonitorDTO */
export type comTaskMonitorDTO = {
  /** 主键id */
  id?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 任务处理结果 */
  execResult?: string | null;
  /** 开始执行时间 */
  executeBegin?: number | null;
  /** 执行完成时间 */
  executeEnd?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 导入原文件连接 */
  originCloudFileLink?: string | null;
  /** 导入原文件名 */
  originCloudFileName?: string | null;
  /** 文件名称 */
  originFileName?: string | null;
  /** 解析后文件连接 */
  parseCloudFileLink?: string | null;
  /** 解析文件名 */
  parseCloudFileName?: string | null;
  /** 平台code1、运营2、会员 */
  platformCode?: number | null;
  /** 任务代码：统一规范;6位数字，前3位为模块代码，后3位为任务代码 */
  taskCode?: string | null;
  /** 任务代码名称 */
  taskCodeName?: string | null;
  /** 任务实例名称，默认与任务名称相同 */
  taskInstance?: string | null;
  /** 操作类型名称 */
  taskName?: string | null;
  /** 状态:1未开始2进行中3已完成4失败 */
  taskStatus?: number | null;
  /** 任务状态名称 */
  taskStatusName?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dataMqDlqMsg列表DTO */
export type dataMqDlqMsg列表DTO = any;

/** dataMqDlqMsg新增DTO */
export type dataMqDlqMsg新增DTO = any;

/** dataMqDlqMsg更新DTO */
export type dataMqDlqMsg更新DTO = any;

/** dataMqDlqMsg详情DTO */
export type dataMqDlqMsg详情DTO = any;

/** dmnAirlineCompanyDTO */
export type dmnAirlineCompanyDTO = {
  /** 主键id */
  id?: number | null;
  /** 中文全称; */
  chineseName?: string | null;
  /** 中文简称; */
  chineseShortname?: string | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 英文简称; */
  englishShortname?: string | null;
  /** logo文件id;航空公司标在云存储上的文件id */
  logoFileId?: number | null;
  /** SCAC代码 */
  scacCode?: string | null;
};

/** dmnAirportDTO */
export type dmnAirportDTO = {
  /** 主键id */
  id?: number | null;
  /** 如上海 */
  chineseName?: string | null;
  /** 如SHA */
  code3?: string | null;
  /** 国家代码;如CN */
  countryCode?: string | null;
  /** 如shanghai */
  englishName?: string | null;
  /** 辖区id */
  subdivisionId?: number | null;
  /** 时区 */
  timeZone?: string | null;
};

/** dmnContainerOwnerDTO */
export type dmnContainerOwnerDTO = {
  /** 主键id */
  id?: number | null;
  /** 箱主编码 */
  code?: string | null;
  /** 国家名称 */
  countryName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 行政区划code */
  divisionCode?: string | null;
  /** 箱主名称 */
  name?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 城市 */
  ownerCity?: string | null;
  /** 国家代码 */
  ownerCountry?: string | null;
  /** 州/省/区 */
  ownerProvince?: string | null;
  /** 箱主简称 */
  shortName?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dmnContainerYardDTO */
export type dmnContainerYardDTO = {
  /** 主键id */
  id?: number | null;
  /** 堆场编码 */
  code?: string | null;
  /** 联系人 */
  contact?: string | null;
  /** 联系电话 */
  contactPhone?: string | null;
  /** 国家名称 */
  countryName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 行政区划code */
  divisionCode?: string | null;
  /** 纬度 */
  latitude?: number | null;
  /** 经度 */
  longitude?: number | null;
  /** 堆场名称 */
  name?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 关联港口代码（五字码） */
  portCode?: string | null;
  /** 港口名称 */
  portName?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 堆场地址 */
  yardAddress: string;
  /** 城市 */
  yardCity?: string | null;
  /** 国家代码 */
  yardCountry?: string | null;
  /** 州/省 */
  yardProvince?: string | null;
  /** 堆场类型：1堆场；2码头 */
  yardType?: number | null;
};

/** dmnCustomAttributeDTO */
export type dmnCustomAttributeDTO = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  activeFlag?: boolean | null;
  /** 类型编码 */
  code: string;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 是否为item项 */
  itemFlag?: boolean | null;
  /** 类型名称 */
  name: string;
  /** 数据操作url */
  optUrl?: string | null;
  /** 上级类别编码 */
  parentCode?: string | null;
  /** 上级类别id */
  parentId?: number | null;
  /** 上级类别名称 */
  parentName?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序 */
  sequence?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dmnFeeItemBase列表DTO */
export type dmnFeeItemBase列表DTO = {
  /** 主键id */
  id?: number | null;
  /** bcommission */
  bcommission?: boolean | null;
  /** 业务类型:[{'code':'SEA_EXPORT','name':'海运出口'},{'code':'SEA_IMPORT','name':'海运进口'}] */
  businessTypes?: 基本的可选项数据DTO«string»[] | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 计费方式 */
  feeMode?: number | null;
  /** 费用助记码 */
  feeShortName?: string | null;
  /** 计费单位 */
  feeUnit?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seq?: number | null;
  /** 状态:0-草稿,10-已提交(生效中),20-失效 */
  status?: number | null;
  /** 状态:0-草稿,10-已提交(生效中),20-失效 */
  statusName?: string | null;
};

/** dmnFeeItemBase新增DTO */
export type dmnFeeItemBase新增DTO = {
  /** bcommission */
  bcommission?: boolean | null;
  /** 中文名称 */
  chineseName: string;
  /** 代码 */
  code: string;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 业务类型:[{'code':'SEA_EXPORT','name':'海运出口'},{'code':'SEA_IMPORT','name':'海运进口'}] */
  dmnFeeItemBusinesses?: dmnFeeItemBusiness新增DTO[] | null;
  /** 英文名称 */
  englishName: string;
  /** 计费方式 */
  feeMode?: number | null;
  /** 费用助记码 */
  feeShortName: string;
  /** 计费单位 */
  feeUnit?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seq?: number | null;
};

/** dmnFeeItemBase详情DTO */
export type dmnFeeItemBase详情DTO = {
  /** 主键id */
  id?: number | null;
  /** bcommission */
  bcommission?: boolean | null;
  /** 业务类型:[{'code':'SEA_EXPORT','name':'海运出口'},{'code':'SEA_IMPORT','name':'海运进口'}] */
  businessTypes?: 基本的可选项数据DTO«string»[] | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 业务类型:[{'code':'SEA_EXPORT','name':'海运出口'},{'code':'SEA_IMPORT','name':'海运进口'}] */
  dmnFeeItemBusinesses?: dmnFeeItemBusiness详情DTO[] | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 计费方式 */
  feeMode?: number | null;
  /** 费用助记码 */
  feeShortName?: string | null;
  /** 计费单位 */
  feeUnit?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seq?: number | null;
  /** 状态:0-草稿,10-已提交(生效中),20-失效 */
  status?: number | null;
};

/** dmnFeeItemBusiness列表DTO */
export type dmnFeeItemBusiness列表DTO = {
  /** 主键id */
  id?: number | null;
  /** bcommission */
  bcommission?: boolean | null;
  /** 业务类型 */
  businessTypeCode?: string | null;
  /** 业务类型名称 */
  businessTypeName?: string | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建人 */
  createTime?: number | null;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 基础费用编码ID */
  feeItemBaseId?: number | null;
  /** 计费方式 */
  feeMode?: number | null;
  /** 费用助记码 */
  feeShortName?: string | null;
  /** 计费单位 */
  feeUnit?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seq?: number | null;
  /** 状态:0-草稿,10-已提交(生效中),20-失效 */
  status?: number | null;
  /** 状态:0-草稿,10-已提交(生效中),20-失效 */
  statusName?: string | null;
};

/** dmnFeeItemBusiness新增DTO */
export type dmnFeeItemBusiness新增DTO = {
  /** bcommission */
  bcommission?: boolean | null;
  /** 业务类型 */
  businessTypeCode: string;
  /** 业务类型名称 */
  businessTypeName: string;
  /** 中文名称 */
  chineseName: string;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 英文名称 */
  englishName: string;
  /** 计费方式 */
  feeMode?: number | null;
  /** 费用助记码 */
  feeShortName: string;
  /** 计费单位 */
  feeUnit?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seq?: number | null;
};

/** dmnFeeItemBusiness详情DTO */
export type dmnFeeItemBusiness详情DTO = {
  /** 主键id */
  id?: number | null;
  /** bcommission */
  bcommission?: boolean | null;
  /** 业务类型 */
  businessTypeCode?: string | null;
  /** 业务类型名称 */
  businessTypeName?: string | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 默认币种 */
  defaultCurrency?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 基础费用项目ID */
  feeItemBaseId?: number | null;
  /** 计费方式 */
  feeMode?: number | null;
  /** 费用助记码 */
  feeShortName?: string | null;
  /** 计费单位 */
  feeUnit?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seq?: number | null;
  /** 状态:0-草稿,10-已提交(生效中),20-失效 */
  status?: number | null;
  /** 状态:0-草稿,10-已提交(生效中),20-失效 */
  statusName?: string | null;
};

/** dmnFrequentCountryDTO */
export type dmnFrequentCountryDTO = {
  /** 主键id */
  id?: number | null;
  /** 电话区号 */
  areaCod?: string | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 中文简称 */
  chineseShortname?: string | null;
  /** 两字码 */
  code2?: string | null;
  /** 三字码 */
  code3?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 币种代码 */
  currecyCode?: string | null;
  /** 域名后缀 */
  domainSuffix?: string | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 英文简称 */
  englishShortname?: string | null;
  /** 国旗文件id */
  flagFileId?: number | null;
  /** 是否为常用国家1是2不是 */
  frequentFlag?: number | null;
  /** 数字码 */
  numericCode?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dmnIndividual列表DTO */
export type dmnIndividual列表DTO = any;

/** dmnIndividual新增DTO */
export type dmnIndividual新增DTO = any;

/** dmnIndividual更新DTO */
export type dmnIndividual更新DTO = any;

/** dmnIndividual详情DTO */
export type dmnIndividual详情DTO = any;

/** dmnLogisticsCompanyDTO */
export type dmnLogisticsCompanyDTO = {
  /** 主键id */
  id?: number | null;
  /** 中文全称;如太平洋船务有限公司 */
  chineseName?: string | null;
  /** 中文简称;如太平洋船务 */
  chineseShortname?: string | null;
  /** 国家代码 */
  countryCode: string;
  /** 国家 */
  countryName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文全称;如PacificInternationalLines; */
  englishName: string;
  /** 英文简称;如PIL */
  englishShortname?: string | null;
  /** logo文件id;航空公司标在云存储上的文件id */
  logoFileId?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** SCAC代码 */
  scacCode: string;
  /** 公司简称;如PIL */
  shortname: string;
  /** 租户ID */
  tenantId?: number | null;
  /** 轨迹查询代码 */
  trackCode?: string | null;
  /** 轨迹查询地址 */
  trackUrl?: string | null;
  /** transportMode */
  transportMode?: string | null;
  /** 运输方式：1.快递express2.卡车truck3.铁路railway4.拖车container_truck，多个以逗号隔开; */
  transportModeCodeList: number[];
  /** transportModeName */
  transportModeName?: string | null;
  /** transportModeNameList */
  transportModeNameList?: string[] | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dmnSeaportDTO */
export type dmnSeaportDTO = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否内陆港口 */
  bInland?: boolean | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 城市code */
  cityCode?: string | null;
  /** 城市描述;包含国家省市code、中文名、英文名、邮编等 */
  cityDesc?: string | null;
  /** 三字码 */
  code3?: string | null;
  /** 五字码 */
  code5?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 纬度 */
  latitude?: number | null;
  /** 航线 */
  lineCode?: string | null;
  /** 经度 */
  longitude?: number | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 时区 */
  timeZone?: number | null;
};

/** dmnShippingCompanyDTO */
export type dmnShippingCompanyDTO = {
  /** 主键id */
  id?: number | null;
  /** 中文全称;如太平洋船务有限公司 */
  chineseName?: string | null;
  /** 中文简称;如太平洋船务 */
  chineseShortname?: string | null;
  /** 英文全称;如PacificInternationalLines; */
  englishName?: string | null;
  /** 英文简称;如PIL */
  englishShortname?: string | null;
  /** logo文件id;航空公司标在云存储上的文件id */
  logoFileId?: number | null;
  /** SCAC代码 */
  scacCode?: string | null;
};

/** dmn_箱主 */
export type dmn_箱主 = {
  /** 主键id */
  id?: number | null;
  /** 箱主编码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 是否启用 */
  enableFlag?: boolean | null;
  /** 箱主名称 */
  name?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 详细地址 */
  ownerAddress?: string | null;
  /** 城市 */
  ownerCity?: string | null;
  /** 国家代码 */
  ownerCountry?: string | null;
  /** 区县 */
  ownerDistrict?: string | null;
  /** 省市县地址 */
  ownerNormalized?: string | null;
  /** 州/省 */
  ownerProvince?: string | null;
  /** 箱主简称 */
  shortName?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** dmn数据查询条件 */
export type dmn数据查询条件 = {
  /** 代码 */
  code?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
};

/** mdmNumberSegmentDTO */
export type mdmNumberSegmentDTO = {
  /** 主键id */
  id?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 结束号段 */
  endNo?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 号段正则规则 */
  rule?: string | null;
  /** 起始号段 */
  startNo?: string | null;
  /** 号段状态 */
  status?: number | null;
  /** 步长 */
  step?: number | null;
  /** 余量 */
  surplus?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 号段总量 */
  total?: number | null;
  /** 号段类型 */
  type?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** mdmNumberSegmentRequest */
export type mdmNumberSegmentRequest = {
  /** id */
  id?: number | null;
  /** 创建时间结束 */
  createTimeEnd?: number | null;
  /** 创建时间开始 */
  createTimeStart?: number | null;
  /** 结束号段 */
  endNo: string;
  /** 主键列表 */
  ids?: number[] | null;
  /** 页码 */
  pageNum: number;
  /** 页尺 */
  pageSize: number;
  /** 号段正则规则 */
  rule?: string | null;
  /** 排序 */
  sort?: string | null;
  /** 起始号段 */
  startNo: string;
  /** 号段状态 */
  status?: number | null;
  /** 步长 */
  step: number;
  /** 余量 */
  surplus?: number | null;
  /** 号段总量 */
  total?: number | null;
  /** 号段类型 */
  type?: number | null;
};

/** mdmNumberStoreDTO */
export type mdmNumberStoreDTO = {
  /** 主键id */
  id?: number | null;
  /** 业务id */
  businessId?: number | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 号码 */
  no?: string | null;
  /** 号段id */
  numberSegmentId?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 顺序 */
  order?: number | null;
  /** 状态 */
  status?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 版本 */
  version?: number | null;
};

/** memInfoQualificationReviewDTO */
export type memInfoQualificationReviewDTO = {
  /** 客户简称 */
  abbreviation?: string | null;
  /** 管理员中文名称 */
  adminUserChineseName?: string | null;
  /** 审核结果;0-待审核;1-审核通过;2-审核失败 */
  auditingStatus: number;
  /** 失败原因; 审核拒绝必须填写 */
  failureReason?: string | null;
  /** 会员id */
  memberId: number;
};

/** memMemberEnterpriseDTO */
export type memMemberEnterpriseDTO = {
  /** 主键id */
  id?: number | null;
  /** 客户简称 */
  abbreviation?: string | null;
  /** 银行账号 */
  bankAccount?: string | null;
  /** 开户行 */
  bankName?: string | null;
  /** 营业期限结束日期 */
  businessEndDate?: number | null;
  /** 社会信用统一代码 */
  businessLicenceNo?: string | null;
  /** 营业执照，照片地址 */
  businessLicense?: string | null;
  /** 营业执照，照片地址Url */
  businessLicenseUrl?: string | null;
  /** 经营范围 */
  businessScope?: string | null;
  /** 营业期限开始日期 */
  businessStartDate?: number | null;
  /** 中文名;用户实际的中文名，可以重名 */
  chineseName?: string | null;
  /** 法人手机号 */
  corporateMobile?: string | null;
  /** 法人姓名 */
  corporateName?: string | null;
  /** 企业电话 */
  corporateTelephone?: string | null;
  /** 国家 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名;用户实际的英文名，可以重名 */
  englishName?: string | null;
  /** 法人身份证反面照片 */
  identityCardBack?: string | null;
  /** 法人身份证反面照片Url */
  identityCardBackUrl?: string | null;
  /** 法人身份证照片 */
  identityCardFace?: string | null;
  /** 法人身份证照片Url */
  identityCardFaceUrl?: string | null;
  /** 法人身份证号 */
  identityCardNumber?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 数据来源平台(0-未知，1**-内部平台,2**-外部平台):null/0-未知,101-会员新增,201-天眼查 */
  platformFrom?: number | null;
  /** 数据来源平台对应的ID */
  platformFromId?: string | null;
  /** 注册地址 */
  registeredAddress?: string | null;
  /** 注册地址省市县 */
  registeredAddressNormalizedCode?: string | null;
  /** 注册地址省市县 */
  registeredAddressNormalizedName?: string | null;
  /** 注册资金（元） */
  registeredCapital?: number | null;
  /** 注册日期 */
  registeredDate?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** memMemberIndividualDTO */
export type memMemberIndividualDTO = {
  /** 主键id */
  id?: number | null;
  /** 出生日期 */
  birthday?: number | null;
  /** 中文名;用户实际的中文名，可以重名 */
  chineseName?: string | null;
  /** 联系电话 */
  contactMobile?: string | null;
  /** 国家 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名;用户实际的英文名，可以重名 */
  englishName?: string | null;
  /** 性别 Gender */
  gender?: number | null;
  /** 身份证反面 */
  identityCardBack?: string | null;
  /** 身份证反面Url */
  identityCardBackUrl?: string | null;
  /** 身份证正面 */
  identityCardFace?: string | null;
  /** 身份证正面Url */
  identityCardFaceUrl?: string | null;
  /** 身份证号 */
  identityCardNumber?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** memMemberInfoDTO */
export type memMemberInfoDTO = {
  /** 主键id */
  id?: number | null;
  /** 客户简称 */
  abbreviation?: string | null;
  /** 管理员名称 */
  adminUserChineseName?: string | null;
  /** 管理员用户ID */
  adminUserId?: number | null;
  /** 审核结果;0-未提交;1-待审核;2-审核通过;3-审核失败 */
  auditingStatus?: number | null;
  /** 审核结果;0-未提交;1-待审核;2-审核通过;3-审核失败 */
  auditingStatusName?: string | null;
  /** 会员中文名;会员实际的中文名，可以重名 */
  chineseName?: string | null;
  /** 国家 */
  countryCode?: string | null;
  /** 国家 */
  countryName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 客户来源类型 */
  customerSourceType?: number | null;
  /** defaultEnglishTitleFlag */
  defaultEnglishTitleFlag?: boolean | null;
  /** 邮箱;界面不允许直接修改，要通过绑定功能才能修改 */
  email?: string | null;
  /** 邮箱是否已经激活 */
  emailFlag?: boolean | null;
  /** 会员英文名;会员实际的英文名，可以重名 */
  englishName?: string | null;
  /** enterpriseDTO */
  enterpriseDTO?: memMemberEnterpriseDTO | null;
  /** 失败原因; 审核拒绝必须填写 */
  failureReason?: string | null;
  /** individualDTO */
  individualDTO?: memMemberIndividualDTO | null;
  /** initRoleIds */
  initRoleIds?: number[] | null;
  /** 手机;界面不允许直接修改，要通过绑定功能才能修改 */
  mobile?: string | null;
  /** 手机是否已经激活 */
  mobileFlag?: boolean | null;
  /** 昵称 */
  nick?: string | null;
  /** 会员编号 */
  no?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 注册时间 REGISTER_DATE */
  registeredDate?: number | null;
  /** 状态;0-无效(未激活);1-有效(激活);2 -已开通 */
  status?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 租户类型 0 未定，未认证时，类型为0  1 个人，仅有一个用户（子账号） 2 企业，允许有多个用户（子账号） */
  type?: number | null;
  /** 租户类型 0 未定，未认证时，类型为0  1 个人，仅有一个用户（子账号） 2 企业，允许有多个用户（子账号） */
  typeName?: string | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** messageActionDTO */
export type messageActionDTO = {
  /** 订阅动作code */
  subscribeActionCode: string;
  /** 订阅人id */
  subscriberId: number;
  /** 业务ID */
  targetId: number;
};

/** nfyReceiverDTO */
export type nfyReceiverDTO = {
  /** 主键id */
  id?: number | null;
  /** 订阅配置id不为空时,当前接收人是否已被设置为该订阅配置下的接收人 */
  checkFlag?: boolean | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 邮箱;界面不允许直接修改，要通过绑定功能才能修改 */
  email?: string | null;
  /** 邮箱是否验证 */
  emailFlag?: boolean | null;
  /** 手机;界面不允许直接修改，要通过绑定功能才能修改 */
  mobile?: string | null;
  /** 手机是否验证 */
  mobileFlag?: boolean | null;
  /** 中文名;用户实际的中文名，可以重名 */
  name?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 接收平台代码:1-运营;2-会员 */
  receivePlatformCode?: number | null;
  /** 接收人配置id */
  receiverConfigId?: number | null;
  /** 是否系统用户(0:否,1:是.系统用户不允许直接修改邮箱和手机号,只能通过更新用户同步,接收人必选) */
  systemUserFlag?: boolean | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 消息接收者 */
  userId?: number | null;
};

/** nfyUserNotifyDTO */
export type nfyUserNotifyDTO = {
  /** 消息的类型 1: 系统公告;2-业务消息 */
  notifyType?: number | null;
  /** 消息数量 */
  notifyTypeCount?: number | null;
  /** 通知类型 国际化名称 */
  notifyTypeName?: string | null;
};

/** notifyMessageParamDTO */
export type notifyMessageParamDTO = {
  /** 邮箱抄送人 */
  emailCc?: string[] | null;
  /** 邮件参数 */
  emailParams?: {
  } | null;
  /** 站内信参数 */
  msgParams?: {
  } | null;
  /** 短信参数 */
  smsParams?: {
  } | null;
  /** 订阅动作Code */
  subscribeActionCode: string;
  /** 微信参数 */
  wechatParams?: {
  } | null;
};

/** receiverDTO */
export type receiverDTO = {
  /** 主键id */
  id?: number | null;
  /** 中文名;用户实际的中文名，可以重名 */
  name?: string | null;
  /** 接收平台代码:1-运营;2-会员 */
  receivePlatformCode?: number | null;
  /** 消息接收者 */
  userId?: number | null;
};

/** receiverEditDTO */
export type receiverEditDTO = {
  /** id */
  id?: number | null;
  /** 邮箱;界面不允许直接修改，要通过绑定功能才能修改 */
  email?: string | null;
  /** 手机;界面不允许直接修改，要通过绑定功能才能修改 */
  mobile?: string | null;
  /** 中文名;用户实际的中文名，可以重名 */
  name: string;
};

/** report业务所属公司数据源 */
export type report业务所属公司数据源 = {
  /** 中文地址 */
  chineseAddress?: string | null;
  /** 中文名 */
  chineseName?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 英文地址 */
  englishAddress?: string | null;
  /** 英文名 */
  englishName?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 公司图标Logo */
  imageLogo?: string | null;
  /** 简称 */
  shortName?: string | null;
  /** 税号 */
  taxAccount?: string | null;
  /** 电话 */
  tel?: string | null;
  /** 网址 */
  url?: string | null;
  /** 邮编 */
  zipCode?: string | null;
};

/** syncReceiverDTO */
export type syncReceiverDTO = {
  /** 邮箱;界面不允许直接修改，要通过绑定功能才能修改 */
  email?: string | null;
  /** 邮箱(是否激活) */
  emailFlag?: boolean | null;
  /** 手机;界面不允许直接修改，要通过绑定功能才能修改 */
  mobile?: string | null;
  /** 手机(是否已经激活) */
  mobileFlag?: boolean | null;
  /** 中文名;用户实际的中文名，可以重名 */
  name?: string | null;
  /** 接收平台代码:1-运营;2-会员 */
  receivePlatformCode: number;
  /** 系统用户id */
  userId: number;
};

/** sysPrivilegeDTOReq */
export type sysPrivilegeDTOReq = {
  /** 是否控制数据权限 */
  bDataPrivilege: boolean;
  /** role--标志这个权限为身份,如操作客服;data---数据权限,查看同组编辑同组查看本公司编辑本公司查看集团编辑集团;其它---为功能权限 */
  category?: string | null;
  /** 代码 */
  code: string;
  /** 数据权限维度;多个用逗号隔开 */
  dataDimension?: string | null;
  /** 描述 */
  description?: string | null;
  /** 图标 */
  icon?: string | null;
  /** 名称 */
  name: string;
  /** 顺序号 */
  orderIndex?: number | null;
  /** 上级权限ID */
  parentPrivilegeId: number;
  /** 树形path */
  path?: string | null;
  /** 权限点 */
  point?: string | null;
  /** 权限组ID */
  privilegeGroupId?: number | null;
  /** 权限型 */
  shape?: string | null;
};

/** sysPrivilegeDTORes */
export type sysPrivilegeDTORes = {
  /** 主键id */
  id?: number | null;
  /** 是否控制数据权限 */
  bDataPrivilege?: boolean | null;
  /** role--标志这个权限为身份,如操作客服;data---数据权限,查看同组编辑同组查看本公司编辑本公司查看集团编辑集团;其它---为功能权限 */
  category?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 数据权限维度;多个用逗号隔开 */
  dataDimension?: string | null;
  /** 描述 */
  description?: string | null;
  /** 图标 */
  icon?: string | null;
  /** 名称 */
  name?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 顺序号 */
  orderIndex?: number | null;
  /** 上级权限ID */
  parentPrivilegeId?: number | null;
  /** 树形path */
  path?: string | null;
  /** 权限点 */
  point?: string | null;
  /** 权限组ID */
  privilegeGroupId?: number | null;
  /** 权限型 */
  shape?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** triggerActionDTO */
export type triggerActionDTO = {
  /** 触发产生消息参数 */
  actionMessageParams?: notifyMessageParamDTO[] | null;
  /** 订阅信息列表 */
  subscribeInfos: triggerSubscribeInfoDTO[];
  /** 业务ID */
  targetId: number;
  /** 目标的类型(入参不需要传) */
  targetTypeCode?: string | null;
  /** 提醒信息的动作类型(入参不需要传) */
  triggerActionCode?: string | null;
};

/** triggerSubscribeInfoDTO */
export type triggerSubscribeInfoDTO = {
  /** 订阅code */
  subscribeActionCode: string;
  /** 订阅者地址 */
  subscriberAddressList: string[];
  /** 订阅者类型;1-系统用户:订阅者id必需,订阅者地址为空;2 邮箱:订阅者地址记录邮箱地址,订阅者id为空;3- 手机:订阅者地址记录手机号,订阅者id为空 */
  subscriberType?: number | null;
  /** 订阅人ids */
  subscribers: number[];
};

/** urlMap列表DTO */
export type urlMap列表DTO = any;

/** urlMap新增DTO */
export type urlMap新增DTO = any;

/** urlMap更新DTO */
export type urlMap更新DTO = any;

/** urlMap详情DTO */
export type urlMap详情DTO = any;

/** 下拉框value值对应为short类型 */
export type 下拉框value值对应为short类型 = {
  /** 显示内容 */
  label?: string | null;
  /** 值 */
  value?: number | null;
};

/** 下拉框value值对应为string */
export type 下拉框value值对应为string = {
  /** 显示内容 */
  label?: string | null;
  /** 类型(如计费方式常规的job...和箱子CTNR) */
  type?: string | null;
  /** 值 */
  value?: string | null;
};

/** 业务模块客户属性信息 */
export type 业务模块客户属性信息 = {
  /** 客户等级 */
  customerLevel?: string | null;
  /** 到期日期 */
  periodEnd?: string | null;
  /** 结算方式 */
  settlementMode?: number | null;
  /** 结算方式 */
  settlementModeDesc?: string | null;
  /** 签约描述 */
  signDesc?: string | null;
};

/** 人员信息列表 */
export type 人员信息列表 = {
  /** 用户名称 */
  userId?: number | null;
  /** 用户名 */
  userName?: string | null;
};

/** 代码下拉框数据源 */
export type 代码下拉框数据源 = {
  /** 主键id */
  id?: number | null;
  /** 编码 */
  code?: string | null;
  /** 名称 */
  name?: string | null;
  /** 父级id */
  parentId?: number | null;
  /** 备注 */
  remark?: string | null;
  /** 序号 */
  sequence?: number | null;
};

/** 代码项下拉框数据源 */
export type 代码项下拉框数据源 = {
  /** 主键id */
  id?: number | null;
  /** 编码 */
  code?: string | null;
  /** 名称 */
  name?: string | null;
  /** 父级id */
  parentId?: number | null;
  /** 备注 */
  remark?: string | null;
  /** 序号 */
  sequence?: number | null;
};

/** 修改密码DTO */
export type 修改密码DTO = {
  /** 新密码 */
  newPassword: string;
  /** 老密码 */
  oldPassword: string;
};

/** 修改联系人DTO */
export type 修改联系人DTO = {
  /** 联系人:姓名、手机、邮件 */
  contact?: string | null;
};

/** 修改联系人用DTO */
export type 修改联系人用DTO = {
  /** nfy_user_reception_config.id */
  id: number;
  /** nfy_default_reception_config.id */
  defaultConfigId: number;
  /** 消息联系人ids */
  receiverIds?: number[] | null;
};

/** 全部待审批数量 */
export type 全部待审批数量 = {
  /** id */
  id?: number | null;
  /** 工作流代码 */
  flowCode?: string | null;
  /** 审批数量 */
  flowCount?: number | null;
  /** 工作流名称 */
  flowName?: string | null;
};

/** 公司组织架构 */
export type 公司组织架构 = {
  /** 公司or部门主键id */
  id?: number | null;
  /** 名称 */
  name?: string | null;
  /** 部门所属公司id */
  officeId?: number | null;
  /** 类型 0:公司;1:部门 */
  orgType?: number | null;
  /** parentId */
  parentId?: number | null;
  /** path树形路径 */
  path?: string | null;
  /** 排序号 */
  seqNo?: number | null;
  /** 简称 */
  shortName?: string | null;
  /** 用户数量 */
  userQuantity?: number | null;
};

/** 公司组织架构-可视化结构 */
export type 公司组织架构-可视化结构 = {
  /** 公司or部门主键id */
  id?: number | null;
  /** 是否是叶子节点 */
  bLeaf?: boolean | null;
  /** 是否是公司 */
  bOffice?: boolean | null;
  /** 是否是root根节点 */
  bRoot?: boolean | null;
  /** bleaf */
  bleaf?: boolean | null;
  /** boffice */
  boffice?: boolean | null;
  /** broot */
  broot?: boolean | null;
  /** children */
  children?: 公司组织架构-可视化结构[] | null;
  /** 是否展开 */
  expand?: boolean | null;
  /** 名称 */
  label?: string | null;
  /** 简称 */
  shortName?: string | null;
};

/** 公司详情页实体 */
export type 公司详情页实体 = {
  /** 主键id */
  id?: number | null;
  /** 空运提单地址 */
  airBlAddress?: string | null;
  /** 默认空运港口 */
  airPort?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 子节点 */
  childNodes?: SysOffice[] | null;
  /** 中文地址 */
  chineseAddress?: string | null;
  /** 中文名 */
  chineseName: string;
  /** 城市ID */
  cityCode?: string | null;
  /** 国家ID */
  countryCode?: string | null;
  /** 区县ID */
  countyCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 邮箱 */
  email?: string | null;
  /** 英文地址 */
  englishAddress?: string | null;
  /** 英文名 */
  englishName?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 公司Logo地址 */
  imageLogo?: string | null;
  /** 发票寄票地址 */
  invoiceAddress?: string | null;
  /** 发票开票抬头 */
  invoiceTitle?: string | null;
  /** 本位币 */
  localCurrency: string;
  /** 国内账单地址 */
  localDnAddress?: string | null;
  /** 代码 */
  officeCode: string;
  /** 数据操作url */
  optUrl?: string | null;
  /** 海外账单地址 */
  overseaDnAddress?: string | null;
  /** 上级公司id */
  parentOfficeId: number;
  /** 省州ID */
  province?: string | null;
  /** 海运提单地址 */
  seaBlAddress?: string | null;
  /** 默认海运港口 */
  seaPort?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 简称 */
  shortName?: string | null;
  /** 状态 */
  status?: number | null;
  /** 税号 */
  taxAccount?: string | null;
  /** 电话 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 网址 */
  url?: string | null;
  /** 员工数量 */
  userQuantity?: number | null;
  /** 邮编 */
  zipCode?: string | null;
};

/** 分配入参实体:用户分配角色,角色分配用户,角色分配权限,用户分配工作号编码规则 */
export type 分配入参实体:用户分配角色,角色分配用户,角色分配权限,用户分配工作号编码规则 = {
  /** 分配对象id */
  id?: number | null;
  /** 被分配idList */
  assignedIdList?: number[] | null;
};

/** 参数配置保存入参 */
export type 参数配置保存入参 = {
  /** 配置id */
  configId?: number | null;
  /** 配置值 */
  configValue: string;
  /** 配置值描述 */
  configValueDesc?: string | null;
  /** 分公司id */
  officeId: number;
  /** 页码 */
  pageNum: number;
  /** 页尺 */
  pageSize: number;
  /** 参数代码 */
  parameterCode: string;
  /** 排序 */
  sort?: string | null;
};

/** 参数配置复制入参 */
export type 参数配置复制入参 = {
  /** 源分公司id */
  sourceOfficeId: number;
  /** 目标分公司id */
  targetOfficeId: number;
};

/** 发送短信实体 */
export type 发送短信实体 = {
  /** 短信参数键值对 */
  paramsMap?: {
  } | null;
  /** 手机号码 */
  phoneNumbers?: string[] | null;
  /** 短信模板的id */
  smsTemplateId?: number | null;
};

/** 发送邮件实体 */
export type 发送邮件实体 = {
  /** 附件 */
  attachmentMap?: any | null;
  /** 密送人 */
  bcc?: string[] | null;
  /** 抄送人 */
  cc?: string[] | null;
  /** 使用公共模板发送邮件时的模板id */
  emailTemplateId?: number | null;
  /** html邮件内容 */
  html?: string | null;
  /** 在线附件 */
  inlineMap?: any | null;
  /** 使用公共模板发送邮件时的模板的参数 */
  parameters?: {
  } | null;
  /** 主题 */
  subject?: string | null;
  /** 文本邮件内容 */
  text?: string | null;
  /** 收件人 */
  to: string[];
};

/** 可以授权数据权限的用户 */
export type 可以授权数据权限的用户 = {
  /** 部门名称 */
  departmentName?: string | null;
  /** label */
  label?: string | null;
  /** 公司名称 */
  officeName?: string | null;
  /** 用户名 */
  userName?: string | null;
  /** 用户id */
  value?: number | null;
};

/** 基本request */
export type 基本request = {
  /** 页码 */
  pageNum: number;
  /** 页尺 */
  pageSize: number;
  /** 排序 */
  sort?: string | null;
};

/** 基本的可选项数据DTO«int» */
export type 基本的可选项数据DTO«int» = {
  /** 编码 */
  code?: number | null;
  /** 国际化文本Key */
  messageKey?: string | null;
  /** 国际化文本内容 */
  name?: string | null;
};

/** 基本的可选项数据DTO«string» */
export type 基本的可选项数据DTO«string» = {
  /** 编码 */
  code?: string | null;
  /** 国际化文本Key */
  messageKey?: string | null;
  /** 国际化文本内容 */
  name?: string | null;
};

/** 客商合同信息 */
export type 客商合同信息 = {
  /** 合约到期 */
  expireDate?: string | null;
  /** 首次签约 */
  firstSignDate?: string | null;
  /** 最新签约 */
  latestSignDate?: string | null;
  /** 距续约日 */
  validDay?: number | null;
};

/** 客商资料列表查询条件 */
export type 客商资料列表查询条件 = {
  /** 客商简称 */
  abbreviation?: string | null;
  /** 客商状态 */
  acceptStatus?: number | null;
  /** 中文名 */
  chineseName?: string | null;
  /** 城市 */
  cityCode?: string | null;
  /** 国家 */
  countryCode?: string | null;
  /** 创建时间截止日 */
  createTimeEnd?: number | null;
  /** 创建时间起始日 */
  createTimeStart?: number | null;
  /** 客服人员 */
  csById?: number | null;
  /** 客户等级 */
  customerLevel?: string | null;
  /** 英文名 */
  englishName?: string | null;
  /** 简单查询通用条件key */
  keyword?: string | null;
  /** 客商助记码 */
  mnemonic?: string | null;
  /** 分公司id */
  officeId?: number | null;
  /** pageRequest */
  pageRequest?: 基本request | null;
  /** 省份 */
  province?: string | null;
  /** 客户类型 客户,船公司 ... */
  range?: string[] | null;
  /** 客户类型拼接条件sql */
  rangeCondition?: string | null;
  /** 销售人员 */
  saleById?: number | null;
  /** 结算方式 */
  settlementMode?: number | null;
  /** 租户id */
  tenantId?: number | null;
};

/** 客商资料合并入参 */
export type 客商资料合并入参 = {
  /** 被合并客商id */
  beMergedIdList?: string[] | null;
  /** 合并目标客商id */
  targetId: number;
  /** 租户id */
  tenantId?: number | null;
};

/** 客商资料详细页信息Req */
export type 客商资料详细页信息Req = {
  /** 主键id */
  id?: number | null;
  /** 客商简称 */
  abbreviation: string;
  /** 审核人 */
  acceptBy?: number | null;
  /** 审核日期 */
  acceptDate?: number | null;
  /** 审核状态 */
  acceptStatus?: number | null;
  /** 审核状态描述 */
  acceptStatusDesc?: string | null;
  /** 客商地址信息 */
  addressInfoList?: PnrAddressInfo[] | null;
  /** 空运提单地址 */
  airBlAddress?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 航空公司 */
  bAirway?: boolean | null;
  /** 驳船公司 */
  bBarge?: boolean | null;
  /** 是否黑名单 */
  bBlacklist?: boolean | null;
  /** 订舱代理 */
  bBookingAgent?: boolean | null;
  /** 客户 */
  bCustomer?: boolean | null;
  /** 报关行 */
  bCustomsBroker?: boolean | null;
  /** 目的港代理 */
  bDestinationAgent?: boolean | null;
  /** 快递公司 */
  bExpress?: boolean | null;
  /** 所属公司是否为总部 */
  bHeadQuarters?: boolean | null;
  /** 保险公司 */
  bInsurance?: boolean | null;
  /** 国内代理 */
  bLocalAgent?: boolean | null;
  /** 指定货代理 */
  bNominatedAgent?: boolean | null;
  /** 其他 */
  bOther?: boolean | null;
  /** 是否共享 */
  bShare?: boolean | null;
  /** 船公司 */
  bShipowner?: boolean | null;
  /** 发货单位 */
  bShipper?: boolean | null;
  /** 船代 */
  bShippingAgent?: boolean | null;
  /** 场站 */
  bStation?: boolean | null;
  /** 车队 */
  bTrucks?: boolean | null;
  /** 仓库 */
  bWarehouse?: boolean | null;
  /** 客商银行账户;账号+币种唯一 */
  bankAccountList?: PnrBankAccount[] | null;
  /** bheadQuarters */
  bheadQuarters?: boolean | null;
  /** 客商中文地址 */
  chineseAddress?: string | null;
  /** 客商中文全名 */
  chineseName?: string | null;
  /** 城市 */
  cityCode?: string | null;
  /** 客商联系人 */
  contactList?: PnrContact[] | null;
  /** 国家 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** customer */
  customer?: PnrCustomer | null;
  /** 客户凭证代码 */
  customerVoucherCode?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 客商英文地址 */
  englishAddress?: string | null;
  /** 客商英文全名 */
  englishName?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 集团代码 */
  groupCode?: string | null;
  /** 客商开票资料 */
  invoiceInfoList?: PnrInvoiceInfo[] | null;
  /** 法人代表 */
  legalRepresentative?: string | null;
  /** 客商助记码 */
  mnemonic: string;
  /** 所属公司id */
  officeId?: number | null;
  /** 所属公司多个 */
  officeIdList?: number[] | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 省份 */
  province?: string | null;
  /** 注册资金 */
  registeredCapital?: number | null;
  /** 社会信用代码 */
  registrationNum?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 海运提单地址 */
  seaBlAddress?: string | null;
  /** 客商服务要求 */
  serviceRequireList?: PnrServiceRequire[] | null;
  /** 电话;umn_20 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 网址 */
  url?: string | null;
  /** 供应商凭证代码 */
  vendorVoucherCode?: string | null;
  /** 邮政编码 */
  zipCode?: string | null;
};

/** 客商资料详细页信息Res */
export type 客商资料详细页信息Res = {
  /** 主键id */
  id?: number | null;
  /** 客商简称 */
  abbreviation: string;
  /** 审核人 */
  acceptBy?: number | null;
  /** 审核日期 */
  acceptDate?: number | null;
  /** 审核状态 */
  acceptStatus?: number | null;
  /** 审核状态描述 */
  acceptStatusDesc?: string | null;
  /** 空运提单地址 */
  airBlAddress?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 航空公司 */
  bAirway?: boolean | null;
  /** 驳船公司 */
  bBarge?: boolean | null;
  /** 是否黑名单 */
  bBlacklist?: boolean | null;
  /** 订舱代理 */
  bBookingAgent?: boolean | null;
  /** 客户 */
  bCustomer?: boolean | null;
  /** 报关行 */
  bCustomsBroker?: boolean | null;
  /** 目的港代理 */
  bDestinationAgent?: boolean | null;
  /** 快递公司 */
  bExpress?: boolean | null;
  /** 保险公司 */
  bInsurance?: boolean | null;
  /** 国内代理 */
  bLocalAgent?: boolean | null;
  /** 指定货代理 */
  bNominatedAgent?: boolean | null;
  /** 其他 */
  bOther?: boolean | null;
  /** 是否共享 */
  bShare?: boolean | null;
  /** 船公司 */
  bShipowner?: boolean | null;
  /** 发货单位 */
  bShipper?: boolean | null;
  /** 船代 */
  bShippingAgent?: boolean | null;
  /** 场站 */
  bStation?: boolean | null;
  /** 车队 */
  bTrucks?: boolean | null;
  /** 仓库 */
  bWarehouse?: boolean | null;
  /** 客商中文地址 */
  chineseAddress?: string | null;
  /** 客商中文全名 */
  chineseName?: string | null;
  /** 城市 */
  cityCode?: string | null;
  /** 国家 */
  countryCode?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** customer */
  customer?: PnrCustomer | null;
  /** 客户凭证代码 */
  customerVoucherCode?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 客商英文地址 */
  englishAddress?: string | null;
  /** 客商英文全名 */
  englishName?: string | null;
  /** 传真 */
  fax?: string | null;
  /** 集团代码 */
  groupCode?: string | null;
  /** 法人代表 */
  legalRepresentative?: string | null;
  /** 客商助记码 */
  mnemonic: string;
  /** 所属公司id */
  officeId?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 客户类型 */
  partnerTypeDesc?: string | null;
  /** 省份 */
  province?: string | null;
  /** 注册资金 */
  registeredCapital?: number | null;
  /** 社会信用代码 */
  registrationNum?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 海运提单地址 */
  seaBlAddress?: string | null;
  /** 电话;umn_20 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 网址 */
  url?: string | null;
  /** 供应商凭证代码 */
  vendorVoucherCode?: string | null;
  /** 邮政编码 */
  zipCode?: string | null;
};

/** 工作流类型-平台级别 */
export type 工作流类型-平台级别 = {
  /** id */
  id?: number | null;
  /** 业务实体类型;如1、job;2、office */
  entityType?: string | null;
  /** 工作流代码 */
  flowCode?: string | null;
  /** 工作流名称 */
  flowName?: string | null;
  /** 工作流类型;1审核流程2工作协同; */
  flowType?: number | null;
  /** 租户id;仅存公共数据，tenant_id全部为0 */
  tenantId?: number | null;
};

/** 常用-最近-所有-下拉选项模型«DmnCountrySelectionDTO» */
export type 常用-最近-所有-下拉选项模型«DmnCountrySelectionDTO» = {
  /** 所有 */
  all?: DmnCountrySelectionDTO[] | null;
  /** 常用 */
  frequent?: DmnCountrySelectionDTO[] | null;
  /** 最近 */
  latest?: DmnCountrySelectionDTO[] | null;
};

/** 当前登录用户redis存储用户详细信息 */
export type 当前登录用户redis存储用户详细信息 = {
  /** 用户ID */
  id?: number | null;
  /** 系统ID（1-运营，2-会员，3-中台...） */
  aId?: number | null;
  /** 默认空港 */
  airPort?: string | null;
  /** 生日 */
  birthday?: number | null;
  /** 用户中文名称 */
  chineseName?: string | null;
  /** 所属部门id */
  departmentId?: number | null;
  /** 所属部门名称 */
  departmentName?: string | null;
  /** email */
  email?: string | null;
  /** fax */
  fax?: string | null;
  /** 租户一级公司(总公司)id */
  headOfficeId?: number | null;
  /** 本位币 */
  localCurrency?: string | null;
  /** 会员ID */
  mId?: number | null;
  /** 会员名称 */
  mName?: string | null;
  /** mobile */
  mobile?: string | null;
  /** 用户名 */
  name?: string | null;
  /** 所属分公司id */
  officeId?: number | null;
  /** 所属分公司名称 */
  officeName?: string | null;
  /** 数据权限 */
  permissionMap?: any | null;
  /** 功能权限 */
  privilegeCodeList?: string[] | null;
  /** 角色CODE列表 */
  rls?: string[] | null;
  /** 海运提单地址 */
  seaBlAddress?: string | null;
  /** 默认海港 */
  seaPort?: string | null;
  /** 性别:1-男,2女 */
  sex?: number | null;
  /** 租户ID */
  tId?: number | null;
  /** tel */
  tel?: string | null;
  /** 类型 */
  type?: number | null;
};

/** 微信openId登录token */
export type 微信openId登录token = {
  /** openId */
  openId: string;
};

/** 微信登录并绑定openId */
export type 微信登录并绑定openId = {
  /** openId */
  openId: string;
};

/** 我司地址,联系人信息及其他信息 */
export type 我司地址,联系人信息及其他信息 = {
  /** 银行账号 */
  bankAccountNo?: string | null;
  /** 银行 */
  bankName?: string | null;
  /** 中文地址 */
  chineseAddress?: string | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 邮箱 */
  email?: string | null;
  /** 英文地址 */
  englishAddress?: string | null;
  /** 传真 */
  fax?: string | null;
  /** (租户公司的)发票开票抬头 */
  invTitle?: string | null;
  /** 纳税人识别号 */
  taxNum?: string | null;
  /** 电话 */
  tel?: string | null;
};

/** 打印报表数据源条件参数 */
export type 打印报表数据源条件参数 = {
  /** 辅助条件参数 */
  assistInfo?: string | null;
  /** 自定义信息(根据需要填写json,eg:回调打印时返回信息) */
  definedInfo?: {
  } | null;
  /** 打印业务id */
  entityIdList?: number[] | null;
  /** jobId */
  jobId?: number | null;
  /** 查询条件json */
  queryConditionJson?: {
  } | null;
  /** 备注 */
  remark?: string | null;
};

/** 批量修改联系人用DTO */
export type 批量修改联系人用DTO = {
  /** 消息联系人ids */
  receiverIds?: number[] | null;
  /** configId,defaultConfigId */
  userReceiverConfigList: 修改联系人用DTO[];
};

/** 文件批量保存request */
export type 文件批量保存request = {
  /** 云服务器文件名称(唯一id+后缀) */
  cloudFileName: string;
  /** 文件类型代码;文件归类，在界面上显示文件归档时显示文件的类型，如job上的历史文件的类型 */
  documentTypeCode?: string | null;
  /** 业务实体id;关联的业务实体id，如job的历史文件 */
  entityId?: number | null;
  /** 业务实体类型 */
  entityType?: string | null;
  /** 业务实体对应文件类型代码 */
  fieldCode?: string | null;
  /** 文件大小 */
  fileSize?: number | null;
  /** 源文件名 */
  originFileName: string;
  /** 文件来源默认 upload */
  sourceType?: string | null;
  /** 上传人Id */
  uploadBy?: number | null;
  /** 上传人名 */
  uploadByName?: string | null;
  /** 上传时间 */
  uploadTime?: number | null;
  /** 云服务器路径有效期24小时 */
  url?: string | null;
};

/** 文件批量保存request0 */
export type 文件批量保存request0 = {
  /** 云服务器文件名称(唯一id+后缀) */
  cloudFileName: string;
  /** 文件类型代码;文件归类，在界面上显示文件归档时显示文件的类型，如job上的历史文件的类型 */
  documentTypeCode?: string | null;
  /** 业务实体id;关联的业务实体id，如job的历史文件 */
  entityId?: number | null;
  /** 业务实体类型 */
  entityType?: string | null;
  /** 业务实体对应文件类型代码 */
  fieldCode?: string | null;
  /** 文件大小 */
  fileSize?: number | null;
  /** 源文件名 */
  originFileName: string;
  /** 文件来源默认 upload */
  sourceType?: string | null;
  /** 上传人Id */
  uploadBy?: number | null;
  /** 上传人名 */
  uploadByName?: string | null;
  /** 上传时间 */
  uploadTime?: number | null;
  /** 云服务器路径有效期24小时 */
  url?: string | null;
};

/** 文件批量删除DTO */
export type 文件批量删除DTO = {
  /** cloudFileNames */
  cloudFileNames?: string[] | null;
  /** 业务实体类型 */
  documentTypeCode?: string | null;
  /** 业务实体id;关联的业务实体id，如job的历史文件 */
  entityId?: number | null;
  /** 业务实体类型 */
  entityType?: string | null;
  /** 业务实体对应文件类型 */
  fieldCode?: string | null;
};

/** 更新联系人 */
export type 更新联系人 = {
  /** 联系人:姓名、手机、邮件 */
  contact?: string | null;
  /** 联系人:姓名、手机、邮件的激活状态 */
  contactFlag?: boolean | null;
};

/** 本地企业库下拉 */
export type 本地企业库下拉 = {
  /** 主键 */
  id?: number | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 英文名称 */
  englishName?: string | null;
};

/** 本地企业库详情 */
export type 本地企业库详情 = {
  /** 主键 */
  id?: number | null;
  /** 客户简称 */
  abbreviation?: string | null;
  /** 营业期限结束日期 */
  businessEndDate?: number | null;
  /** 社会信用统一代码 */
  businessLicenceNo?: string | null;
  /** 经营范围 */
  businessScope?: string | null;
  /** 营业期限开始日期 */
  businessStartDate?: number | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 法人姓名 */
  corporateName?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 数据来源平台(0-未知，1**-内部平台,2**-外部平台):null/0-未知,101-会员新增,201-天眼查 */
  platformFrom?: number | null;
  /** 注册状态 */
  regStatus?: string | null;
  /** 注册地址 */
  registeredAddress?: string | null;
  /** 注册地址省市县CODE */
  registeredAddressNormalizedCode?: string | null;
  /** 注册地址省市县名称 */
  registeredAddressNormalizedName?: string | null;
  /** 注册资金（元） */
  registeredCapital?: number | null;
  /** 注册日期 */
  registeredDate?: number | null;
};

/** 根据entityId更新请求 */
export type 根据entityId更新请求 = {
  /** 文件类型代码;文件归类，在界面上显示文件归档时显示文件的类型，如job上的历史文件的类型 */
  documentTypeCode?: string | null;
  /** 业务实体id;关联的业务实体id，如job的历史文件 */
  entityId: number;
  /** 业务实体类型 */
  entityType?: string | null;
  /** 文件来源 */
  sourceType?: string | null;
};

/** 根据单据列表批量获取文件 */
export type 根据单据列表批量获取文件 = {
  /** 业务实体id */
  entityIds?: number[] | null;
  /** 业务实体类型 */
  entityType?: string | null;
};

/** 根据单据获取文件 */
export type 根据单据获取文件 = {
  /** 业务实体id */
  entityId?: number | null;
  /** 业务实体类型 */
  entityType?: string | null;
  /** 云存储Bucket Name */
  storageBucketName?: string | null;
};

/** 汇率列表 */
export type 汇率列表 = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否内陆港口 */
  bInland?: boolean | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 城市code */
  cityCode?: string | null;
  /** 城市描述 */
  cityDesc?: string | null;
  /** 三字码 */
  code3?: string | null;
  /** 五字码 */
  code5?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
  /** 国家名称 */
  countryName?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 经度 */
  latitude?: number | null;
  /** 航线code */
  lineCode?: string | null;
  /** 纬度 */
  longitude?: number | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 辖区id */
  subdivisionId?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 时区 */
  timeZone?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 消息列表出参 */
export type 消息列表出参 = {
  /** 主键id */
  id?: number | null;
  /** 消息业务类型 */
  bizType?: string | null;
  /** 消息时间 */
  createTime?: number | null;
  /** 消息标题 */
  notifyTitle?: string | null;
  /** 消息的类型 1: 系统公告;2-业务消息 */
  notifyType?: number | null;
  /** 通知类型 国际化名称 */
  notifyTypeName?: string | null;
  /** 是否已读 */
  readFlag?: boolean | null;
  /** 发送人 */
  sender?: string | null;
};

/** 消息详情 */
export type 消息详情 = {
  /** 主键id */
  id?: number | null;
  /** 消息业务类型 */
  bizType?: string | null;
  /** 消息时间 */
  createTime?: number | null;
  /** 消息的内容 */
  notifyContent?: string | null;
  /** 消息标题 */
  notifyTitle?: string | null;
  /** 消息的类型 1: 系统公告;2-业务消息 */
  notifyType?: number | null;
  /** 通知类型 国际化名称 */
  notifyTypeName?: string | null;
  /** 是否已读 */
  readFlag?: boolean | null;
  /** 发送人 */
  sender?: string | null;
};

/** 港口下拉列表 */
export type 港口下拉列表 = {
  /** 主键id */
  id?: number | null;
  /** 是否被选中 */
  checked?: boolean | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 三字码 */
  code3?: string | null;
  /** 五字码 */
  code5?: string | null;
  /** 英文全称 */
  englishName?: string | null;
};

/** 港口下拉框数据源 */
export type 港口下拉框数据源 = {
  /** id */
  id?: number | null;
  /** 中文全称 */
  chineseName?: string | null;
  /** 城市代码 */
  cityCode?: string | null;
  /** 城市描述 */
  cityDesc?: string | null;
  /** 三字码 */
  code3?: string | null;
  /** 五字码 */
  code5?: string | null;
  /** 国家代码 */
  countryCode?: string | null;
  /** 英文全称 */
  englishName?: string | null;
  /** 航线code */
  lineCode?: string | null;
};

/** 物流公司下拉数据DTO */
export type 物流公司下拉数据DTO = {
  /** 公司ID */
  id?: number | null;
  /** 中文全称;如太平洋船务有限公司 */
  chineseName?: string | null;
  /** 中文简称;如太平洋船务 */
  chineseShortname?: string | null;
  /** 英文全称;如PacificInternationalLines; */
  englishName?: string | null;
  /** 英文简称;如PIL */
  englishShortname?: string | null;
  /** SCAC代码 */
  scacCode?: string | null;
  /** shortname */
  shortname?: string | null;
  /** 运输方式：快递express卡车truck铁路railway拖车container_truck，多个以逗号隔开; */
  transportMode?: string | null;
};

/** 用户Token */
export type 用户Token = {
  /** accessToken */
  accessToken?: string | null;
  /** expiresIn */
  expiresIn?: number | null;
  /** refreshToken */
  refreshToken?: string | null;
};

/** 用户token相关信息 */
export type 用户token相关信息 = {
  /** 用户ID */
  id?: number | null;
  /** 系统ID（1-运营，2-会员，3-中台...） */
  aId?: number | null;
  /** 默认空港 */
  airPort?: string | null;
  /** 生日 */
  birthday?: number | null;
  /** 用户中文名称 */
  chineseName?: string | null;
  /** 所属部门id */
  departmentId?: number | null;
  /** 所属部门名称 */
  departmentName?: string | null;
  /** email */
  email?: string | null;
  /** fax */
  fax?: string | null;
  /** 租户一级公司(总公司)id */
  headOfficeId?: number | null;
  /** 本位币 */
  localCurrency?: string | null;
  /** 会员ID */
  mId?: number | null;
  /** 会员名称 */
  mName?: string | null;
  /** mobile */
  mobile?: string | null;
  /** 用户名 */
  name?: string | null;
  /** 所属分公司id */
  officeId?: number | null;
  /** 所属分公司名称 */
  officeName?: string | null;
  /** 角色CODE列表 */
  rls?: string[] | null;
  /** 海运提单地址 */
  seaBlAddress?: string | null;
  /** 默认海港 */
  seaPort?: string | null;
  /** 性别:1-男,2女 */
  sex?: number | null;
  /** 租户ID */
  tId?: number | null;
  /** tel */
  tel?: string | null;
  /** 类型 */
  type?: number | null;
};

/** 用户分配角色列表&明细页实体 */
export type 用户分配角色列表&明细页实体 = {
  /** 主键id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否归属当前用户 */
  bAssigned?: boolean | null;
  /** 是否系统级角色 */
  bSystem?: boolean | null;
  /** bassigned */
  bassigned?: boolean | null;
  /** 角色编码 */
  code: string;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 角色描述 */
  description?: string | null;
  /** 角色名称 */
  name: string;
  /** 数据操作url */
  optUrl?: string | null;
  /** 被复制的角色id */
  roleIdToBeCopied?: number | null;
  /** 状态 */
  status?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 用户列表及详细信息 */
export type 用户列表及详细信息 = {
  /** 主键id */
  id?: number | null;
  /** 地址 */
  address?: string | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否有效 */
  bActiveDesc?: string | null;
  /** bAdministrator */
  bAdministrator?: boolean | null;
  /** 是否归属当前角色 */
  bAssigned?: boolean | null;
  /** bAuthorizer */
  bAuthorizer?: boolean | null;
  /** 生日:MM-dd */
  birthdate?: string | null;
  /** 生日 */
  birthday?: number | null;
  /** 中文名 */
  chineseName: string;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 所属部门ID */
  departmentId: number;
  /** 所属部门 */
  departmentName?: string | null;
  /** 邮箱 */
  email: string;
  /** 英文名 */
  englishName: string;
  /** 分机号 */
  extNum?: string | null;
  /** 用户传真 */
  fax?: string | null;
  /** 手机 */
  mobile: string;
  /** 所属公司ID */
  officeId: number;
  /** 所属公司 */
  officeName?: string | null;
  /** 所属公司简称 */
  officeShortName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 用户密码 */
  password: string;
  /** qq */
  qq?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 性别:1-男,2女 */
  sex?: number | null;
  /** 状态 */
  status?: number | null;
  /** 用户电话 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 用户名 */
  userName: string;
  /** 微信 */
  wechat?: string | null;
};

/** 用户密码修改入参 */
export type 用户密码修改入参 = {
  /** 是否校验旧密码 */
  bCheckOldPassword?: boolean | null;
  /** bcheckOldPassword */
  bcheckOldPassword?: boolean | null;
  /** 新密码 */
  newPassword: string;
  /** 旧密码 */
  oldPassword: string;
  /** 用户Id */
  userId?: number | null;
};

/** 用户接收配置(查询用)DTO */
export type 用户接收配置(查询用)DTO = {
  /** 订阅类型列表 */
  subscribeActions?: SubscribeActionConfigDTO[] | null;
  /** 目标类型代码 */
  targetTypeCode?: string | null;
  /** 目标类型名称 */
  targetTypeName?: string | null;
};

/** 用户接收配置(编辑用)DTO */
export type 用户接收配置(编辑用)DTO = {
  /** 主键id */
  id: number;
  /** nfy_default_reception_config.id */
  defaultConfigId: number;
  /** 邮件通知是否允许修改;0-不允许,1-允许 */
  emailEnable?: boolean | null;
  /** 是否发邮件 */
  emailFlag?: boolean | null;
  /** 站内信通知是否允许修改;0-不允许,1-允许 */
  messageEnable?: boolean | null;
  /** 是否发站内消息 */
  messageFlag?: boolean | null;
  /** 接收人列表 */
  receivers?: receiverDTO[] | null;
  /** 短信通知是否允许修改;0-不允许,1-允许 */
  smsEnable?: boolean | null;
  /** 是否发短信 */
  smsFlag?: boolean | null;
  /** 订阅动作代码 */
  subscribeActionCode?: string | null;
  /** 订阅动作名称 */
  subscribeActionName?: string | null;
  /** 订阅者id */
  subscriberId?: number | null;
  /** 目标类型代码 */
  targetTypeCode?: string | null;
  /** 目标类型名称 */
  targetTypeName?: string | null;
  /** 是否发公众号 */
  wechatFlag?: boolean | null;
};

/** 用户职能实体 */
export type 用户职能实体 = {
  /** 是否归属 */
  bAssigned?: boolean | null;
  /** 职能代码 */
  dutyCode?: string | null;
  /** 职能名称 */
  dutyName?: string | null;
};

/** 用户详细实体 */
export type 用户详细实体 = {
  /** 主键id */
  id?: number | null;
  /** 地址 */
  address?: string | null;
  /** appId */
  appId?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否有效 */
  bActiveDesc?: string | null;
  /** bAdministrator */
  bAdministrator?: boolean | null;
  /** 是否归属当前角色 */
  bAssigned?: boolean | null;
  /** bAuthorizer */
  bAuthorizer?: boolean | null;
  /** 生日 */
  birthday?: number | null;
  /** 中文名 */
  chineseName: string;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 所属部门ID */
  departmentId: number;
  /** 所属部门 */
  departmentName?: string | null;
  /** 邮箱 */
  email: string;
  /** 英文名 */
  englishName: string;
  /** 分机号 */
  extNum?: string | null;
  /** 用户传真 */
  fax?: string | null;
  /** 手机 */
  mobile: string;
  /** 所属公司ID */
  officeId: number;
  /** 所属公司 */
  officeName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 用户密码 */
  password: string;
  /** qq */
  qq?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 状态 */
  status?: number | null;
  /** 用户电话 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 用户名 */
  userName: string;
  /** 微信 */
  wechat?: string | null;
};

/** 用户详细页及保存入参实体 */
export type 用户详细页及保存入参实体 = {
  /** 主键id */
  id?: number | null;
  /** 地址 */
  address?: string | null;
  /** appId */
  appId?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否有效 */
  bActiveDesc?: string | null;
  /** bAdministrator */
  bAdministrator?: boolean | null;
  /** 是否归属当前角色 */
  bAssigned?: boolean | null;
  /** bAuthorizer */
  bAuthorizer?: boolean | null;
  /** 生日:MM-dd */
  birthdate?: string | null;
  /** 生日 */
  birthday?: number | null;
  /** 中文名 */
  chineseName: string;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 所属部门ID */
  departmentId: number;
  /** 所属部门 */
  departmentName?: string | null;
  /** 邮箱 */
  email: string;
  /** 英文名 */
  englishName: string;
  /** 分机号 */
  extNum?: string | null;
  /** 用户传真 */
  fax?: string | null;
  /** 手机 */
  mobile: string;
  /** 所属公司ID */
  officeId: number;
  /** 所属公司 */
  officeName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 用户密码 */
  password: string;
  /** qq */
  qq?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 性别:1-男,2女 */
  sex?: number | null;
  /** 状态 */
  status?: number | null;
  /** 用户类型list */
  sysUserDutyList?: 用户职能实体[] | null;
  /** 用户电话 */
  tel?: string | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
  /** 用户名 */
  userName: string;
  /** 微信 */
  wechat?: string | null;
};

/** 站内信发送业务消息 */
export type 站内信发送业务消息 = {
  /** 主键id */
  id?: number | null;
  /** 业务类型 */
  bizType: string;
  /** 消息内容 */
  content: string;
  /** 消息时间 */
  messageTime?: number | null;
  /** 接收人 */
  toId: number;
  /** 接收人 */
  toName?: string | null;
};

/** 站内信消息 内容 */
export type 站内信消息 内容 = {
  /** 主键id */
  id: number;
  /** 消息内容 */
  content: string;
  /** 消息内容 文本类型 */
  contentType?: string | null;
  /** 发送人 */
  fromId?: number | null;
  /** 发送人 */
  fromName?: string | null;
  /** 消息时间 */
  messageTime: number;
  /** 通知类型 国际化名称 */
  notifyTypeName?: string | null;
  /** 发送时间 */
  sendTime?: number | null;
  /** 消息主题 */
  title?: string | null;
  /** 接收人 */
  toId: number;
  /** 接收人 */
  toName: string;
  /** 未读消息数量 */
  unReadNum?: number | null;
};

/** 第三方 通用文件上传请求DTO */
export type 第三方 通用文件上传请求DTO = {
  /** 文件类型代码;文件归类，在界面上显示文件归档时显示文件的类型，如job上的历史文件的类型 */
  documentTypeCode: string;
  /** 业务实体类型 */
  entityType: string;
  /** 文件Base64转码后的值 */
  fileBase64: string;
  /** 文件大小 */
  fileSize: number;
  /** 源文件名 */
  originalFileName: string;
  /** 文件来源 */
  sourceType: string;
};

/** 第三方企业库下拉 */
export type 第三方企业库下拉 = {
  /** 主键 */
  id?: {
  } | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 英文名称 */
  englishName?: string | null;
};

/** 第三方企业库详情 */
export type 第三方企业库详情 = {
  /** 主键 */
  id?: number | null;
  /** 客户简称 */
  abbreviation?: string | null;
  /** 营业期限结束日期 */
  businessEndDate?: number | null;
  /** 社会信用统一代码 */
  businessLicenceNo?: string | null;
  /** 经营范围 */
  businessScope?: string | null;
  /** 营业期限开始日期 */
  businessStartDate?: number | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 法人姓名 */
  corporateName?: string | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 数据来源平台(0-未知，1**-内部平台,2**-外部平台):null/0-未知,101-会员新增,201-天眼查 */
  platformFrom?: number | null;
  /** 注册状态 */
  regStatus?: string | null;
  /** 注册地址 */
  registeredAddress?: string | null;
  /** 注册地址省市县CODE */
  registeredAddressNormalizedCode?: string | null;
  /** 注册地址省市县名称 */
  registeredAddressNormalizedName?: string | null;
  /** 注册资金（元） */
  registeredCapital?: number | null;
  /** 注册日期 */
  registeredDate?: number | null;
};

/** 管理员更新用户密码 */
export type 管理员更新用户密码 = {
  /** 密码 */
  password?: string | null;
};

/** 结算单位发票税号地址及其他信息 */
export type 结算单位发票税号地址及其他信息 = {
  /** 地址 */
  address?: string | null;
  /** 银行账号 */
  bankAccount?: string | null;
  /** 开户银行 */
  bankName?: string | null;
  /** 发票抬头 */
  invoiceTitle?: string | null;
  /** 寄票地址 */
  sendAddress?: string | null;
  /** 纳税人识别号 */
  taxNo?: string | null;
  /** 电话 */
  tel?: string | null;
};

/** 编码规则列表及详细页 */
export type 编码规则列表及详细页 = {
  /** id */
  id?: number | null;
  /** 是否启用 */
  bActive?: boolean | null;
  /** 是否显示分配用户 */
  bShowAssignUser?: boolean | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 当前流水值 */
  currentSequence?: string | null;
  /** 编码类型 */
  identifierType?: string | null;
  /** 编码类型描述 */
  identifierTypeDesc?: string | null;
  /** 分公司id */
  officeId?: number | null;
  /** 分公司名称 */
  officeName?: string | null;
  /** 重置方式 */
  resetType?: string | null;
  /** 归零方式描述 */
  resetTypeDesc?: string | null;
  /** 编号代码 */
  ruleCode?: string | null;
  /** 规则表达式 */
  ruleExpression?: string | null;
  /** 编码规则说明 */
  ruleRemark?: string | null;
  /** 编号简称 */
  shortName?: string | null;
  /** 起始号, 默认为1 */
  startSeq?: number | null;
  /** 租户id */
  tenantId?: number | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 编码规则详细页初始加载内容 */
export type 编码规则详细页初始加载内容 = {
  /** 编码类型 */
  identifierTypeList?: 下拉框value值对应为string[] | null;
  /** 分公司下拉框List */
  officeList?: 下拉框value值对应为string[] | null;
  /** 通用规则表达式 */
  ruleExpressionCommonList?: 下拉框value值对应为string[] | null;
  /** 高级规则表达式 */
  ruleExpressionSeniorList?: 下拉框value值对应为string[] | null;
  /** 归零方式 */
  sequenceResetTypeList?: 下拉框value值对应为string[] | null;
};

/** 联系人状态更新 */
export type 联系人状态更新 = {
  /** 状态 */
  status?: number | null;
};

/** 获取参数配置入参 */
export type 获取参数配置入参 = {
  /** 分公司id */
  officeId: number;
  /** 参数代码 */
  parameterCode: string;
};

/** 获取审批历史查询条件 */
export type 获取审批历史查询条件 = {
  /** 审批时间截止日 */
  approveTimeEnd?: number | null;
  /** 审批时间起始日 */
  approveTimeStart?: number | null;
  /** 工作流代码 */
  flowCode?: string | null;
  /** 审批时间类型:1:今天,2:近一周,3:近1月,4:自定义 */
  timeRange?: number | null;
};

/** 菜单树形 */
export type 菜单树形 = {
  /** id */
  id?: number | null;
  /** 子树 */
  children?: 菜单树形[] | null;
  /** 编码 */
  code?: string | null;
  /** favorite */
  favorite?: boolean | null;
  /** 图标 */
  icon?: string | null;
  /** 排序 */
  orderIndex?: number | null;
  /** parentId */
  parentId?: number | null;
  /** 路径 */
  path?: string | null;
  /** 节点类型;dir,menu */
  shape?: string | null;
  /** 名称 */
  title?: string | null;
};

/** 行业术语项列表 */
export type 行业术语项列表 = {
  /** 主键id */
  id?: number | null;
  /** 中文名称 */
  chineseName?: string | null;
  /** 代码 */
  code?: string | null;
  /** 创建人 */
  createBy?: number | null;
  /** 创建人名 */
  createByName?: string | null;
  /** 创建时间 */
  createTime?: number | null;
  /** 英文名称 */
  englishName?: string | null;
  /** 数据操作url */
  optUrl?: string | null;
  /** 备注 */
  remark?: string | null;
  /** 顺序号 */
  seqNo?: number | null;
  /** 租户ID */
  tenantId?: number | null;
  /** 术语类型 */
  termType?: string | null;
  /** 术语类型描述 */
  termTypeDesc?: string | null;
  /** 更新人 */
  updateBy?: number | null;
  /** 更新人名 */
  updateByName?: string | null;
  /** 更新时间 */
  updateTime?: number | null;
};

/** 订阅动作 */
export type 订阅动作 = {
  /** 触发产生消息参数 */
  actionMessageParams?: notifyMessageParamDTO[] | null;
  /** 业务ID */
  targetId?: number | null;
};

/** 费用方案列表实体 */
export type 费用方案列表实体 = {
  /** 部门 */
  id?: number | null;
  /** 部门名称 */
  departmentName?: string | null;
  /** 公司名称 */
  officeName?: string | null;
  /** 上级部门 */
  parentName?: string | null;
};

/** 运营用户授权登录会员 */
export type 运营用户授权登录会员 = {
  /** appId */
  appId: number;
  /** memberId */
  memberId: number;
};

/** 部门人员信息列表 */
export type 部门人员信息列表 = {
  /** 部门id */
  departmentId?: number | null;
  /** 部门名称中文 */
  departmentName?: string | null;
  /** 用户列表 */
  userVoList?: 人员信息列表[] | null;
};

/** 验证码登录 */
export type 验证码登录 = {
  /** 图片验证码 */
  captchaCode?: string | null;
  /** 图片验证码uuid */
  captchaUUID?: string | null;
  /** CODE、验证码 */
  code: string;
  /** 号码或邮件 */
  loginName: string;
};

/** 验证码重置密码 */
export type 验证码重置密码 = {
  /** 系统ID */
  appId?: number | null;
  /** 图片验证码 */
  captchaCode?: string | null;
  /** 图片验证码uuid */
  captchaUUID?: string | null;
  /** CODE、验证码 */
  code: string;
  /** 号码或邮件 */
  loginName: string;
  /** 密码 */
  password: string;
};