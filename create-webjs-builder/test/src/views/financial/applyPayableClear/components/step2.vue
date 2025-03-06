<template>
	<div class="section second-step">
		<div class="title">
      <i class="m-icon el-icon-warning-outline" />
      <!--对冲核销-->
      {{$t('fmsReceiveClear.offsetClear')}}
    </div>
		<div class="remain-container-item">
      <!--剩余应收-->
			<span class="remain-name">{{$t('fmsReceiveClear.remainReceipt')}}</span>
			<span v-if="arRemainAmounts.length > 0">
				<label v-for="(item, index) in arRemainAmounts" :key="index">
					{{item.currency}}
					{{item.value | numberToThousands}}
				</label>
			</span>
			<label v-if="arRemainAmounts.length === 0">0.00</label>
		</div>
		<div class="remain-container-item">
      <!--剩余应付-->
			<span class="remain-name">{{$t('fmsReceiveClear.remainPayable')}}</span>
			<span v-if="apRemainAmounts.length > 0">
				<label v-for="(item, index) in apRemainAmounts" :key="index">
					{{item.currency}}
					{{item.value | numberToThousands}}
				</label>
			</span>
			<label v-if="apRemainAmounts.length === 0">0.00</label>
		</div>
		<el-form ref="formModelRef" :model="formModel" size="mini" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item :label="$t('fmsReceiveClear.targetCurrency')" prop="currency">
				<el-select v-model="formModel.currency" size="mini" @change="diffOffsetCurrencyChange">
					<el-option v-for="(item, index) in currenciesList" :key="index" :label="item.name" :value="item.code" />
				</el-select>
			</el-form-item>
		</el-form>

		<div class="text-container">
			<div class="amount-container">
				<el-row v-for="(item, index) in arRemainAmounts" :key="index + 'AR'" class="amount-row">
					<el-col :span="4">
						<div>
              <!--应收-->
							<span v-if="index === 0">{{$t('fmsReceiveClear.AR')}}</span>
							<span v-else>&nbsp;&nbsp;</span>
						</div>
					</el-col>
					<el-col :span="16" class="currency-value">
						<span class="currency">{{item.currency}}</span>
						<span class="value">{{item.value | numberToThousands}}</span>
						<span class="symbol">x</span>
						<span class="input">
							<edit-input v-model="item.exchangeRate" @calc="calcAmount(item)" :canEdit="item.currency != formModel.currency" />
						</span>
					</el-col>
					<el-col :span="4" class="calc-total">
						<div>
							<span class="symbol">=</span>
							<span class="total-transfer">{{item.calcTransferTotal | numberToThousands}}</span>
						</div>
					</el-col>
				</el-row>
			</div>

			<div class="amount-container">
				<el-row v-for="(item, index) in apRemainAmounts" :key="index + 'AP'" class="amount-row">
					<el-col :span="4">
						<div>
              <!--应付-->
							<span v-if="index === 0">{{$t('fmsReceiveClear.AP')}}</span>
							<span v-else>&nbsp;&nbsp;</span>
						</div>
					</el-col>
					<el-col :span="16" class="currency-value">
						<span class="currency">{{item.currency}}</span>
						<span class="value">{{item.value | numberToThousands}}</span>
						<span class="symbol">x</span>
						<span class="input">
							<edit-input v-model="item.exchangeRate" @calc="calcAmount(item)" :canEdit="item.currency != formModel.currency" />
						</span>
					</el-col>
					<el-col :span="4" class="calc-total">
						<div>
							<span class="symbol">=</span>
							<span class="total-transfer">{{item.calcTransferTotal | numberToThousands}}</span>
						</div>
					</el-col>
				</el-row>
			</div>

			<el-row class="remain-row">
				<el-col :span="6">
          <!--剩余应收-->
					<div>{{$t('fmsReceiveClear.remainReceipt')}}</div>
				</el-col>
				<el-col :span="14" class="total-currency">
					<div>
						<span v-if="formModel.currency">{{formModel.currency}}</span>
						<span v-if="!formModel.currency"> &nbsp;&nbsp;</span>
					</div>
				</el-col>
				<el-col :span="4" class="calc-total">
					<div>
						<span class="symbol"></span>
						<span class="total-transfer">{{calcRemainOffsetAmountsTotal | numberToThousands}}</span>
					</div>
				</el-col>
			</el-row>

			<div>
				<el-radio-group v-model="instructionTransactionType" :disabled="instructionTransactionTypeDisabled">
					<!--关联收款-->
          <el-radio :label="1">{{$t('fmsReceiveClear.TRANSACTIONS')}}</el-radio>
          <!--无收款-->
          <el-radio :label="6">{{$t('fmsReceiveClear.TRANSACTIONS_NO')}}</el-radio>
				</el-radio-group>
			</div>
		</div>
	</div>
