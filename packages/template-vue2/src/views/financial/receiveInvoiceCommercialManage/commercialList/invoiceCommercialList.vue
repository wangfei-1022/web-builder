<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset">
        <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("fmsReceiveInvoice.invoiceNo1")' prop="invoiceNo">
              <el-input v-model="formData.invoiceNo" type="text" :placeholder="$t('receiveFms.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.invoiceSeqNo")' prop="invoiceSeqNo">
              <el-input v-model="formData.invoiceSeqNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.applyNo")' prop="applyNo">
              <el-input v-model="formData.applyNo" type="text" :placeholder="$t('receiveFms.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
            </el-form-item>
            <el-form-item :label="$t('fmsReceiveInvoice.business_type_name')" prop="businessType">
               <el-select v-model="formData.businessType" size="mini" @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="item in businessTypeList" :key="item.code" :label="item.chineseName" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('fmsReceiveInvoice.settlement_company_name')" prop="settlementCompanyId">
              <type-select v-model="formData.settlementCompanyId" type="settlementCompany" @selected="getList" />
            </el-form-item>
             <el-form-item :label="$t('fmsReceiveInvoice.settlement_office_name')" prop="settlementOfficeId">
               <el-select v-model="formData.settlementOfficeId" size="mini" @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="(item, index) in YHTList" :key="index" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.invoiceMedium")' prop="invoiceMedium">
              <el-select v-model="formData.invoiceMedium" size="mini"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="(item, index) in invoiceMaterialTypeList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.applyById")' prop="applyById">
              <type-select v-model="formData.applyById" type="user" @selected="getList" />
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.applyTime")' prop="applyTimePeriod">
              <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.applyTimePeriod"	@change="getList" clearable></common-picker>
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.invoiceTime")' prop="invoiceDatePeriod">
              <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.invoiceDatePeriod"	@change="getList" clearable></common-picker>
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.invoiceState")' prop="commercialInvoiceState">
              <el-select v-model="formData.commercialInvoiceState" size="mini"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="(item, index) in commercialInvoiceStateTypeList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.notifyState")' prop="notifyState">
              <el-select v-model="formData.notifyState" size="mini"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="(item, index) in notifyStateList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.expressState")' prop="expressState">
              <el-select v-model="formData.expressState" size="mini"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="(item, index) in expressStateList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.clearState")' prop="clearState">
              <el-select v-model="formData.clearState" size="mini"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="(item, index) in clearStateList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.instructionState")' prop="instructionState">
              <el-select v-model="formData.instructionState" size="mini"  @change="getList">
                <el-option :label="$t('common.ALL')" value="" />
                <el-option v-for="(item, index) in applyClearStateList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label='$t("fmsReceiveInvoice.expressNo")' prop="expressNo">
              <el-input v-model="formData.expressNo" type="text" :placeholder="$t('receiveFms.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
            </el-form-item>
          </el-form>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
        <el-button size="mini" type="primary" @click="expressNoFn()">{{$t("fmsReceiveInvoice.expressNoUpload")}}</el-button>
        <el-button size="mini" type="primary" @click="batchDownloadFileFn()">{{$t("fmsReceiveInvoice.downloadFile")}}</el-button>
        <el-button size="mini" type="primary" @click="applyOrHedgeClear(false)">{{$t("fmsReceiveInvoice.applyClear")}}</el-button>
        <el-button size="mini" type="primary" @click="applyOrHedgeClear(true)">{{$t("fmsReceiveInvoice.hedgeClear")}}</el-button>
      </div>

      <ag-grid-vue-pro
        :data="dataList"
        :style-grid="gridHeight"
        :column-fields-default="columnFields"
        :grid-ready="onReady"
      />

       <div class="page-total">
        <span>{{$t("fmsReceiveInvoice.total")}}：</span>
        <span>
          <span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
            <span class='value'>{{item.currency}}</span>
            <span>{{item.value}}</span>
          </span>
        </span>
      </div>

      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList"/>
    </div>

    <!--批量下载文件-->
    <el-dialog :title='$t("fmsReceiveInvoice.downloadFile")' :visible.sync="batchDownloadFileVisible" width="400px" @close="nullifyColseFn">
      <div style="margin-bottom: 10px;">
        <el-form ref="batchDownloadFileRef" :model="batchDownloadFileForm" :rules="batchDownloadFileFormRules" label-width="0px" label-position="right">
          <el-form-item label="" prop="invoiceFileTypes">
            <el-checkbox-group v-model="batchDownloadFileForm.invoiceFileTypes" size="mini">
              <div v-for="item in batchDownloadFileList" :key="item.code">
                <el-checkbox :label="item.code">{{item.name}}</el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchDownloadFileVisible = false" size="mini">{{$t("common.cancel")}}</el-button>
        <el-button type="primary" @click="batchDownloadFileConfirmFn" size="mini" :loading="batchDownloadFileLoading">{{$t("common.confirm")}}</el-button>
      </span>
    </el-dialog>

    <!--作废发票-->
    <el-dialog :title='$t("fmsReceiveInvoice.nullifyInvoice")' :visible.sync="cancelVisible" width="500px" @close="nullifyColseFn">
      <div>
        {{$t("fmsReceiveInvoice.nullifyInvoiceInfo")}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="nullifyColseFn" size="mini">{{$t("common.cancel")}}</el-button>
        <el-button type="primary" @click="nullifySubmitFn" size="mini" :loading="cancelLoading">{{$t("common.confirm")}}</el-button>
      </span>
    </el-dialog>

    <!--回传单号-->
    <el-dialog :title='$t("fmsReceiveInvoice.expressNoUpload")' :visible.sync="expressNoVisible" width="500px">
      <el-form ref="expressNoFormRef" :model="expressNoForm" :rules="expressNoFormRules" label-width="120px" label-position="right">
        <div style="padding-left: 58px;margin-bottom: 10px;">
          <span style="margin-right: 15px;">{{$t("fmsReceiveInvoice.invoiceNo1")}}</span>
          <span>{{expressNoInvoiceNo}}</span>
        </div>
        <el-form-item :label='$t("fmsReceiveInvoice.expressNo")' prop="expressNo">
          <el-input size="mini" v-model="expressNoForm.expressNo" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="expressNoVisible = false" size="mini">{{$t("common.cancel")}}</el-button>
        <el-button type="primary" @click="expressNoSubmitFn" size="mini" :loading="expressNoLoading">{{$t("common.confirm")}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/views/financial/receiveInvoiceTaxManage/mixin'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import invoiceCommercialListTableFinance from '../table/invoiceCommercialListTableFinance'
import { getCommercialInvoicedListByFinanceApi, getCommercialInvoicedTotalByFinanceApi } from "@/api/financial/fmsReceiveInvoice"

// 税控发票列表
export default {
	name: "FmsCommercialIncoiceListComponent",
	mixins: [mixin],
	data() {
		return {
			columnFields: []
		}
	},
	created() {
		this.columnFields = invoiceCommercialListTableFinance
	},
  methods: {
    async getList() {
      // 形式发票
      let params = this.getParams()
      const res = await getCommercialInvoicedListByFinanceApi(params)
      if (res.ok) {
        res.content.list = res.content.list || []
        this.total = parseInt(res.content.total, 10)
        this.dataList = this.formatListData(res.content.list)
      } else {
        this.total = 0
        this.dataList = []
      }
      this.loading = false

      getCommercialInvoicedTotalByFinanceApi(params).then(res => {
        if (res.ok) {
          res.content.forEach(v => {
            if (v.amountName === 'sourceAmount') {
                v.amounts.forEach(v => {
                  v.value = formatNumberToThousands(v.value)
                })
                this.amountTotal = v.amounts
              }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.right-main-wrapper {
	padding: 5px 20px;
	height: 100%;
	overflow: hidden;
}
.page-total {
	background: rgba(16, 142, 233, 0.1);
	color: #108ee9;
	font-family: "PingFangSC-Regular", "PingFang SC";
	font-weight: 400;
	font-style: normal;
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	padding: 0px 10px;

	.value-item {
		display: inline-block;
		margin-right: 30px;
		.value {
			display: inline-block;
			margin-right: 5px;
		}
	}
}
.pagination-container {
	margin-top: 0px;
}
</style>
