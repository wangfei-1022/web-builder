<template>
	<el-form ref="addDataForm" :model="claimerData" :rules="claimerDataRule" label-width="120px" :inline="true" size="mini">
		<el-form-item :label="$t('fmsReceiptTransactions.transactions_type')" prop="transactionsReceiptType">
			<el-select v-model="claimerData.transactionsReceiptType" style="width: 100%" size="mini">
				<el-option v-for="item in transactionsReceiptTypeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item :label="$t('fmsReceiptTransactions.business_type')" prop="businessTypes">
			<el-select v-model="claimerData.businessTypes" style="width: 100%" size="mini" multiple>
				<el-option v-for="item in businessTypeList" :key="item.code" :label="item.chineseName" :value="item.code" :disabled="businessTypes.indexOf(item.code) >= 0">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item :label="$t('fmsReceiptTransactions.current_claim_amount')" prop="claimAmount">
			<el-input v-model="claimerData.claimAmount" type="text" size="mini" clearable oninput="value=value.replace(/[^\d.-]/g,'')" />
		</el-form-item>
		<el-form-item :label="$t('fmsReceiptTransactions.claim_remark')" prop="claimRemark" class="full">
			<el-input v-model="claimerData.claimRemark" type="text" size="mini" clearable />
		</el-form-item>
		<el-form-item :label="$t('fmsReceiptTransactions.claim_files')" prop="claimFiles" class="full">
			<upload-file v-model="claimerData.claimFiles" multiple></upload-file>
		</el-form-item>
	</el-form>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { getRelativeTransactionReceiptListApi } from "@/api/financial/fmsReceiptTransactions";
import { getDictDataApi } from "@/api/financial/fmsReceive";

// 申请核销
export default {
	name: "ClaimForm",
	props: {
		transactionsItem: {
			type: Object,
			default: function () {
				return {};
			}
		},
		businessTypeList: {
			type: Array,
			default: function () {
				return [];
			}
		},
		transactionsReceiptTypeList: {
			type: Array,
			default: function () {
				return [];
			}
		},
		businessTypes: {
			type: Array,
			default: function () {
				return [];
			}
		},
		settlementCompanyId: {
			type: String,
			default: ""
		}
	},
	data() {
		return {
			visible: false,
			// 认领
			claimerVisible: false,
			claimerData: {
				transactionsReceiptType: "", // 收款类型
				businessTypes: [], // 业务类型
				settlementCompanyId: "", // 结算单位id
				claimAmount: "", // 认领金额
				claimRemark: "", // 认领备注
				claimFiles: [] // 认领凭证
			},
			claimerDataRule: {
				transactionsReceiptType: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				businessTypes: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				settlementCompanyId: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }],
				claimAmount: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }]
			}
		};
	},
	watch: {},
	created() {
    this.claimerData.claimAmount = this.transactionsItem.unClaimTotalAmount
    let arr = []
    this.businessTypes.forEach(v => {
      arr.push(v.businessType)
    })
		this.claimerData.businessTypes = arr
	},
	methods: {
		validate() {
			let VALID = true;
			this.$refs.addDataForm.validate(valid => {
				VALID = valid;
			});
			if (Number(this.transactionsItem.unClaimTotalAmount) < Number(this.claimerData.claimAmount)) {
				// "收款编号为：" + this.transactionsItem.transactionsNo + " 的本次认领金额不能大于未认领金额"
        this.$message.error(this.$t('fmsReceiptTransactions.claimErrorInfo', { transactionsNo: this.transactionsItem.transactionsNo}));
				return false;
			}
			return VALID;
		},
		getValue() {
			return {
				...this.claimerData,
				transactionsId: this.transactionsItem.transactionsId,
				settlementCompanyId: this.settlementCompanyId
			};
		},
		confirmFn() {}
	}
};
</script>

<style lang="scss" scoped>
</style>