</template>

<script>
import EditInput from "./editInput";
import { getCurrenciesListApi } from "@/api/common";

export default {
	name: "Step2",
	components: {
		EditInput
	},
	props: {
		offsetAmounts: {
			type: Object,
			default: function () {
				return {
					// 对冲之后的剩余 应收和应付
					apRemainAmounts: [],
					arRemainAmounts: [],
					sameOffsetAmounts: [],
					calcArOffsetAmountsTotal: 0, // 异币种对冲应收金额
					calcApOffsetAmountsTotal: 0, // 异币种对冲应付金额
					calcRemainOffsetAmountsTotal: 0 // 异币种对冲剩余金额
				};
			}
		}
	},
	watch: {
		offsetAmounts: {
			handler(val) {
				// init
				this.apRemainAmounts = [];
				this.arRemainAmounts = [];
				this.sameOffsetAmounts = [];
				this.instructionTransactionType = 1;
				this.instructionTransactionTypeDisabled = false;
				this.formModel.currency = "";

				let obj = this.$extends(true, {}, val);
				obj.apRemainAmounts.forEach(item => {
					item.exchangeRate = "";
					item.calcTransferTotal = "";
				});
				obj.arRemainAmounts.forEach(item => {
					item.exchangeRate = "";
					item.calcTransferTotal = "";
				});
				this.$nextTick(() => {
					this.apRemainAmounts = obj.apRemainAmounts;
					this.arRemainAmounts = obj.arRemainAmounts;
					this.sameOffsetAmounts = obj.sameOffsetAmounts;
				});
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		return {
			formModel: {
				currency: ""
			},
			formRules: {
				currency: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "change" }]
			},
			currenciesList: [],
			calcRemainOffsetAmountsTotal: 0,
			// 对比之后的值
			apRemainAmounts: [],
			arRemainAmounts: [],
			calcApOffsetAmountsTotal: "",
			calcArOffsetAmountsTotal: "",
			sameOffsetAmounts: [],
			instructionTransactionType: 1,
			instructionTransactionTypeDisabled: false
		};
	},
	created() {
		this.getBaseDataFn();
	},
	methods: {
		getBaseDataFn() {
			Promise.all([getCurrenciesListApi()]).then(results => {
				const currenciesRes = results[0];
				if (currenciesRes.ok) {
					this.currenciesList = currenciesRes.content || [];
				}
			});
		},
		// 选中的目标币种变更
		diffOffsetCurrencyChange() {
			let arTotal = 0;
			let apTotal = 0;
			this.arRemainAmounts.forEach((v, index) => {
				if (v.currency === this.formModel.currency) {
					v.exchangeRate = 1;
					v.calcTransferTotal = v.value;
				}
				arTotal += Number(v.calcTransferTotal || 0).toFixed(2);
			});
			this.apRemainAmounts.forEach((v, index) => {
				if (v.currency === this.formModel.currency) {
					v.exchangeRate = 1;
					v.calcTransferTotal = v.value;
				}
				apTotal += Number(v.calcTransferTotal || 0).toFixed(2);
			});
			this.calcApOffsetAmountsTotal = apTotal;
			this.calcArOffsetAmountsTotal = arTotal;
			this.calcRemainOffsetAmountsTotal = (arTotal - apTotal).toFixed(2);
		},
		// 变更汇率之后进行计算
		calcAmount(item) {
			item.calcTransferTotal = (Number(item.value || 0) * Number(item.exchangeRate || 0)).toFixed(2);

			// 计算剩余的汇总
			let arTotal = 0;
			let apTotal = 0;
			this.arRemainAmounts.forEach(v => {
				arTotal += Number(v.calcTransferTotal || 0).toFixed(2);
			});
			this.apRemainAmounts.forEach(v => {
				apTotal += Number(v.calcTransferTotal || 0).toFixed(2);
			});
			this.calcApOffsetAmountsTotal = apTotal;
			this.calcArOffsetAmountsTotal = arTotal;
			this.calcRemainOffsetAmountsTotal = (arTotal - apTotal).toFixed(2);

			if (Number(this.calcRemainOffsetAmountsTotal) === 0) {
				this.instructionTransactionType = 5;
				this.instructionTransactionTypeDisabled = true;
			} else {
				this.instructionTransactionTypeDisabled = false;
			}
		},
		validate() {
			let valid = true;
			this.$refs.formModelRef.validate(v => {
				valid = v;
			});
			if (!valid) {
				return false;
			}
			let VALID_FLAG_ZERO = true;
			if (this.arRemainAmounts.length > 0) {
				this.arRemainAmounts.forEach(v => {
					if (!v.exchangeRate) {
						valid = false;
					}
					if (v.exchangeRate === 0) {
						VALID_FLAG_ZERO = false;
					}
				});
			}
			if (this.apRemainAmounts.length > 0) {
				this.apRemainAmounts.forEach(v => {
					if (!v.exchangeRate) {
						valid = false;
					}
					if (v.exchangeRate === 0) {
						VALID_FLAG_ZERO = false;
					}
				});
			}
			if (!valid) {
        // 请先填写完整汇率
				this.$message.error(this.$t('fmsReceiveClear.exchangeRateCheck'));
				return false;
			}
			if (!VALID_FLAG_ZERO) {
        // 输入的汇率不能为0
				this.$message.error(this.$t('fmsReceiveClear.exchangeRateCheck1'));
				return;
			}
			if (Number(this.calcRemainOffsetAmountsTotal) < 0) {
				// 应付大于应收校验不通过
        // 目前不支持应付大于应收，请重新选择费用！
				this.$message.error(this.$t('fmsReceiveClear.arapCheck'));
				return false;
			}
			return valid;
		},
		getValue() {
			let instructionTransactionType = null;
			if (Number(this.calcRemainOffsetAmountsTotal) > 0 && this.instructionTransactionType === 5) {
				// 余额平账
				// 且是选择了无收款
				instructionTransactionType = 6;
			} else if (Number(this.calcRemainOffsetAmountsTotal) === 0) {
				// 完全平账
				instructionTransactionType = 5;
			} else {
				instructionTransactionType = this.instructionTransactionType;
			}

			return {
				instructionTransactionType: instructionTransactionType,
				remainOffsetReceiptAmounts: [
					{
						currency: this.formModel.currency,
						value: this.calcRemainOffsetAmountsTotal
					}
				],
				apRemainAmounts: this.apRemainAmounts,
				arRemainAmounts: this.arRemainAmounts,
				sameOffsetAmounts: this.sameOffsetAmounts,
				diffOffsetCurrency: this.formModel.currency,
				calcArOffsetAmountsTotal: this.calcArOffsetAmountsTotal,
				calcApOffsetAmountsTotal: this.calcApOffsetAmountsTotal,
				calcRemainOffsetAmountsTotal: this.calcRemainOffsetAmountsTotal
			};
		}
	}
};
</script>

