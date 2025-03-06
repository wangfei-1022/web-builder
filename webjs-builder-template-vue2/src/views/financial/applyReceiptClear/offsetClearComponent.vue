<template>
	<div class="page-edit-container full-page">
		<div class="page-edit-content">
			<div class="first-step" v-show="step === 1">
				<step1 ref="step1Ref" :config="config" />
			</div>

			<div class="second-step" v-show="step === 2">
				<step2 ref="step2Ref" :offsetAmounts="offsetAmounts" />
			</div>

			<div class="second-step" v-show="step === 3">
				<step3 ref="step3Ref" :remainOffsetReceiptAmounts="totalData.remainOffsetReceiptAmounts" :detail="totalData"
        />
			</div>

			<div class="second-step" v-show="step === 4">
				<step4 ref="step4Ref" :totalData="totalData" />
			</div>

		</div>

		<div class="page-edit-footer">
			<el-button type="primary" size="mini" plain @click="backList()">{{$t('common.cancel')}}</el-button>
			<el-button type="primary" size="mini" @click="previousFn()" v-if="step === 2 || step === 3 || step === 4">{{$t('common.previousStep')}}</el-button>
			<el-button type="primary" size="mini" @click="nextFn()" v-if="step != 4">{{$t('common.nextStep')}}</el-button>
			<el-button type="primary" size="mini" @click="submitFn()" v-if="step === 4" :loading="submitLoading">{{$t('common.submit')}}</el-button>
		</div>

		<clear-reason-modal ref="clearReasonModalRef" @ok="submitConfirmFn" />
	</div>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getBillClearingApi, getHedgeResultApi, fmsInstructionOffsetSubmitApi } from "@/api/financial/fmsReceiptClear";
import Step1 from "./components/step1";
import Step2 from "./components/step2";
import Step3 from "./components/step3";
import Step4 from "./components/step4";
import ClearReasonModal from "@/views/financial/components/ReceiptClearReasonModal";

