<template>
  <el-form ref="baseForm" :rules="formRule" :model="form" label-width="120px" size="mini">
    <el-form-item :label='$t("uexpressPriceCard.supplierName")' prop="supplierId">
      <type-select
        @selected="infoChange"
        :disabled="!!offerVersionId"
        v-model="form.supplierId"
        type="supplier"
        :requestParams="{partnerRole: '17011'}"
        :defaultDisplay="[{id: form.supplierId, chineseName: form.supplierName}]"
      />
    </el-form-item>
    <el-form-item :label='$t("uexpressPriceCard.offerName")' prop="offerName">
      <el-input v-model="form.offerName" :disabled="!!offerVersionId"></el-input>
    </el-form-item>
    <el-form-item :label='$t("uexpressPriceCard.supplierProduct")' prop="productCode">
      <el-select v-model="form.productCode" size="mini" style="width: 100%" filterable :disabled="!!offerVersionId">
        <el-option v-for="item in supplierProductList" :key="item.productCode" :label="item.productName" :value="item.productCode"/>
      </el-select>
    </el-form-item>
    <el-form-item :label='$t("uexpressPriceCard.countryName")' prop="destinationCountryCode">
      <base-select v-model="form.destinationCountryCode" type="country" filterable clearable :disabled="!!offerVersionId"/>
    </el-form-item>
    <el-form-item :label='$t("uexpressPriceCard.currency")' prop="currency">
      <base-select v-model="form.currency" type="currency" />
    </el-form-item>
    <el-form-item :label='$t("uexpressPriceCard.bulkyModulus")' prop="bulkyModulus">
      <el-input v-model="form.bulkyModulus"></el-input>
    </el-form-item>
    <el-form-item :label='$t("uexpressPriceCard.effectiveDate")' prop="effectiveDate">
      <common-picker v-model="form.effectiveDate" pikcer-type="datetime" pickerFormat="yyyy-MM-dd HH:mm:ss" size="mini" />
    </el-form-item>
    <el-form-item :label='$t("uexpressPriceCard.unitGroup")' prop="unitGroup">
      <uexpress-select type="unitGroup" v-model="form.unitGroup" @selected="infoChange"/>
    </el-form-item>
    <el-form-item :label='$t("uexpressPriceCard.ounceFlag")' prop="ounceFlag" v-if="form.unitGroup === 2">
      <el-radio-group v-model="form.ounceFlag" @change="infoChange">
        <el-radio :label="true">{{$t('uexpressPriceCard.YES')}}</el-radio>
        <el-radio :label="false">{{$t('uexpressPriceCard.NO')}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label='$t("uexpressPriceCard.remarks")' prop="remarks" class="full-line">
      <el-input v-model="form.remarks" type="textarea"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import { getDictListApi, getSupplierProductByApi } from "@/api/uexpress/base";

export default {
	name: "UexpressPriceCardSupplierPayableAdd",
  props: {
    offerVersionId: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    formData: {
      handler(val) {
        this.form = {
          ...this.form,
          ...val
        }
        if (val.supplierId) {
          this.getSupplierProduct(val.supplierId)
        }
      },
      deep: true,
      immediate: true
    }
  },
	data() {
		return {
			form: {
        supplierId: '',
        currency: '',
        supplierName: '',
        offerName: '',
        productCode: '',
        productType: '',
        destinationCountryCode: '',
        templateNo: '',
        templateName: '',
        bulkyModulus: '',
        effectiveDate: '',
        unitGroup: '',
        ounceFlag: '',
        remarks: ''
			},
			formRule: {
				supplierId: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
				currency: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
				offerName: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        productCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        destinationCountryCode: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        templateNo: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        bulkyModulus: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        effectiveDate: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        unitGroup: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}],
        ounceFlag: [{	required: true, message: this.$t("common.cannot_be_null"),	trigger: "change"}]
			},
      templateCharges: [],
      supplierProductList: []
		};
	},
	methods: {
    getSupplierProduct(supplierId) {
      getSupplierProductByApi({ supplierId: supplierId }).then(res => {
        if (res.ok) {
          this.supplierProductList = res.content
        }
      })
    },
    supplierChange(item) {
      this.supplierProductList = []
      this.form.productCode = ''
      this.form.productName = ''
      if (item.id) {
        this.$emit('updateInfo', this.form)
        this.getSupplierProduct(item.id)
      }
    },
    infoChange() {
      this.$emit('updateInfo', this.form)
    },
		validate() {
      let VALID = true
			this.$refs.baseForm.validate(valid => {
        VALID = valid
				if (!valid) {
          this.mixinsFormScrollIntoView();
				}
			});
      return VALID
		},
    getValue() {
      return {
        ...this.form
      }
    }
	}
};
</script>
<style scoped lang="scss">

</style>
