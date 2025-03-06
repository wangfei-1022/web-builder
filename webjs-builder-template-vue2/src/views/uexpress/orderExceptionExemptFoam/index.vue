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
              <uexpress-select v-model="formData.abnormalityProcessPlan" type="abnormalityProcessPlan" :params="{ abnormalityType: abnormalityType}" addALL />
            </el-form-item>
            <el-form-item :label='$t("uexpressOrder.abnormalityProcessState")' prop="abnormalityProcessState">
              <uexpress-select v-model="formData.abnormalityProcessState" type="abnormalityProcessState" :params="{abnormalityProcessPlan: formData.abnormalityProcessPlan}" addALL />
            </el-form-item>
            <el-form-item :label='$t("uexpressOrder.abnormalityAuditStateName")' prop="abnormalityAuditState">
              <el-select v-model="formData.abnormalityAuditState" style="width: 100%;">
                <el-option v-for="(item, index) in abnormalityAuditStateList" :key="index" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="mt-20">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="exportFn(5)">{{$t("uexpressOrder.export")}}</el-button>
				<el-button type="primary" size="mini" v-permission="['ilp:ord:exception:exempt:foam:apply']" @click="exemptFoamApplyFn">{{ $t("uexpressOrder.exemptFoamApply") }}</el-button>
        <el-button type="primary" size="mini" v-permission="['ilp:ord:exception:exempt:foam:pass']" @click="exemptFoamPassFn">{{ $t("uexpressOrder.exemptFoamPass") }}</el-button>
        <el-button type="primary" size="mini" v-permission="['ilp:ord:exception:exempt:foam:product:audit']" @click="exemptFoamProductAuditFn">{{ $t("uexpressOrder.exemptFoamProductAudit") }}</el-button>
        <el-button type="primary" size="mini" v-permission="['ilp:ord:exception:exempt:foam:principal:audit']" @click="exemptFoamPrincipalAuditFn">{{ $t("uexpressOrder.exemptFoamPrincipalAudit") }}</el-button>
        <el-button type="primary" size="mini" v-permission="['ilp:ord:exception:exempt:foam:weight:discharge']" @click="exemptFoamWeightDischargeFn">{{ $t("uexpressOrder.exemptFoamWeightDischarge") }}</el-button>
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

    <el-dialog :visible.sync="exemptFoamPassVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.exemptFoamPass")'>
      <el-form ref="exemptFoamPassRef" :model="exemptFoamPassForm" :rules="exemptFoamPassFormRule" label-width="100px" size="mini">
        <div style="padding-left: 34px; margin-bottom: 10px;">
          <span v-html="$t('uexpressOrder.selectOrderInfo', { num: ids.length})"></span>
        </div>
        <el-form-item :label='$t("uexpressOrder.exemptFoamPassAuditFlag")' prop="auditFlag" >
          <el-radio-group v-model="exemptFoamPassForm.auditFlag">
            <el-radio :label="true">{{$t("uexpressOrder.exemptFoamPassAuditFlagTrue")}}</el-radio>
            <el-radio :label="false">{{$t("uexpressOrder.exemptFoamPassAuditFlagFalse")}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label='$t("uexpressOrder.remark")' prop="remark">
          <el-input type="textarea" v-model="exemptFoamPassForm.remark" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="exemptFoamPassVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="exemptFoamPassConfirmFn" :loading="exemptFoamPassLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="productAuditVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.exemptFoamProductAudit")'>
      <el-form ref="productAuditRef" :model="productAuditForm" :rules="productAuditFormRule" label-width="100px" size="mini">
        <div style="padding-left: 34px; margin-bottom: 10px;">
          <span v-html="$t('uexpressOrder.selectOrderInfo', { num: ids.length})"></span>
        </div>
        <el-form-item :label='$t("uexpressOrder.productAuditFlag")' prop="auditFlag" >
          <el-radio-group v-model="productAuditForm.auditFlag">
            <el-radio :label="true">{{$t("uexpressOrder.productAuditFlagTrue")}}</el-radio>
            <el-radio :label="false">{{$t("uexpressOrder.productAuditFlagFalse")}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label='$t("uexpressOrder.remark")' prop="remark">
          <el-input type="textarea" v-model="productAuditForm.remark" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="productAuditVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="productAuditConfirmFn" :loading="productAuditLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>


    <el-dialog :visible.sync="principalAuditVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.exemptFoamPrincipalAudit")'>
      <el-form ref="principalAuditRef" :model="principalAuditForm" :rules="principalAuditFormRule" label-width="100px" size="mini">
        <div style="padding-left: 34px; margin-bottom: 10px;">
          <span v-html="$t('uexpressOrder.selectOrderInfo', { num: ids.length})"></span>
        </div>
        <el-form-item :label='$t("uexpressOrder.principalAuditFlag")' prop="auditFlag" >
          <el-radio-group v-model="principalAuditForm.auditFlag">
            <el-radio :label="true">{{$t("uexpressOrder.principalAuditFlagTrue")}}</el-radio>
            <el-radio :label="false">{{$t("uexpressOrder.principalAuditFlagFalse")}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label='$t("uexpressOrder.remark")' prop="remark">
          <el-input type="textarea" v-model="principalAuditForm.remark" :rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="principalAuditVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="principalAuditConfirmFn" :loading="principalAuditLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderExceptionListApi,
  getOrderExceptionListByNosApi,
  exemptFoamApplyApi, // 免泡申请
  exemptFoamPassApi, // 免泡确认
  exemptFoamProductAuditApi, // 产品审核
  exemptFoamPrincipalAuditApi, // 负责人审核
  exemptFoamWeightDischargeApi // 泡重放行
} from '@/api/uexpress/orderException'
import { getDictListApi } from '@/api/uexpress/base'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import mixin from "@/views/uexpress/orderException/mixin";

