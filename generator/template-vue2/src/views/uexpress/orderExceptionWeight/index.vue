<template>
  <div class="right-main-wrapper" v-loading="loading">
    <el-tabs v-model="activeName" class="top-tabs">
			<el-tab-pane :label='$t("uexpressOrder.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
			<el-tab-pane :label='$t("uexpressOrder.noSearch")' name="NO_SEARCH"></el-tab-pane>
		</el-tabs>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="activeName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataSimpleRef" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressOrder.no")' prop="queryType" style="width: 100px;float: left;"></el-form-item>
            <el-form-item label='' prop="nos" class="multiple-no-item">
              <el-input v-model="formData.nos" type="textarea" rows="3" size="mini" resize="none" clearable :placeholder="$t('uexpressOrder.noPlaceholder')" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="activeName === 'BASE_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">

            <el-form-item label="">
              <template slot="label">
                <el-select v-model="formData.noType" style="width: 100px;">
                  <el-option :label="$t('uexpressOrder.orderNo')" value="orderNo"></el-option>
                  <el-option :label="$t('uexpressOrder.channelOrderNo')" value="channelOrderNo"></el-option>
                  <el-option :label="$t('uexpressOrder.memberOrderNo')" value="memberOrderNo"></el-option>
                </el-select>
              </template>
              <el-input v-trim :placeholder="$t('common.placeholder')" v-model="formData.nos" clearable />
            </el-form-item>
            <el-form-item :label='$t("uexpressOrder.predictTime")' prop="predictTimeArr">
              <search-date-picker v-model="formData.predictTimeArr" type="datetime"  clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("uexpressOrder.processedTime")' prop="processedTimeArr">
              <search-date-picker v-model="formData.processedTimeArr" type="datetime"  clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label='$t("uexpressOrder.orderState")' prop="orderState">
              <uexpress-select v-model="formData.orderState" type="orderState" addALL filterable />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.customerId')" prop="customerId">
              <type-select v-model="formData.customerId" type="customer" />
            </el-form-item>
            <el-form-item label="" prop="periodTimeArr">
              <template slot="label">
                <el-select v-model="formData.periodTimeType" style="width: 100px;">
                  <el-option key="orderTime" :label="$t('uexpressOrder.orderTime')" value="orderTime"></el-option>
                  <el-option key="inboundTime" :label="$t('uexpressOrder.inboundTime')" value="inboundTime"></el-option>
                  <el-option key="outboundTime" :label="$t('uexpressOrder.outboundTime')" value="memberOrderNo"></el-option>
                </el-select>
              </template>
              <search-date-picker v-model="formData.periodTimeArr" type="datetime"  clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.productId')" prop="productCode">
              <uexpress-type-select v-model="formData.productCode" type="productSales" filterable @selected="getList" />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.podAreaCode')" prop="consigneeCountryCode">
              <base-select v-model="formData.consigneeCountryCode" type="country" filterable clearable />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.channelCode')" prop="channelCode">
              <uexpress-type-select type="channel" v-model="formData.channelCode" clearable filterable @selected="channelSelected" />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.supplierId')" prop="supplierId">
              <type-select v-model="formData.supplierId"  type="supplier" :requestParams="{businessType: 'INTERNATIONAL_LINE', partnerRole: '17011'}" />
            </el-form-item>
            <el-form-item :label='$t("uexpressOrder.abnormalityState")' prop="abnormalityState" v-if="abnormalityState === 'ALL'">
              <uexpress-select v-model="formData.abnormalityState" type="abnormalityState" addALL />
            </el-form-item>
             <el-form-item :label='$t("uexpressOrder.abnormalityProcessPlan")' prop="abnormalityProcessPlan">
              <uexpress-select v-model="formData.abnormalityProcessPlan" type="abnormalityProcessPlan" :params="{ abnormalityType: abnormalityType}" addALL filterable />
            </el-form-item>
            <el-form-item :label='$t("uexpressOrder.abnormalityProcessState")' prop="abnormalityProcessState">
              <uexpress-select v-model="formData.abnormalityProcessState" type="abnormalityProcessState" :params="{abnormalityProcessPlan: formData.abnormalityProcessPlan}" addALL filterable />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="mt-20">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-dropdown size="mini" @command="exportFn" style="margin-right: 10px;" v-if="false">
          <el-button type="primary" size="mini">{{$t("uexpressOrder.export")}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">{{$t("uexpressOrder.exportOrder")}}</el-dropdown-item>
            <el-dropdown-item :command="2">{{$t("uexpressOrder.exportTrack")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
				<el-button type="primary" size="mini" @click="returnFn">{{ $t("uexpressOrder.return") }}</el-button>
        <el-button type="primary" size="mini" @click="companyWeightNextFn">{{ $t("uexpressOrder.companyWeightNext") }}</el-button>
        <el-button type="primary" size="mini" @click="retestWeightFn">{{ $t("uexpressOrder.retestWeight") }}</el-button>
        <el-button type="primary" size="mini" @click="retestWeightNextFn">{{ $t("uexpressOrder.retestWeightNext") }}</el-button>
			</div>
      <el-tabs v-model="abnormalityState" class="middle-tabs" @tab-click="abnormalityTabsClick">
        <el-tab-pane :label='$t("uexpressOrder.PENDING")' name="1"></el-tab-pane>
        <el-tab-pane :label='$t("uexpressOrder.PROCESSING")' name="2"></el-tab-pane>
        <el-tab-pane :label='$t("uexpressOrder.SOLVED")' name="3"></el-tab-pane>
        <el-tab-pane :label='$t("uexpressOrder.ALL")' name="ALL"></el-tab-pane>
      </el-tabs>
      <ag-grid-vue
        :locale-text-func="_i18nGridLocalText"
        :grid-options="gridOptions"
        :side-bar="sideBarDefs"
        :column-defs="columnFields"
        :row-data="dataList"
        :enable-col-resize="true"
        :enable-sorting="true"
        :pagination="false"
        :pagination-auto-page-size="false"
        :grid-ready="onReady"
        :style="gridHeight"
        class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
    </div>

    <el-dialog :visible.sync="returnVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.return")'>
      <el-form class="contact-form" ref="returnRef" :model="returnForm" :rules="returnFormRule" label-width="100px" size="mini">
        <el-form-item :label='$t("uexpressOrder.returnType")' prop="returnType">
          <el-select v-model="returnForm.returnType" size="mini" @change="returnTypeChange">
            <el-option v-for="(item, index) in returnTypeList" :key="index" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item :label='$t("uexpressOrder.returnAddress")' prop="returnAddressType" v-if="returnForm.returnType === 1 || returnForm.returnType === 2">
          <el-radio-group v-model="returnForm.returnAddressType">
            <el-radio v-for="(item, index) in returnAddressTypeList" :label="item.code" :key="index">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="(returnForm.returnType === 1 || returnForm.returnType === 2) && returnForm.returnAddressType === 2">
          <el-form-item :label='$t("uexpressOrder.consigneePersonalName")' prop="pickUpAddressInfo.consigneePersonalName">
            <el-input v-model="returnForm.pickUpAddressInfo.consigneePersonalName" />
          </el-form-item>
          <el-form-item :label='$t("uexpressOrder.consigneeMobile")' prop="pickUpAddressInfo.consigneeMobile">
            <el-input v-model="returnForm.pickUpAddressInfo.consigneeMobile" />
          </el-form-item>
          <el-form-item :label='$t("uexpressOrder.pcd")' prop="pcd">
            <provinces :value="returnForm.pcd" :valueName="returnForm.pcdName" @change="provincesChange" />
          </el-form-item>
          <el-form-item :label='$t("uexpressOrder.consigneeDetailAddress")' prop="pickUpAddressInfo.consigneeDetailAddress">
            <el-input v-model="returnForm.pickUpAddressInfo.consigneeDetailAddress" />
          </el-form-item>
        </div>
        <el-form-item :label='$t("uexpressOrder.companyEntrust")' prop="company" v-if="returnForm.returnType === 4">
          <el-input v-model="returnForm.company" />
        </el-form-item>
        <el-form-item :label='$t("uexpressOrder.remark")' prop="remark">
          <el-input type="textarea" v-model="returnForm.remark" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="returnVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="returnConfirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderExceptionListApi,
  getOrderExceptionListByNosApi,
  returnPlanApi, // 退回
  returnPlanAddressApi, // 快递退回/司机退回
  returnPlanCustomerPickupApi, // 客户自提
  returnPlanThirdPartyApi // 委托第三方公司
} from '@/api/uexpress/orderException'
import { getReturnTypeListApi, getReturnAddressTypeListApi } from '@/api/uexpress/base'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import mixin from "@/views/uexpress/orderException/mixin";

export default {
  name: "UexpressOrderExceptionWeightList",
  mixins: [mixin],
  data() {
    return {
      activeName: 'BASE_SEARCH',
      loading: false,
      abnormalityType: 410, // 异常类型
      abnormalityState: '1',

      returnAddressTypeList: [],
      returnTypeList: [],
      returnVisible: false,
      returnForm: {
        returnType: '',
        returnAddressType: '',
        remark: '',
        pickUpAddressInfo: {

        }
      },
      returnFormRule: {
        returnType: [{required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        returnAddressType: [{required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      columnFields: [{
          field: 'index',
          headerName: '',
          width: 55,
          pinned: 'left',
          suppressSorting: true,
          checkboxSelection: true,
          suppressMenu: true,
          suppressSizeToFit: true,
          suppressResize: true,
          headerCheckboxSelection: true
        },
        {
          field: "orderNo",
          headerName: this.$t("uexpressOrder.orderNo"),
          minWidth: 160,
          cellRendererFramework: "OrderNoComponent"
        },
        {
          field: "orderChannelNo",
          headerName: this.$t("uexpressOrder.orderChannelNo"),
          minWidth: 140,
          cellRendererFramework: "OrderChannelNoComponent"
        },
        {
          field: "memberOrderNo",
          headerName: this.$t("uexpressOrder.memberOrderNo"),
          minWidth: 160,
          cellRendererFramework: "MemberOrderNoComponent"
        },
        {
          field: "abnormalStateName",
          headerName: this.$t("uexpressOrder.abnormalityState"),
          minWidth: 120
        },
        {
          field: "abnormalityProcessPlanName",
          headerName: this.$t("uexpressOrder.abnormalityProcessPlan"),
          minWidth: 120
        },
        {
          field: "abnormalityProcessStateName",
          headerName: this.$t("uexpressOrder.abnormalityProcessState"),
          minWidth: 120
        },

        {
          field: "preLWH",
          headerName: this.$t("uexpressOrder.preLWH"),
          minWidth: 120
        },
        {
          field: "preConvertWeight",
          headerName: this.$t("uexpressOrder.preConvertWeight"),
          minWidth: 120
        },
        {
          field: "LWH",
          headerName: this.$t("uexpressOrder.LWH"),
          minWidth: 120
        },
        {
          field: "convertWeight",
          headerName: this.$t("uexpressOrder.convertWeight"),
          minWidth: 120
        },
        {
          field: "volumeWeightRateValue",
          headerName: this.$t("uexpressOrder.volumeWeightRateValue"),
          minWidth: 120
        },
        {
          field: "preWeight",
          headerName: this.$t("uexpressOrder.preWeight"),
          minWidth: 120
        },
        {
          field: "customerOutboundWeight",
          headerName: this.$t("uexpressOrder.declareWeightKG"),
          minWidth: 120
        },
        {
          field: "weight",
          headerName: this.$t("uexpressOrder.weight"),
          minWidth: 120
        },
        {
          field: "chargeWeight",
          headerName: this.$t("uexpressOrder.chargeWeight"),
          minWidth: 120
        },
        {
          field: "convertWeightDiffWEeight",
          headerName: this.$t("uexpressOrder.convertWeightDiffWEeight"),
          minWidth: 120
        },
        {
          field: "totalAmount",
          headerName: this.$t("uexpressOrder.totalAmount"),
          minWidth: 120
        },

        {
          field: "predictTime",
          headerName: this.$t("uexpressOrder.predictTime"),
          minWidth: 150
        },
        {
          field: "processedTime",
          headerName: this.$t("uexpressOrder.processedTime"),
          minWidth: 150
        },
        {
          field: "predictByName",
          headerName: this.$t("uexpressOrder.predictByName"),
          minWidth: 150
        },
        {
          field: "processedByName",
          headerName: this.$t("uexpressOrder.processedByName"),
          minWidth: 150
        },
        {
          field: "channelPushStateName",
          headerName: this.$t("uexpressOrder.channelPushStateName"),
          minWidth: 120
        },
        {
          field: "salesSettlementStateName",
          headerName: this.$t("uexpressOrder.salesSettlementStateName"),
          minWidth: 120
        },
        {
          field: "orderStateName",
          headerName: this.$t("uexpressOrder.orderStateName"),
          minWidth: 120
        },
        {
          field: "customerName",
          headerName: this.$t("uexpressOrder.customerName"),
          minWidth: 120
        },
        {
          field: "productName",
          headerName: this.$t("uexpressOrder.productName"),
          minWidth: 150
        },
        {
          field: "consigneeCountryName",
          headerName: this.$t("uexpressOrder.destinationAreaName"),
          minWidth: 120
        },
        {
          field: "channelName",
          headerName: this.$t("uexpressOrder.channelName"),
          minWidth: 120
        },
        {
          field: "channelSupplierName",
          headerName: this.$t("uexpressOrder.channelSupplierName"),
          minWidth: 120
        },
        {
          field: 'orderTime',
          headerName: this.$t("uexpressOrder.orderTime"),
          minWidth: 150
        },
        {
          field: 'inboundTime',
          headerName: this.$t("uexpressOrder.inboundTime"),
          minWidth: 150
        },
        {
          field: 'outboundTime',
          headerName: this.$t("uexpressOrder.outboundTime"),
          minWidth: 150
        }
      ]
    }
  },
  created() {
    this.getBaseData()
    this.getList()
  },
  methods: {
    getBaseData() {
      getReturnTypeListApi().then(res => {
        this.returnTypeList = res.content
      })
    },
    async getList() {
      this.loading = true;
      const params = this.getParams()
      let fn = this.activeName === 'NO_SEARCH' ? getOrderExceptionListByNosApi : getOrderExceptionListApi
      const res = await fn(params)
      if (res && res.ok && res.content) {
        let dataList = this.formatDataList(res.content.list)
        dataList.forEach(v => {
          // 入库材积重-入库重
          v.convertWeightDiffWEeight = v.convertWeight - v.weight
          // 预报长宽高
          v.preLWH = v.preLength + '*' + v.preWidth + '*' + v.preHeight
          // 入库长宽高
          v.LWH = v.length + '*' + v.width + '*' + v.height
        })
        this.dataList = dataList
        this.total = Number(res.content.total)
      } else {
        this.dataList = []
        this.total = 0
      }
      this.loading = false;
    },
    // 我司重量放行
    companyWeightNextFn() {
      let arr = this.gridApi.getSelectedRows()
      if (arr.length === 0) {
        this.$message.error(this.$t('uexpressOrder.needOne'))
        return
      }
      let VALID = true
      let ids = []
      arr.forEach(v => {
        ids.push({
          id: v.id,
          abnormalitySk: v.abnormalitySk
        })
        if (v.abnormalityState !== 1) {
          VALID = false
        }
      })
      if (!VALID) {
        // 只有【待处理】的订单，才能选择【我司重量放行】的处理方案
        this.$message.error(this.$t('uexpressOrder.companyWeightNextErrorInfo'))
        return
      }
      // 您已勾选10个订单，确认按照入库重量放行吗？
      this.returnPlanFn("uexpressOrder.companyWeightNextInfo", 2, ids)
    },
    // 重测重量
    retestWeightFn() {
      let arr = this.gridApi.getSelectedRows()
      if (arr.length === 0) {
        this.$message.error(this.$t('uexpressOrder.needOne'))
        return
      }
      let VALID = true
      let ids = []
      arr.forEach(v => {
        ids.push({
          id: v.id,
          abnormalitySk: v.abnormalitySk
        })
        if (v.abnormalityState !== 1) {
          VALID = false
        }
      })
      if (!VALID) {
        // 只有【待处理】的订单，才能选择【重测重量】的处理方案
        this.$message.error(this.$t('uexpressOrder.retestWeightErrorInfo'))
        return
      }
      // 您已勾选10个订单，确认按照入库重量放行吗？
      this.returnPlanFn("uexpressOrder.retestWeightInfo", 3, ids)
    },
    // 重测重量放行
    retestWeightNextFn() {
      let arr = this.gridApi.getSelectedRows()
      if (arr.length === 0) {
        this.$message.error(this.$t('uexpressOrder.needOne'))
        return
      }
      let VALID = true
      let ids = []
      arr.forEach(v => {
        ids.push({
          id: v.id,
          abnormalitySk: v.abnormalitySk
        })
        if (v.abnormalityState === 2 && v.abnormalityProcessState === 4) {
          // 通过
        } else {
           VALID = false
        }
      })
      if (!VALID) {
        // 只有【待处理】的订单，才能选择【重测重量放行】的处理方案
        this.$message.error(this.$t('uexpressOrder.retestWeightNextErrorInfo'))
        return
      }
      // 您已勾选10个订单，确认按照入库重量放行吗？
      this.returnPlanFn("uexpressOrder.retestWeightNextInfo", 4, ids)
    },
    // 退回方案接口-我司重量放行-重测重量-重测重量放行
    returnPlanFn(msg$t, planCode, ids) {
      let arr = this.gridApi.getSelectedRows()
      let msg = this.$t(msg$t, { num: arr.length})
      this.$confirm(msg, this.$t("common.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      }).then(() => {
        this.loading = true
        let data = {
          planCode: planCode,
          ids: ids
        }
        returnPlanApi(data).then(res => {
          if (res.ok) {
            this.getList()
            this.$message.success(this.$t("uexpressOrder.operSuccess"));
          }
          this.loading = false
        });
      }).catch(() => { });
    },
    // 退回
    returnFn() {
      let arr = this.gridApi.getSelectedRows()
      if (arr.length === 0) {
        this.$message.error(this.$t('uexpressOrder.needOne'))
        return
      }
      let VALID = true
      let ids = []
      arr.forEach(v => {
        ids.push({
          id: v.id,
          abnormalitySk: v.abnormalitySk
        })
        if (v.abnormalityState === 1 || v.abnormalityState === 2 && v.abnormalityProcessState === 4) {
          // 通过
        } else {
          VALID = false
        }
      })
      if (!VALID) {
        // 【异常状态】=【待处理】；
        // 【异常状态】=【处理中】、【处理状态】=【已重测】；
        this.$message.error(this.$t('uexpressOrder.returnError'))
        return
      }
      this.returnVisible = true
    },
    returnTypeChange() {
      getReturnAddressTypeListApi({ returnType: this.returnForm.returnType}).then(res => {
        this.returnAddressTypeList = res.content
      })
    },
    provincesChange(val) {
			this.returnForm.pickUpAddressInfo.consigneeProvinceCode = val.provinceCode;
			this.returnForm.pickUpAddressInfo.consigneeProvinceName = val.provinceName;
			this.returnForm.pickUpAddressInfo.consigneeCityCode = val.cityCode;
			this.returnForm.pickUpAddressInfo.consigneeCityName = val.cityName;
			this.returnForm.pickUpAddressInfo.consigneeDistrictCode = val.districtCode;
			this.returnForm.pickUpAddressInfo.consigneeDistrictName = val.districtName;
		},
    returnConfirmFn() {
      this.$refs.returnRef.validate(valid => {
        if (valid) {
          let arr = this.gridApi.getSelectedRows()
          let ids = []
          arr.forEach(v => {
            ids.push({
              id: v.id,
              abnormalitySk: v.abnormalitySk
            })
          })
          let data = {
            ...this.returnForm,
            ids: ids
          }
          if (this.returnForm.returnAddressType === 1) {
            data.pickUpAddressInfo = null
            delete data.pickUpAddressInfo
          }
          let fn = null
          switch (this.returnForm.returnType) {
            case 1:
            case 2:
              fn = returnPlanAddressApi
              break;
            case 3:
              fn = returnPlanCustomerPickupApi
              break;
            case 4:
              fn = returnPlanThirdPartyApi
              break;
            default:
              break;
          }
          if (fn) {
            fn(data).then(res => {
            if (res.ok) {
              this.getList()
              this.returnVisible = false
              this.$message.success(this.$t('uexpressOrder.operSuccess'))
            }
          })
          }
        }
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

.multiple-no-item {
  width: calc(100% - 150px);
  float: left;

  ::v-deep .el-form-item__content {
    width: 100%;
  }
  .el-select {
    float: left;
    width: 80px;
  }
  .el-textarea {
    width: 100%;
    float: left;
  }
}
.pagination-container {
  margin-top: 0px;
}
</style>
