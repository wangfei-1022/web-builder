<template>
	<div class="" v-if="remainOffsetReceiptAmounts.length">
		<div class="section origin-container" v-if="false">
			<div class="title">
				<div class="title-item">
					<span class="title-item-des">
						<svg-icon className="clear-module-icon" iconClass="icon-querenshoukuan" />
            <!--关联收款-->
            {{$t('fmsReceiveClear.relativeTransactions')}}
					</span>
				</div>
			</div>
		</div>

		<div class="section origin-container">
			<div class="title">
				<div class="title-item">
					<span class="title-item-des">
						<svg-icon className="clear-module-icon" iconClass="icon-yue1" />
            <!--剩余未销应收-->
            {{$t('fmsReceiveClear.remainClearReceipt')}}
					</span>
					<div class="currency-value-des">
						<span v-for="(item, index) in remainOffsetReceiptAmounts" :key="index">
							<span class="currency-value-item">{{item.currency}} {{item.value | numberToThousands}}</span>
						</span>
					</div>
				</div>
			</div>
		</div>

		<div class="section containerrelative-container">
			<relative-transaction
        @selectFn="selectReceiptFn"
        :detail="{
          settlementOfficeId: detail.settlementOfficeId,
          settlementOfficeName: detail.settlementOfficeName,
          settlementCompanyId: detail.settlementCompanyId,
          settlementCompanyName: detail.settlementCompanyName,
          businessTypes: detail.businessTypes
        }"
        :targetCurrency="diffOffsetCurrency"
        :sourceClearAmounts="remainOffsetReceiptAmounts"
        :show-select-type="false"
      />
		</div>

		<div class="section">
			<div class="title">
				<div class="title-item">
					<span class="title-item-des">
						<svg-icon className="clear-module-icon" iconClass="icon-hexiaoxiangqing" />
            <!--核销情况-->
            {{$t('fmsReceiveClear.clearInfo')}}
					</span>
				</div>
			</div>
			<div class="section-content same-curreny-result-container">
				<el-row class="amount-row">
					<el-col :span="6">
            <!--本次核销金额-->
            {{$t('fmsReceiveClear.currentClearAmount')}}
          </el-col>
					<el-col :span="18">
						<div class="currency-value">
							<span class="currency">{{diffOffsetCurrency}}</span>
							<span class="value">{{remainOffsetReceiptAmounts[0].value | numberToThousands}}</span>
						</div>
					</el-col>
				</el-row>
				<el-row class="amount-row">
					<el-col :span="6">
            <!--本次收款核销金额-->
            {{$t('fmsReceiveClear.currentTransactionsClearAmount')}}
          </el-col>
					<el-col :span="18">
						<div class="currency-value">
							<span class="currency">{{diffOffsetCurrency}}</span>
							<span class="value">{{receiptTransactionsTotal | numberToThousands}}</span>
						</div>
					</el-col>
				</el-row>
				<el-row class="amount-row remain-calc-row">
					<el-col :span="6">
            <!--差额-->
            {{$t('fmsReceiveClear.diffAmount')}}
          </el-col>
					<el-col :span="18">
						<div class="currency-value">
							<span class="currency">{{diffOffsetCurrency}}</span>
							<span class="value">{{diffCalcTotal | numberToThousands}}</span>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
import RelativeTransaction from "./relativeTransaction";

export default {
	name: "Step3",
	components: {
		RelativeTransaction
	},
	props: {
		detail: {
			type: Object,
			default: function () {
				return {};
			}
		},
		remainOffsetReceiptAmounts: {
			type: Array,
			default: function () {
				return [];
			}
		}
	},
	watch: {
		remainOffsetReceiptAmounts: {
			handler(val) {
				if (val.length > 0) {
					this.diffOffsetCurrency = val[0].currency;
				}
			},
			immediate: true,
			deep: true
		}
	},
	data() {
		return {
			receiptAmounts: [],
			receiptTransactionsTotal: 0,

			diffCalcTotal: 0, // 差额
			claimList: [],
			diffOffsetCurrency: "" // 目标币种
		};
	},
	created() {},
	methods: {
		selectReceiptFn(val, receiptAmounts) {
			if (val.length > 0) {
				this.receiptTransactionsTotal = receiptAmounts[0].value;
				this.diffCalcTotal = (Number(this.remainOffsetReceiptAmounts[0].value) - Number(this.receiptTransactionsTotal)).toFixed(2);
				this.claimList = val;
				this.receiptAmounts = receiptAmounts;
			} else {
				this.receiptAmounts = [];
				this.claimList = [];
				this.receiptTransactionsTotal = 0;
				this.diffCalcTotal = 0;
			}
		},
		validate() {
			if (this.claimList.length === 0) {
        // 请先选择一个关联收款！
				this.$message.error(this.$t('fmsReceiveClear.pleaseSelectTransactions'));
				return false;
			}
			let VALID = true;
			let msg = "";
			this.claimList.forEach(v => {
				if (!v.useAmount) {
					VALID = false;
          // 收款的使用金额不能为空
					msg = this.$t('fmsReceiveClear.transactionsAmountCheck1');
				}
				if (v.useAmount > v.remainAmount) {
					VALID = false;
          // 使用金额不能大于未关联金额
					msg = this.$t('fmsReceiveClear.transactionsAmountCheck2');
				}
			});
			if (!VALID) {
				this.$message.error(msg);
				return false;
			}
			return true;
		},
		getValue() {
			return {
				claimList: this.claimList,
				diffCalcTotal: this.diffCalcTotal,
				receiptTransactionsTotal: this.receiptTransactionsTotal
			};
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../../styles/clear.scss";

.same-curreny-result-container {
	overflow: hidden;
	clear: both;
	font-size: 14px;
	font-weight: 600;
	padding: 0 20px;

	.amount-row {
		margin-bottom: 20px;

		.currency-value {
			text-align: right;
			.value {
				width: 120px;
				display: inline-block;
			}
		}
	}

	.remain-calc-row {
		padding-top: 20px;
		border-top: 1px dashed #dedede;
	}
}
</style>
