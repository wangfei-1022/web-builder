import { getCustomerListApi, getCustomerTypeListApi, checkCustomerIsUniqueApi, getBusinessTypeListApi, getSalesListApi } from "@/api/partner/customerManage"
import optionBtnApplyTax from "./optionBtn"
import { AgGridVue } from "ag-grid-vue"
import { getYHTListApi } from '@/api/partner/base'
import { getReceiveBillListApi, getReceiveBillListTotalApi, getDictDataApi, receiveBillConfirmApi, receiveBillRecallApi, downloadBillFileApi } from "@/api/financial/fmsReceive"
import { parseTime, formatNumberToThousands } from '@/utils/index'
import { invoiceTypeMap } from '@/utils/constant'
import {
  getApplyTaxToInvoiceListByOperatorApi, // 税票申请-运营-待开票
  getApplyTaxToInvoiceTotalByOperatorApi,

  getApplyTaxInvoicedListByOperatorApi, // 税票申请-运营-已开票
  getApplyTaxInvoicedTotalByOperatorApi,

  getApplyTaxInvoicedListByBusinessApi, // 税票申请-商务-已开票
  getApplyTaxInvoicedTotalByBusinessApi,

  getApplyTaxRecallInvoiceListByOperatorApi, // 税票申请-运营-已作废
  getApplyTaxRecallInvoiceTotalByOperatorApi,

  getApplyTaxInvoicedListByFinanceApi, // 税票申请-财务-已开票-(财务-开票人)
  getApplyTaxInvoicedTotalByFinanceApi,

  getApplyTaxToInvoiceListByFinanceApi, //  税票申请-财务-待开票-(财务-开票人)
  getApplyTaxToInvoiceTotalByFinanceApi,

  getApplyCommercialInvoicedListByFinanceApi, // 形票-财务-已开票列表
  getApplyCommercialInvoicedTotalByFinanceApi,

  getApplyCommercialNullfiedListByOperatorApi, // 形票-运营-已作废
  getApplyCommercialNullfiedTotalByOperatorApi,

  getApplyCommercialInvoicedListByOperatorApi, // 形票-运营-已开票
  getApplyCommercialInvoicedTotalByOperatorApi,

  getApplyCommercialInvoicedListByBusinessApi, // 形票-商务-已开票
  getApplyCommercialInvoicedTotalByBusinessApi,

  getApplyCommercialToInvoiceListByOperatorApi, // 形票-运营-待开票
  getApplyCommercialToInvoiceTotalByOperatorApi,

  applyInvoiceTaxRecallApi, // 撤回开票申请
  applyInvoiceCommercialNullifyApi, // 形票的已开票申请作废(财务)
} from "@/api/financial/fmsReceiveInvoice"


