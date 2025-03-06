<template>
	<div>
		<el-dialog	:visible.sync="dialogVisible" title="异常柜维护" width="520px"	:close-on-click-modal="false">
      <div class="dialog-content">
        <el-form label-width="100px" label-position="left" :model="formData" ref="formData" v-if="dialogVisible" v-loading="loading" >
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item :label="$t('seaBl.ctnNo')" >
                <el-input size="mini" v-model="initData.ctnNo" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item :label="$t('seaBl.exceptionDescription')" prop="exceptionRemark" :rules="[{ required:true, message: $t('seaBl.exceptionDescription_input') }]">
                <el-input v-model="formData.exceptionRemark" type="textarea" size="mini" :disabled="initData.state!=20" />
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loading" size="mini" v-if="initData.state==20" @click="submitData('formData')">{{$t("common.confirmBtn")}}</el-button>
        <el-button type="danger" :loading="loading" size="mini" v-if="initData.state==22" @click="revocationData('formData')">{{$t("common.revocationBtn")}}</el-button>
        <el-button size="mini" @click="dialogVisible = false">{{$t("common.cancelBtn")}}</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
import { exceptionSeaCtnApi, cancelExceptionSeaCtnApi } from '@/api/OvlSeaSitManage/seaBl'
export default {
	name: 'ExchangeOrderDialog',
	props: {
		initData: Object,
		visible: {
			type: Boolean,
			default: false
		}

	},
	data() {
		let defaultForm = {
			id: null,
			exceptionRemark: null
		}
		return {
			dialogVisible: false,
			loading: false,
			defaultForm,
			formData: this.$extends({}, defaultForm)
		}
	},

	methods: {
		// 提交
		async submitData(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				const saveForm = this.$extends(true, {}, this.formData)
				exceptionSeaCtnApi(saveForm).then(res => {
					if (res && res.ok) {
						this.$message.success(this.$t('common.saveSuccess'))
						this.dialogVisible = false
						this.loading = false
					} else {
						this.loading = false
					}
				}).catch(() => {
					this.loading = false
				})
			})
		},
		revocationData() {
			this.confirmTips(this.$t('seaBl.revocationTips')).then(() => {
				cancelExceptionSeaCtnApi({ id: this.formData.id }).then(res => {
					if (res.ok) {
						this.$message.success(this.$t('common.revocationSuccess'))
						this.dialogVisible = false
						this.loading = false
					}
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
				this.formData.exceptionRemark = this.initData.exceptionRemark
				this.formData.id = this.initData.id
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style>
</style>
