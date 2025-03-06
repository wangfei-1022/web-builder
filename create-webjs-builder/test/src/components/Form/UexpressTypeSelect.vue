<template>
  <div>
    <!--小包-服务产品-->
    <advance-select
      ref="advanceSelectRef"
      v-if="type === 'productSales'"
      v-model="modelValue"
      :placeholder='$t("uexpressProduct.productPlaceholder")'
      :multiple="multiple"
      :filterable="filterable"
      :method="getProductSalesByApiFn"
      :fields="['productCode','productName']"
      :headers="['产品编码', '产品名称']"
      value-key="productCode"
      label-key="productName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
      class="w-full"
    >
    </advance-select>
    <!--小包-渠道-->
    <advance-select
      ref="advanceSelectRef"
      v-if="type === 'channel'"
      v-model="modelValue"
      :placeholder='$t("uexpressProduct.channelPlaceholder")'
      :multiple="multiple"
      :filterable="filterable"
      :method="getChannelListFn"
      :fields="['channelCode','channelName']"
      :headers="['渠道编码', '渠道名称']"
      value-key="channelCode"
      label-key="channelName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
      class="w-full"
    >
    </advance-select>
    <!--小包-价卡模板-->
    <advance-select
      ref="advanceSelectRef"
      v-if="type === 'priceTemplate'"
      v-model="modelValue"
      :placeholder="placeholder"
      :multiple="multiple"
      :filterable="filterable"
      :method="getChargeTemplateListFn"
      :fields="['templateNo', 'templateName']"
      :headers="['价卡编码', '价卡名称']"
      value-key="templateNo"
      label-key="templateName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
      class="w-full"
    >
    </advance-select>
    <!-- 小包 - 轨迹渠道 -->
    <advance-select
      ref="advanceSelectRef"
      v-if="type === 'traceChannel'"
      v-model="modelValue"
      :placeholder="placeholder"
      :multiple="multiple"
      :filterable="filterable"
      :method="getTraceChannelInfoFN"
      :fields="['channelCode','channelName']"
      :headers="['渠道编码', '渠道名称']"
      value-key="channelCode"
      label-key="channelName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
      class="w-full">
    </advance-select>
    <!-- 小包 - 供应商服务产品 -->
    <advance-select
      ref="advanceSelectRef"
      v-if="type === 'supplierProduct'"
      v-model="modelValue"
      :placeholder="placeholder"
      :multiple="multiple"
      :filterable="filterable"
      :method="getSupplierProductByApiFn"
      :fields="['productCode','productName']"
      :headers="['产品编码', '产品名称']"
      value-key="productCode"
      label-key="productName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
      class="w-full"
    >
    </advance-select>
    <!-- 小包 - 标准轨迹节点 -->
    <advance-select
      ref="advanceSelectRef"
      v-if="type === 'nodeDropdown'"
      v-model="modelValue"
      :placeholder="placeholder"
      :multiple="multiple"
      :filterable="filterable"
      :method="getNodeDropdownByApiFn"
      :fields="['nodeCode','nodeName']"
      :headers="['节点编码', '节点名称']"
      value-key="nodeCode"
      label-key="nodeName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
      class="w-full"
    >
    </advance-select>
  </div>
</template>
<script>
import AdvanceSelect from "./AdvanceSelect"
import {
	getProductSalesByApi,
	getAllChannelApi,
	getChargeTemplateListApi,
	getSupplierProductByApi,
	getNodeDropdownApi,
	getTraceChannelInfoApi
} from '@/api/uexpress/base'

export default {
	name: 'UexpressTypeSelect',
	components: { AdvanceSelect },
	props: {
		type: {
			type: String
		},
		value: {
			type: [String, Array]
		},
		// 远程请求
		method: { type: Function, default: null },
		// 检索
		filterable: { type: Boolean, default: false },
		// 不可编辑
		disabled: { type: Boolean, default: false },
		// 是否有清空按钮操作
		clearable: { type: Boolean, default: true },
		// 是否允许创建新条目进行选择
		allowCreate: { type: Boolean, default: false },
		// 是否多选
		multiple: { type: Boolean, default: false },
		placeholder: { type: String, default: '请输入关键词' },
		// 远程搜索间隔时间
		wait: { type: Number, default: 200 },
		// 要取来显示到select框内的字段名
		valueKey: { type: String, default: '' },
		labelKey: { type: String, default: 'id' },
		podLable: { type: String, default: 'code5' },
		// 固定的select的option
		fixedOptions: { type: Array, default: null },
		// 是否显示options 头部提示文字
		tips: { type: Boolean, default: true },
		// 回显
		defaultDisplay: { type: [String, Object, Array], default: '' },
		// termCode
		termCode: { type: String, default: '' },
		requestParams: {
			type: Object,
			default: function () {
				return {}
			}
		}
	},
	data() {
		return {
			modelValue: null
		}
	},
	created() {
		this.modelValue = this.value
	},
	watch: {
		value(newValue) {
			this.modelValue = newValue
		},
		modelValue(newValue) {
			this.$emit('input', newValue)
		}
	},
	methods: {
    fetchList() {
      this.$refs.advanceSelectRef.fetchList('')
    },
    clear() {
      this.$refs.advanceSelectRef.clear()
    },
		selectedFn(item) {
			this.$emit('selected', item)
		},
		getProductSalesByApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword,
				...this.requestParams
			}
			let fn = this.method || getProductSalesByApi
			return fn(data)
		},
		getSupplierProductByApiFn() {
			const data = {
				...this.requestParams
			}
			let fn = this.method || getSupplierProductByApi
			return fn(data)
		},
		getNodeDropdownByApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword,
				...this.requestParams
			}
			let fn = this.method || getNodeDropdownApi
			return fn(data)
		},
		getChannelListFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword,
				...this.requestParams
			}
			let fn = this.method || getAllChannelApi
			return fn(data)
		},
		getChargeTemplateListFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword,
				...this.requestParams
			}
			let fn = this.method || getChargeTemplateListApi
			return fn(data)
		},
		getTraceChannelInfoFN() {
			let fn = this.method || getTraceChannelInfoApi
			return fn()
		},
		clearChildOption() {
      this.$refs.advanceSelectRef.clearOption()
		}
	}
}
</script>
<style scoped lang="scss">
.item {
	float: left;
	flex: 1;
	padding: 0 5px;
}
</style>
