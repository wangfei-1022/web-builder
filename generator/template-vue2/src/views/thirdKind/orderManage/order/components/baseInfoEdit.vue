<template>
  <el-dialog :visible.sync="dialogVisible" :title="getZH('baseInfo')" width="1000px" :close-on-click-modal="false">
    <div class="dialog-content" v-loading="loading">
      <el-form ref="formData" :model="formData" label-width="100px" v-if="dialogVisible" :rules="rules">
        <BaseInfo :formData="formData" :isDisabled="false" :small="true" />
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"	size="mini" @click="saveForm()" :loading="loading">{{ $t("common.saveBtn") }}</el-button>
      <el-button	size="mini"	@click="dialogVisible = false" :loading="loading">	{{ $t("common.cancelBtn") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import getZHMixin from './getZHMixin'
import BaseInfo from './baseInfo'
import { detailThiOrderApi, saveThiOrderBaseApi } from '@/api/thirdKind'
export default {
	name: 'BaseInfoEdit',
	mixins: [getZHMixin],
	components: { BaseInfo },
	props: {
		visible: {
			type: Boolean,
			default: false
		},
		id: String
	},
	data() {
		let defaultForm = {
			id: null,
			businessType: null,
			businessDate: null,
			businessTypeName: null,
			customerId: null,
			customerName: null,
			contactCnName: null,
			contactMobile: null,
			contactEmail: null,
			sellerName: null,
			sellerId: null
		}
		return {
			dialogVisible: false,
			loading: false,
			rules: {
				customerId: [{ required: true, message: this.selectZH('client') }],
				sellerName: [{ required: true, message: this.inputZH('sellerName') }]
			},
			defaultForm,
			formData: this.$extends({}, defaultForm)
		}
	},
	methods: {
		async getDetail() {
			this.loading = true
			if (this.$isNotEmpty(this.id)) {
				let res = await detailThiOrderApi(this.id)
				if (res.ok) {
					this.$copyProps(this.formData, res.content)
				}
				this.loading = false
			}
		},
		async saveForm() {
			this.loading = true
			let res = await saveThiOrderBaseApi(this.formData)
			if (res.ok) {
				this.$message.success(this.getZH('saveSuccess', 'common'))
				this.dialogVisible = false
				this.$emit('saved')
			}
			this.loading = false
		}
	},
	watch: {
		dialogVisible(val) {
			if (!val) {
				this.formData = this.$extends({}, this.defaultForm)
				this.$emit('update:visible', val)
			}
		},
		visible(val) {
			this.dialogVisible = val
			if (val) {
				this.getDetail()
			}
		}
	}

}
</script>

<style lang="scss" scoped>
</style>
