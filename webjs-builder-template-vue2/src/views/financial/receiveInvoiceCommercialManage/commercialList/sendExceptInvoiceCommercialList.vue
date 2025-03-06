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
        <!--重新推送-->
				<el-button size="mini" type="primary" @click="resendTaxInvoiceFn()">{{$t("fmsReceiveInvoice.resendInvoice")}}</el-button>
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
  </div>
</template>

<script>
import mixin from '@/views/financial/receiveInvoiceTaxManage/mixin'
import { parseTime, formatNumberToThousands } from '@/utils/index'
import sendExceptInvoiceCommercialListTableFinance from '../table/sendExceptInvoiceCommercialListTableFinance'
import { getCommercialInvoiceSendExceptListByFinanceApi, getCommercialInvoiceSendExceptTotalByFinanceApi, resendCommercialInvoiceApi } from "@/api/financial/fmsReceiveInvoice"

// 形式发票列表-推送异常
export default {
	name: "FmsCommercialIncoiceListComponent",
	mixins: [mixin],
	data() {
		return {
			columnFields: []
		}
	},
	created() {
		this.columnFields = sendExceptInvoiceCommercialListTableFinance
	},
  methods: {
    async getList() {
      // 形式发票-推送异常
      let params = this.getParams()
      const res = await getCommercialInvoiceSendExceptListByFinanceApi(params)
      if (res.ok) {
        res.content.list = res.content.list || []
        this.total = parseInt(res.content.total, 10)
        this.dataList = this.formatListData(res.content.list)
      } else {
        this.total = 0
        this.dataList = []
      }
      this.loading = false

      getCommercialInvoiceSendExceptTotalByFinanceApi(params).then(res => {
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
    },
    resendTaxInvoiceFn() {
      let rows = this.gridApi.getSelectedRows()
      if (!rows.length) {
        this.$message.error(this.$t('fmsReceiveInvoice.pleaseSelectOne'))
        return
      }
      let data = {
        invoiceIds: []
      }
      rows.forEach(v => {
        data.invoiceIds.push(v.id)
      })
      resendCommercialInvoiceApi(data).then(res => {
        if (res.ok) {
          this.$message.success(this.$t('fmsReceiveInvoice.resendInvoiceSuccess'))
          this.getList()
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
