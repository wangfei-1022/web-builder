<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('putInStorageManage.addInfo')"
			width="550px"
			:close-on-click-modal="false"
		>
			<div>
				<el-form
					ref="formData"
					v-loading="loading"
					:model="formData"
					label-width="130px"
				>
					<el-form-item
						:label="$t('putInStorageManage.realTrayCount')"
						v-if="type == 1"
					>
						<el-input
							size="mini"
							v-model="formData.realTrayCount"
							oninput="value=value.replace(/[^\d]/g,'')"
							min="1"
						></el-input>
					</el-form-item>
					<el-form-item :label="$t('putInStorageManage.realBoxQuantity')">
						<el-input
							size="mini"
							v-model="formData.realBoxQuantity"
							oninput="value=value.replace(/[^\d]/g,'')"
							min="1"
						></el-input>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button
					type="primary"
					size="mini"
					@click="saveForm()"
					:disabled="
						loading ||
						($isEmpty(formData.realTrayCount) &&
							$isEmpty(formData.realBoxQuantity))
					"
				>
					{{ $t("common.confirmBtn") }}
				</el-button>
				<el-button
					size="mini"
					@click="dialogVisible = false"
					:disabled="loading"
				>
					{{ $t("common.cancelBtn") }}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { updateRealTrayBoxCountApi } from "@/api/OverseasWarehouse/GRNManager.js"
export default {
	name: 'CollectionInfo',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String,
		// 1 为 带托盘 2为不带托盘
		type: String
	},
	data() {
		return {
			loading: false,
			dialogVisible: false,
			formData: {
				id: '',
				realTrayCount: "",
				realBoxQuantity: ''
			}
		}
	},
	methods: {

		/**
		 * 保存数据
		 */
		async saveForm() {
			this.formData.id = this.id
			let res = await updateRealTrayBoxCountApi(this.formData)
			if (res.ok) {
				this.$message.success('保存成功')
				this.dialogVisible = false
			}
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.realTrayCount = null
				this.formData.realBoxQuantity = null
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.upload {
	text-align: left !important;
}
.tips {
	padding: 10px;
	font-size: 12px;
	color: #edc28c;
	background-color: #fef5ec;
	margin-bottom: 10px;
}
.label-name {
	width: 80px;
}
</style>
