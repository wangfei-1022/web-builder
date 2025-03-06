<template>
	<div class="right-main-wrapper" v-loading="loading">
    <el-tabs v-model="searchActiveName" class="top-tabs">
			<el-tab-pane :label='$t("uexpressFmsConfirmation.otherSearch")' name="BASE_SEARCH"></el-tab-pane>
			<el-tab-pane :label='$t("uexpressFmsConfirmation.noSearch")' name="NO_SEARCH"></el-tab-pane>
		</el-tabs>

    <top-search-items-slot :searchFun="getList" :resetFun="reset" :visible="searchActiveName === 'NO_SEARCH'">
      <template slot="multipleSearch">
        <div class="multiple-no-wrap">
          <el-form ref="formDataRef" :inline="true" :model="formData" label-width="100px" size="mini">
            <el-form-item :label='$t("uexpressOrder.no")' prop="queryType" style="width: 100px;float: left;"></el-form-item>
            <el-form-item label='' prop="nos" class="multiple-no-item">
              <el-input v-model="formData.nos" type="textarea" rows="3" size="mini" resize="none" clearable :placeholder="$t('uexpressOrder.noPlaceholder')" />
            </el-form-item>
          </el-form>
        </div>
      </template>
    </top-search-items-slot>

		<top-search-items-slot :searchFun="getList" :resetFun="reset" v-if="searchActiveName === 'BASE_SEARCH'">
			<el-form slot="multipleSearch" ref="formData" :inline="true" :model="formData" label-width="100px" size="mini">
				<el-form-item label='' prop="searchNo">
          <template slot="label">
            <el-select v-model="formData.noType">
              <el-option :label="$t('uexpressFmsConfirmation.orderNo')" :value="1" />
              <el-option :label="$t('uexpressFmsConfirmation.channelOrderNo')" :value="2" />
              <el-option :label="$t('uexpressFmsConfirmation.memberOrderNo')" :value="3" />
            </el-select>
          </template>
          <el-input v-model="formData.searchNo" type="text" size="mini"  clearable  />
        </el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.customer_name')" prop="memberId">
					<type-select v-model="formData.memberId" type="customer" @selected="getList" :requestParams="{businessType: 'INTERNATIONAL_LINE'}"/>
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.productName')" prop="productCode">
					<uexpress-type-select v-model="formData.productCode" type="productSales" filterable @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.countryCode')" prop="countryCode">
					<base-select v-model="formData.countryCode" type="country" filterable clearable @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.bill_status')" prop="entryState">
					<fms-select v-model="formData.entryState" type="entryState" addAll @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.confirmationType')" prop="confirmationType">
					<uexpress-select v-model="formData.confirmationType" type="confirmationType" addAll @selected="getList" />
				</el-form-item>
        <el-form-item>
          <template slot="label">
            <el-select v-model="formData.timeType">
              <el-option :label="$t('uexpressFmsConfirmation.inboundTime')" :value="1" />
              <el-option :label="$t('uexpressFmsConfirmation.outboundTime')" :value="2" />
              <el-option :label="$t('uexpressFmsConfirmation.offsetTime')" :value="3" />
            </el-select>
          </template>
					<search-date-picker v-model="formData.datePeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsConfirmation.sales_names')" prop="salesId">
					<base-select v-model="formData.salesId" type="sale" filterable clearable @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.confirmation_state')" prop="confirmationState">
					<fms-select v-model="formData.confirmationState" type="confirmationState" addAll @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsConfirmation.verification_status')" prop="clearState">
					<fms-select v-model="formData.clearState" type="clearState" addAll @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.settlement_mode')" prop="settlementMode">
					<base-select v-model="formData.settlementMode" type="settlementMode" addAll @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.productType')" prop="productType">
					<uexpress-select v-model="formData.productType" type="productType" addAll @selected="getList" />
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.orderTime')" prop="orderTimePeriod">
					<search-date-picker v-model="formData.orderTimePeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.lastMileCollectDateTime')" prop="lastMileCollectDateTimePeriod">
					<search-date-picker v-model="formData.lastMileCollectDateTimePeriod" @change="getList" clearable></search-date-picker>
				</el-form-item>

				<el-form-item :label="$t('uexpressFmsConfirmation.invoice_status')" prop="invoiceState" v-if="false">
					<fms-select v-model="formData.invoiceState" type="invoiceState" addAll @selected="getList" />
				</el-form-item>
				<el-form-item :label="$t('uexpressFmsConfirmation.apply_clear_status')" prop="instructionState" v-if="false">
					<fms-select v-model="formData.instructionState" type="applyClearState" addAll @selected="getList" />
				</el-form-item>
			</el-form>
		</top-search-items-slot>
		<div class="">
			<div class="top-btn-wrap mb-10 mt-10">
        <!-- 批量确认 -->
        <el-button size="mini" type="primary" @click="batchConfirmFn()" v-if="role === 'FINANCE'">{{$t('uexpressFmsConfirmation.batchConfirm')}}</el-button>
        <!-- 导出 -->
        <el-button size="mini" type="primary" @click="changeConfirmSettlementFn()" v-if="role === 'FINANCE' && false">{{$t('uexpressFmsConfirmation.export')}}</el-button>
        <!-- 批量调整 -->
        <el-button size="mini" type="primary" @click="batchImportFn()" v-if="role === 'PRODUCT' || role === 'OPERATOR'">{{$t('uexpressFmsConfirmation.batchAdjust')}}</el-button>
			</div>
			<ag-grid-vue-pro :data="dataList" :style-grid="gridHeight" :column-fields-default="columnFields" :grid-ready="onReady" :enabled="false"/>

			<div class="page-total">
				<span>{{type === 'AR' ? $t('uexpressFmsConfirmation.receive_sum'): $t('payableFms.payable_sum')}}：</span>
				<span>
					<span class="value-item" v-for="(item, index) in amountTotal" :key='index'>
						<span class='value'>{{item.currency}}</span>
						<span>{{item.value}}</span>
					</span>
				</span>
			</div>

			<Pagination :total="total" :limit.sync="pageSize" :page.sync="pageNum" @pagination="getList" />
		</div>


    <el-dialog :title="$t('uexpressFmsConfirmation.join_bill')" :visible.sync="joinBillVisible" width="500px">
      <el-form class="join-bill-form" ref="formRef" :model="joinForm" :rules="joinFormRules" label-width="120px" label-position="right">
        <el-form-item :label="$t('uexpressFmsConfirmation.entity_no')" prop="orderNo">
          <span>{{joinForm.orderNo}}</span>
        </el-form-item>
        <el-form-item :label="$t('uexpressFmsConfirmation.entry_amount')" >
          <span v-for="(item, index) in joinForm.currencyAmounts" :key="index">
            <span>{{item.value}}{{item.currency}}</span>
          </span>
        </el-form-item>
        <el-form-item :label='$t("uexpressFmsConfirmation.bill_no")' prop="billNo">
					<el-input v-model="joinForm.billNo" type="text" size="mini" clearable />
				</el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="joinBillVisible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="joinBillSubmitFn" size="mini" :loading="joinBillLoading">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="batchImportVisible" :close-on-click-modal="false" width="500px" :title='$t("uexpressFmsConfirmation.batchAdjust")'>
      <el-form class="contact-form" ref="batchImportRef" :model="importForm" :rules="importFormRule" label-width="100px" size="mini">
        <div style="text-align: center;margin-bottom: 20px;">
          <el-button size="mini" type="primary" icon="el-icon-download" @click="downloadTemplateFn">{{$t("uexpressFmsConfirmation.batchAdjustTemplate")}}</el-button>
        </div>
        <el-form-item label='excel' prop="adjustChargeExcel">
          <upload-file v-model="importForm.adjustChargeExcel" accept=".xls,.xlsx" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="option-btn-wrap">
        <el-button size="mini" @click="batchImportVisible = false">{{ $t("common.cancel") }}</el-button>
        <el-button size="mini" type="primary" :loading="batchImportLoading" @click="batchImportConfirmFn">{{ $t("common.confirm") }}</el-button>
      </div>
    </el-dialog>

    <batch-oper-confirm-dialog ref="batchOperConfirmDialogRef" />
  </div>
