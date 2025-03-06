<template>
	<div class="right-main-wrapper" v-loading="loading">
		<top-search-items-slot :searchFun="list" :resetFun="reset">
			<el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
				<el-form-item :label='$t("uexpressFmsBill.bill_no")' prop="billNo">
					<el-input v-model="formData.billNo" type="text" :placeholder="$t('uexpressFmsBill.please_enter')" size="mini" clearable @keyup.enter.native="list" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsConfirmation.customer_name')" prop="memberId">
					<type-select v-model="formData.memberId" type="customer" @selected="list" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"/>
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsConfirmation.settlement_mode')" prop="settlementMode">
					<base-select v-model="formData.settlementMode" type="settlementMode" addAll @selected="list" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsBill.settlement_office_name')" prop="settlementOfficeId">
					<base-select v-model="formData.settlementOfficeId" type="settlementOffice" addAll @selected="list" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsBill.bill_status')" prop="billState" v-if="!billState">
					<fms-select v-model="formData.billState" type="billState" addAll @selected="list" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsBill.invoice_status')" prop="invoiceState">
					<fms-select v-model="formData.invoiceState" type="invoiceState" addAll @selected="list" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsBill.verification_status')" prop="clearState">
					<fms-select v-model="formData.confirmationState" type="clearState" addAll @selected="list" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsBill.sales_names')" prop="saleId">
          <base-select v-model="formData.saleId" type="sale" filterable addAll clearable @selected="list" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsBill.billDate')" prop="billDateActualPeriod">
					<search-date-picker v-model="formData.billDateActualPeriod" @change="list" clearable></search-date-picker>
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsBill.bill_date_estimate')" prop="billDateEstimatePeriod" v-if="false">
					<search-date-picker v-model="formData.billDateEstimatePeriod" @change="list" clearable></search-date-picker>
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsBill.productType')" prop="childBusinessType">
					<uexpress-select v-model="formData.childBusinessType" type="productType" addAll @selected="list" />
				</el-form-item>
			</el-form>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
				<el-button size="mini" type="primary" @click="batchCheckFn()">{{$t('uexpressFmsBill.batchCheck')}} </el-button>
				<el-button size="mini" type="primary" @click="batchSendFn()">{{$t('uexpressFmsBill.batchSend')}} </el-button>
			</div>

			<ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" :enabled="false" />

			<div class="page-total" v-if="!pushEmailState">
				<span class="page-total-item">
					<span>{{type === 'AR' ? $t('uexpressFmsBill.receive_sum'): $t('payableFms.payable_sum')}}：</span>
					<span>
						<span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
						<span class='value'>{{item.currency}}</span>
						<span>{{item.value}}</span>
						</span>
					</span>
				</span>

				<span class="page-total-item">
					<span>{{$t('uexpressFmsBill.un_clear_amount_total')}}：</span>
					<span>
						<span class="value-item" v-for="(item, index) in unClearedAmountTotal" :key='index'>
							<span class='value'>{{item.currency}}</span>
							<span>{{item.value}}</span>
						</span>
					</span>
				</span>
			</div>

			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="list" />
		</div>
	</div>
</template>

<script>
import OptionBtnBill from "./optionBtn";
import { AgGridVue } from "ag-grid-vue";
import {
  getReceiveBillListApi,
  getReceiveBillListTotalApi,
  sendReceiveBillEmailApi,
  downloadBillFileApi,
  receiveBillConfirmApi
} from "@/api/uexpress/fmsBill";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import {
  getPayableBillListApi,
  getPayableBillListTotalApi,
  payableBillExportExcelApi
} from "@/api/financial/fmsPayable";
import receiveTable from "./table/receiveTable";

