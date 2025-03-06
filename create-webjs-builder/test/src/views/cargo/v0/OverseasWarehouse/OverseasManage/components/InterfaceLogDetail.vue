<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			:title="$t('InterfaceLog.detailTitle')"
			width="800px"
			:close-on-click-modal="false"
		>
			<div class="dialog-content">
				<el-form	v-if="dialogVisible"	ref="formData"	label-width="90px" label-position="left"	:model="formData"	>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('InterfaceLog.abnormalMainClass')">{{formData.businessMark || '-'}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('InterfaceLog.abnormalMainClass')">{{formData.expMainCategoryCodeName || '-'}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('InterfaceLog.abnormalSubClass')">{{formData.expSpecificCategoryCodeName || '-'}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('InterfaceLog.functionModule')">{{formData.optMoudleTypeName || '-'}}</el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item :label="$t('InterfaceLog.caller')">{{formData.caller || '-'}}</el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item :label="$t('InterfaceLog.byCaller')">{{formData.callee || '-'}}</el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item :label="$t('InterfaceLog.interfaceType')">{{formData.callType || '-'}}</el-form-item>
            </el-col> -->
            <el-col :span="24">
              <el-form-item :label="$t('InterfaceLog.interfaceAddress')">{{formData.callUrl || '-'}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('InterfaceLog.failureReason')">{{formData.remark  || '-'}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('InterfaceLog.invokePacket')">{{formData.requestMessage  || '-'}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('InterfaceLog.responsePacket')">{{formData.responseMessage  || '-'}}</el-form-item>
            </el-col>
          </el-row>

				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false" :disabled="loading">{{ $t("common.cancelBtn") }}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { detailInterfaceLogApi } from '@/api/OverseasWarehouse/InterfaceLog'
export default {
	name: 'InterfaceLogDetail',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String
	},

	data() {
		return {
			loading: false,
			dialogVisible: false,
			formData: {
			}
		}
	},
	methods: {
		async getDetail() {
			if (this.$isEmpty(this.id)) {
				return
			}
			this.loading = true
			let res = await detailInterfaceLogApi(this.id)
			if (res.ok) {
				this.formData = this.$extends({}, res.content)
				this.loading = false
			} else {
				this.loading = false
			}
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)

		},
		visible(val) {
			if (val) {
				this.getDetail()
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
.tips {
	font-size: 12px;
	// margin-bottom: 10px;
}
</style>
