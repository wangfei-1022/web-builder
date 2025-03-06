<template>
	<el-dialog :visible.sync="exportVisiable" :close-on-click-modal="false" width="400px" :title="$t('fmsReceiptTransactions.export_transaction')">
		<div class="record-container">
			<el-form ref="exportFormRef" :model="exportFormModel" :rules="exportFormRules" label-width="0">
				<el-form-item label="" prop="transactionFile">
					<upload-file v-model="exportFormModel.transactionFile" :limit="1" accept=".xlsx,.xls">
						<template slot="upload">
							<el-button type="primary" size="mini">{{$t('fmsReceiptTransactions.upload_file')}}</el-button>
							<div>
								{{$t('fmsReceiptTransactions.upload_file_desc')}}
								<a href="/static/批量导入收款模板.xlsx" target="_blank" @click="preventFn($event)" class="link">{{$t('fmsReceiptTransactions.download_template')}}</a>
							</div>
						</template>
					</upload-file>
				</el-form-item>
			</el-form>

		</div>
		<div slot="footer" class="option-btn-wrap">
			<el-button size="mini" type="primary" plain @click="exportVisiable = false">{{ $t("common.cancel")}}</el-button>
			<el-button size="mini" type="primary" @click="exportConfirm">{{ $t("common.confirm")}}</el-button>
		</div>
	</el-dialog>
</template>
<script>
import { parseTime, formatNumberToThousands } from "@/utils/index";
import { walletTransactionImportApi } from "@/api/financial/fmsReceiptTransactions";

// 申请核销
export default {
	name: "ClearReasonModal",
	data() {
		return {
			exportVisiable: false,
			exportFormModel: {
				transactionFile: []
			},
			exportFormRules: {
				transactionFile: [{ required: true, message: this.$t("common.cannot_be_null"), trigger: "blur" }]
			}
		};
	},
	methods: {
		show() {
			this.exportVisiable = true;
		},
		exportConfirm() {
			this.$refs.exportFormRef.validate(valid => {
				if (valid) {
					let data = {
						transactionFile: this.exportFormModel.transactionFile[0]
					};
					walletTransactionImportApi(data).then(res => {
						if (res.ok) {
							this.exportVisiable = false;
							this.exportFormModel.transactionFile = [];
							this.$message.success(this.$t('fmsReceiptTransactions.upload_file_success'));
							this.$emit("success");
						}
					});
				}
			});
		},
		preventFn(e) {
			e.stopPropagation();
		}
	}
};
</script>

<style lang="scss" scoped>
.link {
	color: #1890ff;
}
</style>
