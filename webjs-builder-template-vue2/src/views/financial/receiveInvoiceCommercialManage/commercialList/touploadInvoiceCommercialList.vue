<template>
  <div class="right-main-wrapper" v-loading="loading">
    <top-search-items-slot :searchFun="getList" :resetFun="reset">
        <el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("fmsReceiveInvoice.invoiceNo")' prop="invoiceNo">
              <el-input v-model="formData.invoiceNo" type="text" :placeholder="$t('receiveFms.please_enter')" size="mini" clearable @keyup.enter.native="getList" />
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
            <el-form-item :label="$t('fmsReceiveInvoice.invoiceMedium')" prop="invoiceMedium">
              <el-select v-model="formData.invoiceMedium" size="mini"  @change="getList">
                <el-option :label="$t('receiveFms.ALL')" value="" />
                <el-option v-for="(item, index) in invoiceMaterialTypeList" :key="index" :label="item.name" :value="item.code"/>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('fmsReceiveInvoice.applyById')" prop="applyById">
             <type-select v-model="formData.applyById" type="user" @selected="getList" />
            </el-form-item>
            <el-form-item :label="$t('fmsReceiveInvoice.applyTime')" prop="applyTimePeriod">
              <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.applyTimePeriod"	@change="getList" clearable></common-picker>
            </el-form-item>
            <el-form-item :label="$t('fmsReceiveInvoice.invoiceTime')" prop="invoiceDatePeriod">
              <common-picker pikcerType="daterange" :defaultTime="['00:00:00', '23:59:59']" v-model="formData.invoiceDatePeriod"	@change="getList" clearable></common-picker>
            </el-form-item>
          </el-form>
    </top-search-items-slot>
    <div class="">
      <div class="top-btn-wrap mb-10 mt-10">
      </div>

      <ag-grid-vue-pro
			:data="dataList"
			:style-grid="gridHeight"
			:column-fields-default="columnFields"
			:grid-ready="onReady"
			:is-no-oper="true"
		/>

       <div class="page-total">
        <span>{{$t('fmsReceiveInvoice.total')}}：</span>
        <span>
          <span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
            <span class='value'>{{item.currency}}</span>
            <span>{{item.value}}</span>
          </span>
        </span>
      </div>

      <Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList"/>

      <!--上传文件-->
      <el-dialog :title="$t('fmsReceiveInvoice.uploadFile')" :visible.sync="uploadVisible" width="500px">
        <el-form ref="uploadFormRef" :model="uploadForm" :rules="uploadFormRules" label-width="120px" label-position="right">
          <el-form-item :label="$t('fmsReceiveInvoice.attachmentUpload')" prop="files">
            <upload-file v-model="uploadForm.files" multiple></upload-file>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="uploadVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
          <el-button type="primary" @click="uploadSubmitFn" size="mini" :loading="uploadLoading">{{$t('common.confirm')}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixin from '@/views/financial/receiveInvoiceTaxManage/mixin'
import uploadInvoiceFileCell from '@/views/financial/receiveInvoiceTaxManage/components/uploadInvoiceFileCell' // 发票扫码件
import uploadChargeFileCell from '@/views/financial/receiveInvoiceTaxManage/components/uploadChargeFileCell' // 费用明细扫描件
import uploadOtherFileCell from '@/views/financial/receiveInvoiceTaxManage/components/uploadOtherFileCell' // 其它附件扫描件
import { parseTime, formatNumberToThousands } from '@/utils/index'
import touploadInvoiceCommercialListTable from "../table/touploadInvoiceCommercialListTable"
import { getCommercialInvoiceTouploadListByFinanceApi, getCommercialInvoiceTouploadTotalByFinanceApi } from "@/api/financial/fmsReceiveInvoice"

// 税控发票列表
export default {
	name: "FmsTaxIncoiceListComponent",
	mixins: [mixin],
	components: {
		uploadInvoiceFileCell,
		uploadChargeFileCell,
		uploadOtherFileCell
	},
	data() {
		return {
			columnFields: []
		}
	},
	created() {
		this.columnFields = touploadInvoiceCommercialListTable
	},
  methods: {
    async getList() {
      // 形式发票
      let params = this.getParams()
      const res = await getCommercialInvoiceTouploadListByFinanceApi(params)
      if (res.ok) {
        res.content.list = res.content.list || []
        this.total = parseInt(res.content.total, 10)
        this.dataList = this.formatListData(res.content.list)
      } else {
        this.total = 0
        this.dataList = []
      }
      this.loading = false

      getCommercialInvoiceTouploadTotalByFinanceApi(params).then(res => {
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