// 申请核销
export default {
	name: "OffsetClearComponent",
	components: {
		Step1,
		Step2,
		Step3,
		Step4,
		ClearReasonModal
	},
	props: {
		config: {
			type: Object,
			default: function () {
				return {};
			}
		}
	},
	data() {
		return {
			submitLoading: false,
			step: 1,
			stepStack: [1], // 当返回指定
			// 对冲之后的剩余 应收和应付
			offsetAmounts: {
				apRemainAmounts: [],
				arRemainAmounts: [],
				sameOffsetAmounts: [],
				calcArOffsetAmountsTotal: 0, // 异币种对冲应收金额
				calcApOffsetAmountsTotal: 0, // 异币种对冲应付金额
				calcRemainOffsetAmountsTotal: 0 // 异币种对冲剩余金额
			},

			// 第四步汇总的数据
			totalData: {
				instructionTransactionType: "", // 1 款项 2 钱包 3 水单 4 待付
				settlementOfficeId: "",
        settlementOfficeName: "",
				settlementCompanyId: "",
        settlementCompanyName: "",
				businessTypes: [],
				remark: "",
				arClearingInfo: {
					settlementSource: "",
					charges: [],
					bills: [],
					invoices: [],
					unInstructionAmounts: []
				},
				apClearingInfo: {
					settlementSource: "",
					charges: [],
					bills: [],
					invoices: [],
					unInstructionAmounts: []
				},
				sameOffsetAmounts: [], // 同币种对冲金额
				arOffsetAmounts: [], // 异币种对冲应收金额
				apOffsetAmounts: [], // 异币种对冲应付金额
				diffOffsetCurrency: "", // 异币种对冲目标币种
				calcRemainAmountsTotal: "", // 目标币种剩余的应收
				claimList: [], // 收款列表

				// 前端使用
				remainOffsetReceiptAmounts: [], // 填写完汇率计算之后的应收值(对冲之后剩余的)
				// 前端使用
				calcArOffsetAmountsTotal: "", // 异币种目标币种应收合计
				calcApOffsetAmountsTotal: "", // 异币种目标币种应付合计
				calcRemainOffsetAmountsTotal: "", // 填写完汇率计算之后的应收值(异币种对冲之后剩余的)
				diffCalcTotal: "", // 收款之后的剩余值计算(差额)
				receiptTransactionsTotal: "" // 收款的使用总和
			}
		};
	},
	created() {
		this.ids = this.config.ids;
		this.origin = this.config.origin;
		this.back = this.config.backPath;
	},
	methods: {
		backList() {
			if (this.back) {
				this.$store.dispatch("tagsView/delView", this.$route);
				this.$router.push({ name: this.back });
			}
		},
		previousFn() {
			this.stepStack.pop();
			let step = this.stepStack[this.stepStack.length - 1];
			this.step = step;
		},
		nextFn() {
			if (this.step === 1) {
				this.getRemainFn();
			} else if (this.step === 2) {
				this.getRemainReceiptFn();
			} else if (this.step === 3) {
				this.getRelativeReceiptFn();
			}
		},
		// 获取到关联的可用收款
		getRelativeReceiptFn() {
			if (!this.$refs.step3Ref.validate()) {
				return;
			}
			let step3Res = this.$refs.step3Ref.getValue();
			this.totalData.claimList = step3Res.claimList;
			this.totalData.diffCalcTotal = step3Res.diffCalcTotal;
			this.totalData.receiptTransactionsTotal = step3Res.receiptTransactionsTotal;
			this.step = 4;
			this.stepStack.push(4);
		},
		// 获取计算后的应收的额
		getRemainReceiptFn() {
			if (!this.$refs.step2Ref.validate()) {
				return;
			}
			let step2Res = this.$refs.step2Ref.getValue();
			this.totalData.remainOffsetReceiptAmounts = step2Res.remainOffsetReceiptAmounts;
			this.totalData.calcArOffsetAmountsTotal = step2Res.calcArOffsetAmountsTotal; // 异币种目标币种应收合计
			this.totalData.calcApOffsetAmountsTotal = step2Res.calcApOffsetAmountsTotal; // 异币种目标币种应付合计
			this.totalData.calcRemainOffsetAmountsTotal = step2Res.calcRemainOffsetAmountsTotal; // 填写完汇率计算之后的应收值(异币种对冲之后剩余的)

			this.totalData.sameOffsetAmounts = step2Res.sameOffsetAmounts;
			this.totalData.arOffsetAmounts = step2Res.arRemainAmounts;
			this.totalData.apOffsetAmounts = step2Res.apRemainAmounts;
			this.totalData.diffOffsetCurrency = step2Res.diffOffsetCurrency;
			this.totalData.calcRemainAmountsTotal = step2Res.calcRemainAmountsTotal;
			this.totalData.instructionTransactionType = step2Res.instructionTransactionType;
			// 无收款 或者是完全平账
			if (step2Res.instructionTransactionType === 5 || step2Res.instructionTransactionType === 6) {
				// 关联收款
				this.step = 4;
				this.stepStack.push(4);
			} else {
				// 关联收款
				this.step = 3;
				this.stepStack.push(3);
			}
		},
		// 获得对冲之后的值
		async getRemainFn() {
			if (!this.$refs.step1Ref.validate()) {
				return;
			}
			let step1Res = await this.$refs.step1Ref.getValue();
			this.totalData.settlementOfficeId = step1Res.settlementOfficeId;
			this.totalData.settlementOfficeName = step1Res.settlementOfficeName;
			this.totalData.settlementCompanyId = step1Res.settlementCompanyId;
			this.totalData.settlementCompanyName = step1Res.settlementCompanyName;
			this.totalData.businessTypes = step1Res.businessTypes;
			this.totalData.arClearingInfo = step1Res.arClearingInfo;
			this.totalData.apClearingInfo = step1Res.apClearingInfo;
			// 再做对比
			let fn = this.config.getHedgeResultApi;
			fn(step1Res).then(res => {
				if (res.ok) {
					if (res.content.arRemainAmounts.length === 0 && res.content.apRemainAmounts.length === 0) {
						this.totalData.arOffsetAmounts = [];
						this.totalData.apOffsetAmounts = [];
						this.totalData.instructionTransactionType = 5; // 完全平账
						this.totalData.sameOffsetAmounts = res.content.sameOffsetAmounts;
						this.step = 4;
						this.stepStack.push(4);
					} else {
						this.step = 2;
						this.stepStack.push(2);
						this.offsetAmounts = {
							...this.offsetAmounts,
							...res.content
						};
					}
				}
			});
		},
		// 提交
		submitFn() {
			if (this.totalData.instructionTransactionType === 5) {
				// 完全平账
				this.submitConfirmFn();
			} else if (this.totalData.instructionTransactionType === 6) {
				// 余额平账
				this.$refs.clearReasonModalRef.show(true);
			} else if (this.totalData.instructionTransactionType === 1) {
				// 关联收款
				if (Number(this.totalData.diffCalcTotal) !== 0) {
					let flag = this.totalData.diffCalcTotal > 0;
					this.$refs.clearReasonModalRef.show(flag);
				} else {
					this.submitConfirmFn();
				}
			}
		},
		// 提交
		submitConfirmFn(reason) {
			let data = {
				instructionTransactionType: 1, // 1 款项 2 钱包 3 水单 4 待付
				...this.totalData,
				arClearingInfo: {
					settlementSource: "",
					charges: [],
					bills: [],
					invoices: [],
					unInstructionAmounts: [],
					...this.totalData.arClearingInfo
				},
				apClearingInfo: {
					settlementSource: "",
					charges: [],
					bills: [],
					invoices: [],
					unInstructionAmounts: [],
					...this.totalData.apClearingInfo
				},
				claimList: []
			};

			// 如果是弹窗选原因
			if (reason) {
				data.clearDiffRemark = reason.remark;
				if (this.totalData.diffCalcTotal > 0) {
					data.clearUnderReason = reason.reason;
				} else {
					data.clearOverReason = reason.reason;
				}
			}

			let step4Res = this.$refs.step4Ref.getValue();
			data.remark = step4Res.remark;

			// 应收
			if (this.totalData.arClearingInfo.bills.length > 0) {
				data.arClearingInfo.bills = [];
				this.totalData.arClearingInfo.bills.forEach(v => {
					let clearingCharges = [];
					v.clearingCharges.forEach(item => {
						clearingCharges.push({
							chargeKeepId: item.chargeKeepId,
							unInstructionAmount: item.unInstructionAmount
						});
					});
					data.arClearingInfo.bills.push({
						id: v.id,
						clearingCharges: clearingCharges
					});
				});
			}
			if (this.totalData.arClearingInfo.invoices.length > 0) {
				data.arClearingInfo.invoices = [];
				this.totalData.arClearingInfo.invoices.forEach(v => {
					let clearingCharges = [];
					v.clearingCharges.forEach(item => {
						clearingCharges.push({
							chargeKeepId: item.chargeKeepId,
							unInstructionAmount: item.unInstructionAmount
						});
					});
					data.arClearingInfo.invoices.push({
						id: v.id,
						clearingCharges: clearingCharges
					});
				});
			}
			if (this.totalData.arClearingInfo.charges.length > 0) {
				data.arClearingInfo.charges = [];
				this.totalData.arClearingInfo.charges.forEach(v => {
					data.arClearingInfo.charges.push({
						chargeKeepId: v.chargeKeepId,
						unInstructionAmount: v.unInstructionAmount
					});
				});
			}

			// 应付
			if (this.totalData.apClearingInfo.bills.length > 0) {
				data.apClearingInfo.bills = [];
				this.totalData.apClearingInfo.bills.forEach(v => {
					let clearingCharges = [];
					v.clearingCharges.forEach(item => {
						clearingCharges.push({
							chargeKeepId: item.chargeKeepId,
							unInstructionAmount: item.unInstructionAmount
						});
					});
					data.apClearingInfo.bills.push({
						id: v.id,
						clearingCharges: clearingCharges
					});
				});
			}
			if (this.totalData.claimList.length > 0) {
				this.totalData.claimList.forEach(v => {
					data.claimList.push({
						claimId: v.id,
						useAmount: v.useAmount
					});
				});
			}
			this.submitLoading = true;
			let fn = this.config.fmsInstructionOffsetSubmitApi;
			fn(data)
				.then(res => {
					if (res.ok) {
            // 对冲核销申请提交成功
						this.$message.success(this.$t('fmsReceiveClear.applyOffsetClearSuccess'));
						this.backList();
					}
					this.submitLoading = false;
				})
				.catch(() => {
					this.submitLoading = false;
				});
		}
	}
};
</script>

<style lang="scss" scoped></style>
