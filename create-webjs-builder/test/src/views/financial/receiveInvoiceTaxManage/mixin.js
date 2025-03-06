import { getCustomerListApi, getCustomerTypeListApi, checkCustomerIsUniqueApi, getBusinessTypeListApi, getSalesListApi } from "@/api/partner/customerManage"
import optionBtnInvoiceOper from "./optionBtn"
import { AgGridVue } from "ag-grid-vue"
import { getYHTListApi } from '@/api/partner/base'
import { getReceiveBillListApi, getReceiveBillListTotalApi, getDictDataApi, receiveBillConfirmApi, receiveBillRecallApi, downloadBillFileApi } from "@/api/financial/fmsReceive"
import { parseTime, formatNumberToThousands, downloadFile } from '@/utils/index'
import { invoiceTypeMap, invoiceTypeList, invoiceMaterialTypeMap, invoiceMaterialTypeList } from '@/utils/constant'
import {
  getCommercialInvoiceSendExceptListByFinanceApi, // 形票-财务-推送异常
  getCommercialInvoiceSendExceptTotalByFinanceApi,

  getCommercialInvoiceTouploadListByFinanceApi, // 形票-财务-待回传
  getCommercialInvoiceTouploadTotalByFinanceApi,

  getCommercialInvoicedListByFinanceApi, // 形票-财务-形票列表
  getCommercialInvoicedTotalByFinanceApi,

  getCommercialInvoicedListByOperatorApi, // 形票-运营-形票列表
  getCommercialInvoicedTotalByOperatorApi,

  getCommercialInvoicedListByBusinessApi, // 形票-商务-形票列表
  getCommercialInvoicedTotalByBusinessApi,

  getTaxInvoicedListByOperatorApi, // 税票-运营-形票列表
  getTaxInvoicedTotalByOperatorApi,

  getTaxInvoicedListByBusinessApi, // 税票-商务-形票列表
  getTaxInvoicedTotalByBusinessApi,

  getTaxToInvoiceListByFinanceApi, // 税票-财务-待提交税控
  getTaxToInvoiceTotalByFinanceApi,

  getTaxInvoiceExceptListByFinanceApi, // 税票-财务-异常
  getTaxInvoiceExceptTotalByFinanceApi,

  getTaxInvoiceTouploadListByFinanceApi, // 税票-财务-待回传
  getTaxInvoiceTouploadTotalByFinanceApi,

  getTaxInvoicedListByFinanceApi, // 税票-财务-开票完成 税控列表
  getTaxInvoicedTotalByFinanceApi, // 税票-财务-开票完成 税控列表 - 合计
  invoiceTaxToSubmitApi, // 提交税控
  invoiceTaxReverseSubmitApi, // 红冲-提交税控
  invoiceTaxReverseCancelApi, // 取消红冲操作

  invoiceTaxNullifyApi, // 税票-作废
  invoiceTaxNullifyCancelApi, // 税票-取消作废

  resendEmailTaxInvoiceApi, // 税票- 推送失败后 - 重新推送
  resendEmailCommercialInvoiceApi, // 形票- 推送失败后 - 重新推送

  invoiceTaxCancelApi, // 待提交税控-撤回
  invoiceTaxExpressNoApi, // 税票-回传单号
  invoiceCommercialExpressNoApi, // 形票-回传单号
  invoiceTaxPrintApi, // 打印发票
  invoiceTaxDownloadFilesApi, // 税票-下载发票
  invoiceCommercialDownloadFilesApi, // 形票-下载发票
  invoiceTaxDownloadFilesBySelectApi, // 税票-批量下载文件
  invoiceCommercialDownloadFilesBySelectApi, // 形票-批量下载文件
  invoiceTaxFileUploadApi, // 税票-上传文件
  invoiceCommercialFileUploadApi // 形票-上传文件
} from "@/api/financial/fmsReceiveInvoice"


