<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :title="getZH('addRefusedReason')" width="520px" :close-on-click-modal="false">
      <el-form v-if="dialogVisible" ref="formData" v-loading="loading" label-width="80px" label-position="left" :model="formData">
        <el-form-item
          :label="getZH('reason')"
          prop="refuseOpt"
          :rules="[
            { required: true, message: selectZH('refusedReason')},
          ]"
        >
          <el-select v-model="formData.refuseOpt" class="w-full" size="mini">
            <el-option v-for="item in reasonList" :key="item.value" :label="getZH(item.label)" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.refuseOpt===3"
          :label="getZH('remark')"
          prop="refuseReson"
          :rules="[
            { required: true, message: getZH('remark')},
          ]"
        >
          <el-input v-model="formData.refuseReson" size="mini" type="textarea" :rows="2" maxlength="20" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" :loading="loading" @click="saveForm('formData')">
          {{getZH('confirm','common')}}
          </el-button>
        <el-button size="mini" :loading="loading" @click="dialogVisible = false">
           {{getZH('cancel','common')}}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { auditGoodsApi } from '@/api/OverseasWarehouse/goodsManager'
export default {
	name: 'RefusedDioalog',
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String,
		status: Number
	},
	data() {
		return {
			loading: false,
			dialogVisible: false,
			reasonList: [
				{
					label: 'auditReason1',
					value: 1
				},
				{
					label: 'auditReason2',
					value: 2
				},
				{
					label: 'auditReason3',
					value: 3
				}
			],
			formData: {
				refuseOpt: null,
				refuseReson: ''
			}
		}
	},
	watch: {
		dialogVisible(val) {
			this.$emit('update:visible', val)
		},
		visible(val) {
			if (val) {
				this.formData.reason = ''
				this.formData.refuseReson = ''
			}
			this.dialogVisible = val
		}
	},
	methods: {
		/**
		 * 保存接口
		 */
		saveForm(refName) {
			this.$refs[refName].validate(valid => {
				if (!valid) {
					this.mixinsFormScrollIntoView()
					return false
				}
				this.loading = true
				const saveData = {
					id: this.id,
					goodsStatus: this.status === 2 ? 3 : 5,
					refuseOpt: this.formData.refuseOpt,
					refuseReson: this.formData.refuseReson
				}
				auditGoodsApi(saveData).then(res => {
					if (res.ok) {
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
		},
		/**
	 * 下拉框
	 */
		selectZH(key) {
			return this.getZH('selectPlaceholder', 'common') + this.getZH(key)
		},
		/**
		 * 输入框
		 */
		inputZH(key) {
			return this.getZH('placeholder', 'common') + this.getZH(key)
		},
		/**
		 * 获取中英文
		 */
		getZH(key, obj) {
			obj = obj || 'goodsManagement'
			let str = obj + '.' + key
			return this.$t(str)
		}
	}

}
</script>
<style>
</style>
