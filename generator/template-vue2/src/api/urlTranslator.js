const URL = {
  authLogin: '/api/auth-service/login',
  authAuth: '/api/auth-service/auth',
  sysUser: '/api/sys-service/sys/user',
  logout: '/api/sys-service/sys/logout',
  remoteMember: '/api/member-service/mem/member/info/spinner',
  dmn: {
    shippingInfo: '/api/mdm-service/com/vessel', // 船舶
    shippingType: '/api/mdm-service/com/vessel/vesseltypelist', // 船舶类型
    shippingBatchDel: '/api/mdm-service/com/vessel/batch', // 船舶
    shippingSelect: '/api/mdm-service/com/vessel/list', // 船舶下拉
    voyageBatchDel: '/api/mdm-service/com/sailing/schedule/batch', // 航次、航行信息-批量删除
    shippingBatchDel2: '/api/mdm-service/com/vessel/batch2', // 船舶
    voyageInfo: '/api/mdm-service/com/sailing/schedule', // 航次、航行信息
    chargeItemInfo: '/api/mdm-service/dmn/fee/item', // 费用项
    chargeEnable: '/api/mdm-service/dmn/fee/item/activeenable', // 费用启用
    chargeDisable: '/api/mdm-service/dmn/fee/item/activedisable', // 费用禁用
    chargeBatchDel: '/api/mdm-service/dmn/fee/item/batch', // 费用批量删除
    seaPortInfo: '/api/mdm-service/dmn/seaport', // 海港
    seaPortInfoEnable: '/api/mdm-service/dmn/seaport/activeenable', // 海港 启用
    seaPortInfoDisable: '/api/mdm-service/dmn/seaport/activedisable', // 海港 禁用
    seaPortEnable: '/api/mdm-service/dmn/seaportenable', // 海港启用
    seaPortDisable: '/api/mdm-service/dmn/seaportdisable', // 海港禁用
    currencyInfo: '/api/mdm-service/dmn/currency', // 币种
    countryInfo: '/api/mdm-service/dmn/country', // 国家
    countryList: '/api/mdm-service/dmn/countrylist', // 国家
    divisionInfo: '/api/mdm-service/dmn/administrative/division', // 行政区域
    divisionAllList: '/api/mdm-service/dmn/administrative/division/list', // 行政区域 全部
    divisionByCountry: '/api/mdm-service/dmn/administrative/division/listbycountry', // 行政区域 某一个国家的
    containerTypeInfo: '/api/mdm-service/dmn/container', // 集装箱型
    terminologyInfo: '/api/mdm-service/dmn/term/item', // 行业术语
    terminologyEnable: '/api/mdm-service/dmn/term/item/activeenable', // 行业术语 启用
    terminologyDisable: '/api/mdm-service/dmn/term/item/activedisable', // 行业术语 禁用
    terminologyTypeInfo: '/api/mdm-service/dmn/term', // 行业术语 类别
    terminologyByType: '/api/mdm-service/dmn/term/item/dropdownlist', // 行业术语 根据类别
    currencyDropDownList: '/api/mdm-service/dmn/currency/dropdownlist', // 币种 下拉
    containerEnable: '/api/mdm-service/dmn/container/activeenable', // 集装箱型-启用
    containerDisable: '/api/mdm-service/dmn/container/activedisable', // 集装箱型-禁用
    hscode: '/api/mdm-service/dmn/hscode', // Hscode
    negative: '/api/mdm-service/dmn/negative/list', // 负面清单
    companyCode: '/api/mdm-service/dmn/company/code/type'// 客户代码
  },
  // oms: {
  //   quickAddSoNo: '/api/oms-service/oms/premanifest/sono/batch-init', // 快捷新增关单
  //   bookingSoNoDialogSave: '/api/oms-service/oms/premanifest/sono',
  //   bookingSoNoDeleteValidation: '/api/oms-service/oms/premanifest/validation',
  //   containerSaveTypeAndQuant: '/api/oms-service/oms/se/job/ctnr/validation',
  //   containerDeleteValidation: '/api/oms-service/oms/se/job/ctnr/validation-del',
  //   seaExportSelectableJobNoForBlPane: '/api/oms-service/oms/se/job/combined-job',
  //   encasementUploadFile: (process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_API : '') + '/api/mdm-service/web/upload/file',
  //   encasementUploadFileInfoSave: '/api/sys-service/com/file/import',
  //   encasementUploadFileHandle: '/api/oms-service/oms/se/container/excel-handle',
  //   encasementUploadFileHistory: '/api/sys-service/com/file/import',
  //   uploadedConfirm: '/api/oms-service/oms/se/contanier/cargo/batch-handler-import-data',
  //   uploadedTitle: '/api/oms-service/oms/premanifest/import',
  //   uploadedList: '/api/oms-service/oms/se/container/cargo/import',
  //   seaExportJobCancel: '/api/oms-service/oms/se/job/shut/out',
  //   seaExportJob: '/api/oms-service/oms/se/job',
  //   seaExportJobOfConsol: '/api/oms-service/oms/se/job/consol',
  //   seaExportJobInit: '/api/oms-service/oms/se/job/init',
  //   seaExportJobOfConsolInit: '/api/oms-service/oms/se/job/consol/init',
  //   seaExportSelectableSlave: '/api/oms-service/oms/se/job/selectable/slave',
  //   seaExportAppendSlave: '/api/oms-service/oms/se/job/append/slave',
  //   seaExportRemoveSlave: '/api/oms-service/oms/se/job/remove/slave',
  //   seaExportCreateSlave: '/api/oms-service/oms/se/job/salve/init',
  //   seaExportJobCopy: '/api/oms-service/oms/se/job/copy',
  //   seaExportJobPanorama: '/api/oms-service/oms/se/job/panorama',
  //   seaExportJobPanoramaProfit: '/api/act-service/act/charge/panorama/profit',
  //   seaExportJobPanoramaState: '/api/act-service/act/charge/panorama/state',
  //   seaExportJobSubmit: '/api/oms-service/oms/se/job/commited',
  //   seaExportJobSingleReviewAccept: '/api/oms-service/oms/se/job/verified/success',
  //   seaExportJobSingleReviewReject: '/api/oms-service/oms/se/job/verified/failed',
  //   seaExportJobPreManifest: '/api/oms-service/oms/premanifest',
  //   seaExportJobPreManifest4OneAdd: '/api/oms-service/oms/premanifest/add', // 单个新增的保存
  //   seaExportJobManifest: '/api/oms-service/oms/ct/manifest',
  //   seaExportJobEncasementContainer: '/api/oms-service/oms/se/container',
  //   seaExportJobEncasementContainerValidation: '/api/oms-service/oms/se/container/validation', // 集装箱号验证
  //   seaExportJobEncasementRemovePreManifest: '/api/oms-service/oms/se/container/remove-premanifest',
  //   seaExportJobEncasementLadingNo: '/api/oms-service/oms/premanifest',
  //   seaExportJobEncasementLadingNoLeft: '/api/oms-service/oms/premanifest/out/container', // 装箱界面专用（排除已经全部装箱的预配舱单）
  //   seaExportJobEncasementContainerDetail: '/api/oms-service/oms/se/container/cargo',
  //   seaExportJobEncasementResetContainer: '/api/oms-service/oms/se/container/reload',
  //   seaExportJobEncasementAutoDistribute: '/api/oms-service/oms/se/container/premanifest/average', // 均摊
  //   seaExportJobEncasementAutoLoadContainer: '/api/oms-service/oms/se/container/auto-load', // 自动装箱
  //   seaExportJobEncasementClearContainer: '/api/oms-service/oms/se/container/clear', // 清除装箱信息
  //   seaExportJobEncasementExecEncase: '/api/oms-service/oms/se/container/premanifest',
  //   seaExportJobTruck: '/api/oms-service/oms/transport',
  //   seaExportJobTruckChoosableContainer: '/api/oms-service/oms/transport/choosable/container', // 获取拖车页签下可装的箱子
  //   seaExportJobHbl: '/api/oms-service/oms/se/hbl/job', // 这是首次进到hbl页签时捞的数据
  //   seaExportJobHblDetail: '/api/oms-service/oms/se/hbl', // 页面右上角表格中的资源
  //   seaExportJobHblAdd4Seperated: '/api/oms-service/oms/se/hbl', // 没错，最后改到了和上一行相同...
  //   seaExportJobHblSwitchHBlMode: '/api/oms-service/oms/se/hbl/mode',
  //   seaExportJobHblJob: '/api/oms-service/oms/se/hbl/combined/job', // 并单时一个hbl下的job
  //   seaExportJobHblJobToBeRemoved: '/api/oms-service/oms/se/hbl/combined/removed/job', // 移除回hbl下的job
  //   seaExportJobMbl: '/api/oms-service/oms/se/mbl/job', // 这是首次进到hbl页签时捞的数据
  //   seaExportJobMblDetail: '/api/oms-service/oms/se/mbl', // 页面右上角表格中的资源
  //   seaExportJobMblSwitchMBlMode: '/api/oms-service/oms/se/mbl/mode',
  //   seaExportJobMblJob: '/api/oms-service/oms/se/mbl/combined/job', // 并单时一个mbl下的job
  //   seaExportJobMblJobToBeRemoved: '/api/oms-service/oms/se/mbl/combined/removed/job', // 移除回hbl下的job
  //   seaExportJobWarehouseDetail: '/api/oms-service/oms/warehouse/detail',
  //   seaExportJobWarehouseDetailSpecifiedForEditing: '/api/oms-service/oms/warehouse', // 专用于修改的URL
  //   seaExportJobWarehouseInRecord: '/api/oms-service/oms/warehouse/receipt',
  //   seaExportJobDangerousCargo: '/api/oms-service/oms/se/job/danger',
  //   seaExportJobFocus: '/api/sys-service/per/focus',
  //   seaExportJobFocusBatch: '/api/sys-service/per/focus/batch',
  //   seaExportJobBatchSubmit: '/api/oms-service/oms/se/job/batch/commited',
  //   seaExportJobBatchUnSubmit: '/api/oms-service/oms/se/job/batch/cancel-commited',
  //   seaExportJobBatchVerify: '/api/oms-service/oms/se/job/batch-verified/success',
  //   seaExportJobBatchVerifyFailed: '/api/oms-service/oms/se/job/batch-verified/failed',
  //   seaExportJobBatchUnVerify: '/api/oms-service/oms/se/job/batch-cancel-verified/success',
  //   seaExportJobBatchUpdate: '/api/oms-service/oms/se/job/list',
  //   seaExportJobElectronicFile: '/api/mdm-service/com/file',
  //   seaExportJobElectronicFileSave: '/api/mdm-service/com/file/batchSave',
  //   seaExportJobDocumentTypeCodeTree: '/api/mdm-service/dmn/document/treelist',
  //   seaExportJobUploadFile: process.env.VUE_APP_BASE_API + '/api/mdm-service/web/upload/file',
  //   seaExportJobClipboard: '/api/oms-service/oms/se/job/capsule',
  //   seaExportJobClipboardConfig: '/api/sys-service/per/config',
  //   billConfirm: '/api/oms-service/oms/bill/history',
  //   billConfirmUrl: '/api/oms-service/oms/bill/confirm-url/', // 生成邀请对单的链接
  //   genTransportNo: '/api/oms-service/oms/transport/no',
  //   placeChosenContainer: '/api/oms-service/oms/transport/append-container',
  //   removeChosenContainer: '/api/oms-service/oms/transport/remove-container'
  // },
  // act: {
  //   exchangeRateInfo: '/api/act-service/act/exchange/rate', // 汇率
  //   exchangeRateBatch: '/api/act-service/act/exchange/rate/batch', // 汇率批量操作
  //   exchangeRateDetailInit: '/api/act-service/act/exchange/rate/pageinit', // 汇率弹框 数据初始化
  //   chargeDetailsList: '/api/act-service/act/charge/list', // 费用明细列表
  //   chargeDetailsListAdv: '/api/act-service/act/charge/list/advanced', // 费用明细列表-高级查询
  //   chargePayableList: '/api/act-service/act/charge/aplist', // 应付费用列表
  //   chargeReceivableList: '/api/act-service/act/charge/arlist', // 应收费用列表
  //   chargeSubstitutePayableList: '/api/act-service/act/charge/subaplist', // 代付费用列表
  //   chargeSubstituteReceivableList: '/api/act-service/act/charge/subarlist', // 代收列表
  //   charge: '/api/act-service/act/charge', // 费用 删除、编辑、新增
  //   chargeBatchDel: '/api/act-service/act/charge/batch', // 费用 批量删除
  //   chargeSubmit: '/api/act-service/act/charge/submit/success', // 费用提交
  //   chargeCancelSubmit: '/api/act-service/act/charge/submit/cancel', // 取消提交
  //   chargeAccept: '/api/act-service/act/charge/accept/success', // 费用审核
  //   chargeCancelAccept: '/api/act-service/act/charge/accept/cancel', // 取消审核
  //   chargeAllSubmitAr: '/api/act-service/act/charge/submitar/success', // 全部提交应收 -根据工作号
  //   chargeAllSubmitAp: '/api/act-service/act/charge/submitap/success', // 全部提交应付 -根据工作号
  //   chargeAllCancelSubmitAr: '/api/act-service/act/charge/submitar/cancel', // 全部取消提交应收 -根据工作号
  //   chargeAllCancelSubmitAp: '/api/act-service/act/charge/submitap/cancel', // 全部取消提交应付 -根据工作号
  //   chargeAllAcceptAr: '/api/act-service/act/charge/acceptar/success', // 全部审核 -根据工作号
  //   chargeAllAcceptAp: '/api/act-service/act/charge/acceptap/success', // 全部审核 -根据工作号
  //   chargeAllCancelAcceptAr: '/api/act-service/act/charge/acceptar/cancel', // 全部取消审核 -根据工作号
  //   chargeAllCancelAcceptAp: '/api/act-service/act/charge/acceptap/cancel', // 全部取消审核 -根据工作号
  //   chargeUnitDropDown: '/api/act-service/act/charge/unit/dropdownlist', // 工作号-费用 费用单位
  //   chargeItemUnitDropDown: '/api/act-service/act/charge/unit/dropdownlist', // 费用项的 费用单位
  //   chargeDialogInitData: '/api/act-service/act/charge/pageinit', // 获取详情页初始化准备数据
  //   chargeUnitNumByUnit: '/api/act-service/act/charge/unitnum', // 根据单位获取数量
  //   chargeRateBySourceCurrency: '/api/act-service/act/charge/exchangerate', // 根据jobId&源币种获取汇率
  //   billByJob: '/api/act-service/act/billing/list', // 根据工作号id查询账单列表
  //   invoiceByJob: '/api/act-service/act/invoice/list', // 根据工作号id查询发票
  //   checkByJob: '/api/act-service/act/statement/list', // 根据工作号id查询对账单列表
  //   applyPaymentByJob: '/api/act-service/act/apply/payment/list', // 根据工作号id查询 收付列表
  //   bill: '/api/act-service/act/billing/list', // 账单列表-财务结算
  //   billAdv: '/api/act-service/act/billing/list/advanced', // 账单列表-财务结算-高级查询
  //   billConfirm: '/api/act-service/act/billing/confirm',
  //   billCancelConfirm: '/api/act-service/act/billing/confirm/cancel', // 账单详情取消确认
  //   billAbolish: '/api/act-service/act/billing/abolish', // 账单作废
  //   billDetail: '/api/act-service/act/billing', // 账单删除
  //   billBatchDel: '/api/act-service/act/billing/batch', // 账单列表批量删除
  //   billDetailPageInitFromGuide: '/api/act-service/act/billing/create/datainit', // 账单详情页加载-向导页（目前只保留向导页）
  //   billGeneratePageInit: '/api/act-service/act/billing/guidepage/init', // 账单生成对话框 初始值
  //   billGenerateBillTypeList: '/api/act-service/act/billing/billtypelist',
  //   chargeDialogListBy: '/api/act-service/act/common/selectcharge', // 账单/发票/收付申请/对账单/核销 费用查询公共页
  //   customerDropDownListByJob: '/api/act-service/act/billing/guidepage/customerlist', // 根据工作号生成账单获取客商列表 下拉
  //   customerDropDownListByJobForPayment: '/api/act-service/act/apply/payment/guidepage/customerlist', // 根据工作号-费用-收付申请 获取客商列表 下拉
  //   arApDropDownList: '/api/act-service/act/billing/araptypelist', // 费用收支类型
  //   payTypeDropDownList: '/api/act-service/act/apply/payment/paytypelist', // 收付申请详细页-支付方式list
  //   invoice: '/api/act-service/act/invoice',
  //   invoiceAdv: '/api/act-service/act/invoice/advanced',
  //   invoiceBatchDel: '/api/act-service/act/invoice/batch', // 发票批量删除
  //   invoiceBatchAbolish: '/api/act-service/act/invoice/abolish/batch', // 批量作废
  //   invoiceConfirm: '/api/act-service/act/invoice/comfirm', // 确认开票
  //   invoiceAbolish: '/api/act-service/act/invoice/abolish', // 单个作废
  //   invoiceTypeList: '/api/act-service/act/invoice/typelist', // 发票类型list
  //   invoiceTextureList: '/api/act-service/act/invoice/formlist', // 发票材质
  //   chargeInvoiceDetailPageInit: '/api/act-service/act/invoice/createinvdatainit', // 发票新增-详细页加载数据-工作号入口-费用 开票收票
  //   billInvoiceDetailPageInit: '/api/act-service/act/invoice/billinvdatainit', // 发票新增-详细页加载数据-账单入口通知开票收票,
  //   invoiceItemAfterRemoveCharge: '/api/act-service/act/invoice/removechrgscal', // 发票详情-发票明细页-费用移除-计算发票信息
  //   invoiceItemAfterJoinCharge: '/api/act-service/act/invoice/joinchrgscal', // 发票详情-发票明细页-费用加入-计算发票信息
  //   invoiceItemAfterSwitchMerge: '/api/act-service/act/invoice/switchmerge', // 发票明细页-合开/明细切换获取发票明细项列表
  //   invoiceItemAfter: '/api/act-service/act/invoice/calculation/amount', // 获取发票明细 1、发票详情-发票明细页-费用移除-计算发票信息 2、发票详情-发票明细页-费用加入-计算发票信息 3、发票明细页-合开/明细切换获取发票明细项列表
  //   statement: '/api/act-service/act/statement', // 对账单
  //   statementAdv: '/api/act-service/act/statement/advanced', // 对账单
  //   statementUnCheckCharge: '/api/act-service/act/statement/selectcharge', // 对账单待选费用查询
  //   statementBatchDel: '/api/act-service/act/statement/batch',
  //   statementInvoiceDetailPageInit: '/api/act-service/act/invoice/soainvdatainit', // 对账单通知开票收票-发票创建详细页加载数据
  //   statementCompleted: '/api/act-service/act/statement/completed', // 对账完成
  //   statementCancelCompleted: '/api/act-service/act/statement/completed/cancel',
  //   applyPayment: '/api/act-service/act/apply/payment', // 收付款申请
  //   applyPaymentAdv: '/api/act-service/act/apply/payment/advanced', // 收付款申请
  //   applyPaymentUnCheckCharge: '/api/act-service/act/apply/payment/selectcharge', // 收付款申请待选费用查询
  //   applyPaymentBatchDel: '/api/act-service/act/apply/payment/batch',
  //   applyPaymentSubmit: '/api/act-service/act/apply/payment/submit/success', // 收付款申请 提交
  //   applyPaymentCancelSubmit: '/api/act-service/act/apply/payment/submit/cancel', // 取消提交
  //   applyPaymentAccept: '/api/act-service/act/apply/payment/accept/success', // 收付款申请 审核
  //   applyPaymentCancelAccept: '/api/act-service/act/apply/payment/accept/cancel', // 取消审核
  //   chargeApplyPaymentDetailPageInit: '/api/act-service/act/apply/payment/datainitbyjob', // 收付申请创建-详细页加载数据-工作号费用入口
  //   overview: '/api/act-service/act/job/overview', // 业务总览
  //   overviewAdv: '/api/act-service/act/job/overview/advanced', // 业务总览
  //   currencySummaryTableDataForBill: '/api/act-service/act/currency/amount/cal', // 账单详情获取 币种合计列表数据
  //   invoiceDetailClearInvno: '/api/act-service/act/invoice/clearinvno', // 发票详情-清空发票号
  //   invoiceDetailOffsetInv: '/api/act-service/act/invoice/offsetinvdatainit', // 发票详情-红冲
  //   clear: '/api/act-service/act/clear', // 核销管理
  //   clearAdv: '/api/act-service/act/clear/advanced', // 核销管理
  //   clearBatchDel: '/api/act-service/act/clear/batch', // 核销批量删除
  //   unClearSelectCharge: '/api/act-service/act/clear/selectcharge', // 核销待选费用查询
  //   clearFinish: '/api/act-service/act/clear/finish', // 核销完成-核销记录新增保存
  //   feeItemDropdownList: '/api/mdm-service/dmn/fee/dropdown/list', // 费用项下拉
  //   payTypeForClearDropdownList: '/api/act-service/act/clear/cleartypelist', // 核销-结算方式
  //   clearDraft: '/api/act-service/act/clear/draft', // 核销存为草稿
  //   clearSubmitSuccess: '/api/act-service/act/clear/submit/success',
  //   clearSubmitCancel: '/api/act-service/act/clear/submit/cancel',
  //   clearAcceptSuccess: '/api/act-service/act/clear/accept/success',
  //   clearAcceptCancel: '/api/act-service/act/clear/accept/cancel',
  //   chargeSchemeByJobId: '/api/act-service/charge/scheme/list', // 费用方案列表-工作号Id
  //   chargeSchemeProduction: '/api/act-service/charge/scheme/production', // 费用方案生成费用
  //   wentDutchTypeList: '/api/act-service/act/charge/sharemode/dropdownlist', // 分摊方式列表
  //   wentDutchList: '/api/act-service/act/charge/share/list', // 费用分摊列表
  //   chargeSplit: '/api/act-service/act/charge/separation', // 费用拆分
  //   agencyBillAmount: '/api/act-service/act/billing/amount/cal', // 代理分成账单金额计算
  //   chargeFilterType: '/api/act-service/act/charge/filtertype/list', // 费用显示模式-过滤类型
  //   chargeSummaryAmount: '/api/act-service/act/charge/summary', // 费用页签摘要
  //   chargeBatchUpdateCurrency: '/api/act-service/act/charge/batch/currency', // 费用批量修改-币种
  //   chargeBatchUpdateCustomer: '/api/act-service/act/charge/batch/customer', // 费用批量修改-结算单位
  //   chargeBatchUpdateInvtitle: '/api/act-service/act/charge/batch/invtitle', // 费用批量修改-发票抬头
  //   chargeBatchUpdateRate: '/api/act-service/act/charge/batch/rate', // 费用批量修改-汇率
  //   chargeBatchUpdateRemark: '/api/act-service/act/charge/batch/remark', // 费用批量修改-备注
  //   jobChargeBatchAccept: '/api/act-service/act/charge/accept/success/batch', // 费用批量审核-工作号ids
  //   jobChargeBatchCancelAccept: '/api/act-service/act/charge/accept/cancel/batch', // 费用批量取消审核-工作号ids
  //   jobChargeBatchSubmit: '/api/act-service/act/charge/submit/success/batch', // 费用批量提交-工作号ids
  //   jobChargeBatchCancelSubmit: '/api/act-service/act/charge/submit/cancel/batch', // 费用批量取消提交-工作号ids
  //   chargeSchemeListByJobs: '/api/act-service/charge/scheme/list/batch', // 费用方案列表-批量工作号
  //   chargeListShowBySchemeAndJob: '/api/act-service/charge/scheme/chargelist', // 费用方案获取费用list-工作号id&方案id
  //   chargeListCommitByScheme: '/api/act-service/charge/scheme/production/batch', // 费用方案生成费用-批量工作号
  //   chargeConfirmPageInit: '/api/act-service/act/billing/confirmonline/pageinit', // 在线费用确认-pageInit数据源
  //   chargeConfirmSendEmail: '/api/act-service/act/billing/confirmonline/email', // 在线费用确认-发送邮件邀请确认
  //   chargeConfirmLink: '/api/act-service/act/billing/confirmonline/copyurl', // 在线费用确认-链接邀请确认
  //   chargeConfirmLog: '/api/act-service/act/billing/snapshot', // 在线费用确认-日志
  //   actFocus: '/api/sys-service/per/focus/batch', // act财务模块，关注/取消关注
  //   invoiceDashboard: '/api/act-service/act/invoice/dashboard', // 发票-仪表盘
  //   lclprofitList: '/api/act-service/act/charge/lclprofit', // 工作号-拼柜利润
  //   invoiceCombine: '/api/act-service/act/invoice/combine', // 发票合并
  //   overviewDetailStatus: '/api/act-service/act/job/overview/state', // 业务浏览-状态
  //   checkApplyPayment: '/api/act-service/act/apply/payment/datainitbysoa', // 对账单入口 -收付申请创建
  //   releaseAllow: '/api/act-service/bl/release/able', // 可放单(允许 )
  //   releaseReject: '/api/act-service/bl/release/deduct', // 拒绝
  //   releasePass: '/api/act-service/bl/release', // 放单
  //   releaseArrearage: '/api/act-service/bl/release/charge', // 查看欠费信息
  //   releaseAdv: '/api/act-service/bl/release/list/advanced', // 放单-高级查询
  //   release: '/api/act-service/bl/release/list', // 放单-简单查询
  //   releaseSeAdv: '/api/act-service/bl/release/se/list/advanced', // 放单-高级查询
  //   releaseSe: '/api/act-service/bl/release/se/list', // 放单-简单查询
  //   realCash: '/api/act-service/act/actual/payment',
  //   realCashAdv: '/api/act-service/act/actual/payment/advanced',
  //   realCashBatchDel: '/api/act-service/act/actual/payment/batch',
  //   realCashAcceptSuccess: '/api/act-service/act/actual/payment/accept/success',
  //   realCashAcceptCancel: '/api/act-service/act/actual/payment/accept/cancel',
  //   realCashSubmitSuccess: '/api/act-service/act/actual/payment/submit/success',
  //   realCashSubmitCancel: '/api/act-service/act/actual/payment/submit/cancel',
  //   realCashClears: '/api/act-service/act/clear/actualpayment', // 核销列表-实收实付明细入口
  //   realCashClearCharges: '/api/act-service/act/clear/chargelist', // 核销费用记录列表(路径入参 核销记录Id)
  //   clearDetailRealCashs: '/api/act-service/act/actual/payment/select', // 核销详情-查询实收实付列表
  //   invoiceOffsetPlatform: '/api/act-service/act/invoice/offset/platform', // 获取发票红冲的方式（平台红冲还是第三方红冲）
  //   invoiceThirdOffset: '/api/act-service/act/invoice/kpt/red', // 第三方 发票红冲
  //   invoiceThirdGenerate: '/api/act-service/act/invoice/kpt', // 第三方 开具发票
  //   jobBatchAccept: '/api/act-service/act/job/accept/success', // 工作单批量审核-工作号ids
  //   jobBatchCancelAccept: '/api/act-service/act/job/accept/cancel', // 工作单批量取消审核-工作号ids
  //   jobBatchSubmit: '/api/act-service/act/job/submit/success', // 工作单批量提交-工作号ids
  //   jobBatchCancelSubmit: '/api/act-service/act/job/submit/cancel', // 工作单批量取消提交-工作号ids
  //   jobBatchRejectSubmit: '/api/act-service/act/job/submit/reject', // 工作单批量驳回-工作号ids
  //   invoiceInitCommon: '/api/act-service/act/invoice/invdatainit', // 发票详情-通用
  //   applyPaymentAddPageInit: '/api/act-service/act/apply/payment/datainit', // 收付申请创建-详细页加载数据
  //   statementAddPageInit: '/api/act-service/act/statement/datainit', // 对账单新增创建-详细页加载数据
  //   clearAddPageInit: '/api/act-service/act/clear/datainit', // 核销记录新增创建-详细页加载数据
  //   validationBeforeClearAddPageInit: '/api/act-service/act/clear/datainit/validation', // 核销记录新增创建-校验
  //   validationBeforeCheckAddPageInit: '/api/act-service/act/statement/datainit/validation', // 对账单新增创建-校验
  //   validationBeforeApplyPaymentAddPageInit: '/api/act-service/act/apply/payment/datainit/validation', // 收付申请创建-校验
  //   validationBeforeInvoiceAddPageInit: '/api/act-service/act/invoice/invdatainit/validation', // 发票新增-校验
  //   validationBeforeBillAddPageInit: '/api/act-service/act/billing/create/datainit/validation', // 账单创建-校验
  //   chargeTabCopyCharge: '/api/act-service/act/charge/create/copy', // 抄录
  //   schemeAutoMatchCondition: '/api/act-service/job/scheme/queryvo', // 费用方案自动匹配业务信息查询
  //   schemeList: '/api/act-service/job/scheme/detail/list', // 方案查询列表
  //   schemeChargeResultShow: '/api/act-service/job/scheme/charge/list', // 工作号费用展示
  //   schemeChargeResultProd: '/api/act-service/job/scheme/charge/production' // 工作号费用生成-

  // },
  sys: {
    configParams: '/api/mdm-service/cfg/parameter/config/value', // 获取自定义配置的那些参数
    containerTypeList: '/api/mdm-service/dmn/container/dropdownlist',
    changePassword: '/api/sys-service/sys/user/current/modifypassword',
    dmnTermItemList: '/api/mdm-service/dmn/term/item/dropdownlist',
    loginInitRedisInfo: '/api/sys-service/sys/login', // 初始化redis信息
    partnerDropDownList: '/api/sys-service/sys/common/pnrpartnerlist', // 结算单位下拉
    customerLevelList: '/api/mdm-service/dmn/term/item/dropdownlist?termCode=CUSTOMERRATE', // 客户等级下拉
    jobTypeList: '/api/sys-service/sys/common/jobtypelist',
    positionTypeList: '/api/sys-service/sys/common/positiontypelist',
    customerList: '/api/sys-service/sys/common/pnrpartnerlist', // 海出工作号委托页签-用于查“委托单位”下拉列表，后面要改成?type=customer形式
    customerContactList: '/api/sys-service/sys/common/pnrpartnerlist/contact',
    seaPortList: '/api/sys-service/dmn/seaport',
    architectureInfo: '/api/sys-service/sys/office/organization', // 公司架构
    companyList: '/api/sys-service/sys/officelist',
    companyInfo: '/api/sys-service/sys/office',
    companyEnable: '/api/sys-service/sys/office/activeenable',
    companyDisable: '/api/sys-service/sys/office/activedisable',
    userEnable: '/api/sys-service/sys/user/activeenable',
    userDisable: '/api/sys-service/sys/user/activedisable',
    userAssignedRole: '/api/sys-service/sys/user/rolelist',
    userAssignRole: '/api/sys-service/sys/user/assign-role',
    userAssignedRule: '/api/sys-service/sys/user/identifier/rulelist',
    userAssignRule: '/api/sys-service/sys/user/identifier/assign/rule',
    deptInfo: '/api/sys-service/sys/department', // 部门
    deptTree: '/api/sys-service/sys/department/treebyoffice',
    membersOfDept: '/api/sys-service/sys/user/bydepartment',
    bankAccounts: '/api/sys-service/sys/bank/account/list',
    invoiceBankAccounts: '/api/sys-service/sys/bank/account/list-business', // 发票使用
    bankInfo: '/api/sys-service/sys/bank/account',
    bankEnable: '/api/sys-service/sys/bank/account/activeenable',
    bankDisable: '/api/sys-service/sys/bank/account/activedisable',
    officeList: '/api/sys-service/sys/office/dropdownlist',
    departmentList: '/api/sys-service/sys/department/dropdownlist',
    role: '/api/sys-service/sys/role',
    roleEnable: '/api/sys-service/sys/role/activeenable',
    roleDisable: '/api/sys-service/sys/role/activedisable',
    roleCopy: '/api/sys-service/sys/role/copy',
    privilege: '/api/sys-service/sys/role/privilegelistview', // 功能权限，应该叫privilegeOfFunction
    privilegeOfData: '/api/sys-service/sys/role/privilege/permissions', // 系统权限
    privilegeRelated: '/api/sys-service/sys/privilege/checklist', // 找出某个权限打钩/取消时，相关联的父级、子级id
    privilegeAuthorize: '/api/sys-service/sys/role/authorization-privilege',
    dataPrivilege: '/api/sys-service/sys/role/privilege-permissions', // 数据权限，
    removeDataPrivilege: '/api/sys-service/sys/role/privilege/remove-permission', // 移除写了一个单独的接口，支持批量
    officeListForSettingDataPrivilege: '/api/sys-service/sys/office/permssion-offices',
    departmentListForSettingDataPrivilege: '/api/sys-service/sys/department/permssion-departments',
    personListForSettingDataPrivilege: '/api/sys-service/sys/user/permssion-users',
    roleAssignedUser: '/api/sys-service/sys/role/userlist/',
    roleAssignUser: '/api/sys-service/sys/role/assign-user',
    ruleAssignedUser: '/api/sys-service/sys/user/identifier/userlist',
    ruleAssignUser: '/api/sys-service/sys/user/identifier/assign/user',
    userDropDownList: '/api/sys-service/sys/common/sysuserlist',
    userDutyList: '/api/sys-service/sys/user/dutylist',
    resetPassword: '/api/sys-service/sys/user/resetpassword',
    chargeScheme: '/api/sys-service/com/charge/scheme',
    chargeSchemeAdv: '/api/sys-service/com/charge/scheme/advanced',
    chargeSchemeAcceptCancel: '/api/sys-service/com/charge/scheme/accept/cancel',
    chargeSchemeAcceptSuccess: '/api/sys-service/com/charge/scheme/accept/success',
    chargeSchemeCustomerList: '/api/sys-service/com/charge/scheme/customertypelist', // 费用方案-结算单位类型
    chargeSchemeJobList: '/api/sys-service/sys/common/jobtypelist', // 费用方案-业务类型
    chargeSchemeUnitList: '/api/sys-service/com/charge/scheme/unitlist', // 费用方案-单位下拉
    cargoTypeList: '/api/sys-service/sys/common/cargotypelist', // 费用方案-货物类型
    fclLclList: '/api/sys-service/sys/common/fcllcllist', // 费用方案-整拼类型
    chargeSchemeLineList: '/api/mdm-service/dmn/term/item/dropdownlist', // 费用方案-航线list
    chargeSchemeActiveDisable: '/api/sys-service/com/charge/scheme/activedisable', // 费用方案-禁用
    chargeSchemeActiveEnable: '/api/sys-service/com/charge/scheme/activeenable', // 费用方案-启用
    chargeSchemeBatchDel: '/api/sys-service/com/charge/scheme/batch', // 费用方案-批量删除
    companyVisualView: '/api/sys-service/sys/office/organization/visualview', // 可视化公司架构
    reportListByType: '/api/report-service/cfg/template/listbytype', // 根据类型获取报表list、报表
    businessReportListByType: '/api/report-service/cfg/template/listbyapply', // 业务入口-根据类型获取报表list、报表
    report: '/api/report-service/cfg/template', //
    reportTypeList: '/api/report-service/cfg/template/type', // 报表类型
    detailReportType: '/api/report-service/cfg/template/type/detail', // 查看报表类型
    templateScheme: '/api/report-service/cfg/template/scheme', // 保存报表类型
    detailScheme: '/api/report-service/cfg/template/scheme/detail', // 查看报表类型
    reportTemplateDataInit: '/api/report-service/cfg/template/paraminit', // 获取模板数据（Report服务使用这些参数）
    getGlobalQueryConfig: '/api/sys-service/per/config/global', // 获取全局参数配置
    personQueryConfig: '/api/sys-service/per/config', // 保存个人参数配置
    savePersonQueryConfig: '/api/sys-service/per/config', // 保存个人参数配置
    getStaSchemaTree: '/api/sys-service/per/config/sta', // 查询通用报表配置
    shareQueryConfig: '/api/sys-service/per/config/share', // 分享通用报表配置
    queryUrl: 'api/mdm-service/dmn/countrylist', // 界面查询url
    countryList: 'api/mdm-service/dmn/countrylist', // 界面查询url
    ediTypeList: '/api/cargoone-edi/edi/type', // edi类型列表
    edi: '/api/cargoone-edi/edi/template', // 根据edi类型获取edi列表-删除-保存
    ediChannelListByType: '/api/cargoone-edi/edi/template/channellist', // edi渠道列表
    ediModeListByChannel: '/api/cargoone-edi/edi/template/modelist', // ediMode列表
    ediTemplateListByMode: '/api/cargoone-edi/edi/template/listbymode', // edi模板列表
    ediTemplateContent: '/api/cargoone-edi/edi/template/filedata', // edi模板内容
    viewEdiTemplateContent: '/api/cargoone-edi/edi/template/edifile', // 预览edi模板内容
    sendEdiTemplate: '/api/cargoone-edi/edi/template/edisend', // 预览edi模板内容
    ediReceiverTypeList: '/api/cargoone-edi/edi/config/receivertypelist', // 接收方类型下拉框List
    ediCommunicationModeList: '/api/cargoone-edi/edi/config/communicationmodelist', // 通信方式下拉框List
    ediConfig: '/api/cargoone-edi/edi/config', // edi配置查询详情
    ediLog: '/api/cargoone-edi/edi/send/log/list', // edi日志
    ediDownload: '/api/cargoone-edi/edi/file/download', // edi 报文全部下载
    userByCustomer: '/api/sys-service/sys/common/pnrpartnerlist/contact', // 联系人-根据结算单位
    voyageInfo: '/api/sys-service/com/sailing/schedule/list',
    departmentListDown: '/api/sys-service/sys/department/parent/list', // 部门下拉
    schemeData: '/api/report-service/cfg/template/scheme', // 数据源接口
    schemeDataCodes: '/api/report-service/cfg/template/scheme/codes', // 数据源name code
    schemeDataDetail: '/api/report-service/cfg/template/scheme/detail', // 数据源详情
    schemeDataList: '/api/report-service/cfg/template/scheme/list' // 数据源列表
  },
  cfg: {
    ruleDropDownListByIdentifierType: '/api/mdm-service/cfg/identifier/rule/list', // 账单创建向导(sys)-根据编码类型获取规则list
    rulesDetailInit: '/api/mdm-service/cfg/identifier/rule/pageinit', // 初始化详情页面信息
    rulesInfo: '/api/mdm-service/cfg/identifier/rule', // 编号规则
    rulesInfoCopy: '/api/mdm-service/cfg/identifier/rule/copy ', // 编号规则-复制公司
    rulesEnable: '/api/mdm-service/cfg/identifier/rule/activeenable', // 编号规则 启用
    rulesDisable: '/api/mdm-service/cfg/identifier/rule/activedisable', // 编号规则 禁用
    getRulesByOfficeId: '/api/mdm-service/cfg/identifier/rule/list', // 根据分公司id查询列表
    generateRulesJobNo: '/api/mdm-service/cfg/identifier/rule/jobnoexample', // 生成编号
    ruleList: '/api/mdm-service/cfg/identifier/rule/list', // 用于复制或保存工作号时获取可选的规则列表
    parametersList: '/api/mdm-service/cfg/parameter/config', // 参数配置查询列表-根据公司id、保存
    parameterValueListByCode: '/api/mdm-service/cfg/parameter/item', // 参数配置查询-根据parameterCode 获取选项值
    parametersListReset: '/api/mdm-service/cfg/parameter/config/reset', // 参数配置查询-参数恢复默认值
    parametersListCopy: '/api/mdm-service/cfg/parameter/config/copy' // 参数配置查询-参数配置复制
  },
  pnr: {
    partnerAdv: '/api/sys-service/pnr/partner/advanced',
    contact: '/api/sys-service/pnr/contact',
    contactEnable: '/api/sys-service/pnr/contact/activeenable',
    contactDisable: '/api/sys-service/pnr/contact/activedisable',
    address: '/api/sys-service/pnr/address/info',
    addressEnable: '/api/sys-service/pnr/address/info/activeenable',
    addressDisable: '/api/sys-service/pnr/address/info/activedisable',
    invoice: '/api/sys-service/pnr/invoice/info',
    invoiceEnable: '/api/sys-service/pnr/invoice/info/activeenable',
    invoiceDisable: '/api/sys-service/pnr/invoice/info/activedisable',
    account: '/api/sys-service/pnr/bank/account',
    accountEnable: '/api/sys-service/pnr/bank/account/activeenable',
    accountDisable: '/api/sys-service/pnr/bank/account/activedisable',
    position: '/api/sys-service/pnr/customer/position',
    bl: '/api/sys-service/pnr/bl/address',
    contract: '/api/sys-service/pnr/contract/info',
    termUnitList: '/api/sys-service/pnr/customer/credit/info/termunitlist',
    settleModeList: '/api/sys-service/pnr/customer/credit/info/settlemodelist',
    dateTypeList: '/api/sys-service/pnr/customer/credit/info/datetypelist',
    controlModeList: '/api/sys-service/pnr/customer/credit/info/controlmodelist',
    credit: '/api/sys-service/pnr/customer/credit/info',
    pre: '/api/sys-service/pnr/manifest/info/pre',
    ct: '/api/sys-service/pnr/manifest/info/ct',
    resetAmount: '/api/act-service/act/common/customer/resetamount',
    overDue: '/api/act-service/pnr/customer/credit/overdue/summary', // 客商超限超额信息汇总
    defaultSalesAndCs: '/api/sys-service/pnr/customer/position/default',
    jobTypeListOfContractInfo: '/api/sys-service/pnr/contract/info/jobtypelist',
    contractInfo: '/api/sys-service/pnr/contract/info/cal',
    customerCreditValidation: '/api/act-service/pnr/customer/credit/validation'
  },
  report: {
    designerReport: '/api/report-service/report/designer',
    viewReport: '/api/report-service/report/viewreport'
  },
  qf: { // qf is short for quickFilter
    staff: '/api/sys-service/sys/common/sysuserlist',
    partner: '/api/sys-service/sys/common/pnrpartnerlist',
    partnerOfCarrier: '/api/mdm-service/dmn/shipping/companylist',
    // seaport: '/api/sys-service/dmn/seaport'
    seaport: '/api/mdm-service/dmn/seaportlist',
    door: '/api/sys-service/pnr/customer/address/list',
    terminology: '/api/mdm-service/dmn/term/item/dropdownlist'
  },
  // si: { // si is short for searchItem
  //   seJob: '/api/oms-service/oms/se/job',
  //   seJobAdv: '/api/oms-service/oms/se/job/advanced-query'
  // },
  // sta: {
  //   queryJob: '/api/sta-service/sta/job', // 货量
  //   queryProfit: '/api/sta-service/sta/profit', // 利润
  //   queryJobAdvanced: '/api/sta-service/sta/job/advanced', // 货量-高级查询
  //   queryProfitAdvanced: '/api/sta-service/sta/profit/advanced' // 利润-高级查询
  // },
  // flw: {
  //   flow: '/api/sys-service/flw/flow/modelist', // 工作流类型
  //   flowNode: '/api/sys-service/flw/node/modelist', // 工作流节点
  //   flowNodeConfig: '/api/sys-service/flw/node/config', // 工作流节点配置-定义
  //   flowConfig: '/api/sys-service/flw/flow/config', // 工作流配置-定义
  //   flowConfigByType: '/api/sys-service/flw/flow/config/modelist', // 根据类型 查工作流配置-定义
  //   flowConfigInit: '/api/sys-service/flw/flow/config/init', // 工作流配置 新增-初始化
  //   flowOfficeOrInterventionUser: '/api/sys-service/flw/flow/config/office/admin', // 工作流配置 修改公司或干预人
  //   flowInstanceSummary: '/api/sys-service/flw/flow/instance/pending/approve/count', // 审批管理（摘要）
  //   flowInstanceByType: '/api/sys-service/flw/flow/instance/pending/approve/list', // 审批管理（审批列表）
  //   flowInstance: '/api/sys-service/flw/flow/instance',
  //   flowInstanceApprove: '/api/sys-service/flw/flow/instance/approve', // 审批
  //   flowInstanceReject: '/api/sys-service/flw/flow/instance/reject', // 拒绝
  //   flowInstanceRollback: '/api/sys-service/flw/flow/instance/rollback', // 撤回
  //   flowInstanceLogTypeCount: '/api/sys-service/flw/flow/instance/approve/complete/count', // 获取全部审批历史数量
  //   flowInstanceLogByBusinessId: '/api/sys-service/flw/flow/instance/entity/log', // 获取指定流程实例的审批日志
  //   flowInstanceLogList: '/api/sys-service/flw/flow/instance/approve/complete/list', // 获取指定流程类型的当前人审批或者通知节点列表
  //   validationFlowNodeRouterRule: '/api/sys-service/flw/node/route/rule/validation', // 校验规则表达式是否正确
  //   drawFlowGraph: '/api/sys-service/flw/node/route/edge' // 工作流的流程图
  // },
  omc: {
    rechargeList: '/api/fms-service/omc/recharge/list', // 会员充值记录
    rechargeDetail: '/api/fms-service/omc/recharge/detail', // 会员充值详情
    checkCharge: '/api/fms-service/omc/recharge/state', // 审核
    getAccount: '/api/fms-service/omc/wallet/account', // 审核
    getPlatform: '/api/fms-service/wallet/account/platform', // 获取平台收款账户
    uploadWebUrl: '/api/mdm-service/web/upload/file', // 上传文件
    saveRecharge: '/api/fms-service/omc/recharge/offline', // 新增线下审批单
    getConfirmedCount: '/api/fms-service/omc/recharge/confirmedCount',
    // 船期相关接口路径
    scheduleList: '/api/cas-service/omc/cas/sailing/schedule/list', // 船期列表
    scheduleDel: '/api/cas-service/omc/cas/sailing/schedule', // 船期列表删除
    scheduleInfo: '/api/cas-service/omc/cas/sailing/schedule/insert', // 船期信息
    scheduleInfoDetail: '/api/cas-service/omc/cas/sailing/schedule/detail', // 船期信息详情
    updateBaseData: '/api/cas-service/omc/cas/sailing/schedule/updateBaseData', // 船期信息更新数据
    scheduleInfoPublish: '/api/cas-service/omc/cas/sailing/schedule/publish', // 船期信息发布
    scheduleInfoUndercarriage: '/api/cas-service/omc/cas/sailing/schedule/undercarriage', // 船期信息下架
    shippingCompanylist: '/api/mdm-service/dmn/shipping/companylist', // 获取司列表
    saveScheduleLoading: '/api/cas-service/omc/cas/schedule/loading/insert', // 保存装货港信息单条数据
    delScheduleLoading: '/api/cas-service/omc/cas/schedule/loading', // 删除装货港信息单条数据
    saveDischarge: '/api/cas-service/omc/cas/schedule/discharge/insert', // 保存卸货港信息单条数据
    delDischarge: '/api/cas-service/omc/cas/schedule/discharge', // 删除卸货港信息单条数据
    savePickReturnAddress: '/api/cas-service/omc/cas/pick/return/address/insert', // 保存提还箱点信息
    delPickReturnAddress: '/api/cas-service/omc/cas/pick/return/address', //  删除提还箱点信息
    // 提单信息相关接口
    getBLList: '/api/cas-service/omc/cas/job/bl/list', // 查询提单列表
    batchDelete: '/api/cas-service/omc/cas/job/bl/batchDelete', // 批量删除提单
    batchIssue: '/api/cas-service/omc/cas/job/bl/batchIssue', // 签发,批量
    exportBL: '/api/cas-service/omc/cas/job/bl/export', // 提单列表相关导出
    billDetail: '/api/cas-service/omc/cas/job/bl/billDetail', // 提单详情
    // billPrint: '/api/cas-service/omc/cas/job/bl/print' // 提单列表相关导出
    billPrint: '/api/cas-service/omc/cas/job/bl/report/print'
  },
  charteredBoat: { // 包船
    booking: { // 订舱
      list: '/api/cas-service/omc/cas/order/list', // 订舱列表
      statistics4List: '/api/cas-service/omc/cas/order/list_statistics', // 会员查询列表统计汇总
      contactList: '/api/member-service/omc/member/scn/list', // 联系人列表
      sailingDetail: '/api/cas-service/omc/cas/order/sailing_detail', // 船期详细信息
      bookingOrder: '/api/cas-service/omc/cas/order', // 订舱订单-更新、删除
      saveBookingOrder: '/api/cas-service/omc/cas/order', // 订舱订单-、、保存
      bookingDetail: '/api/cas-service/omc/cas/order/detail', // 订舱订单详情
      containerUrlPrefix: '/api/cas-service/omc/cas/order/', // 订舱-集装箱url前缀
      auditBooking: '/api/cas-service/omc/cas/order/audit', // 订舱-审核
      cancelBooking: '/api/cas-service/omc/cas/order/cancel', // 订舱-取消
      confirmCancelBooking: '/api/cas-service/omc/cas/order/confirm_cancel', // 订舱-取消确认
      rejectBooking: '/api/cas-service/omc/cas/order/reject', // 订舱-驳回
      checkSoExists: '/api/cas-service/omc/cas/order/check_so_exists', // 订舱-so校验
      loadingPortAddress: '/api/cas-service/omc/cas/order/loading_port_address', // 根据卸货港获取提还箱点列表
      downloadBooking: '/api/cas-service/omc/cas/order/download_booking_confirm', // 下载订舱确认函
      sendBooking: '/api/cas-service/omc/cas/order/batch_send_booking_confirm', // 批量发送订舱确认函
      updateAssignFieldInfo: '/api/cas-service/omc/cas/order/update_column', // 订舱-更新指定的字段，局部表单更新
      addressDetail: '/api/cas-service/omc/cas/order/address_detail', // 订舱-提箱点分配-获取和更新（整个list的操作）
      supportSizeType: '/api/cas-service/omc/cas/order/support_size_type', // 装货港堆场支持箱型
      contactDetail: '/api/member-service/omc/member/scn/detail', // 收发通详情
      getTemplate: '/api/report-service/cfg/template/listbyapply' // 获取对应的typeCode的模板
    },
    // 预约车队相关接口
    getTrailerList: '/api/cas-service/omc/cas/job/eir/list', // 查询车队预约列表
    cancelTrailers: '/api/cas-service/omc/cas/job/eir/cancel', // 取消预约
    printTrailer: '/api/cas-service/omc/cas/job/eir/download_eir' // 打印
  }
}

export default URL
