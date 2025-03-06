<template>
  <el-dialog :title="title" :visible.sync="visvible" :width="width">
    <el-form ref="orderForm" :inline="true" :model="form" :rules="formRule" label-width="80px">
      <el-form-item :label='$t("receiveFms.entity_no")' prop="entityNo">
        <el-input v-model.trim="form.entityNo" size="mini" :placeholder="$t('receiveFms.please_enter_order_no')" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="visvible = false">{{$t('common.cancel')}}</el-button>
      <el-button size="mini" type="primary" @click="next()" :loading="loading">{{$t('receiveFms.next')}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getReceiveConfirmationDetailApi } from "@/api/fmsReceiveOvl"

export default {
	name: "EditCharge",
	props: {
		addChargeInfo: {
			type: Object,
			default: function () {
				return {}
			}
		}
	},
	watch: {
		addChargeInfo: {
			handler(val) {
				if (val.addType === 'ADD') {
					this.title = this.$t("receiveFms.add_charge")
				} else if (val.addType === 'CHANGE') {
					this.title = this.$t("receiveFms.change_charge")
				}
			},
			deep: true,
			immediate: true
		}
	},
	data() {
		return {
			loading: false,
			title: '',
			width: '400px',
			visvible: false,
			form: {
				entityNo: ''
			},
			formRule: {
				entityNo: [{ required: true, message: this.$t("receiveFms.please_enter"), trigger: "change" }]
			}
		}
	},
	created() {

	},
	methods: {
		show() {
			this.form.entityNo = ''
			this.visvible = true
		},
		next() {
			this.$refs.orderForm.validate(valid => {
				if (valid) {
					this.loading = true
					// 校验订单号是否存在
					getReceiveConfirmationDetailApi(this.form.entityNo).then(res => {
						this.loading = false
						if (res.ok) {
							this.visvible = false
							if (this.addChargeInfo.addType === 'ADD') {
								this.$router.push({
									name: `OvlAdjustChargeAdd`,
									query: {
										entityNo: this.form.entityNo,
										type: this.addChargeInfo.addType,
										origin: this.addChargeInfo.origin
									}
								})
								return
							}
							this.$router.push({
								name: `OvlAdjustCharge`,
								query: {
									entityNo: this.form.entityNo,
									type: this.addChargeInfo.addType,
									origin: this.addChargeInfo.origin
								}
							})
						}
					})
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>

