
<template>
  <div class="right-main-wrapper" v-loading="loading">
    <el-tabs v-model="activeName" @tab-click="tabClick" class="top-tabs">
      <el-tab-pane :label='$t("receiveFms.nomarlSearch")' name="first"></el-tab-pane>
      <el-tab-pane :label='$t("receiveFms.moreNoSearch")' name="third"></el-tab-pane>
    </el-tabs>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" ref="searchFormRef1" v-show="activeName === 'first'">
      <template slot="multipleSearch">
        <div class="multiple-form-wrap">
          <el-form ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label="$t('fmsLock.orderNo')" prop="orderNo">
              <el-input v-model="formData.orderNo" type="text" clearable @keyup.enter.native="getList" />
            </el-form-item>
            <el-form-item :label="$t('fmsLock.MBL')" prop="mainOrderNo">
              <el-input v-model="formData.mainOrderNo" type="text" clearable @keyup.enter.native="getList" />
            </el-form-item>
            <el-form-item :label="$t('fmsLock.memberName')" prop="memberId">
              <type-select v-model="formData.memberId" type="member" @selected="getList" />
            </el-form-item>
            <el-form-item :label="$t('fmsLock.businessType')" prop="businessType">
              <base-select v-model="formData.businessType" type="businessType" @selected="getList" addAll></base-select>
            </el-form-item>
            <el-form-item :label="$t('fmsLock.businessDate')" prop="businessDatePeriod">
              <search-date-picker v-model="formData.businessDatePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label="$t('fmsLock.createByName')" prop="createId">
              <base-select v-model="formData.createId" type="user" filterable clearable @selected="getList" />
            </el-form-item>
            <el-form-item :label="$t('fmsLock.updateTime')" prop="updateTimePeriod">
              <search-date-picker v-model="formData.updateTimePeriod" @change="getList" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label="$t('fmsLock.unlockOrderTime')" prop="unlockOrderTime">
              <search-date-picker v-model="formData.unlockOrderTime" @change="getList" clearable></search-date-picker>
            </el-form-item>
            <el-form-item :label="$t('fmsLock.lockOrderStateName')" prop="lockOrderState" v-if="!lockOrderState">
              <fms-select v-model="formData.lockOrderState" type="lockOrderState" @selected="getList" addAll />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>
    <top-search-items-slot :searchFun="getList" :resetFun="reset" ref="searchFormRef3" v-show="activeName === 'third'">
      <!--多单号搜索-->
      <el-form slot="singleSearch" ref="formDataRef3" class="multipleNoSearch" :inline="true" :model="formData" label-width="100px" size="mini">
        <el-form-item label="" prop="multipleNos" class='multiple-no-item'>
          <template slot="label">
            <el-select v-model="formData.queryType" style="width: 100px;">
              <el-option :label="$t('fmsLock.orderNo')" value="1" />
              <el-option :label="$t('fmsLock.MBL')" value="2" />
            </el-select>
          </template>
          <el-input v-model="formData.multipleNos" type="textarea" rows="3" resize="none" clearable :placeholder="$t('receiveFms.multipleNosInfo')" />
        </el-form-item>
      </el-form>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button type="primary" @click="batchUnlockFn" v-if="lockOrderState === 50 || lockOrderState === ''" size="mini">{{$t('fmsLock.batchUnlock')}}</el-button>
        <el-button type="primary" @click="batchLockFn" v-if="lockOrderState === 40 || lockOrderState === ''" size="mini">{{$t('fmsLock.batchLock')}}</el-button>
      </div>
      <ag-grid-vue :locale-text-func="_i18nGridLocalText" :grid-options="gridOptions" :side-bar="sideBarDefs" :column-defs="columnFields" :row-data="dataList" :enable-col-resize="true"
                   :enable-sorting="true" :pagination="false" :pagination-auto-page-size="false" :grid-ready="onReady" :style="gridHeight" class="ag-theme-balham" />
      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
    </div>

    <el-dialog :visible.sync="infoVisible" :close-on-click-modal="false" width="500px" :title="$t('common.mention')">
      <div style="line-height: 24px;">{{infoMsg}}</div>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="infoVisible = false">{{ $t("contract.cancel") }}</el-button>
        <el-button size="mini" type="primary" @click="confirmFn">{{ $t("contract.confirm") }}</el-button>
      </div>
    </el-dialog>

    <batch-lock-dialog ref="batchLockDialogRef" @success="getList"/>
  </div>
