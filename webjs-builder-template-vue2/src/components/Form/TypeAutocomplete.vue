<template>
  <div>
    <!--行业术语检索-->
    <advance-autocomplete
      v-if="type == 'trade'"
      v-model="modelValue"
      :multiple="multiple"
      :method="termListApiFn"
      :fields="['chineseName','englishName']"
      :headers="['中文名', '英文名']"
      value-key="englishName"
      label-key="englishName"
      @selected="selectedFn"
      :disabled="disabled"
      :tips="tips"
      :defaultDisplay="defaultDisplay"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'airport'"
      v-model="modelValue"
      :multiple="multiple"
      :method="airportListApiFn"
      :headers="['英文名称', '三字码', '中文名称']"
      :fields="['englishName', 'code3', 'chineseName']"
      value-key="code3"
      label-key="code3"
      @selected="selectedFn"
      :disabled="disabled"
      :tips="tips"
      :defaultDisplay="defaultDisplay"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'seaport'"
      v-model="modelValue"
      :multiple="multiple"
      :method="seaportListApiFn"
      :headers="['英文名称', '五字码', '中文名称']"
      :fields="['englishName', 'code5', 'chineseName']"
      value-key="code5"
      label-key="code5"
      @selected="selectedFn"
      :disabled="disabled"
      :tips="tips"
      :defaultDisplay="defaultDisplay"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'addSeaport'"
      v-model="modelValue"
      :multiple="multiple"
      :method="seaportAddListApiFn"
      :headers="['英文名称', '五字码', '中文名称','是否已添加']"
      :fields="[]"
      value-key="id"
      label-key="code5"
      disabled-key="checked"
      @selected="selectedFn"
      :disabled="disabled"
      :tips="tips"
      :defaultDisplay="defaultDisplay"
    >
      <template slot="option" slot-scope="{row}">
        <div v-for="(field) in ['englishName', 'code5', 'chineseName','checked']" :key="field" class="item">
          <span v-if="field == 'checked'">
            <i class="iconfont icon-checkmark-outline" v-if="row[field]"></i>
          </span>
          <span v-else>{{row[field]}}</span>
        </div>
      </template>
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'customer'"
      v-model="modelValue"
      :multiple="multiple"
      :method="customerListApiFn"
      :fields="['chineseName','englishName']"
      :headers="['中文名', '英文名']"
      value-key="id"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
      class="w-full"
    >
    </advance-autocomplete>
    <!--供应商-->
    <advance-autocomplete
      v-if="type == 'supplier'"
      v-model="modelValue"
      :multiple="multiple"
      :method="supplierListApiFn"
      :fields="['chineseName','englishName']"
      :headers="['中文名', '英文名']"
      value-key="id"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
      class="w-full"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'airLine'"
      v-model="modelValue"
      :multiple="multiple"
      :method="airLineListApiFn"
      :fields="['chineseName','englishName']"
      :headers="['中文名', '英文名']"
      value-key="id"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'shippingCompany'"
      v-model="modelValue"
      :multiple="multiple"
      :method="getShippingCompanyListApiFn"
      :fields="['chineseName','englishName']"
      :headers="['中文名', '英文名']"
      value-key="id"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'deliveryCompany'"
      v-model="modelValue"
      :multiple="multiple"
      :method="getExpressDeliveryListApiFn"
      :fields="['chineseName','englishName']"
      :headers="['中文名', '英文名']"
      value-key="id"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'member'"
      v-model="modelValue"
      :multiple="multiple"
      :method="memberListApiFn"
      :fields="['chineseName','englishName']"
      :headers="['中文名', '英文名']"
      value-key="id"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'settlementCompany'"
      v-model="modelValue"
      :multiple="multiple"
      :method="settlementCompanyApiFn"
      :fields="['settlementCompanyName','englishName']"
      :headers="['中文名', '英文名']"
      value-key="settlementCompanyId"
      label-key="settlementCompanyName"
      @selected="selectedFn"
      :disabled="disabled"
      :tips="tips"
      :defaultDisplay="defaultDisplay"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'businessFee'"
      v-model="modelValue"
      :multiple="multiple"
      :method="getFeeListApiFn"
      :value-key="valueKey || 'code'"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :fields="['code','chineseName']"
      :headers="['代码', '中文名']"
      :defaultDisplay="defaultDisplay"
    >
    </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'fmsFee'"
      v-model="modelValue"
      :multiple="multiple"
      :method="getFmsFeeListApiFn"
      value-key="code"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :fields="['code','chineseName']"
      :headers="['代码', '中文名']"
      :defaultDisplay="defaultDisplay"
    >
    </advance-autocomplete>
     <advance-autocomplete
      v-if="type == 'ovlProduct'"
      v-model="modelValue"
      :multiple="multiple"
      :method="getProductList"
      value-key="productCode"
      label-key="productName"
      @selected="selectedFn"
      :disabled="disabled"
      :fields="['productName','productCode']"
      :headers="[$t('logisticsProduct.logistics_product_name'),$t('logisticsProduct.logistics_product_code')]"
      class="w-full"
      :defaultDisplay="defaultDisplay"
    >
    </advance-autocomplete>
     <advance-autocomplete
      v-if="type == 'operation'"
      v-model="modelValue"
      :multiple="multiple"
      :method="getAllOperationApiFn"
      value-key="id"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :fields="['chineseName']"
      :headers="[]"
      clearable
      :defaultDisplay="defaultDisplay"
      :tips='false'>
      </advance-autocomplete>
    <advance-autocomplete
      v-if="type == 'user'"
      v-model="modelValue"
      :multiple="multiple"
      :method="getUserDropDownListFun"
      value-key="id"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :fields="['chineseName']"
      :headers="[]"
      clearable
      :tips='false'>
    </advance-autocomplete>
  </div>
