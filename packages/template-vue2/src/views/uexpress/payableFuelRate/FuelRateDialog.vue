<template>
  <el-dialog v-if="addVisible" :title="addTitle" :visible.sync="addVisible" width="530px">
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="110px" label-position="right" size="mini">
      <el-form-item :label='$t("uexpressPriceCard.supplierName")' prop="supplierId">
        <type-select 
          v-model="addForm.supplierId" 
          type="supplier"
          :defaultDisplay="addForm.supplierDefaultDisplay"
          :requestParams="{partnerRole: 17011}"
          @selected="getSupplierProduct"
          :disabled="type === 'VIEW' || type === 'ADJUST' || type === 'EDIT'"
         ></type-select>
      </el-form-item>
      <el-form-item :label='$t("uexpressPriceCard.supplierProduct")' prop="productCode">
        <el-select v-model="addForm.productCode" size="mini" style="width: 100%" filterable :disabled="type === 'VIEW' || type === 'ADJUST' || type === 'EDIT'">
          <el-option v-for="item in supplierProductList" :key="item.productCode" :label="item.productName" :value="item.productCode"/>
        </el-select>
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
          :params="{arAp: 2}"
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
  createPayableFuelRateApi,
  updatePayableFuelRateApi,
  adjustPayableFuelRateApi
} from '@/api/uexpress/payableFuelRate'
import { getSupplierProductByApi } from "@/api/uexpress/base";
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
        supplierId: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        destinationCountryCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        effectiveDatePeriod: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        fuelRate: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        feeItemCodes: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
      },
      supplierProductList: []
		}
	},
	created() {
		this.init()
	},
	methods: {
    getSupplierProduct() {
      getSupplierProductByApi({ supplierId: this.addForm.supplierId }).then(res => {
        if (res.ok) {
          this.supplierProductList = res.content
        }
      })
    },
    init() {
      this.addForm = {
        supplierId: '',
        supplierName: '',
        productCode: '',
        destinationCountryCode: '',
        effectiveDatePeriod: [],
        fuelRate: '',
        feeItemCodes: [],
        remarks: '',
        supplierDefaultDisplay: []
      }
    },
    // 业务类型 订单类型
		show(type, row) {
			this.addVisible = true
      this.type = type
      let form = {
        supplierId: row.supplierId,
        supplierName: row.supplierName,
        productCode: row.productCode,
        destinationCountryCode: row.destinationCountryCode,
        fuelRate: row.fuelRate,
        feeItemCodes: row.feeItemCodes || [],
        remarks: row.remarks,
        effectiveDatePeriod: row.effectiveDateBegin ? [row.effectiveDateBegin, row.effectiveDateEnd] : [],
        supplierDefaultDisplay: row.supplierId ? [{id: row.supplierId, chineseName: row.supplierName }] : []
      }
      if(type === 'EDIT') {
        this.addTitle = this.$t('uexpressPriceCard.edit')
        this.fn = updatePayableFuelRateApi
        this.addVisible = true
        form.offerVersionId = row.offerVersionId
      } else if(type === 'ADJUST') {
        this.addTitle = this.$t('uexpressPriceCard.adjust')
        this.fn = adjustPayableFuelRateApi
        form.sourceOfferVersionId = row.offerVersionId
      } else if(type === 'ADD') {
        this.init()
        this.fn = createPayableFuelRateApi
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
