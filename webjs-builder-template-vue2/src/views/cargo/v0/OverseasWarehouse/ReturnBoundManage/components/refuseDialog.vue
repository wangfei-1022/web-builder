<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('common.auditBtn')"
			width="360px"
			:close-on-click-modal="false"
		>
      <el-form	v-if="dialogVisible"	ref="formData" label-width="90px" label-position="top" :model="formData">
        <el-form-item :label="$t('outInStorageManage.rejectMessage')" label-width="120px" prop="rejectMessage" :rules="[{ required: true, message: $t('outInStorageManage.inputRejectMessage') }]">
          <el-input v-model="formData.rejectMessage" type="textarea" maxlength="50" show-word-limit size="mini" />
        </el-form-item>
      </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary"	size="mini" @click="saveForm('formData')">{{ $t("common.saveBtn") }}</el-button>
				<el-button	size="mini"	@click="dialogVisible = false">	{{ $t("common.cancel") }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { rejectedReturnboundApi } from '@/api/OverseasWarehouse/returnManage'
export default {
	name: 'AddDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String
	},
	data() {
		return {
			dialogVisible: false,
			formData: {
				id: null,
				rejectMessage: ''
			}
		}

	},
	methods: {
		/**
		 * 保存接口
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (valid) {
					this.loading = true
					this.formData.id = this.id
					rejectedReturnboundApi(this.formData).then(res => {
						this.loading = false
						if (res.ok) {
							this.$message.success(this.$t('common.auditSuccess'))
							this.dialogVisible = false
							this.$emit('saved')
						}
					})
				} else {
					return false
				}
			})
		}
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.$emit('update:visible', val)
			}
		},
		visible(val) {
			if (val) {
				this.formData.rejectMessage = null
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
</style>
