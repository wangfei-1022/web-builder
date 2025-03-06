<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('common.tips')"
			width="550px"
			:close-on-click-modal="false"
			:append-to-body="true"
		>
      <el-form v-if="dialogVisible" ref="formData" label-width="110px" label-position="top" :model="formData">
        <el-form-item :label="$t('putInStorageManage.auditFlag')" prop="auditFlag">
          <el-select size="mini" v-model="formData.auditFlag" required>
            <el-option :label="$t('putInStorageManage.pass')" :value="true"></el-option>
            <el-option :label="$t('putInStorageManage.refuse')" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="!formData.auditFlag" :label="$t('putInStorageManage.refuseReason')" :rules="[ { required: true, message: $t('putInStorageManage.input_refuseReason') } ]" prop="reason">
          <el-input  type="textarea"  :placeholder="$t('putInStorageManage.input_refuseReason')"  v-model="formData.reason"  maxlength="50" show-word-limit></el-input>
        </el-form-item>
      </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button  size="mini" @click="dialogVisible = false" :loading='loading'>
					{{$t('common.cancelBtn') }}
				</el-button>
        <el-button type="primary" size="mini" @click="saveForm('formData')" :loading='loading'>
						{{$t('common.saveBtn') }}
				</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { batchAuditInboundtApi } from '@/api/OverseasWarehouse/GRNManager'
export default {
	name: 'AduitRejectDialog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		ids: Array
	},
	data() {
		return {
			dialogVisible: false,
			loading: false,
			formData: {
				reason: null,
				auditFlag: true
			}
		}
	},
	methods: {
		/**
		 * 保存接口
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					return false
				}
				this.loading = true
				batchAuditInboundtApi({ ids: this.ids, ...this.formData }).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.saveSuccess'))
						this.loading = false
						this.$emit('saved')
						this.dialogVisible = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			})
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.reason = null
				this.formData.auditFlag = true
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