</template>
<script>
import request from '@/utils/request'
import AdvanceAutocomplete from "./AdvanceAutocomplete"
import {
	seaportListApi, seaportAddListApi, airportListApi, getTerminologyListByTypeSearchApi, getMemberDropDownListApi,
	getCustomerDropDownListApi, getSupplierDropDownListApi, getSettlementCompanyListApi, getFeeListApi, getFmsFeeByKeyApi, airLineListApi, getAllOperationApi,
	getShippingCompanyListApi, getExpressDeliveryListApi
} from '@/api/common'
import { getProductListApi } from '@/api/OverseasWarehouse/peakSeasonSurcharge'
import { getUserDropDownList } from "@/api/commonComponent";

export default {
	name: 'Port',
	components: { AdvanceAutocomplete },
	props: {
		type: {
			type: String
		},
		value: {
			type: [String, Array]
		},
		// 远程请求
		method: { type: Function, default: null },
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
		// 固定的select的option
		fixedOptions: { type: Array, default: null },
		// 是否显示options 头部提示文字
		tips: { type: Boolean, default: true },
		// 是否显示options 头部提示文字
		defaultDisplay: { type: String, default: '' },
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
		selectedFn(item) {
			this.$emit('selected', item)
		},
		seaportAddListApiFn(params) {
			return seaportAddListApi(params)
		},
		seaportListApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || seaportListApi
			return fn(data)
		},
		airportListApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || airportListApi
			return fn(data)
		},
		termListApiFn(params) {
			if (!this.termCode) {
				return
			}
			const { keyword } = params
			const data = {
				keyword: keyword,
				termCode: this.termCode
			}
			let fn = this.method || getTerminologyListByTypeSearchApi
			return fn(data)
		},
		customerListApiFn(params) {
			const { keyword } = params
			const data = {
				name: keyword,
        ...this.requestParams
			}
			let fn = this.method || getCustomerDropDownListApi
			return fn(data)
		},
		supplierListApiFn(params) {
			const { keyword } = params
			const data = {
				name: keyword,
        ...this.requestParams
			}
			let fn = this.method || getSupplierDropDownListApi
			return fn(data)
		},
		airLineListApiFn(params) {
			const { keyword } = params
			const data = {
				name: keyword
			}
			let fn = this.method || airLineListApi
			return fn(data)
		},
		memberListApiFn(params) {
			const { keyword } = params
			const data = {
				name: keyword,
				auditingStatus: 2
			}
			let fn = this.method || getMemberDropDownListApi
			return fn(data)
		},
		settlementCompanyApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword,
				...this.requestParams
			}
			let fn = this.method || getSettlementCompanyListApi
			return fn(data)
		},
		getFeeListApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword,
				...this.requestParams
			}
			let fn = this.method || getFeeListApi
			return fn(data)
		},
		getFmsFeeListApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || getFmsFeeByKeyApi
			return fn(data)
		},
		/**
		* 模糊查询列表
		*/
		getProductList({ keyword }) {
			return getProductListApi(keyword)
		},
		getAllOperationApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || getAllOperationApi
			return fn(data)
		},
		getUserDropDownListFun(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || getUserDropDownList
			return fn(data)
		},
		getShippingCompanyListApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || getShippingCompanyListApi
			return fn(data)
		},
		getExpressDeliveryListApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || getExpressDeliveryListApi
			return fn(data)
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
