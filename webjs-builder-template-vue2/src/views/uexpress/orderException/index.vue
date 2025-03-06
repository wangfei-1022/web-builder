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
            <el-form-item :label='$t("uexpressOrder.abnormalityType")' prop="abnormalityType">
              <uexpress-select v-model="formData.abnormalityType" type="abnormalityType" addALL />
            </el-form-item>
            <el-form-item :label='$t("uexpressOrder.orderState")' prop="orderState">
              <uexpress-select v-model="formData.orderState" type="orderState" addALL filterable />
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
            <el-form-item :label="$t('uexpressOrder.salesSettlementState')" prop="salesSettlementState">
              <uexpress-select v-model="formData.salesSettlementState" type="salesSettlementState" addALL />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.channelPushState')" prop="channelPushState">
              <uexpress-select v-model="formData.channelPushState" type="channelPushState" addALL />
            </el-form-item>
            <el-form-item :label="$t('uexpressOrder.customerId')" prop="customerId">
              <type-select v-model="formData.customerId" type="customer" />
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
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

    <div class="mt-20">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" size="mini" @click="exportFn(4)">{{$t("uexpressOrder.export")}}</el-button>
        <el-button type="primary" size="mini" @click="exportFn(5)">{{$t("uexpressOrder.exportUnConfirm")}}</el-button>
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
  </div>
</template>

<script>
import mixin from "./mixin";

export default {
  name: "UexpressOrderExceptionList",
  mixins: [mixin],
  data() {
    return {
      activeName: 'BASE_SEARCH',
      loading: false,
      abnormalityState: '1',
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
          field: "abnormalTypeName",
          headerName: this.$t("uexpressOrder.channelPushFailMessage"),
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
          minWidth: 100
        },
        {
          field: "processedByName",
          headerName: this.$t("uexpressOrder.processedByName"),
          minWidth: 100
        },
        {
          field: "channelPushStateName",
          headerName: this.$t("uexpressOrder.channelPushStateName"),
          minWidth: 100
        },
        {
          field: "salesSettlementStateName",
          headerName: this.$t("uexpressOrder.salesSettlementStateName"),
          minWidth: 100
        },
        {
          field: "orderStateName",
          headerName: this.$t("uexpressOrder.orderStateName"),
          minWidth: 100
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
          minWidth: 100
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