export default {
  name: "FmsTaxApplyIncoiceList",
  components: {
    AgGridVue,
    optionBtnApplyTax
  },
  props: {
    applyState: {
      type: [String, Number],
      default: ''
    },
    invoiceType: {
      type: [String, Number],
      default: ''
    },
    role: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      invoiceTypeMap: invoiceTypeMap,
      formData: {
        applyNo: '',
        applyById: '',
        businessType: '',
        settlementCompanyId: '',
        settlementOfficeId: '',
        invoiceType: '',
        invoiceMedium: '',

        billState: '',
        invoiceState: '',
        invoiceGroupType: '',
        applyTimePeriod: []
      },
      billStateList: [],
      businessTypeList: [],
      invoiceMaterialTypeList: [],
      invoiceGroupTypeList: [],
      invoiceStateList: [], // 开票状态
      invoiceReceiptStateTypeList: [], // 发票状态
      invoiceTypeList: [],
      taxInvoiceTypeList: [], // 税票发票类型
      YHTList: [],
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],
      amountTotal: [], // 统计
      columnFields: [],
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
    this.getList()
    this.getBaseDataFn()
  },
  methods: {
    getBaseDataFn() {
      Promise.all([getYHTListApi(), getDictDataApi(7), getDictDataApi(3), getDictDataApi(12), getDictDataApi(13), getBusinessTypeListApi(), getDictDataApi(14), getDictDataApi(15), getDictDataApi(29)]).then(results => {
        const YHTRes = results[0]
        const billStateRes = results[1]
        const invoiceStateRes = results[2]
        const invoiceTypeRes = results[3]
        const invoiceMaterialTypeRes = results[4]
        const businessTypeRes = results[5]
        const invoiceGroupTypeRes = results[6]
        const invoiceReceiptStateTypeRes = results[7]
        const taxInvoiceTypeRes = results[8]

        if (YHTRes.ok) {
          this.YHTList = YHTRes.content
        }
        if (billStateRes.ok) {
          this.billStateList = billStateRes.content
        }
        if (invoiceStateRes.ok) {
          let arr = invoiceStateRes.content || []
          // 待申请时候 只显示 未开票和已开票
          if (this.applyState === 1) {
            let index = arr.findIndex(v => v.code === 3)
            arr.splice(index, 1)
          }
          this.invoiceStateList = arr
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
        if (invoiceGroupTypeRes.ok) {
          this.invoiceGroupTypeList = invoiceGroupTypeRes.content
        }
        if (invoiceReceiptStateTypeRes.ok) {
          this.invoiceReceiptStateTypeList = invoiceReceiptStateTypeRes.content
        }
        if (taxInvoiceTypeRes.ok) {
          this.taxInvoiceTypeList = taxInvoiceTypeRes.content
        }
      })
    },
    onReady(params) {
      this.gridApi = params.api
    },

    async getList() {
      this.loading = true
      this.$emit('count')
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      }
      if (this.formData.applyTimePeriod.length) {
        params.applyTimeStart = this.formData.applyTimePeriod[0]
        params.applyTimeEnd = this.formData.applyTimePeriod[1]
      }
      delete params.applyTimePeriod

      let listFn = null
      let totalFn = null

      // 运营和商务
      if (this.role === 'OPERATORS' || this.role === 'BUSINESS') {
        // 形票
        if (this.invoiceType === 3) {
          // 待开票申请
          if (this.applyState === 1) {
            listFn = getApplyCommercialToInvoiceListByOperatorApi
            totalFn = getApplyCommercialToInvoiceTotalByOperatorApi
          }
          // 已开票申请
          if (this.applyState === 2) {
            listFn = getApplyCommercialInvoicedListByOperatorApi
            totalFn = getApplyCommercialInvoicedTotalByOperatorApi

            // 商务看到的是 全部申请
            if (this.role === 'BUSINESS') {
              listFn = getApplyCommercialInvoicedListByBusinessApi
              totalFn = getApplyCommercialInvoicedTotalByBusinessApi
            }
          }
          // 已作废申请
          if (this.applyState === 3) {
            listFn = getApplyCommercialNullfiedListByOperatorApi
            totalFn = getApplyCommercialNullfiedTotalByOperatorApi
          }
        } else {
          // 税票
          // 待开票申请
          if (this.applyState === 1) {
            listFn = getApplyTaxToInvoiceListByOperatorApi
            totalFn = getApplyTaxToInvoiceTotalByOperatorApi
          }
          // 已开票申请
          if (this.applyState === 2) {
            listFn = getApplyTaxInvoicedListByOperatorApi
            totalFn = getApplyTaxInvoicedTotalByOperatorApi

            // 商务看到的是 全部申请
            if (this.role === 'BUSINESS') {
              listFn = getApplyTaxInvoicedListByBusinessApi
              totalFn = getApplyTaxInvoicedTotalByBusinessApi
            }
          }
          // 已作废申请
          if (this.applyState === 3) {
            listFn = getApplyTaxRecallInvoiceListByOperatorApi
            totalFn = getApplyTaxRecallInvoiceTotalByOperatorApi
          }
        }
      } else {
        // 形票
        if (this.invoiceType === 3) {
          // 已开票申请
          if (this.applyState === 2) {
            listFn = getApplyCommercialInvoicedListByFinanceApi
            totalFn = getApplyCommercialInvoicedTotalByFinanceApi
          }
        } else {
          // 税票
          // 待开票申请
          if (this.applyState === 1) {
            listFn = getApplyTaxToInvoiceListByFinanceApi
            totalFn = getApplyTaxToInvoiceTotalByFinanceApi
          }
          // 已开票申请
          if (this.applyState === 2) {
            listFn = getApplyTaxInvoicedListByFinanceApi
            totalFn = getApplyTaxInvoicedTotalByFinanceApi
          }
        }
      }

      if (totalFn) {
        totalFn(params).then(res => {
          if (res.ok) {
            res.content.forEach(v => {
              if (v.amountName === 'amount') {
                v.amounts.forEach(v => {
                  v.value = formatNumberToThousands(v.value)
                })
                this.amountTotal = v.amounts
              }
            })
          }
        })
      }

      if (listFn) {
        const res = await listFn(params)
        if (res.ok) {
          res.content.list = res.content.list || []
          this.total = parseInt(res.content.total, 10)
          res.content.list.forEach(v => {
            v.applyTime = parseTime(v.applyTime, '{y}-{m}-{d} {h}:{i}:{s}')
            v.role = this.role

            // 金额币种
            if (v.sourceAmounts) {
              let invoiceCurrencyAmountStr = []
              v.sourceAmounts.forEach(c => {
                c.value = formatNumberToThousands(c.value)
                invoiceCurrencyAmountStr.push(c.currency + ' ' + c.value)
              })
              v.invoiceCurrencyAmountStr = invoiceCurrencyAmountStr.join(',')
            }
          })
          this.dataList = res.content.list
        } else {
          this.total = 0
          this.dataList = []
        }
        this.loading = false
      }
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getList()
    },
    handleCurrentChange(page) {
      this.pageNum = page
      this.getList()
    },
    reset() {
      this.$refs.formData.resetFields()
      this.getList()
    },
    // 作废申请
    nullifyApplyFn() {
      let data = {
        invoiceApplyIds: []
      }
      let rows = this.gridApi.getSelectedRows()
      if (!rows.length) {
        this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
        return
      }
      rows.forEach(v => {
        data.invoiceApplyIds.push(v.id)
      })

      this.$confirm(this.$t('fmsReceiveInvoice.nullifyInfo'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        applyInvoiceCommercialNullifyApi(data).then(res => {
          if (res.ok) {
            this.getList()
            this.$message.success(this.$t('fmsReceiveInvoice.nullifySuccess'))
          }
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 撤回申请
    recallApplyFn() {
      let rows = this.gridApi.getSelectedRows()
      if (rows.length !== 1) {
        this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
        return
      }
      this.$refs.recallTaxApplyModalRef.show(rows[0])
    },
    // 开票
    invoiceMake(item) {
      // if (item.invoiceMedium === 1) {
      //   this.$confirm('系统已对接数电票接口，不支持开纸票。财务至易票云线下开具纸票后，系统回传发票号及更新系统费用申请开票及开票状态。', this.$t('receiveFms.mention'), {
      //     confirmButtonText: this.$t('common.confirm'),
      //     cancelButtonText: this.$t('common.cancel'),
      //     type: 'warning'
      //   }).then(() => {
      //     this.$router.push({ name: `FmsTaxInvoiceMake`, query: { id: item.id } })
      //   }).catch(() => {
      //   })
      // } else {
      this.$router.push({ name: `FmsTaxInvoiceMake`, query: { id: item.id } })
      // }
    },
    // 查看
    view(item) {
      this.$router.push({
        name: `FmsTaxInvoiceApplyDetail`,
        query: {
          id: item.id,
          invoiceType: item.invoiceType,
          role: this.role
        }
      })
    },
    // 撤回
    recall(item) {
      // 撤回开票申请，申请开票费用将回退至未申请状态，是否撤回？
      this.$confirm(this.$t('fmsReceiveInvoice.recallApplyInfo'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        this.loading = true
        applyInvoiceTaxRecallApi({ invoiceApplyIds: [item.id] }).then(res => {
          if (res.ok) {
            this.$message.success(this.$t('fmsReceiveInvoice.recallApplySuccess'))
            this.getList()
          }
          this.loading = false
        })
      }).catch(() => {
      })
    }
  }
}
