<template>
    <el-dialog :title="$t('uexpressPriceCard.offlinePrice')" :visible.sync="visible" width="500px">
      <el-form ref="formRef" :model="formModel" :rules="formRules" label-width="120px" label-position="right" size="mini">
        <el-form-item :label="$t('uexpressPriceCard.effectiveDateTo')" prop="expireTime">
          <common-picker v-model="formModel.expireTime" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions" size="mini" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="mini">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" @click="submitFn" :loading="offlineLoading" size="mini">{{$t('common.confirm')}}</el-button>
      </span>
    </el-dialog>
</template>

<script>
// 下线价卡-失效时间
import { offlineExpireTimeOfferCustomerLastApi } from '@/api/uexpress/priceCardCustomerLast'
import { offlineExpireTimeOfferSupplierApi } from '@/api/uexpress/priceCardSupplier'
export default {
	name: "UexpressOfflinePriceCardDialog",
	data() {
		return {
      offlineLoading: false,
			visible: false,
			formModel: {
        expireTime: ''
			},
			formRules: {
				"expireTime": [{ required: true, message: this.$t('common.can_not_be_null'), trigger: 'blur' }]
			},
      row: {},
      pickerOptions: {},
      type: ''
		}
	},
	created() {

	},
	methods: {
		show(type, row) {
      this.type = type
      this.row = row
			this.visible = true
      let dateValue = row.effectiveDate > new Date().getTime() ? row.effectiveDate : new Date().getTime()
      this.pickerOptions = {
        disabledDate(time) {
          if (dateValue) {
            return time.getTime() < new Date(dateValue).getTime()
          } else {
            return false
          }
        }
      }
		},
		submitFn() {
			this.$refs.formRef.validate(valid => {
				if (valid) {
          let data = {
            offerVersionId: this.row.offerVersionId,
            effectiveDate: this.row.effectiveDateBegin,
            expireTime: this.formModel.expireTime
          }
          this.offlineLoading = true
          let fn = this.type === 'CUSTOMER' ? offlineExpireTimeOfferCustomerLastApi : offlineExpireTimeOfferSupplierApi
          fn(data).then(res => {
            if (res.ok) {
              this.$message.success(this.$t("uexpressPriceCard.offlineSuccess"))
              this.visible = false
              this.$emit('ok')
            }
            this.offlineLoading = false
          })

				}
			})
		}
	}
}
</script>
<style lang="scss" scoped>

</style>
