<template>
  <div class="right-main-wrapper" v-loading="loading">
    <el-tabs v-model="activeName" class="top-tabs">
			<el-tab-pane :label='$t("uexpressOrder.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
			<el-tab-pane :label='$t("uexpressOrder.noSearch")' name="NO_SEARCH"></el-tab-pane>
		</el-tabs>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini" class="multipleNoSearch">
            <el-form-item label="" prop="nos" class='multiple-no-item'>
              <template slot="label">
                <el-select v-model="formData.noType" style="width: 100px;">
                  <el-option :label="$t('uexpressOrder.no')" value="1" />
                  <el-option :label="$t('uexpressOrder.boxNo')" value="2" />
                  <el-option :label="$t('uexpressOrder.outboundNo')" value="3" />
                  <el-option :label="$t('uexpressOrder.bolNo')" value="4"/>
                </el-select>
              </template>
              <el-input v-model="formData.nos" type="textarea" rows="3" resize="none" clearable :placeholder="$t('receiveFms.multipleNosInfo')" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="activeName === 'BASE_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item label="">
              <el-input v-trim :placeholder="$t('common.placeholder')" v-model="formData.noValue" class="input-with-select" style="width: 440px;" clearable>
                <el-select v-model="formData.orderNoType" slot="prepend" style="width: 110px;" >
                  <el-option key="orderNo" :label="$t('uexpressOrder.orderNo')" value="orderNo"></el-option>
                  <el-option key="channelOrderNo" :label="$t('uexpressOrder.channelOrderNo')" value="channelOrderNo"></el-option>
                  <el-option key="memberOrderNo" :label="$t('uexpressOrder.memberOrderNo')" value="memberOrderNo"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="" prop="periodTimeArr">
              <template slot="label">
                <el-select v-model="formData.periodTimeType" style="width: 100px;">
                  <el-option key="orderTime" :label="$t('uexpressOrder.orderTime')" value="orderTime"></el-option>
                  <el-option key="inboundTime" :label="$t('uexpressOrder.inboundTime')" value="inboundTime"></el-option>
                  <el-option key="outboundTime" :label="$t('uexpressOrder.outboundTime')" value="outboundTime"></el-option>
                </el-select>
              </template>
              <search-date-picker v-model="formData.periodTimeArr" type="datetime"  clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("uexpressOrder.orderState")' prop="orderStateList">
              <el-select v-model="formData.orderStateList" filterable multiple collapse-tags>
                <el-option v-for="item in orderStatusList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.exceptionFlag')" prop="exceptionFlag">
              <el-select v-model="formData.exceptionFlag">
                <el-option :label="$t('common.all')" value="" />
                <el-option :label="$t('common.falseText')" :value="0" />
                <el-option :label="$t('common.trueText')" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.printLabelFlag')" prop="printLabelFlag">
              <el-select v-model="formData.printLabelFlag">
                <el-option :label="$t('common.all')" value="" />
                <el-option :label="$t('common.falseText')" :value="0" />
                <el-option :label="$t('common.trueText')" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.salesSettlementState')" prop="salesSettlementStateList">
              <el-select v-model="formData.salesSettlementStateList" multiple collapse-tags>
                <el-option v-for="item in settlementStateList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.channelPushState')" prop="channelPushState">
              <el-select v-model="formData.channelPushState" filterable>
                <el-option :label="$t('common.all')" value="" />
                <el-option v-for="item in channelPushStateList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.productId')" prop="productCode">
              <el-select v-model="formData.productCode" filterable>
                <el-option :label="$t('common.all')" value="" />
                <el-option v-for="item in productList" :key="item.productCode" :label="item.productName" :value="item.productCode" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.podAreaCode')" prop="consigneeCountryCode">
              <base-select v-model="formData.consigneeCountryCode" type="country" filterable clearable />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.channelCode')" prop="channelCode">
              <el-select v-model="formData.channelCode" filterable>
                <el-option :label="$t('common.all')" value="" />
                <el-option v-for="item in channelList" :key="item.channelCode" :label="item.englishName" :value="item.channelCode" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.productType')" prop="productType">
              <el-select v-model="formData.productType">
                <el-option :label="$t('common.all')" value="" />
                <el-option v-for="item in productTypeList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.customerId')" prop="customerId">
              <type-select v-model="formData.customerId" type="customer" />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.supplierId')" prop="channelSupplierId">
              <TypeSelect v-model="formData.channelSupplierId"  type="supplier" :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '17011'}" />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.redeliveryFlag')" prop="redeliveryFlag">
              <el-select v-model="formData.redeliveryFlag">
                <el-option :label="$t('common.all')" value="" />
                <el-option :label="$t('common.falseText')" :value="0" />
                <el-option :label="$t('common.trueText')" :value="1" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.salesName')" prop="salesId">
              <base-select v-model="formData.salesId" type="sale" addALL filterable clearable/>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.customerServiceName')" prop="customerServiceId">
              <base-select v-model="formData.customerServiceId" type="customerService" addALL filterable clearable/>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="mt-20">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-dropdown size="mini" @command="exportFn" style="margin-right: 10px;">
          <el-button type="primary" size="mini">{{$t("uexpressOrder.export")}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">{{$t("uexpressOrder.exportOrder")}}</el-dropdown-item>
            <el-dropdown-item :command="2">{{$t("uexpressOrder.exportTrack")}}</el-dropdown-item>
            <el-dropdown-item :command="3">{{$t("uexpressOrder.proofOfShipment1")}}</el-dropdown-item>
            <el-dropdown-item :command="4">{{$t("uexpressOrder.proofOfShipment2")}}</el-dropdown-item>
            <el-dropdown-item :command="5">{{$t("uexpressOrder.proofOfSign")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" size="mini" @click="batchPrintFn">{{$t('uexpressOrder.batchPrint')}}</el-button>
				<el-button type="primary" size="mini" @click="batchRemarkFn">{{ $t("uexpressOrder.batchRemark") }}</el-button>
				<el-button type="primary" size="mini" @click="batchRedeliveryNoFn">{{ $t("uexpressOrder.batchRedeliveryNoImport") }}</el-button>
        <el-button type="primary" size="mini" @click="batchChangeChannelFn">{{ $t("uexpressOrder.batchChangeChannel") }}</el-button>
        <el-button type="primary" size="mini" @click="batchChangeProductFn">{{ $t("uexpressOrder.batchChangeProduct") }}</el-button>
        <el-button type="primary" size="mini" @click="batchRecoverFn">{{ $t("uexpressOrder.batchRecover") }}</el-button>
			</div>

      <ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" />

      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
    </div>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.batchRemark")'>
      <el-form ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(10)">{{$t("uexpressOrder.batchRemarkImportTemplate")}}</el-button>
        </div>
        <el-form-item label='excel' prop="orderSalesRemarkExcel">
          <upload-file v-model="importForm.orderSalesRemarkExcel" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchImportConfirmFn" :loading="batchImportLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="batchRedeliveryNoVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.batchRedeliveryNoImport")'>
      <el-form ref="redeliveryNoFormRef" :model="redeliveryNoForm" :rules="redeliveryNoFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn(17)">{{$t("uexpressOrder.batchRedeliveryNoImportTemplate")}}</el-button>
        </div>
        <el-form-item label='excel' prop="orderSalesExcel">
          <upload-file v-model="redeliveryNoForm.orderSalesExcel" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchRedeliveryNoVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchRedeliveryNoConfirmFn" :loading="batchRedeliveryNoLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <update-consignee-address ref="updateConsigneeAddressRef" @ok="getList" />
    <batch-change-product-dialog ref="batchChangeProductDialogRef" @ok="getList" />
    <batch-change-channel-dialog ref="batchChangeChannelDialogRef" @ok="getList" />
    <print-dialog ref="printDialogRef" @ok="getList" />
    <update-goods-item-list-dialog ref="updateGoodsItemListDialogRef" @ok="getList" />
  </div>
</template>

<script>
import {
  getDictListApi,
  getOrderListApi,
  getOrderListByNosApi,
  exportOrderNosApi,
  exportOrderConditionsApi,
  exportOrderSelectedApi,
  importBatchRemarkApi,
  cancelOrderApi,
  exportProofOfShipment1Api, // 导出订单-发货证明1
  exportProofOfShipment2Api, // 导出订单-发货证明2
  exportProofOfSignApi, // 导出订单-签收证明
  importBatchChannelNoApi, // 批量维护重派运单号
  printOrderPdfApi, // 打印面单单个
  printOrderPdfIdsApi, // 打印面单批量
  reuseConfirmOrderApi // 恢复
} from '@/api/uexpress/orderManager'
import { getTemplateFileApi, getAllAreaProductApi, getProductSalesByApi, getAllChannelApi } from '@/api/uexpress/base'
import OptionBtn from './optionBtn'
import orderTable from './table/orderTable'
import OrderNoComponent from "@/views/uexpress/order/components/OrderNo";
import MemberOrderNoComponent from "@/views/uexpress/order/components/MemberOrderNo";
import OrderChannelNoComponent from "@/views/uexpress/order/components/OrderChannelNo";
import UpdateConsigneeAddress from './components/UpdateConsigneeAddress'
import OrderAmount from './components/OrderAmount'
import BatchChangeProductDialog from './components/BatchChangeProductDialog'
import BatchChangeChannelDialog from './components/BatchChangeChannelDialog'
import UpdateGoodsItemListDialog from './components/UpdateGoodsItemListDialog'
import PrintDialog from './components/PrintDialog'
import { parseTime, formatNumberToThousands } from "@/utils/index";

export default {
  name: "UexpressOrderList",
  components: {
    OptionBtn,
    OrderNoComponent,
    MemberOrderNoComponent,
    OrderChannelNoComponent,
    UpdateConsigneeAddress,
    OrderAmount,
    BatchChangeProductDialog,
    BatchChangeChannelDialog,
    PrintDialog,
    UpdateGoodsItemListDialog
  },
  data() {
    return {
      activeName: 'BASE_SEARCH',
      loading: false,
      formData: { },
      pageSize: 50,
      pageNum: 0,
      total: 0,
      dataList: [],
      orderStatusList: [],
      settlementStateList: [],
      channelPushStateList: [],
      productList: [],
      podAreaList: [],
      channelList: [],
      productTypeList: [],
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

      // 批量导入
      batchImportVisible: false,
      batchImportLoading: false,
      importForm: {
        orderSalesRemarkExcel: []
      },
      importFormRule: {
        orderSalesRemarkExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      // 批量维护重派单号
      batchRedeliveryNoVisible: false,
      batchRedeliveryNoLoading: false,
      redeliveryNoForm: {
        orderSalesExcel: []
      },
      redeliveryNoFormRule: {
        orderSalesExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
    }
  },
  created() {
    this.columnFields = orderTable
    this.formDataInit()
    this.getBaseDataFn()
  },
  methods: {
    formDataInit() {
      this.formData = {
        noType: '1',
        orderNoType: 'orderNo',
        noValue: '',
        nos: '',
        orderState: null,
        orderStateList: [],
        exceptionFlag: null,
        printLabelFlag: null,
        salesSettlementState: null,
        salesSettlementStateList: [],
        channelPushState: null,
        productCode: null,
        consigneeCountryCode: '',
        channelCode: null,
        productType: null,
        customerId: '',
        redeliveryFlag: '',
        channelSupplierId: null,
        periodTimeArr: [],
        periodTimeType: 'orderTime'
      }
    },
    getBaseDataFn() {
      Promise.all([ getDictListApi(4), getDictListApi(10), getDictListApi(11), getDictListApi(18), getProductSalesByApi(), getAllAreaProductApi(), getAllChannelApi()]).then(results => {
        const productTypeRes = results[0];  // 产品类型下拉
        const settlementRes = results[1]; // 支付状态下拉
        const channelPushRes = results[2]; // 取号状态下拉
        const orderStateRes = results[3]; // 订单状态下拉
        const productRes = results[4]; // 产品下拉
        const areaRes = results[5]; // 目的地下拉
        const channelRes = results[6]; // 渠道下拉
        if (productTypeRes && productTypeRes.ok) {
          this.productTypeList = productTypeRes.content
        }
        if (settlementRes && settlementRes.ok) {
          this.settlementStateList = settlementRes.content
        }
        if (channelPushRes && channelPushRes.ok) {
          this.channelPushStateList = channelPushRes.content
        }
        if (orderStateRes && orderStateRes.ok) {
          this.orderStatusList = orderStateRes.content
        }
        if (productRes && productRes.ok) {
          this.productList = productRes.content
        }
        if (areaRes && areaRes.ok) {
          this.podAreaList = areaRes.content
        }
        if (channelRes && channelRes.ok) {
          this.channelList = channelRes.content
        }
      })
    },
    onReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      this.gridApi.sizeColumnsToFit()
    },
    downloadTemplateFn(type) {
      // 10-批量备注
      getTemplateFileApi(type).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    batchRemarkFn() {
      this.importForm.orderSalesRemarkExcel = []
      this.batchImportVisible = true
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm
          }
          data.orderSalesRemarkExcel = data.orderSalesRemarkExcel[0]
          this.batchImportLoading = true
          importBatchRemarkApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressOrder.import_oper_success'))
            }
            this.batchImportLoading = false
          })
        }
      })
    },
    // 更新品名
    checkUpdateGoodsItemList(row) {
      // 预报未取号 &&  (未取号 || 取号失败)
      return row.predictWeightBooking === false && (row.channelPushState === 10 || row.channelPushState === 14)
    },
    updateGoodsItemListFn(row) {
      this.$refs.updateGoodsItemListDialogRef.show(row)  
    },
    // 修改地址
    checkUpdateConsigneeAddress(row) {
      // 预报未取号 &&  (未取号 || 取号失败)
      return row.predictWeightBooking === false && (row.channelPushState === 10 || row.channelPushState === 14)
    },
    // 修改地址
    updateConsigneeAddressFn(row) {
      this.$refs.updateConsigneeAddressRef.show(row, "UPDATE_ADDRESS")
    },
    // 批量换产品
    batchChangeProductFn() {
      this.$refs.batchChangeProductDialogRef.show()
    },
    // 批量换渠道
    batchChangeChannelFn() {
     this.$refs.batchChangeChannelDialogRef.show()
    },
   // 重派单号
    batchRedeliveryNoFn() {
      this.redeliveryNoForm.orderSalesExcel = []
      this.batchRedeliveryNoVisible = true
    },
    batchRedeliveryNoConfirmFn() {
      this.$refs.redeliveryNoFormRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.redeliveryNoForm
          }
          data.orderSalesExcel = data.orderSalesExcel[0]
          this.batchRedeliveryNoLoading = true
          importBatchChannelNoApi(data).then(res => {
            if (res.ok) {
              this.batchRedeliveryNoVisible = false
              this.$message.success(this.$t('uexpressOrder.import_oper_success'))
            }
            this.batchRedeliveryNoLoading = false
          })
        }
      })
    },
    exportFn(exportExcelType) {
      switch (exportExcelType) {
        case 1:
        case 2:
          this.exportTaskFn(exportExcelType)
          break;
        case 3:
        case 4:
        case 5:
          this.exportExcelFn(exportExcelType)
          break;
        default:
          break;
      }
    },
    // 导出EXCEL
    exportExcelFn(exportExcelType) {
      let params = {}
      let selRows = this.gridApi.getSelectedRows();
      if (selRows.length === 0) {
        this.$message.error(this.$t('uexpressOrder.needOne'))
        return
      }
      params.ids = []
      selRows.forEach(v => {
        params.ids.push({
          id: v.orderId,
          sk: v.shardingKey
        })
      })
      let fn = null
      switch (exportExcelType) {
        case 3:
          // for (let index = 0, len = selRows.length; index < len; index++) {
          //   if (selRows[index].orderState < 240) {
          //     this.$message.error(this.$t('uexpressOrder.proofOfShipment1Error'))
          //     return
          //   }
          // }
          fn = exportProofOfShipment1Api
          break;
        case 4:
          // for (let index = 0, len = selRows.length; index < len; index++) {
          //   if (selRows[index].orderState < 240) {
          //     this.$message.error(this.$t('uexpressOrder.proofOfShipment1Error'))
          //     return
          //   }
          // }
          fn = exportProofOfShipment2Api
          break;
        case 5:
          // for (let index = 0, len = selRows.length; index < len; index++) {
          //   if (selRows[index].orderState !== 420) {
          //     this.$message.error(this.$t('uexpressOrder.proofOfSignError'))
          //     return
          //   }
          // }
          fn = exportProofOfSignApi
          break;
        default:
          break;
      }
      this.loading = true
      fn(params).then(res => {
        this.loading = false
        if (res.ok && res.content) {
          const downloadElement = document.createElement('a')
          downloadElement.style.display = 'none'
          downloadElement.href = res.content
          downloadElement.target = "_blank"
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
        }
      })
    },
    // 导出EXCEL 至任务列表
    exportTaskFn(exportExcelType) {
      let params = this.getParams();
      params.exportExcelType = exportExcelType
      let selRows = this.gridApi.getSelectedRows();
      let fn = null
      if (selRows.length > 0) {
        fn = exportOrderSelectedApi
        params.ids = []
        selRows.forEach(v => {
          params.ids.push({
            id: v.orderId,
            sk: v.shardingKey
          })
        })
      } else {
        if (this.activeName === 'NO_SEARCH') {
          fn = exportOrderNosApi
        } else {
          fn = exportOrderConditionsApi
          // // 应该先填写下单时间的起始时间和结束时间
          // if (!params.orderTimeStart || !params.orderTimeEnd) {
          //   this.$message.error(this.$t('uexpressOrder.orderTimeError1'))
          //   return
          // }
          // // 时间范围不能超过超过3个月
          // if (moment(moment(params.orderTimeEnd).subtract(3, 'months').format('YYYY-MM-DD')).startOf('day').valueOf() > params.orderTimeStart) {
          //   this.$message.error(this.$t('uexpressOrder.orderTimeError2'))
          //   return
          // }
        }
      }
      this.loading = true
      fn(params).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('uexpressOrder.exportSuccess'))
        }
        this.loading = false
      })
    },
    getParams() {
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      if (this.activeName === 'NO_SEARCH') {
        params.noType = this.formData.noType
        params.nos = this.formData.nos ? this.formData.nos.split(/,|，|\s+/) : []
      } else {
        params = {
          ...params,
          ...this.formData
        }
        if (params.periodTimeArr && params.periodTimeArr.length) {
          params[this.formData.periodTimeType + 'Start'] = params.periodTimeArr[0]
          params[this.formData.periodTimeType + 'End'] = params.periodTimeArr[1]
        }
        if (params.noValue) {
          params[this.formData.orderNoType] = params.noValue
        }
      }
      return params
    },
    async getList() {
      this.loading = true;
      const params = this.getParams()
      let fn = this.activeName === 'NO_SEARCH' ? getOrderListByNosApi : getOrderListApi
      const res = await fn(params)
      if (res && res.ok && res.content) {
        res.content.list.forEach(v => {
          v.orderTime = parseTime(v.orderTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.inboundTime = parseTime(v.inboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.outboundTime = parseTime(v.outboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.exceptionFlagStr = ''
          if (typeof v.exceptionFlag === 'boolean') {
            v.exceptionFlagStr = v.exceptionFlag ? this.$t('common.trueText') : this.$t('common.falseText')
          }
          v.redeliveryFlagStr = ''
          if (typeof v.redeliveryFlag === 'boolean') {
            v.redeliveryFlagStr = v.redeliveryFlag ? this.$t('common.trueText') : this.$t('common.falseText')
          }
        })
        this.dataList = res.content.list
        this.total = Number(res.content.total)
      } else {
        this.dataList = []
        this.total = 0
      }
      this.loading = false;
    },
    reset() {
      this.formDataInit()
      // this.$refs.formData.resetFields();
      this.dataList = []
    },
    // 打印面单 【待确认】、【已取消】、【已赔付】、【已销毁】、【已退件】  这些状态不出现
    checkPrint(row) {
      return row.orderState !== 100 && row.orderState !== 500 && row.orderState !== 510 && row.orderState !== 520 && row.orderState !== 530
    },
    printPdfFn(row) {
      let data = {
        orderId: row.orderId,
        shardingKey: row.shardingKey
      }
      printOrderPdfApi(data).then(res => {
        if (res.ok) {
          this.printFn(res)
        }
      })
    },
    batchPrintFn() {
      let VALID = true
      let ids = []
      let selRows = this.gridApi.getSelectedRows();
      selRows.forEach(v => {
        ids.push({
          id: v.orderId,
          sk: v.shardingKey
        })
        if (!this.checkPrint(v)) {
          VALID = false
        }
      })
      if (!VALID) {
        this.$message.error(this.$t('uexpressOrder.printError'))
        return
      }
      let rows = selRows
      if (rows.length === 0) {
        this.$message.error(this.$t('uexpressOrder.needOne'))
        return
      }
      let max = 25
      if (rows.length > max) {
        this.$message.error(this.$t('uexpressOrder.printMaxValue', { max: max}))
        return
      }
      this.$refs.printDialogRef.show(ids)
    },
    cancelFn(row) {
      this.$confirm(this.$t('uexpressOrder.cancelWarningText'), this.$t('common.warnningText'), {
        confirmButtonText: this.$t('common.confirmBtn'),
        cancelButtonText: this.$t('uexpressOrder.thinkOver'),
        type: 'warning'
      })
      .then(async() => {
        const res = await cancelOrderApi({
          orderId: row.orderId,
          shardingKey: row.shardingKey
        })

        if (res && res.ok) {
          this.$message.success(this.$t('uexpressOrder.canceledOrderSuccess'))
          this.getList()
        }
      }).catch(err => {
        console.error(err)
      })
    },
    viewOrderDetail(row) {
      this.$router.push({
        name: 'UexpressOrderDetail',
        params: {
          orderId: row.orderId, shardingKey: row.shardingKey
        }
      })
    },
    viewTrackFn(row) {
      this.$router.push({name: 'TraceSearch', query: {orderNo: row.orderNo}})
    },
    recoverFn(row) {
       this.$confirm(this.$t('uexpressOrder.recoverInfo'), this.$t('common.mention'), {
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      })
      .then(() => {
        let ids = [{
          orderId: row.orderId,
          shardingKey: row.shardingKey
        }]
        reuseConfirmOrderApi({ ids: ids }).then(res => {
          if (res && res.ok) {
            if (res.content) {
              this.$alert(res.content, this.$t('common.mention'), {
                confirmButtonText: this.$t('common.confirm')
              });
            } else {
              this.$message.success(this.$t('uexpressOrder.recoverSuccess'))
            }
            this.getList()
          }
        })
      }).catch(err => {
        console.error(err)
      })
    },
    // 恢复
    batchRecoverFn() {
      let VALID = true
      let selRows = this.gridApi.getSelectedRows();
      if (selRows.length === 0) {
        this.$message.error(this.$t('uexpressOrder.needOne'))
        return
      }
      selRows.forEach(v => {
        if (v.orderState !== 500) {
          VALID = false
        }
      })
      if (!VALID) {
        this.$message.error(this.$t('uexpressOrder.recoverError'))
        return
      }
      this.$confirm(this.$t('uexpressOrder.batchRecoverInfo', {count: selRows.length}), this.$t('common.mention'), {
        dangerouslyUseHTMLString: true,
        confirmButtonText: this.$t('common.confirm'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      })
      .then(() => {
        let ids = []
        selRows.forEach(v => {
          ids.push({
            orderId: v.orderId,
            shardingKey: v.shardingKey
          })
        })
        reuseConfirmOrderApi({ ids: ids }).then(res => {
          if (res && res.ok) {
            if (res.content) {
              this.$alert(res.content, this.$t('common.mention'), {
                confirmButtonText: this.$t('common.confirm')
              });
            } else {
              this.$message.success(this.$t('uexpressOrder.recoverSuccess'))
            }
            this.getList()
          }
        })
      }).catch(err => {
        console.error(err)
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.right-main-wrapper{
  padding: 0 20px 20px 20px;
}
.multiple-no-wrap{
  width: 100%;
  overflow:hidden;
}

.multipleNoSearch {
	width: 100%;
	.multiple-no-item{
    width: 100%;
    ::v-deep .el-form-item__content{
      width: calc(100% - 120px);
    }
    ::v-deep .el-textarea{
      width: 100%;
    }
  }
}

.pagination-container {
  margin-top: 0px;
}
</style>