// 税控发票列表
export default {
  name: "FmsTaxIncoiceListComponent",
  components: {
    AgGridVue,
    optionBtnInvoiceOper

  },
  props: {
    role: {
      type: String,
      default: ''
    },
    invoiceState: {
      type: [String, Number],
      default: ''
    },
    invoiceType: {
      type: [String, Number],
      default: ''
    },
    billState: String
  },
  data() {
    return {
      // 上传文件
      uploadFileInvoiceId: '',
      uploadFileInvoiceType: '',
      uploadVisible: false,
      uploadForm: {
        files: []
      },
      uploadFormRules: {
        files: [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
      },
      uploadLoading: false,

      // 批量下载文件
      batchDownloadFileVisible: false,
      batchDownloadFileLoading: false,
      batchDownloadFileForm: {
        invoiceFileTypes: []
      },
      batchDownloadFileFormRules: {
        invoiceFileTypes: [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
      },
      batchDownloadFileList: [],

      // 作废发票
      nullifyItem: null, // 单个作废的存储
      cancelVisible: false,
      cancelForm: {},
      cancelFormRules: {},
      cancelInvoiceNo: '',
      cancelLoading: false,

      // 开具红冲
      reverseItem: null, // 单个开具红冲的存储
      reverseVisible: false,
      reverseForm: {
        taxInvoiceReverseReason: ''
      },
      reverseFormRules: {
        taxInvoiceReverseReason: [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
      },
      reverseLoading: false,


      expressNoVisible: false,
      expressNoForm: {
        expressNo: ''
      },
      expressNoFormRules: {
        expressNo: [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
      },
      expressNoInvoiceNo: '',
      expressNoLoading: false,
      // 回传单号

      currentItem: {}, // 当前操作哪一行

      invoiceTypeMap: invoiceTypeMap,
      formData: {
        invoiceSeqNo: '',
        applyNo: '',
        invoiceNo: '',
        businessType: '',
        settlementCompanyId: '',
        settlementOfficeId: '',
        invoiceType: '',
        clearState: '',
        instructionState: '',
        applyById: '',
        invoiceMedium: '',
        billState: '',
        invoiceState: '',
        taxInvoiceState: '',
        commercialInvoiceState: '',
        expressState: '',
        notifyState: '',
        expressNo: '',
        invoiceDatePeriod: [], // 开票时间
        applyTimePeriod: []
      },
      expressStateList: [],
      notifyStateList: [],
      cancelTypeList: [],
      clearStateList: [],
      applyClearStateList: [],
      billStateList: [],
      businessTypeList: [],
      invoiceTypeList: [],
      taxInvoiceTypeList: [], // 税票发票类型
      invoiceStateList: [], // 开票状态
      taxInvoiceStateTypeList: [], // 税票发票状态
      commercialInvoiceStateTypeList: [], // 形票发票状态
      invoiceMaterialTypeList: [],
      YHTList: [],
      pageSizeRange: [10, 20, 30, 50],
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],
      amountTotal: [], // 统计
      sideBarDefs: { toolPanels: ["columns", "filter"], visible: false },
      gridOptions: {
        rowSelection: "multiple", // 设置多行可选
        animateRows: true,
        suppressRowClickSelection: true,
        context: {
          componentParent: this
        }
      },
      gridApi: {},
      loading: false
    }
  },
  created() {
    if (this.invoiceType === 1 || this.invoiceType === 2) {
      this.batchDownloadFileList = [{
        code: 3,
        name: '发票'
      }, {
        code: 7,
        name: '开票申请书'
      }]
      this.batchDownloadFileForm.invoiceFileTypes = [3, 7]
    } else {
      this.batchDownloadFileList = [{
        code: 4,
        name: '发票'
      }, {
        code: 7,
        name: '开票申请书'
      }]
      this.batchDownloadFileForm.invoiceFileTypes = [4, 7]
    }
    this.getList()
    this.getBaseDataFn()
  },
  methods: {
    // 1 入账状态 2 发票申请状态 3 开票状态 4 核销状态 5 费用确认单状态 6 发票税率 7 账单状态 8 单位 9 盈亏状态 12、发票类型 13、发票材质 14、开票方式 15、发票状态 16、寄送状态 17、打印状态 18、通知推送状态 19、作废原因
    getBaseDataFn() {
      Promise.all([getYHTListApi(), getDictDataApi(7), getDictDataApi(3), getDictDataApi(12), getDictDataApi(13), getBusinessTypeListApi(), getDictDataApi(16), getDictDataApi(18), getDictDataApi(19), getDictDataApi(20), getDictDataApi(21), getDictDataApi(4), getDictDataApi(25), getDictDataApi(29)]).then(results => {
        const YHTRes = results[0]
        const billStateRes = results[1]
        const invoiceStateRes = results[2]
        const invoiceTypeRes = results[3]
        const invoiceMaterialTypeRes = results[4]
        const businessTypeRes = results[5]
        const expressStateTypeRes = results[6]
        const notifyStateTypeRes = results[7]
        const cancelTypeRes = results[8]
        const taxInvoiceStateTypeRes = results[9]
        const commercialInvoiceStateTypeRes = results[10]
        const clearStateRes = results[11]
        const applyClearStateRes = results[12]
        const taxInvoiceTypeRes = results[13]

        if (YHTRes.ok) {
          this.YHTList = YHTRes.content
        }
        if (billStateRes.ok) {
          this.billStateList = billStateRes.content
        }
        if (invoiceStateRes.ok) {
          this.invoiceStateList = invoiceStateRes.content
        }
        if (invoiceTypeRes.ok) {
          this.invoiceTypeList = invoiceTypeRes.content
        }
        if (invoiceMaterialTypeRes.ok) {
          this.invoiceMaterialTypeList = invoiceMaterialTypeRes.content
        }
        if (businessTypeRes.ok) {
          this.businessTypeList = businessTypeRes.content
        }
        if (expressStateTypeRes.ok) {
          this.expressStateList = expressStateTypeRes.content
        }
        if (notifyStateTypeRes.ok) {
          this.notifyStateList = notifyStateTypeRes.content
        }
        if (cancelTypeRes.ok) {
          this.cancelTypeList = cancelTypeRes.content
        }
        if (taxInvoiceStateTypeRes.ok) {
          this.taxInvoiceStateTypeList = taxInvoiceStateTypeRes.content
        }
        if (commercialInvoiceStateTypeRes.ok) {
          this.commercialInvoiceStateTypeList = commercialInvoiceStateTypeRes.content
        }
        if (clearStateRes.ok) {
          this.clearStateList = clearStateRes.content
        }
        if (applyClearStateRes.ok) {
          this.applyClearStateList = applyClearStateRes.content
        }

        if (taxInvoiceTypeRes.ok) {
          this.taxInvoiceTypeList = taxInvoiceTypeRes.content
        }
      })
    },
    onReady(params) {
      this.gridApi = params.api
    },
    getParams() {
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }

      if (this.formData.applyTimePeriod.length) {
        params.applyTimeStart = this.formData.applyTimePeriod[0]
        params.applyTimeEnd = this.formData.applyTimePeriod[1]
      }

      if (this.formData.invoiceDatePeriod.length) {
        params.invoiceDateStart = this.formData.invoiceDatePeriod[0]
        params.invoiceDateEnd = this.formData.invoiceDatePeriod[1]
      }

      delete params.applyTimePeriod
      delete params.invoiceDatePeriod

      return params
    },
    formatListData(data) {
      data.forEach(v => {
        v.invoiceStateDefine = this.invoiceState
        v.role = this.role
        v.applyTime = parseTime(v.applyTime, '{y}-{m}-{d} {h}:{i}:{s}')
        v.invoiceDate = parseTime(v.invoiceDate, '{y}-{m}-{d} {h}:{i}:{s}')
        v.nullifyDate = parseTime(v.nullifyDate, '{y}-{m}-{d} {h}:{i}:{s}')
        v.invoiceAmount = formatNumberToThousands(v.invoiceAmount)

        // 金额币种 形票展示用的
        if (v.sourceAmounts) {
          let invoiceCurrencyAmountStr = []
          v.sourceAmounts.forEach(c => {
            c.value = formatNumberToThousands(c.value)
            invoiceCurrencyAmountStr.push(c.currency + ' ' + c.value)
          })
          v.invoiceCurrencyAmountStr = invoiceCurrencyAmountStr.join(',')
        }
        // 发票号 形票展示用的
        v.invoiceNoCommercial = ''
        let str = ''
        if (v.companyInvoiceNo) {
          str = v.companyInvoiceNo ? '(' + v.companyInvoiceNo + ')' : ''
        }
        v.invoiceNoCommercial = v.invoiceNo + str
      })
      return data
    },
    reset() {
      this.$refs.formData.resetFields()
      this.getList()
    },
    // 待提交税控-撤回
    cancelFn(item) {
      this.$confirm(this.$t('fmsReceiveInvoice.recallInfo'), this.$t('common.mention'), {
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonText: this.$t('common.confirm')
      }).then(() => {
        this.loading = true
        invoiceTaxCancelApi({ invoiceIds: [item.id] }).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('fmsReceiveInvoice.recallSuccess'))
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {
        // 取消
      });
    },
    // 上传文件
    uploadFile(item, fileType) {
      this.uploadFileInvoiceId = item.id
      this.uploadFileInvoiceType = item.invoiceType
      this.uploadVisible = true
      this.uploadForm.files = []
      this.fileType = fileType
    },
    uploadSubmitFn() {
      // 4 发票扫描件 5账单 6其他
      let data = {
        invoiceId: this.uploadFileInvoiceId,
        invoiceFileType: this.fileType,
        files: this.uploadForm.files
      }
      this.$refs.uploadFormRef.validate(valid => {
        if (valid) {
          this.uploadLoading = true
          let fn = this.uploadFileInvoiceType === 3 ? invoiceCommercialFileUploadApi : invoiceTaxFileUploadApi
          fn(data).then(res => {
            if (res.ok) {
              this.uploadVisible = false
              this.$message.success(this.$t('fmsReceiveInvoice.uploadSuccess'))
              this.getList()
            }
            this.uploadLoading = false
          })
        }
      })
    },
    // 批量下载文件
    batchDownloadFileFn() {
      let rows = this.gridApi.getSelectedRows()
      if (!rows.length) {
        this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
        return
      }
      this.batchDownloadFileVisible = true
    },
    batchDownloadFileConfirmFn() {
      let data = {
        invoiceIds: [],
        invoiceFileTypes: []
      }
      let invoiceType = ''
      let rows = this.gridApi.getSelectedRows()
      if (!rows.length) {
        this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
        return
      }
      rows.forEach(v => {
        invoiceType = v.invoiceType
        data.invoiceIds.push(v.id)
      })
      this.$refs.batchDownloadFileRef.validate(valid => {
        if (valid) {
          data.invoiceFileTypes = this.batchDownloadFileForm.invoiceFileTypes
          let fn = invoiceType === 3 ? invoiceCommercialDownloadFilesBySelectApi : invoiceTaxDownloadFilesBySelectApi
          this.batchDownloadFileLoading = true
          fn(data).then(res => {
            if (res.ok) {
              this.batchDownloadFileVisible = false
              window.location.href = res.content.url
            }
            this.batchDownloadFileLoading = false
          })
        }
      })
    },
    resendEmailFn(item) {
      let fn = null
      if (this.invoiceType === 1 || this.invoiceType === 2) {
        fn = resendEmailTaxInvoiceApi
      } else {
        fn = resendEmailCommercialInvoiceApi
      }
      fn({ invoiceId: item.id }).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsReceiveInvoice.resendEmailSuccess'))
          this.getList()
        }
      })
    },
    // 下载发票
    invoiceDownloadFn() {
      let invoiceIds = []
      let invoiceType = ''
      let rows = this.gridApi.getSelectedRows()
      if (!rows.length) {
        this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
        return
      }
      rows.forEach(v => {
        invoiceType = v.invoiceType
        invoiceIds.push(v.id)
      })
      let fn = invoiceType === 3 ? invoiceCommercialDownloadFilesApi : invoiceTaxDownloadFilesApi
      fn(invoiceIds).then(res => {
        if (res.ok) {
          window.location.href = res.content.url
        }
      })
    },
    // 打印发票
    printInvoiceFn(item) {
      let data = {
        invoiceIds: []
      }
      let rows = this.gridApi.getSelectedRows()
      if (!rows.length) {
        this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
        return
      }
      rows.forEach(v => {
        data.invoiceIds.push(v.id)
      })

      invoiceTaxPrintApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsReceiveInvoice.printSuccess'))
        }
      })
    },
    // 查看
    view(item) {
      // 形票
      this.$router.push({ name: `FmsTaxInvoiceDetail`, query: { id: item.id, invoiceType: item.invoiceType } })
    },
    // 重新红冲
    reverseAgainFn(item) {
      let data = {
        invoiceIds: [item.id]
      }
      invoiceTaxReverseSubmitApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsReceiveInvoice.submitSuccessInfo'))
          this.getList()
        }
      })
    },
    // 确认开具红冲
    reverseSubmitFn() {
      this.$refs.reverseFormRef.validate(v => {
        if (v) {
          let id = ''
          if (this.reverseItem) {
            id = this.reverseItem.id
          } else {
            let rows = this.gridApi.getSelectedRows()
            id = rows[0].id
          }
          this.reverseVisible = false
          this.$router.push({
            name: `FmsTaxInvoiceReverse`,
            query: {
              id: id,
              taxInvoiceReverseReason: this.reverseForm.taxInvoiceReverseReason
            }
          })
        }
      })
    },
    // 开具红冲
    reverseInvocieFn(item) {
      let id = null
      if (item) {
        id = item.id
        this.reverseItem = item
      } else {
        let rows = this.gridApi.getSelectedRows()
        if (rows.length !== 1) {
          this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
          return
        }
        if (rows[0].taxInvoiceState !== 2) {
          this.$message.error(this.$t('fmsReceiveInvoice.reverseInvocieCheck'))
          return
        }
        id = rows[0].id
        this.reverseItem = null
      }
      this.reverseVisible = true
    },
    reverseInvocieCloseFn() {
      this.reverseItem = null
      this.reverseVisible = false
    },
    // 撤回红冲
    reverseInvocieCancelFn(item) {
      this.$confirm(this.$t('fmsReceiveInvoice.reverseInvocieCancelInfo'), this.$t('common.mention'), {
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonText: this.$t('common.confirm')
      }).then(() => {
        invoiceTaxReverseCancelApi(item.id).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('fmsReceiveInvoice.cancelSuccess'))
            this.getList()
          }
        })
      }).catch(() => {
        // 取消
      });
    },
    // 提交税控
    submitTaxFn(item) {
      let data = {
        invoiceIds: []
      }
      if (item) {
        data.invoiceIds.push(item.id)
      } else {
        let rows = this.gridApi.getSelectedRows()
        if (!rows.length) {
          this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
          return
        }
        rows.forEach(v => {
          data.invoiceIds.push(v.id)
        })
      }
      // 当红冲的提交税控时候 调用不同的接口(后台处理)
      invoiceTaxToSubmitApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsReceiveInvoice.submitSuccessInfo'))
          this.getList()
        }
      })
    },
    // 取消作废
    nullifyCancelFn(item) {
      this.$confirm(this.$t('fmsReceiveInvoice.nullifyCancelInfo'), this.$t('common.mention'), {
        cancelButtonText: this.$t('common.cancel'),
        confirmButtonText: this.$t('common.confirm')
      }).then(() => {
        invoiceTaxNullifyCancelApi({ invoiceIds: [item.id] }).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('fmsReceiveInvoice.cancelSuccess'))
            this.getList()
          }
        })
      }).catch(() => {
        // 取消
      });
    },
    // 作废
    nullifyFn(item) {
      if (item) {
        this.nullifyItem = item
      } else {
        let rows = this.gridApi.getSelectedRows()
        if (!rows.length) {
          this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
          return
        }
        // 状态的校验
        let flag = false
        rows.forEach(v => {
          if (v.taxInvoiceState !== 2) {
            flag = true
          }
        })
        if (flag) {
          // 只有发票状态是开票完成的才能进行作废操作！
          this.$message.error(this.$t('fmsReceiveInvoice.nullifyInvocieCheck'))
          return
        }
        let cancelInvoiceNo = []
        rows.forEach(v => {
          cancelInvoiceNo.push(v.invoiceNo)
        })
        this.cancelInvoiceNo = cancelInvoiceNo.join('、')
      }
      this.cancelVisible = true
    },
    nullifyColseFn() {
      this.nullifyItem = null
      this.cancelVisible = false
    },
    nullifySubmitFn() {
      let data = {
        invoiceIds: []
      }
      if (this.nullifyItem) {
        data.invoiceIds.push(this.nullifyItem.id)
      } else {
        let rows = this.gridApi.getSelectedRows()
        rows.forEach(v => {
          data.invoiceIds.push(v.id)
        })
      }

      this.cancelLoading = true
      invoiceTaxNullifyApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsReceiveInvoice.nullifySuccess'))
          this.getList()
          this.nullifyItem = null
          this.cancelVisible = false
        }
        this.cancelLoading = false
      })
    },
    // 回传单号
    expressNoFn() {
      let rows = this.gridApi.getSelectedRows()
      if (!rows.length) {
        this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
        return
      }
      let expressNoInvoiceNo = []
      let flag = false
      rows.forEach(v => {
        expressNoInvoiceNo.push(v.invoiceNo)
        if (v.expressState !== 1) {
          flag = true
        }
      })
      if (flag) {
        // 只有寄送状态为待寄送的才能回传单号
        this.$message.error(this.$t('fmsReceiveInvoice.expressNoCheck'))
        return
      }
      this.expressNoInvoiceNo = expressNoInvoiceNo.join('、')
      this.expressNoVisible = true
    },
    expressNoSubmitFn() {
      this.$refs.expressNoFormRef.validate(valid => {
        if (valid) {
          let data = {
            invoiceIds: [],
            expressNo: this.expressNoForm.expressNo
          }
          let rows = this.gridApi.getSelectedRows()
          rows.forEach(v => {
            data.invoiceIds.push(v.id)
          })
          this.expressNoLoading = true
          let invoiceType = rows[0].invoiceType
          let fn = invoiceType === 3 ? invoiceCommercialExpressNoApi : invoiceTaxExpressNoApi
          fn(data).then(res => {
            if (res.ok) {
              this.$message.success(this.$t('fmsReceiveInvoice.expressNoSuccess'))
              this.getList()
              this.expressNoVisible = false
            }
            this.expressNoLoading = false
          })
        }
      })
    },
    editInvoiceFn(item) {
      this.$router.push({ name: `FmsTaxInvoiceUpdate`, query: { id: item.id } })
    },
    // 申请核销 或者 对冲
    applyOrHedgeClear(isHedge) {
      let selectedRows = this.gridApi.getSelectedRows()
      if (selectedRows.length <= 0) {
        this.$message.error(this.$t("common.please_select_one_data"))
        return
      }
      let ids = []
      let selectedSettlementId = []
      let MSG = ''
      selectedRows.forEach(v => {
        ids.push(v.id)
        if (selectedSettlementId.indexOf(v.settlementCompanyId) < 0) {
          selectedSettlementId.push(v.settlementCompanyId)
        }
        // 只有发票状态为开票完成的才能进行核销操作
        if ((v.invoiceType === 1 || v.invoiceType === 2) && v.taxInvoiceState !== 2) {
          MSG = this.$t('fmsReceiveInvoice.clearCheckInfo1')
        }
        // 只有发票状态为已开票的才能进行核销操作
        if (v.invoiceType === 3 && v.commercialInvoiceState !== 2) {
          MSG = this.$t('fmsReceiveInvoice.clearCheckInfo2')
        }
        // 只有核销状态为未核销或者部分核销才能进行核销操作
        if (v.clearState !== 1 && v.clearState !== 2) {
          MSG = this.$t('fmsReceiveInvoice.clearCheckInfo3')
        }
        // 只有申请核销状态为未申请或者部分申请才能进行核销操作
        if (v.instructionState !== 1 && v.instructionState !== 2) {
          MSG = this.$t('fmsReceiveInvoice.clearCheckInfo4')
        }
      })
      // 不是同一家结算单位的不支持一起申请核销！
      if (selectedSettlementId.length > 1) {
        this.$message.error(this.$t('fmsReceiveInvoice.clearCheckInfo5'))
        return
      }
      if (MSG) {
        this.$message.error(MSG)
        return
      }
      // 未核销 已对账
      let name = isHedge ? 'FmsReceiptOffsetClearPage' : 'FmsReceiptApplyClearPage'
      this.$router.push({
        name: name,
        query: {
          ids: ids.join(','),
          origin: 'INVOICE',
          back: this.$route.name
        }
      })
    }
  }
}
