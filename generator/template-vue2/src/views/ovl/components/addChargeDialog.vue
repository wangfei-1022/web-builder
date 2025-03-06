<template>
  <el-dialog :visible.sync="dialogVisible" :title='$t("receiveFms.add_charge_info")' width="520px" :close-on-click-modal="false">
    <div class="dialog-content">
      <el-form ref="formData" v-if="dialogVisible" :model="formData" label-width="80px" :rules="rules">
        <el-form-item :label="$t('receiveFms.business_type')" prop="childBusinessTypeArr">
          <el-cascader class="w-full" size="mini" v-model="formData.childBusinessTypeArr" :options="childBusinessTypeOptions" :props="cascaderProps" />
        </el-form-item>
        <el-form-item :label='$t("receiveFms.entity_no")' prop="entityNo">
          <el-input v-model.trim="formData.entityNo" size="mini" :placeholder='$t("receiveFms.please_enter_order_no")'></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary"	size="mini" :loading="loading" @click="saveForm">	{{ $t("common.saveBtn") }}</el-button>
      <el-button	size="mini"	@click="dialogVisible = false">	{{ $t("common.cancelBtn") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getOrderTypesApi, checkOrderConfirmationChargeApi } from "@/api/fmsReceiveOvl"
export default {
	name: 'AddChargeDialog',
	components: {},
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
			loading: false,
			cascaderProps: {
				expandTrigger: 'hover',
				value: 'code',
				label: 'name'
			},
			rules: {
				entityNo: [{ required: true, message: this.$t("receiveFms.please_enter_order_no"), trigger: "change" }],
				childBusinessTypeArr: [{ required: true, message: this.$t("receiveFms.please_enter_business_type"), trigger: "change" }],
			},
			childBusinessTypeOptions: [],
			formData: {
				childBusinessTypeArr: [],
				entityNo: null,
			}
		}

	},
	methods: {
		async init() {
			let res = await getOrderTypesApi()
			if (res.ok) {
				res.content.forEach(v => {
					if (v.children && v.children.length === 0) {
						delete v.children
					}
				})
				this.childBusinessTypeOptions = res.content
			}
		},
		saveForm() {
			this.$refs.formData.validate(valid => {
				if (valid) {
					this.loading = true
					// 校验订单号是否存在
					let data = {
						bizType: this.formData.childBusinessTypeArr[0],
						bizNo: this.formData.entityNo
					}
					checkOrderConfirmationChargeApi(data).then(res => {
						this.loading = false
						if (res.ok) {
							this.dialogVisible = false
							res.content = res.content || {}
							this.$router.push({
								name: `OvlAdjustChargeAdd`,
								query: {
									entityNo: this.formData.entityNo,
									type: 'ADD',
									origin: 'OvlReceiveConfirmation',
									childBusinessType: this.formData.childBusinessTypeArr[0],
									customerName: res.content.customerName,
									warehouseName: res.content.warehouseName,

								}
							})
						}
					})
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
				this.formData = {
					childBusinessTypeArr: [],
					entityNo: null,
				}
				this.init()
			}
			this.dialogVisible = val
		}
	}

}
</script>

<style lang="scss" scoped>
</style>