</template>

<script>
import { getBusinessTypeListApi, getSalesListApi } from "@/api/partner/customerManage";
import {
  getReceiveConfirmationListFinanceApi,
  getReceiveConfirmationListProductApi,
  getReceiveConfirmationListOperatorApi,
  getReceiveConfirmationListFinanceByNosApi,
  getReceiveConfirmationListProductByNosApi,
  getReceiveConfirmationListOperatorByNosApi,
  getReceiveConfirmationListTotalApi,
  receiveConfirmationRemoveBillApi,
  receiveConfirmationJoinBillApi,
  receiveConfirmationConfirmApi,
  receiveConfirmationConfirmOneApi,
  receiveUnallowBillApi,
  receiveAllowBillApi,
  importBatchAdjustChargeApi
} from "@/api/uexpress/fmsConfirmation";
import BatchOperConfirmDialog from "./components/BatchOperConfirmDialog";
import UExpressOptionBtnConfirmation from "./components/OptionBtn";
import { AgGridVue } from "ag-grid-vue";
import { getYHTListApi, getRechargeModeApi } from "@/api/partner/base";
import { parseTime, formatNumberToThousands } from "@/utils/index";
import receiveTable from "./table/receiveTable";
import { getDictListApi, getTemplateFileApi } from "@/api/uexpress/base";

