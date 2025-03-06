<template>
	<div>
    <!-- 查找收款 -->
		<el-dialog :visible.sync="visible" :close-on-click-modal="false" width="1080px" :title="$t('fmsPayablePayment.searchPayment')">
			<div class="container">
				<el-form ref="formDataFormRef" :inline="true" :model="formData" label-width="65px" size="mini">
					<el-form-item :label="$t('fmsPayablePayment.transactionsNo')" prop="transactionsNo">
						<el-input v-model="formData.transactionsNo" clearable />
					</el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.businessType')" prop="businessType">
						<base-select v-model="formData.businessType" type="businessType" addALL />
					</el-form-item>
					<el-form-item :label="$t('fmsPayablePayment.paymentDueDate')" prop="paymentDueDatePeriod">
						<search-date-picker v-model="formData.paymentDueDatePeriod" clearable></search-date-picker>
					</el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.recordByName')" prop="recordById">
						<type-select v-model="formData.recordById" type="user" />
					</el-form-item>
          <el-form-item :label="$t('fmsPayablePayment.submitByName')" prop="submitById">
						<type-select v-model="formData.submitById" type="user" />
					</el-form-item>
					<el-form-item :label="$t('fmsPayablePayment.submitDate')" prop="submitDatePeriod">
						<search-date-picker v-model="formData.submitDatePeriod" clearable></search-date-picker>
					</el-form-item>

					<el-button type="primary" size="mini" @click="getList()">{{$t('common.searchBtn')}}</el-button>
					<el-button type="primary" size="mini" @click="resetFn()">{{$t('common.resetBtn')}}</el-button>
				</el-form>

				<el-table :data="tableDataClaim" style="width: 100%" height="400" size="mini" border @selection-change="handleSelectionChangeClaim">
          <el-table-column type="selection" width="55" fixed="left"></el-table-column>
          <el-table-column prop="transactionsNo" :label="$t('fmsPayablePayment.transactionsNo')" min-width="120"></el-table-column>
          <el-table-column prop="businessTypeNames" :label="$t('fmsPayablePayment.businessType')" min-width="100"></el-table-column>
          <el-table-column prop="settlementCompanyName" :label="$t('fmsPayablePayment.settlementCompanyIdName')" min-width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="transactionsAmount" :label="$t('fmsPayablePayment.paymentCurrencyAmount')" min-width="180">
            <template slot-scope="{row}">
              <span>{{row.transactionsCurrency}}{{row.transactionsAmount | numberToThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remainAmount" :label="$t('fmsPayablePayment.unTransactionsAmount')" min-width="110" >
            <template slot-scope="{row}">
              <span>{{row.remainAmount | numberToThousands}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="settlementOfficeName" :label="$t('fmsPayablePayment.settlementOffice')" min-width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="submitByName" :label="$t('fmsPayablePayment.submitByName')" min-width="120" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="submitDate" :label="$t('fmsPayablePayment.submitDate')" min-width="150">
            <template slot-scope="{row}">
              <span>{{row.submitDate | parseTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="recordByName" :label="$t('fmsPayablePayment.recordByName')" min-width="130"></el-table-column>
          <el-table-column prop="paymentDueDate" :label="$t('fmsPayablePayment.paymentDueDate')" min-width="150">
            <template slot-scope="{row}">
              <span>{{row.paymentDueDate | parseTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('fmsPayablePayment.paymentRemark')" min-width="180"></el-table-column>
        </el-table>
			</div>

			<div slot="footer" class="option-btn-wrap">
				<el-button size="mini" @click="visible = false">{{ $t("customerManage.cancel")}}</el-button>
				<el-button size="mini" type="primary" @click="confirmFn">{{ $t("customerManage.confirm") }}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { getRelativePaymentListApi } from "@/api/financial/fmsPayableClear";

// 申请核销
export default {
	name: "TransactionsReceiptModal",
	components: { },
	props: {
		detail: {
			type: Object,
			default: function () {
				return {};
			}
		},
		targetCurrency: {
			type: String,
			default: ""
		},
		sourceClearAmounts: {
			type: Array,
			default: function () {
				return [];
			}
		}
	},
	data() {
		return {
			visible: false,
			tableDataClaim: [],
			transactionsList: [], // 已经认领的列表
			formData: {
				transactionsNo: "",
				businessType: "",
				recordById: "",
				submitById: "",
				paymentDueDatePeriod: [],
				submitDatePeriod: []
			}
    };
	},
	created() {

	},
	methods: {
		show() {
			this.visible = true;
			this.getList();
		},
		getList() {
			if (this.detail.settlementOfficeId && this.detail.settlementCompanyId) {
				let data = {
					...this.formData,
					settlementOfficeId: this.detail.settlementOfficeId,
					settlementCompanyId: this.detail.settlementCompanyId
					// businessType: this.businessType
				};
				if (data.paymentDueDatePeriod.length) {
					data.paymentDueDateStart = this.formData.paymentDueDatePeriod[0];
					data.paymentDueDateEnd = this.formData.paymentDueDatePeriod[1];
				}
				if (data.submitDatePeriod.length) {
					data.submitDateStart = this.formData.submitDatePeriod[0];
					data.submitDateEnd = this.formData.submitDatePeriod[1];
				}

				getRelativePaymentListApi(data).then(res => {
					if (res.ok) {
						res.content.forEach(v => {
							v.useAmount = "";
						});
						this.tableDataClaim = res.content;
						this.transactionsList = [];
					}
				});
			}
		},
		handleSelectionChangeClaim(val) {
			this.transactionsList = val;
		},
		resetFn() {
			this.formData.payerMemberId = ''
			this.$refs.formDataFormRef.resetFields();
			this.getList();
		},
		// 确认列表选中的认领
		confirmFn() {
			if (this.transactionsList.length === 0) {
				this.$message.error(this.$t("receiveFms.please_select_one_data"));
				return;
			}
			let VALID = true;
			let currency = [];
			this.transactionsList.forEach(v => {
				if (currency.indexOf(v.transactionsCurrency) < 0) {
					currency.push(v.transactionsCurrency);
				}
				if (this.targetCurrency && this.targetCurrency !== v.transactionsCurrency) {
					VALID = false;
				}
			});
      // 当应付核销统计币种 === 1的时候 开启选中的付款币种统一校验
			if (this.sourceClearAmounts.length === 1 && currency.length > 1) {
        // 无法同时关联多币种收款
				this.$message.error(this.$t('fmsReceiveClear.transactionsClearCheck'));
				return;
			}
			if (this.sourceClearAmounts.length === 1 && !VALID) {
        // "关联币种与目标币种（" + this.targetCurrency + "）不一致!"
				this.$message.error(this.$t('fmsReceiveClear.transactionsCurrencyCheck', { targetCurrency: this.targetCurrency }));
				return;
			}
			this.visible = false;
      this.$emit("confirm", this.transactionsList);
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../../styles/clear.scss";
.container {
	::v-deep .el-table--border th {
		background: #f5f7fa;
	}
}

.list-container {
	margin-bottom: 20px;
	.title {
		font-size: 15px;
		font-weight: 600;
	}

	.select-has-list {
		margin-left: 20px;

		.select-has-item {
			overflow: hidden;
			margin-bottom: 15px;
			line-height: 40px;

			.content-item {
				float: left;
				width: 33%;

				label {
					margin-right: 10px;
				}
			}
		}
	}
}
</style>
