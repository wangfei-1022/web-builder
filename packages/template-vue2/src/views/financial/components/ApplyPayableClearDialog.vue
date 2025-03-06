<template>
    <el-dialog :title="$t('fmsPayablePayment.applyClear')" :visible.sync="visible" width="500px">
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="right" size="mini">
        <el-form-item :label="$t('fmsPayablePayment.localServicePaymentType')" prop="localServicePaymentType">
          <el-select v-model="formModel.localServicePaymentType" size="mini">
            <el-option v-for="(item, index) in localServicePaymentTypeList" :key="index" :label="item.name" :value="item.code"/>
          </el-select>
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
	name: "ApplyPayableClearDialog",
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
			localServicePaymentTypeList: [],
			visible: false,
			formModel: {
				localServicePaymentType: ''
			},
			formRules: {
				localServicePaymentType: [{ required: true, message: this.$t('fmsReceiveInvoice.can_not_be_null'), trigger: 'blur' }]
			}
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			Promise.all([getDictDataApi(47)]).then(results => {
				const localServicePaymentTypeRes = results[0]
				if (localServicePaymentTypeRes.ok) {
					this.localServicePaymentTypeList = localServicePaymentTypeRes.content
				}
			})
		},
		// 业务类型 订单类型
		show(ids, businessType, entityType) {
			this.formModel = {
				localServicePaymentType: ''
			}
			// THIRD_ORDER 第三类订单
      // businessType === 'THIRD_ORDER' || 
			if (businessType === 'SEA_EXPORT' || businessType === 'AIR_EXPORT' && entityType === 1101) {
				this.ids = ids
				this.visible = true
			} else {
				this.routerPush()
			}
		},
		routerPush() {
			this.$router.push({
				name: this.toPath,
				query: {
					localServicePaymentType: this.formModel.localServicePaymentType,
					ids: this.ids.join(","),
					origin: this.origin,
					back: this.$route.name
				}
			});
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
					this.visible = false
					this.routerPush()
				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>
</style>
