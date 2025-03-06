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
              <uexpress-select v-model="formData.orderState" type="orderState" addALL />
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
				<el-button type="primary" size="mini" @click="importFn">{{ $t("uexpressOrder.import") }}</el-button>
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

    <update-consignee-address ref="updateConsigneeAddressRef" @ok="getList" />

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressOrder.returnWarehouseImport")'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressOrder.returnWarehouseImportTemplate")}}</el-button>
        </div>
        <el-form-item :label='$t("uexpressOrder.uploadFile")' prop="abnormalityExcel">
          <upload-file v-model="importForm.abnormalityExcel" accept=".xls,.xlsx" :limit="1"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="batchImportConfirmFn" :loading="batchImportLoading">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderExceptionListApi,
  getOrderExceptionListByNosApi,
  importReturnWarehouseApi, // 退回海外仓导入-导入
} from '@/api/uexpress/orderException'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import mixin from "@/views/uexpress/orderException/mixin";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";
import OptionBtn from './optionBtn'
import UpdateConsigneeAddress from '@/views/uexpress/order/components/UpdateConsigneeAddress'

export default {
  name: "UexpressOrderExceptionReturnWarehouseList",
  mixins: [mixin],
  components: {
    OptionBtn,
    UpdateConsigneeAddress
  },
  data() {
    return {
      activeName: 'BASE_SEARCH',
      loading: false,
      abnormalityType: 460, // 清关查验异常
      abnormalityState: '1',

      // 批量导入
      batchImportVisible: false,
      batchImportLoading: false,
      importForm: {
        abnormalityExcel: []
      },
      importFormRule: {
        abnormalityExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
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
          field: "predictTime",
          headerName: this.$t("uexpressOrder.predictTime"),
          minWidth: 150
        },
        {
          field: "customerDeadlineProcessingTime",
          headerName: this.$t("uexpressOrder.customerDeadlineProcessingTime"),
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
          field: "OptionBtn",
          pinned: 'right',
          headerName: this.$t("common.operation"),
          cellRendererFramework: "OptionBtn",
          minWidth: 80
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 重新派送
    redeliveryFn(row) {
      this.$refs.updateConsigneeAddressRef.show(row, "REDELIVERY")
    },
    // 导入
    downloadTemplateFn() {
      getTemplateFileApi(16).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    importFn() {
      this.importForm = {
        abnormalityExcel: []
      }
      this.batchImportVisible = true
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm
          }
          data.abnormalityExcel = data.abnormalityExcel[0]
          this.batchImportLoading = true
          importReturnWarehouseApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressOrder.importOperSuccess'))
            }
            this.batchImportLoading = false
          })
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
