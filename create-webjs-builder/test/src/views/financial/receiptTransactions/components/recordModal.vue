<template>
	<el-dialog :visible.sync="addVisible" :close-on-click-modal="false" width="600px" title="登记收款">
		<el-form ref="addDataForm" :model="addData" :rules="addDataRule" label-width="120px" size="mini">
			<el-form-item :label="$t('fmsReceiptTransactions.settlement_office')" prop="settlementOfficeId">
				<el-select v-model="addData.settlementOfficeId" style="width: 100%" size="mini" @change="getYHTReceiptAccount">
					<el-option v-for="item in YHTList" :key="item.value" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('fmsReceiptTransactions.pay_type')" prop="payType">
				<el-row>
					<el-col :span="8">
						<el-select v-model="addData.payType" size="mini" style="width: 100%">
							<el-option v-for="item in payTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</el-col>
					<el-col :span="8">
						<el-select v-model="addData.thirdPartyCode" size="mini" style="width: 100%" v-if="addData.payType === 4">
							<el-option v-for="item in thirdPartyCodeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</el-col>
					<el-col :span="8" style="padding-left: 10px;">
						<el-checkbox v-model="addData.payingAgentFlag">{{$t('fmsReceiptTransactions.paying_agent')}}</el-checkbox>
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item :label="$t('fmsReceiptTransactions.payer_company')" prop="payerName">
				<el-input v-model="addData.payerName" type="text" size="mini" clearable @keyup.enter.native="getList" />
			</el-form-item>
			<el-form-item :label="$t('fmsReceiptTransactions.member_account_no')" prop="memberAccountNo">
				<el-input v-model="addData.memberAccountNo" type="text" size="mini" clearable @keyup.enter.native="getList" />
			</el-form-item>
			<el-form-item :label="$t('fmsReceiptTransactions.member_account_name')" prop="memberAccountName">
				<el-input v-model="addData.memberAccountName" type="text" size="mini" clearable @keyup.enter.native="getList" />
			</el-form-item>
			<el-form-item :label="$t('fmsReceiptTransactions.op_transactions_account')" prop="opTransactionsAccountKey">
				<el-select v-model="addData.opTransactionsAccountKey" style="width: 100%" @change="accountKeyChange">
					<el-option-group v-for="group in YHTAccountList" :key="group.category" :label="group.category">
						<el-option v-for="item in group.bankAccounts" :key="item.key" :label="item.bankAccount + '(' + item.rechargeCurrency +')'" :value="item.key"></el-option>
					</el-option-group>
				</el-select>
			</el-form-item>
			<el-form-item :label="$t('fmsReceiptTransactions.transactions_amount')" prop="transactionsAmount">
				<el-row>
					<el-col :span="8">
						<el-select v-model="addData.transactionsCurrency" size="mini" style="width: 100%" disabled>
							<el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code"></el-option>
						</el-select>
					</el-col>
					<el-col :span="16">
						<el-input v-model="addData.transactionsAmount" type="text" size="mini" clearable oninput="value=value.replace(/[^\d.-]/g,'')" />
					</el-col>
				</el-row>
			</el-form-item>
			<el-form-item :label="$t('fmsReceiptTransactions.transactions_date')" prop="transactionsDate">
				<common-picker pikcerType="date" v-model="addData.transactionsDate" clearable></common-picker>
			</el-form-item>
			<el-form-item :label="$t('fmsReceiptTransactions.transactions_remark')" prop="remark">
				<el-input v-model="addData.remark" type="textarea" size="mini" clearable />
			</el-form-item>
			<el-form-item :label="$t('fmsReceiptTransactions.certificate_files')" prop="certificateFiles">
				<upload-file v-model="addData.certificateFiles" multiple></upload-file>
			</el-form-item>
		</el-form>
		<div slot="footer" class="option-btn-wrap">
			<el-button size="mini" @click="addVisible = false">{{ $t("common.cancel")}}</el-button>
			<el-button size="mini" type="primary" @click="recordFn" :addLoading="addLoading">{{ $t("common.confirm") }}</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getRelativeTransactionReceiptListApi } from "@/api/financial/fmsReceiptTransactions";