export default {
  name: "UExpressFmsReceiveBillComponent",
  components: {
    AgGridVue,
    OptionBtnBill
  },
  props: {
    invoiceApplyState: {
      type: [String, Number],
      default: ""
    },
    billState: {
      type: [String, Number],
      default: ""
    },
    pushEmailState: {
      type: [String, Number],
      default: ""
    },
    type: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      selectedIds: [],
      billExportMap: {},
      exportTemplates: [],
      selectedInvoiceInfo: {},
      formData: {
        billNo: "",
        settlementCompanyId: "",
        settlementOfficeId: "",
        saleId: "",
        billState: "",
        pushEmailState: "",
        invoiceState: "",
        clearState: "",
        instructionState: "",
        confirmBy: "",
        createBy: "",
        billDateEstimatePeriod: [],
        billDateActualPeriod: [],
        confirmDateEstimatePeriod: [],
        confirmDateActualPeriod: [],
        periodName: "",
        childBusinessType: ''
      },
      billStateList: [],
      businessTypeList: [],
      clearStateList: [],
      pushEmailStateList: [],
      applyClearStateList: [],
      invoiceStateList: [],
      salesList: [],
      YHTList: [],
      pageSizeRange: [10, 20, 30, 50],
      pageSize: 50,
      pageNum: 1,
      total: 0,
      dataList: [],
      amountTotal: [], // 统计
      unClearedAmountTotal: [], // 未销合计

      columnFields: [],
      loading: false
    };
  },
  created() {
    this.columnFields = receiveTable;
    this.list();
  },
  methods: {
    onReady(params) {
      this.gridApi = params.api;
    },
    getParams() {
      const params = {
        ...this.formData,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      // 如果是待对账tab
      if (this.billState) {
        params.billState = this.billState;
      }
      if (this.pushEmailState) {
        params.pushEmailState = this.pushEmailState;
      }
      if (this.invoiceApplyState) {
        params.invoiceApplyState = this.invoiceApplyState;
      }
      if (this.formData.billDateEstimatePeriod.length) {
        params.billDateEstimateStart = this.formData.billDateEstimatePeriod[0];
        params.billDateEstimateEnd = this.formData.billDateEstimatePeriod[1];
      }
      if (this.formData.billDateActualPeriod.length) {
        params.billDateActualStart = this.formData.billDateActualPeriod[0];
        params.billDateActualEnd = this.formData.billDateActualPeriod[1];
      }
      if (this.formData.confirmDateEstimatePeriod.length) {
        params.confirmDateEstimateStart =
          this.formData.confirmDateEstimatePeriod[0];
        params.confirmDateEstimateEnd =
          this.formData.confirmDateEstimatePeriod[1];
      }
      if (this.formData.confirmDateActualPeriod.length) {
        params.confirmDateActualStart =
          this.formData.confirmDateActualPeriod[0];
        params.confirmDateActualEnd = this.formData.confirmDateActualPeriod[1];
      }
      delete params.billDateEstimatePeriod;
      delete params.billDateActualPeriod;
      delete params.confirmDateEstimatePeriod;
      delete params.confirmDateActualPeriod;
      return params;
    },
    async list() {
      this.loading = true;
      let params = this.getParams();
      let totalFn =
        this.type === "AP"
          ? getPayableBillListTotalApi
          : getReceiveBillListTotalApi;
      let listFn =
        this.type === "AP" ? getPayableBillListApi : getReceiveBillListApi;
      this.$emit("refresh");
      totalFn(params).then(res => {
        if (res.ok) {
          res.content.forEach(v => {
            if (v.amountName === "amount") {
              v.amounts.forEach(v => {
                v.value = formatNumberToThousands(v.value);
              });
              this.amountTotal = v.amounts;
            }
            if (v.amountName === "unClearedAmount") {
              v.amounts.forEach(v => {
                v.value = formatNumberToThousands(v.value);
              });
              this.unClearedAmountTotal = v.amounts;
            }
          });
        }
      });
      const res = await listFn(params);
      if (res.ok) {
        this.total = parseInt(res.content.total, 10);
        let currencyArr = [];
        res.content.list.forEach(v => {
          v.type = this.type;
          v.billDateEstimate = parseTime(
            v.billDateEstimate,
            "{y}-{m}-{d} {h}:{i}:{s}"
          );
          v.billDateActual = parseTime(
            v.billDateActual,
            "{y}-{m}-{d} {h}:{i}:{s}"
          );
          v.confirmDateEstimate = parseTime(
            v.confirmDateEstimate,
            "{y}-{m}-{d} {h}:{i}:{s}"
          );
          v.confirmDateActual = parseTime(
            v.confirmDateActual,
            "{y}-{m}-{d} {h}:{i}:{s}"
          );

          if (v.currencyAmounts && v.currencyAmounts.length > 0) {
            v.billAmount = formatNumberToThousands(v.currencyAmounts[0].value);
            v.currency = v.currencyAmounts[0].currency;
          }
        });
        this.dataList = res.content.list;
      } else {
        this.total = 0;
        this.dataList = [];
      }
      this.loading = false;
    },
    reset() {
      this.$refs.formData.resetFields();
      this.list();
    },
    // 发送账单-AR
    batchSendFn() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(
          this.$t("uexpressFmsBill.please_select_one_then_bill")
        );
        return;
      }
      let ids = [];
      let VALID = [];
      selectedRows.forEach(v => {
        ids.push(v.id);
        if (v.billState !== 1) {
          VALID = false;
        }
      });
      if (!VALID) {
        this.$message.error(this.$t("uexpressFmsBill.justSelectUnCheckBill"));
        return;
      }

      this.$confirm(
        this.$t("uexpressFmsBill.sendBillConfrimDes", { count: ids.length }),
        this.$t("uexpressFmsBill.sendBillConfrim"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          sendReceiveBillEmailApi(ids).then(res => {
            if (res.ok) {
              this.list();
              this.$message.success(this.$t("uexpressFmsBill.sendBillSuccess"));
            }
            this.loading = false;
          });
        })
        .catch(() => {});
    },
    // 下载账单
    downloadBillFn(item) {
      downloadBillFileApi(item.id).then(res => {
        if (res.ok) {
          if (!res.content) {
            this.$message.error(this.$t("uexpressFmsBill.download_file_wait"));
            return;
          }
          window.location.href = res.content.url;
        }
      });
    },
    // 查看
    view(item) {
      let name =
        this.type === "AP" ? "FmsPayableBillDetail" : "FmsReceiveBillDetail";
      this.$router.push({ name: name, query: { id: item.id } });
    },
    // 对账确认
    batchCheckFn() {
      let selectedRows = this.gridApi.getSelectedRows();
      if (selectedRows.length <= 0) {
        this.$message.error(
          this.$t("uexpressFmsBill.please_select_one_then_bill")
        );
        return;
      }
      let ids = [];
      let VALID = [];
      selectedRows.forEach(v => {
        ids.push(v.id);
        if (v.billState !== 1) {
          VALID = false;
        }
      });
      if (!VALID) {
        this.$message.error(this.$t("uexpressFmsBill.justSelectUnCheckBill"));
        return;
      }
      this.$confirm(
        this.$t("uexpressFmsBill.fms_bill_confirm_des"),
        this.$t("uexpressFmsBill.mention"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          this.loading = true;
          receiveBillConfirmApi(ids)
            .then(res => {
              if (res.ok) {
                this.$message.success(
                  this.$t("uexpressFmsBill.fms_bill_confirm_success")
                );
                this.list();
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.right-main-wrapper {
  padding: 5px 20px;
  height: 100%;
  overflow: hidden;
}

.pagination-container {
  margin-top: 0px;
}
</style>