<style lang="scss" scoped>
@import "../../styles/clear.scss";

.second-step {
	background: #fff;
	padding: 25px;
	font-size: 15px;

	.remain-container-item {
		margin: 15px 0;

		.remain-name {
			width: 100px;
			text-align: right;
			display: inline-block;
			padding: 0 12px 0 0;
			font-size: 13px;
		}
	}
}

.text-container {
	padding: 0 30px;
	font-weight: 600;
	font-size: 15px;
	border-top: 1px dashed #dedede;

	.amount-container {
		margin: 20px 0;

		.amount-row {
			margin: 10px 0;
		}
	}

	.remain-row {
		padding: 20px 0;
		border-top: 1px solid #dedede;
	}

	.currency-value {
		text-align: center;
		.value {
			margin-right: 40px;
			width: 120px;
			display: inline-block;
			text-align: right;
		}
		.symbol {
			margin-right: 40px;
		}
		.input {
			width: 140px;
			display: inline-block;
			text-align: left;
		}
	}
	.calc-total {
		text-align: right;

		.symbol {
			float: left;
		}
	}
	.total-currency {
		text-align: right;
		padding-right: 20px;
	}
}

.m-icon {
	font-size: 26px;
	color: #1890ff;
	margin-right: 10px;
	float: left;
	margin-top: 10px;
}
</style>