import { getDictDataApi } from "@/api/financial/fmsReceive";
import { getTransactionsReceiptListToclaimApi, getYHTReceiptAccountApi, getThirdPartyPaymentApi, transactionReceiptRecordApi, transactionReceiptCancelApi, getTransactionReceiptDetailApi, transactionReceiptClaimApi } from "@/api/financial/fmsReceiptTransactions";

// 申请核销
export default {
	name: "ClearReasonModal",
	props: {
		YHTList: {
			type: Array,
			default: function () {
				return [];
			}
		},
		payTypeList: {
			type: Array,
			default: function () {
				return [];
			}
		},
		currencyList: {
			type: Array,
			default: function () {
				return [];
			}
		}
	},
	data() {
		return {
			thirdPartyCodeList: [],
			YHTAccountList: [],
			addLoading: false,
			// 登记收款
			addVisible: false,
			addData: {},
			addDataRule: {
				settlementOfficeId: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				payType: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				thirdPartyCode: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				payerName: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				opTransactionsAccountKey: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				transactionsAmount: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				transactionsDate: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }]
			}
		};
	},
	watch: {
		settlementOfficeId: {
			handler(val) {
				if (val) {
					this.getList();
				}
			},
			deep: true,
			immediate: true
		},
		settlementCompanyId: {
			handler(val) {
				if (val) {
					this.getList();
				}
			},
			deep: true,
			immediate: true
		}
	},
	created() {
		this.init();
	},
	methods: {
		init() {
			this.addData = {
				payType: "", // 资金来源
				payingAgentFlag: false, // 是否个人代码
				payerName: "", // 代付人名称
				thirdPartyCode: "", // 三方平台代码
				settlementCompanyId: "", // 结算单位id
				memberAccountNo: "", // 付款账号
				memberAccountName: "", // 付款银行
				settlementOfficeId: "", // 结算分公司id
				opTransactionsAccountKey: "", // 收款账号Key
				transactionsAmount: "", // 收款金额
				transactionsCurrency: "", // 收款币种
				transactionsDate: "", // 收款日期
				remark: "", // 收款备注
				certificateFiles: [] // 收款凭证
			};
		},
		show() {
			this.init();
			this.addVisible = true;
		},
		// 登记收款
		recordFn() {
			this.$refs.addDataForm.validate(valid => {
				if (valid) {
					let data = {
						...this.addData
					};
					this.addLoading = true;
					transactionReceiptRecordApi(data)
						.then(res => {
							if (res.ok) {
								this.addVisible = false;
								this.$message.success(this.$t('fmsReceiptTransactions.record_success'));
								this.$emit("success");
							}
							this.addLoading = false;
						})
						.catch(() => {
							this.addLoading = false;
						});
				}
			});
		},
		// 当选择收款账户信息 确定收款币种
		accountKeyChange(key) {
			this.YHTAccountList.forEach(group => {
				group.bankAccounts.forEach(v => {
					if (v.key === key) {
						this.addData.transactionsCurrency = v.rechargeCurrency;
					}
				});
			});
		},
		// 当选择分公司之后 获取对应的账户信息和第三方信息
		getYHTReceiptAccount() {
			if (this.addData.settlementOfficeId) {
				getYHTReceiptAccountApi(this.addData.settlementOfficeId).then(res => {
					if (res.ok) {
						res.content.forEach(v => {
							if (v.bankAccounts && v.bankAccounts.length === 0) {
								let thirdPartyAccounts = [];
								v.thirdPartyAccounts.forEach(v => {
									thirdPartyAccounts.push({
										bankAccount: v.account,
										rechargeCurrency: v.currency,
										key: v.key
									});
								});
								v.bankAccounts = thirdPartyAccounts;
							}
						});
						this.YHTAccountList = res.content;
					}
				});
				getThirdPartyPaymentApi(this.addData.settlementOfficeId).then(res => {
					if (res.ok) {
						res.content.forEach(v => {
							v.name = v.fullName;
						});
						this.thirdPartyCodeList = res.content;
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	::v-deep .el-table--border th {
		background: #f5f7fa;
	}
}
.des {
	line-height: 35px;

	.title {
		font-weight: 600;
		font-size: 15px;
	}
}
</style>