export default {
  name: "UexpressOrderExceptionExemptFoamList",
  mixins: [mixin],
  data() {
    return {
      activeName: 'BASE_SEARCH',
      loading: false,
      abnormalityType: 420, // 异常类型-泡货待确认
      abnormalityState: '1',
      abnormalityAuditStateList: [],

      ids: [],
      exemptFoamPassVisible: false,
      exemptFoamPassLoading: false,
      exemptFoamPassForm: {
        auditFlag: '',
        remark: ''
      },
      exemptFoamPassFormRule: {
        auditFlag: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      productAuditVisible: false,
      productAuditLoading: false,
      productAuditForm: {
        auditFlag: '',
        remark: ''
      },
      productAuditFormRule: {
        auditFlag: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      },

      principalAuditVisible: false,
      principalAuditLoading: false,
      principalAuditForm: {
        auditFlag: '',
        remark: ''
      },
      principalAuditFormRule: {
        auditFlag: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
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
          field: "customerName",
          headerName: this.$t("uexpressOrder.customerName"),
          minWidth: 120
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
          field: "abnormalityAuditStateName",
          headerName: this.$t("uexpressOrder.abnormalityAuditStateName"),
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
        },
        {
          field: 'remark',
          headerName: this.$t("uexpressOrder.remark"),
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
      getDictListApi(46).then(res => {
        this.abnormalityAuditStateList = res.content
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
          v.convertWeightDiffWEeight = (v.convertWeight - v.weight).toFixed(2)
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
    // 免泡申请
    exemptFoamApplyFn() {
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
        if (v.abnormalityState === 1 || (v.abnormalityState === 3 && v.abnormalityProcessState === 4)) {
          // 通过
        } else {
           VALID = false
        }
      })
      if (!VALID) {
        this.$message.error(this.$t('uexpressOrder.exemptFoamApplyError'))
        return
      }
      this.$confirm(this.$t('uexpressOrder.exemptFoamApplyInfo', { num: arr.length}), this.$t("common.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      }).then(() => {
        this.loading = true
        exemptFoamApplyApi({abnormalityIdList: ids}).then(res => {
          if (res.ok) {
            this.getList()
            this.$message.success(this.$t("uexpressOrder.operSuccess"));
          }
          this.loading = false
        });
      }).catch(() => { });
    },
    // 免泡确认
    exemptFoamPassFn() {
      this.exemptFoamPassForm = {
        auditFlag: '',
        remark: ''
      }
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
        // 【处理方案】 =【免泡放行】且【处理状态】=【免泡已申请】且 异常状态！=【已处理】
        if (v.abnormalityState !== 3 && v.abnormalityProcessPlan === 26 && v.abnormalityProcessState === 14) {
          // 通过
        } else {
           VALID = false
        }
      })
      this.ids = ids
      if (!VALID) {
        this.$message.error(this.$t('uexpressOrder.exemptFoamPassError'))
        return
      }
      this.exemptFoamPassVisible = true
    },
    exemptFoamPassConfirmFn() {
      this.$refs.exemptFoamPassRef.validate(valid => {
        if (valid) {
          this.exemptFoamPassLoading = true
          let data = {
            ...this.exemptFoamPassForm,
            abnormalityIdList: this.ids
          }
          exemptFoamPassApi(data).then(res => {
            if (res.ok) {
              this.getList()
              this.exemptFoamPassVisible = false
              this.$message.success(this.$t("uexpressOrder.operSuccess"));
            }
            this.exemptFoamPassLoading = false
          });
        }
      })
    },
    // 产品审核
    exemptFoamProductAuditFn() {
      this.productAuditForm = {
        auditFlag: '',
        remark: ''
      }
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
        // 【处理方案】 =【免泡放行】且【审核状态】=【待产品审核】且 异常状态！=【已处理】
        if (v.abnormalityState !== 3 && v.abnormalityProcessPlan === 26 && v.abnormalityAuditState === 1) {
          // 通过
        } else {
           VALID = false
        }
      })
      this.ids = ids
      if (!VALID) {
        this.$message.error(this.$t('uexpressOrder.exemptFoamProductAuditError'))
        return
      }
      this.productAuditVisible = true
    },
    productAuditConfirmFn() {
      this.$refs.productAuditRef.validate(valid => {
        if (valid) {
          this.productAuditLoading = true
          let data = {
            ...this.productAuditForm,
            abnormalityIdList: this.ids
          }
          exemptFoamProductAuditApi(data).then(res => {
            if (res.ok) {
              this.getList()
              this.productAuditVisible = false
              this.$message.success(this.$t("uexpressOrder.operSuccess"));
            }
            this.productAuditLoading = false
          });
        }
      })
    },
    // 负责人审核
    exemptFoamPrincipalAuditFn() {
      this.principalAuditForm = {
        auditFlag: '',
        remark: ''
      }
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
        // 【处理方案】 =【免泡放行】且【审核状态】=【待负责人审核】且 异常状态！=【已处理】
        if (v.abnormalityState !== 3 && v.abnormalityProcessPlan === 26 && v.abnormalityAuditState === 2) {
          // 通过
        } else {
           VALID = false
        }
      })
      this.ids = ids
      if (!VALID) {
        this.$message.error(this.$t('uexpressOrder.exemptFoamPrincipalAuditError'))
        return
      }
      this.principalAuditVisible = true
    },
    principalAuditConfirmFn() {
      this.$refs.principalAuditRef.validate(valid => {
        if (valid) {
          this.principalAuditLoading = true
          let data = {
            ...this.principalAuditForm,
            abnormalityIdList: this.ids
          }
          exemptFoamPrincipalAuditApi(data).then(res => {
            if (res.ok) {
              this.getList()
              this.principalAuditVisible = false
              this.$message.success(this.$t("uexpressOrder.operSuccess"));
            }
            this.principalAuditLoading = false
          });
        }
      })
    },
    // 泡重放行
    exemptFoamWeightDischargeFn() {
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
        // 异常状态=【待处理】或 异常状态=【处理中】& 处理状态=【待重测、已重测】
        if (v.abnormalityState === 1 || (v.abnormalityState === 2 && (v.abnormalityProcessState === 3 || v.abnormalityProcessState === 4))) {
          // 通过
        } else {
           VALID = false
        }
      })
      if (!VALID) {
        this.$message.error(this.$t('uexpressOrder.exemptFoamWeightDischargeError'))
        return
      }
      this.$confirm(this.$t('uexpressOrder.exemptFoamWeightDischargeInfo', { num: arr.length}), this.$t("common.mention"), {
        confirmButtonText: this.$t("common.confirm"),
        cancelButtonText: this.$t("common.cancel"),
        type: "warning"
      }).then(() => {
        this.loading = true
        exemptFoamWeightDischargeApi({abnormalityIdList: ids}).then(res => {
          if (res.ok) {
            this.getList()
            this.$message.success(this.$t("uexpressOrder.operSuccess"));
          }
          this.loading = false
        });
      }).catch(() => { });
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
