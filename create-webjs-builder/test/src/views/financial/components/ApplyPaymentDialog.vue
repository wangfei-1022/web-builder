<template>
    <el-dialog :title="$t('fmsPayablePayment.applyPayment')" :visible.sync="visible" width="500px">
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="right" size="mini">
        <el-form-item :label="$t('fmsPayablePayment.localServicePaymentType')" prop="localServicePaymentType" v-if="showLocalServicePaymentType">
          <el-select v-model="formModel.localServicePaymentType" size="mini">
            <el-option v-for="(item, index) in localServicePaymentTypeList" :key="index" :label="item.name" :value="item.code"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('fmsPayablePayment.paymentReport')" prop="isOverSea">
          <el-radio-group v-model="formModel.isOverSea">
            <el-radio :label="true">{{$t('fmsPayablePayment.OVERSEAS')}}</el-radio>
            <el-radio :label="false">{{$t('fmsPayablePayment.DOMESTIC')}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="submitFn" size="mini">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
</template>

<script>
import { getDictDataApi } from "@/api/financial/fmsReceive"

export default {
	name: "ApplyPaymentDialog",
	props: {
		origin: {
			type: String,
			default: ''
		},
		toPath: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			ids: [],
			showLocalServicePaymentType: false,
			invoiceTypeList: [],
			localServicePaymentTypeList: [],
			visible: false,
			formModel: {
				localServicePaymentType: '',
				isOverSea: ''
			},
			formRules: {
				localServicePaymentType: [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }],
				isOverSea: [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
			}
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			Promise.all([getDictDataApi(12), getDictDataApi(47)]).then(results => {
				const invoiceTypeRes = results[0]
				const localServicePaymentTypeRes = results[1]
				if (invoiceTypeRes.ok) {
					this.invoiceTypeList = invoiceTypeRes.content
				}
				if (localServicePaymentTypeRes.ok) {
					this.localServicePaymentTypeList = localServicePaymentTypeRes.content
				}
			})
		},
		// 业务类型 订单类型
		show(ids, businessType, entityType) {
			this.formModel = {
				invoiceMedium: '',
				localServicePaymentType: ''
			}
			// THIRD_ORDER  第三类订单 
      // businessType === 'THIRD_ORDER' || 
			this.showLocalServicePaymentType = businessType === 'SEA_EXPORT' || businessType === 'AIR_EXPORT' && entityType === 1101
			this.ids = ids
			this.visible = true
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					this.visible = false
					this.$router.push({
						name: this.toPath,
						query: {
							paymentType: 1,
							isOverSea: this.formModel.isOverSea,
							localServicePaymentType: this.formModel.localServicePaymentType,
							ids: this.ids.join(","),
							origin: this.origin,
							back: this.$route.name
						}
					});
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
