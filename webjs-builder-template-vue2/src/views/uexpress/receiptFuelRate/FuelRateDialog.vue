<template>
  <el-dialog v-if="addVisible" :title="addTitle" :visible.sync="addVisible" width="530px">
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px" label-position="right" size="mini">
      <el-form-item :label='$t("uexpressPriceCard.productName")' prop="productCode">
        <uexpress-type-select 
          type="productSales" 
          v-model="addForm.productCode" 
          clearable 
          filterable 
          :disabled="type === 'VIEW' || type === 'ADJUST' || type === 'EDIT'"
        />
      </el-form-item>
      <el-form-item :label='$t("uexpressPriceCard.destinationCountry")' prop="destinationCountryCode">
        <base-select 
          type="country" 
          v-model="addForm.destinationCountryCode"
          :disabled="type === 'VIEW' || type === 'ADJUST' || type === 'EDIT'"  
          filterable style="width: 100%" 
        />
      </el-form-item>
      <el-form-item :label='$t("uexpressPriceCard.fuelRateFeeItem")' prop="feeItemCodes">
        <uexpress-select 
          type="chargeItem" 
          v-model="addForm.feeItemCodes" 
          filterable multiple 
          :params="{arAp: 1}"
          :disabled="type === 'VIEW'"  
          style="width: 100%" 
        />
      </el-form-item>
      <el-form-item :label='$t("uexpressPriceCard.fuelRate")' prop="fuelRate">
        <el-input v-model="addForm.fuelRate" :disabled="type === 'VIEW'">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item :label='$t("uexpressPriceCard.fuelRateEffectiveDate")' prop="effectiveDatePeriod">
        <search-date-picker
          v-model="addForm.effectiveDatePeriod" 
          pickerFormat="yyyy-MM-dd HH:mm:ss"
          default-end-time="23:59:59"
          type="datetime"
          :disabled="type === 'VIEW'"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addVisible = false" size="mini" v-if="type === 'VIEW'">{{$t('common.close')}}</el-button>
      <el-button @click="addVisible = false" size="mini" v-if="type !== 'VIEW'">{{$t('common.cancel')}}</el-button>
      <el-button type="primary" @click="addSubmitFn" :loading="addLoading" size="mini" v-if="type !== 'VIEW'">{{$t('common.confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  createReceiptFuelRateApi,
  updateReceiptFuelRateApi,
  adjustReceiptFuelRateApi
} from '@/api/uexpress/receiptFuelRate'
export default {
	name: "FuelRateDialog",
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
      fn: null,
      // 新增编辑
      addVisible: false,
      addLoading: false,
      addTitle: '',
      type: '',
      addForm: {},
      addFormRules: {
        productCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        destinationCountryCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        effectiveDatePeriod: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        fuelRate: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        feeItemCodes: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
      }
		}
	},
	created() {
		this.init()
	},
	methods: {
    init() {
      this.addForm = {
        productCode: '',
        destinationCountryCode: '',
        effectiveDatePeriod: [],
        fuelRate: '',
        feeItemCodes: [],
        remarks: ''
      }
    },
    // 业务类型 订单类型
		show(type, row) {
			this.addVisible = true
      this.type = type
      let form = {
        productCode: row.productCode,
        destinationCountryCode: row.destinationCountryCode,
        fuelRate: row.fuelRate,
        feeItemCodes: row.feeItemCodes || [],
        remarks: row.remarks,
        effectiveDatePeriod: row.effectiveDateBegin ? [row.effectiveDateBegin, row.effectiveDateEnd] : []
      }
      if(type === 'EDIT') {
        this.addTitle = this.$t('uexpressPriceCard.edit')
        this.fn = updateReceiptFuelRateApi
        this.addVisible = true
        form.offerVersionId = row.offerVersionId
      } else if(type === 'ADJUST') {
        this.addTitle = this.$t('uexpressPriceCard.adjust')
        this.fn = adjustReceiptFuelRateApi
        form.sourceOfferVersionId = row.offerVersionId
      } else if(type === 'ADD') {
        this.init()
        this.fn = createReceiptFuelRateApi
        this.addTitle = this.$t('uexpressPriceCard.add')
      } else if(type === 'VIEW') {
        this.addTitle = this.$t('uexpressPriceCard.view')
      }
      this.addForm = form
		},
    addSubmitFn(row) {
      this.$refs.addFormRef.validate(valid => {
        if(valid) {
          let data = {
            ...this.addForm,
            effectiveDate: this.addForm.effectiveDatePeriod[0],
            expireDate: this.addForm.effectiveDatePeriod[1]
          }
          delete data.effectiveDatePeriod
          this.addLoading = true
          this.fn(data).then(res => {
            if(res.ok){
              this.$emit('success')
              this.$message.success(this.$t('uexpressPriceCard.operSuccess'))
              this.addVisible = false
            }
            this.addLoading = false
          })
        }
      });
    },
	}
}
</script>
<style lang="scss" scoped>

</style>