</template>

<script>
import mixins from './mixins';

export default {
    name: 'ReceiptClearListUn',
    mixins: [mixins],
    data() {
        return {
            columnFields: [
                {
                    field: 'index',
                    headerNameKey: '',
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
                    field: 'orderNo',
                    headerName: this.$t('fmsLock.orderNo'),
                    minWidth: 150
                },
                {
                    field: 'mainOrderNo',
                    headerName: this.$t('fmsLock.MBL'),
                    minWidth: 150
                },
                {
                    field: 'businessTypeName',
                    headerName: this.$t('fmsLock.businessType'),
                    minWidth: 110
                },
                {
                    field: 'memberName',
                    headerName: this.$t('fmsLock.memberName'),
                    minWidth: 180
                },
                {
                    field: 'totalAmountAr',
                    headerName: this.$t('fmsLock.totalAmountAr'),
                    minWidth: 130
                },
                {
                    field: 'totalAmountAp',
                    headerName: this.$t('fmsLock.totalAmountAp'),
                    minWidth: 130
                },
                {
                    field: 'totalAmountGrossProfit',
                    headerName: this.$t('fmsLock.totalAmountGrossProfit'),
                    minWidth: 130
                },
                {
                    field: 'totalAmountGrossProfitStandard',
                    headerName: this.$t('fmsLock.totalAmountGrossProfitStandard'),
                    minWidth: 130
                },
                {
                    field: 'orderAmountProfitRate',
                    headerName: this.$t('fmsLock.orderAmountProfitRate'),
                    minWidth: 150
                },
                {
                    field: 'businessDate',
                    headerName: this.$t('fmsLock.businessDate'),
                    minWidth: 150
                },
                {
                    field: 'unlockOrderTime',
                    headerName: this.$t('fmsLock.unlockOrderTime'),
                    minWidth: 150
                },
                {
                    field: 'lockAdjustTypeName',
                    headerName: this.$t('fmsLock.lockAdjustTypeName'),
                    minWidth: 150
                },
                {
                    field: 'adjustTotalAmountAr',
                    headerName: this.$t('fmsLock.arLastAdjustAmounts'),
                    minWidth: 150
                },
                {
                    field: 'adjustTotalAmountAp',
                    headerName: this.$t('fmsLock.apLastAdjustAmounts'),
                    minWidth: 150
                },
                {
                    field: 'unlockVersion',
                    headerName: this.$t('fmsLock.unlockVersion'),
                    minWidth: 100
                },
                {
                    field: 'createByName',
                    headerName: this.$t('fmsLock.createByName'),
                    minWidth: 100
                },
                {
                    field: 'updateTime',
                    headerName: this.$t('fmsLock.updateTime'),
                    minWidth: 150
                },
                {
                    field: 'lockOrderStateName',
                    headerName: this.$t('fmsLock.lockOrderStateName'),
                    minWidth: 150
                },
                {
                    field: 'operation',
                    headerName: this.$t('fmsLock.operation'),
                    cellRendererFramework: 'OperationBtn',
                    minWidth: 100,
                    pinned: 'right'
                }
            ]
        };
    },
    created() {
      
    }
};
</script>
<style lang="scss" scoped>
.pagination-container {
    margin-top: 0px;
}
.right-main-wrapper {
    padding: 0px 20px 20px 20px;
}
.multipleNoSearch {
    width: 100%;
    .multiple-no-item {
        width: 100%;
        ::v-deep .el-form-item__content {
            width: calc(100% - 120px);
        }
        ::v-deep .el-textarea {
            width: 100%;
        }
    }
}
</style>