export default {
	name: "UExpressFmsConfirmationList",
	components: {
		AgGridVue,
		UExpressOptionBtnConfirmation,
    BatchOperConfirmDialog
	},
	props: {
		type: {
			type: String,
			default: ""
		},
		role: {
			type: String,
			default: ""
		},
		origin: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
      searchActiveName: 'BASE_SEARCH',
			selectedIds: [],
			selectedInvoiceInfo: {},
			formData: {
				extendInfo11: "",
        memberId: "",
				searchNo: "",
        noType: 1,
        timeType: 1,
        datePeriod: [],
        orderTimePeriod: [], // 下单时间
        lastMileCollectDateTimePeriod: [], // 尾程揽收时间

				confirmationNo: "",
				settlementCompanyId: "",
				settlementOfficeId: "", // 一海通结算公司
				businessType: "",
				feeId: "",
				entryState: "",
				invoiceState: "",
				clearState: "",
				instructionState: "",
				confirmationState: "",
				salesId: "",
        productType: '' // 业务类型
			},
			createBillInfo: {}, // 生成账单所需信息
			entryStateList: [],
			businessTypeList: [],
			clearStateList: [],
			applyClearStateList: [],
			invoiceStateList: [],
			confirmationStateList: [],
			settlementModeList: [],
			salesList: [],
			YHTList: [],
			pageSizeRange: [10, 20, 30, 50],
			pageSize: 50,
			pageNum: 1,
			total: 0,
			dataList: [],
			amountTotal: [], // 统计

			columnFields: [],
			gridApi: {},
			loading: false,
			addType: "", //

      joinBillVisible: false,
      joinBillLoading: false,
      joinForm: {
        orderNo: '',
        billNo: '',
        currencyAmounts: []
      },
      joinFormRules: {
        billNo: [{required: true,	message: this.$t("common.cannot_be_null")}]
      },
      selectedItem: {},


      // 批量导入
      batchImportVisible: false,
      batchImportLoading: false,
      importForm: {
        adjustChargeExcel: []
      },
      importFormRule: {
        adjustChargeExcel: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
      }
		};
	},
	created() {
		this.getList();
    this.columnFields = receiveTable;
	},
	methods: {
		onReady(params) {
			this.gridApi = params.api;
		},
    getParams() {
      let params = {
				pageSize: this.pageSize,
				pageNum: this.pageNum
			};
      if (this.searchActiveName === 'NO_SEARCH') {
        params.nos = this.formData.nos ? this.formData.nos.split(/,|，|\s+/) : []
      } else {
        params = {
          ...this.formData,
          ...params
        }
        if (params.noType === 1) {
          params.orderNo = params.searchNo
        } else if (params.noType === 2) {
          params.channelOrderNo = params.searchNo
        } else if (params.noType === 3) {
          params.memberOrderNo = params.searchNo
        }

        if (params.timeType === 1) {
          params.inboundTimeStart = params.datePeriod[0]
          params.inboundTimeEnd = params.datePeriod[1]
        } else if (params.timeType === 2) {
          params.outboundTimeStart = params.datePeriod[0]
          params.outboundTimeEnd = params.datePeriod[1]
        } else if (params.timeType === 3) {
          params.offsetTimeStart = params.datePeriod[0]
          params.offsetTimeEnd = params.datePeriod[1]
        }

        if (params.orderTimePeriod && params.orderTimePeriod.length) {
          params.orderTimeStart = params.orderTimePeriod[0]
          params.orderTimeEnd = params.orderTimePeriod[1]
        }
        if (params.lastMileCollectDateTimePeriod && params.lastMileCollectDateTimePeriod.length) {
          params.lastMileCollectDateTimeStart = params.lastMileCollectDateTimePeriod[0]
          params.lastMileCollectDateTimeEnd = params.lastMileCollectDateTimePeriod[1]
        }
        delete params.orderTimePeriod
        delete params.lastMileCollectDateTimeEnd
      }
      return params
    },
		async getList() {
			this.loading = true;
			const params = this.getParams()
			let listFn = null;
      switch (this.role) {
        case "FINANCE":
          listFn = this.searchActiveName === 'NO_SEARCH' ? getReceiveConfirmationListFinanceByNosApi : getReceiveConfirmationListFinanceApi;
          break;
        case "PRODUCT":
          listFn = this.searchActiveName === 'NO_SEARCH' ? getReceiveConfirmationListProductByNosApi : getReceiveConfirmationListProductApi;
          break;
        case "OPERATOR":
          listFn = this.searchActiveName === 'NO_SEARCH' ? getReceiveConfirmationListOperatorByNosApi : getReceiveConfirmationListOperatorApi;
          break;
        default:
          break;
      }
      let totalFn = this.searchActiveName === 'NO_SEARCH' ? getReceiveConfirmationListTotalApi : getReceiveConfirmationListTotalApi
			totalFn(params).then(res => {
				if (res.ok) {
					res.content.forEach(v => {
						if (v.amountName === "amount") {
							v.amounts.forEach(v => {
								v.value = formatNumberToThousands(v.value);
							});
							this.amountTotal = v.amounts;
						}
					});
				}
			});
			const res = await listFn(params);
			if (res.ok) {
				this.total = parseInt(res.content.total, 10);
				let currencyArr = [];
				res.content.list.forEach(v => {
					v = v || {}; // 兼容null
          v.role = this.role
          v.lastMileCollectDateTime = parseTime(v.lastMileCollectDateTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.createTime = parseTime(v.createTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.orderTime = parseTime(v.orderTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.bussinessDate = parseTime(v.bussinessDate, "{y}-{m}-{d} {h}:{i}:{s}");
					v.confirmTime = parseTime(v.confirmTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.inboundTime = parseTime(v.inboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.outboundTime = parseTime(v.outboundTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.payTime = parseTime(v.payTime, "{y}-{m}-{d} {h}:{i}:{s}");
					v.offsetTime = parseTime(v.offsetTime, "{y}-{m}-{d} {h}:{i}:{s}");
          v.confirmationType = Number(v.confirmationType); // 此处因为后端返回的code这会是string

          if (v.currencyAmounts && v.currencyAmounts.length > 0) {
            v.receiptAmount = formatNumberToThousands(v.currencyAmounts[0].value)
            v.currency = v.currencyAmounts[0].currency
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
			this.getList();
		},
    // 批量调整
    batchAdFn() {

    },
    // 调整费用
    adjustChargeFn(item) {
      this.$router.push({
        name: 'UexpressFmsConfirmationAdjust',
        query: {
          confirmationId: item.confirmationId,
          orderId: item.orderId,
          orderSk: item.orderSk,
          origin: this.origin
        }
      })
    },
		// 批量确认
		batchConfirmFn() {
      let selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length <= 0) {
				this.$message.error(this.$t("common.please_select_one_data"));
				return;
			}
      let confirmationIds = []
      let VALID = true
      selectedRows.forEach(v => {
        confirmationIds.push({   
          confirmationId: v.confirmationId, 
          salesOrderId: v.orderId, 
          orderSk:v.orderSk, 
        })
        if (v.confirmationState === 2) {
          VALID = false
        }
      })
      if (!VALID) {
        this.$message.error(this.$t("uexpressFmsConfirmation.batchConfirmError"));
				return;
      }


      this.$refs.batchOperConfirmDialogRef.show({
        ids: confirmationIds,
        oper: "uexpressFmsConfirmation.batchConfirm",
        api: receiveConfirmationConfirmOneApi
      })
      
			// this.$confirm(this.$t("uexpressFmsConfirmation.batchConfirmInfo"), this.$t("common.mention"), {
			// 	confirmButtonText: this.$t("common.confirm"),
			// 	cancelButtonText: this.$t("common.cancel"),
			// 	type: "warning"
			// })
			// 	.then(() => {
			// 		receiveConfirmationConfirmApi({confirmationIds: confirmationIds}).then(res => {
			// 			if (res.ok) {
			// 				this.$message.success(this.$t("uexpressFmsConfirmation.batchConfirmInfoSuccess"));
			// 				this.getList();
			// 			}
			// 		});
			// 	})
			// 	.catch(() => {});
		},
		// 查看
		view(item) {
			this.$router.push({
        name: 'UExpressFmsReceiveConfirmationDetail',
        query: {
          confirmationId: item.confirmationId,
          orderId: item.orderId,
          orderSk: item.orderSk,
          origin: this.origin
        }
      });
		},
    joinBill(item) {
      this.joinBillVisible = true
      this.selectedItem = item
      this.joinForm = {
        orderNo: item.orderNo,
        billNo: item.billNo,
        currencyAmounts: item.currencyAmounts
      }
    },
		// 加入账单
		joinBillSubmitFn() {
      let data = {
        confirmationIds: [this.selectedItem.confirmationId],
        billNo: this.joinForm.billNo
      }
      this.joinBillLoading = true
      receiveConfirmationJoinBillApi(data).then(res => {
        if (res.ok) {
          this.joinBillVisible = false
          this.$message.success(this.$t("uexpressFmsConfirmation.join_bill_success"));
          this.getList();
        }
        this.joinBillLoading = false
      })
		},
    // 移出账单
    removeBillFn(item) {
      let str = this.$t('uexpressFmsConfirmation.removeBillInfo', {billNo: item.billNo})
			this.$confirm(str, this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
					receiveConfirmationRemoveBillApi([item.confirmationId]).then(res => {
						if (res.ok) {
							this.$message.success(this.$t('uexpressFmsConfirmation.remove_success'));
							this.getList();
						}
					});
				})
				.catch(() => {});
		},
    // 不再入账
    unallowBillFn(item) {
			this.$confirm(this.$t('uexpressFmsConfirmation.unallowBillInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
					receiveUnallowBillApi([item.confirmationId]).then(res => {
						if (res.ok) {
							this.$message.success(this.$t('uexpressFmsConfirmation.unallowBillSuccess'));
							this.getList();
						}
					});
				})
				.catch(() => {});
    },
    // 恢复入账
    allowBillFn(item) {
      this.$confirm(this.$t('uexpressFmsConfirmation.allowBillInfo'), this.$t("common.mention"), {
				confirmButtonText: this.$t("common.confirm"),
				cancelButtonText: this.$t("common.cancel"),
				type: "warning"
			})
				.then(() => {
					receiveAllowBillApi([item.confirmationId]).then(res => {
						if (res.ok) {
							this.$message.success(this.$t('uexpressFmsConfirmation.allowBillSuccess'));
							this.getList();
						}
					});
				})
				.catch(() => {});
    },
    downloadTemplateFn() {
      // 6 运营 --- 7 产品
      let type = this.role === 'PRODUCT' ? 7 : 6
      getTemplateFileApi(type).then(res => {
        if (res.ok && res.content && res.content.url) {
          window.location.href = res.content.url
        }
      })
    },
    batchImportFn() {
      this.importForm.adjustChargeExcel = []
      this.batchImportVisible = true
    },
    batchImportConfirmFn() {
      this.$refs.batchImportRef.validate(valid => {
        if (valid) {
          let data = {
            ...this.importForm
          }
          data.adjustChargeExcel = data.adjustChargeExcel[0]
          this.batchImportLoading = true
          importBatchAdjustChargeApi(data).then(res => {
            if (res.ok) {
              this.batchImportVisible = false
              this.$message.success(this.$t('uexpressFmsConfirmation.import_oper_success'))
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
.right-main-wrapper {
	overflow: auto;
	padding: 0px 20px 0 20px;
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

::v-deep .join-bill-form .el-form-item{
  margin-bottom: 0;
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
</style>
