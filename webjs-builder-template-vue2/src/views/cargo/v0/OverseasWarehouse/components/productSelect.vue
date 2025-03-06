<template>
  <div>
     <cargo-advance-select
        ref='productSelect'
        :method="getProductList"
        :headers="[$t('logisticsProduct.logistics_product_name'),$t('logisticsProduct.logistics_product_code')]"
        :default-value="defaultVal"
        :fields="['productName','productCode']"
        :tag-value="tagValue"
        :tag-name="tagName"
        remote
        class="w-full"
        :clearable="clearable"
        @parentCallBack="parentCallBack"
        :disabled='disabled'
      />
  </div>
</template>

<script>
import cargoAdvanceSelect from '@/components/Cargo/Common/cargoAdvanceSelect'
import { getProductListApi } from '@/api/OverseasWarehouse/peakSeasonSurcharge'
export default {
	name: 'ProductSelect',
	components: { cargoAdvanceSelect },
	props: {
		defaultVal: {
			type: String,
			default: ''
		},
		clearable: {
			type: Boolean,
			default: false
		},
		tagValue: {
			type: String,
			default: 'productCode'
		},
		tagName: {
			type: String,
			default: 'productName'
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {

		}
	},
	methods: {
		/**
		 * 模糊查询列表
		 */
		getProductList({ keyword }) {
			return getProductListApi(keyword)
		},
		/**
		 * 选中
		 */
		parentCallBack(data) {
			this.$emit('selected', data)
			this.$emit('input', data[this.tagValue])
		},
		/**
		 * 清空数据
		 */
		clearData() {
			this.$refs.productSelect.value = ''
		}
	}

}
</script>

<style>
</style>
