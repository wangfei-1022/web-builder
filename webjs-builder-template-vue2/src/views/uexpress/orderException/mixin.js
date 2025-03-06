import {
  getOrderExceptionListApi,
  getOrderExceptionListByNosApi,
  getOrderExceptionCountApi,
  orderExceptionExportByIdsApi, // 未妥投异常-勾选导出
  orderExceptionExportByConditionsApi, // 未妥投异常-条件导出
  orderExceptionExportByNosApi, // 未妥投异常-单号导出
} from '@/api/uexpress/orderException'
import { parseTime } from '@/utils/index'
import OrderNoComponent from "@/views/uexpress/order/components/OrderNo";
import MemberOrderNoComponent from "@/views/uexpress/order/components/MemberOrderNo";
import OrderChannelNoComponent from "@/views/uexpress/order/components/OrderChannelNo";

export default {
  components: {
    OrderNoComponent,
    MemberOrderNoComponent,
    OrderChannelNoComponent
  },
  data() {
    return {
      activeName: 'BASE_SEARCH',
      loading: false,
      abnormalityState: '',
      formData: {
        noType: 'orderNo',
        nos: '',
        orderNo: '',
        abnormalityState: '',
        abnormalityType: '', // 异常类型
        channelOrderNo: '',
        memberOrderNo: '',
        orderState: '',
        exceptionFlag: null,
        printLabelFlag: null,
        salesSettlementState: '',
        channelPushState: '',
        productCode: null,
        consigneeCountryCode: '',
        channelCode: null,
        channelId: null,
        productType: null,
        customerId: '',
        supplierId: null,
        periodTimeArr: [],
        predictTimeArr: [],
        processedTime: [],
        periodTimeType: 'orderTime',
        abnormalityAuditState: '' // 审核状态
      },
      pageSize: 50,
      pageNum: 0,
      total: 0,
      dataList: [],
      columnFields: null,
      gridApi: null,
      columnApi: null,
      gridOptions: {
        context: {
          componentParent: this
        },
        rowSelection: 'multiple', // 设置多行可选
        enableRangeSelection: true, // 启用范围选择
        rowMultiSelectWithClick: true, // 允许多行同时被选中 - checkbox可多选
        suppressRowClickSelection: true // 点击行不触发行选中 - 只选中当前单元格
      },
      sideBarDefs: { toolPanels: ['columns', 'filter'], visible: false },

      pendingCount: 0,
      processingCount: 0,
      solvedCount: 0,
      allCount: 0
    }
  },
  methods: {
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    getCount() {
      let data = {
        abnormalityType: this.abnormalityType
      }
      getOrderExceptionCountApi(data).then(res => {
        if (res.ok) {
          res.content.forEach(v => {
            if (v.code === 1) {
              this.pendingCount = v.count
            }
            if (v.code === 2) {
              this.processingCount = v.count
            }
            if (v.code === 3) {
              this.solvedCount = v.count
            }
            if (v.code === null) {
              this.allCount = v.count
            }
          })
        }
      })
    },
    abnormalityTabsClick(item) {
      this.abnormalityState = item.name
      this.getList()
    },
    abnormalityTypeTabsClick(item) {
      this.abnormalityType = item.name
      this.getList()
    },
    exportFn(exportType) {
      let fn = null
      let arr = this.gridApi.getSelectedRows()
      let params = this.getParams()
      params.type = exportType
      if (arr.length > 0) {
        fn = orderExceptionExportByIdsApi
        let ids = []
        arr.forEach(v => {
          ids.push({
            id: v.id,
            abnormalitySk: v.abnormalitySk
          })
        })
        params = {
          type: exportType,
          ids: ids
        }
      } else if (this.activeName === 'NO_SEARCH') {
        fn = orderExceptionExportByNosApi
      } else if (this.activeName === 'BASE_SEARCH') {
        fn = orderExceptionExportByConditionsApi
      }
      fn(params).then(res => {
        if (res.ok) {
          this.$message.success(this.$t("uexpressOrder.exportSuccess"));
        }
      })
    },
    channelSelected(item) {
      this.formData.channelId = item.channelId
      this.getList()
    },
    getParams() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      if (this.activeName === 'NO_SEARCH') {
        params.nos = this.formData.nos ? this.formData.nos.split(/,|，|\s+/) : []
      } else {
        params = {
          ...params,
          ...this.formData
        }
        params[params.noType] = params.nos
        if (params.periodTimeArr && params.periodTimeArr.length) {
          params[this.formData.periodTimeType + 'Start'] = params.periodTimeArr[0]
          params[this.formData.periodTimeType + 'End'] = params.periodTimeArr[1]
        }
        if (params.predictTimeArr && params.predictTimeArr.length) {
          params.predictTimeStart = params.predictTimeArr[0]
          params.predictTimeEnd = params.predictTimeArr[1]
        }
        if (params.processedTimeArr && params.processedTimeArr.length) {
          params.processedTimeStart = params.processedTimeArr[0]
          params.processedTimeEnd = params.processedTimeArr[1]
        }

        // 转换
        params.memOrderNo = params.memberOrderNo // 客户参考号
        params.orderChannelNo = params.channelOrderNo // 运单号
        params.orderCreateTimeStart = params.orderTimeStart // 下单时间开始
        params.orderCreateTimeEnd = params.orderTimeEnd // 下单时间结束
        params.countryCode = params.consigneeCountryCode // 国家
        // params.channelId = params.channelId // 渠道
        params.channelSupplierId = params.supplierId // 供应商
      }
      // 当是Tabs切换的时候 从tabs获取异常状态
      if (this.abnormalityState === '1' || this.abnormalityState === '2' || this.abnormalityState === '3') {
        params.abnormalityState = this.abnormalityState
      }
      if (this.abnormalityType) {
        params.abnormalityType = this.abnormalityType
      }
      return params
    },
    formatDataList(data) {
      data.forEach(v => {
        v.memberOrderNo = v.memOrderNo // 客户参考号
        v.orderChannelNo = v.channelOrderNo // 运单号
        v.abnormalType = v.abnormalityType // 异常类型
        v.abnormalTypeName = v.abnormalityTypeName
        v.abnormalState = v.abnormalityState // 异常状态
        v.abnormalStateName = v.abnormalityStateName
        v.outboundTime = v.orderOutBoundTime // 出库时间
        v.inboundTime = v.orderInboundTime // 入库时间
        v.orderTime = v.orderCreateTime // 下单时间
        v.consigneeCountryName = v.countryName // 目的地

        v.orderTime = parseTime(v.orderTime, "{y}-{m}-{d} {h}:{i}:{s}");
        v.inboundTime = parseTime(v.inboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
        v.outboundTime = parseTime(v.outboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
        v.predictTime = parseTime(v.predictTime, "{y}-{m}-{d} {h}:{i}:{s}");
        v.processedTime = parseTime(v.processedTime, "{y}-{m}-{d} {h}:{i}:{s}");
        v.flowUpTime = parseTime(v.flowUpTime, "{y}-{m}-{d} {h}:{i}:{s}");
        v.boxingTime = parseTime(v.boxingTime, "{y}-{m}-{d} {h}:{i}:{s}");
        v.customerDeadlineProcessingTime = parseTime(v.customerDeadlineProcessingTime, "{y}-{m}-{d} {h}:{i}:{s}");
      })
      return data
    },
    async getList() {
      this.loading = true;
      const params = this.getParams()
      let fn = this.activeName === 'NO_SEARCH' ? getOrderExceptionListByNosApi : getOrderExceptionListApi
      const res = await fn(params)
      if (res && res.ok && res.content) {
        let dataList = this.formatDataList(res.content.list)
        this.dataList = dataList
        this.total = Number(res.content.total)
      } else {
        this.dataList = []
        this.total = 0
      }
      this.loading = false;
    },
    reset() {
      this.formData.channelId = ''
      this.$refs.formDataRef.resetFields()
      this.$refs.formDataSimpleRef.resetFields()
      this.getList();
    },
    viewTrackFn(item) {
      this.$router.push({ name: 'TraceSearch', query: { orderNo: item.orderNo } })
    }
  }
}
