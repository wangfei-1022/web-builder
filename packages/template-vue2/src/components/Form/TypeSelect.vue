<template>
  <div>
    <!--行业术语检索-->
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'trade'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'airport'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'seaport'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
      :method="seaportListApiFn"
      :headers="['英文名称', '五字码', '中文名称']"
      :fields="['englishName', 'code5', 'chineseName']"
      value-key="code5"
      :label-key="podLable"
      @selected="selectedFn"
      :disabled="disabled"
      :tips="tips"
      :defaultDisplay="defaultDisplay"
      :clearable="clearable"
    >
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'railstation'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
      :method="railStationListApiFn"
      :headers="['中文名称', '英文名称']"
      :fields="['chineseName', 'englishName']"
      value-key="code"
      :label-key="'chineseName'"
      @selected="selectedFn"
      :disabled="disabled"
      :tips="tips"
      :defaultDisplay="defaultDisplay"
      :clearable="clearable"
    >
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'addSeaport'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'customer'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
      :method="customerListApiFn"
      :fields="['chineseName','shortName','englishName']"
      :headers="['中文名', '简称','英文名']"
      value-key="id"
      :label-key="customerLabel"
      @selected="selectedFn"
      :disabled="disabled"
      :defaultDisplay="defaultDisplay"
      :tips="tips"
      class="w-full"
      :clearable="clearable"
    >
    </advance-select>
    <!--供应商-->
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'supplier'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
      :clearable="clearable"
    >
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'airLine'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'shippingCompany'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'deliveryCompany'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'member'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'settlementCompany'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'businessFee'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
      :method="getFeeListApiFn"
      :value-key="valueKey || 'code'"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :fields="['code','chineseName']"
      :headers="['代码', '中文名']"
      :defaultDisplay="defaultDisplay"
    >
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'fmsFee'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
      :method="getFmsFeeListApiFn"
      value-key="code"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :fields="['code','chineseName']"
      :headers="['代码', '中文名']"
      :defaultDisplay="defaultDisplay"
    >
    </advance-select>
     <advance-select
      ref="advanceSelectRef"
      v-if="type == 'ovlProduct'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
      :method="getProductList"
      :value-key="productValue"
      label-key="productName"
      @selected="selectedFn"
      :disabled="disabled"
      :fields="['productName','productCode']"
      :headers="[$t('logisticsProduct.logistics_product_name'),$t('logisticsProduct.logistics_product_code')]"
      class="w-full"
      :defaultDisplay="defaultDisplay"
    >
    </advance-select>
     <advance-select
      ref="advanceSelectRef"
      v-if="type == 'operation'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
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
      </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'user'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
      :method="getUserDropDownListFun"
      value-key="id"
      label-key="chineseName"
      @selected="selectedFn"
      :disabled="disabled"
      :fields="['chineseName']"
      :headers="[]"
      clearable
      :tips='false'>
    </advance-select>
     <advance-select
      ref="advanceSelectRef"
      v-if="type == 'seaGoods'"
      v-model="modelValue"
      :multiple="multiple"
      :filterable="filterable"
      :method="seaGoodsApiFn"
      :fields="['skuCode','goodsCnName','goodsEnName']"
      :headers="['电商SKU编码','中文名', '英文名']"
      value-key="id"
      label-key="skuCode"
      @selected="selectedFn"
      :disabled="disabled"
      :tips="tips"
      :defaultDisplay="defaultDisplay"
    >
    </advance-select>
    <advance-select
      ref="advanceSelectRef"
      v-if="type == 'channel'"
      v-model="modelValue"
      :multiple="multiple"
      :method="getChannelListFn"
      :fields="['channelName','channelCode']"
      :headers="[$t('channel.channel_name'),$t('channel.channel_code')]"
      :value-key="channelKey"
      :label-key="channelLabel"
      @selected="selectedFn"
      :disabled="disabled"
      :tips="tips"
      :defaultDisplay="defaultDisplay"
    >
    </advance-select>
  </div>
</template>
<script>
import request from '@/utils/request'
import AdvanceSelect from "./AdvanceSelect"
import {
	seaportListApi, seaportAddListApi, airportListApi, getTerminologyListByTypeSearchApi, getMemberDropDownListApi,
	getCustomerDropDownListApi, getSupplierDropDownListApi, getSettlementCompanyListApi, getFeeListApi, getFmsFeeByKeyApi, airLineListApi, getAllOperationApi,
	getShippingCompanyListApi, getExpressDeliveryListApi,
    getRailStationListApi
} from '@/api/common'
import { getProductListApi } from '@/api/OverseasWarehouse/peakSeasonSurcharge'
import { getUserDropDownList } from "@/api/commonComponent";
import { getSeaGoodsListApi } from '@/api/OvlSeaSitManage/seaGoodsManage'
import { getChannelListApi } from '@/api/OverseasWarehouse/overseasWarehouseManager'

export default {
	name: 'Port',
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
		productValue: { type: String, default: 'productCode' },
		customerLabel: { type: String, default: 'chineseName' },
		// 固定的select的option
		fixedOptions: { type: Array, default: null },
		// 是否显示options 头部提示文字
		tips: { type: Boolean, default: true },
		// 回显
		defaultDisplay: { type: [String, Object, Array], default: '' },
		// termCode
		termCode: { type: String, default: '' },
		channelKey: { type: String, default: 'id' },
		channelLabel: { type: String, default: 'channelName' },
		requestParams: {
			type: Object,
			default: function () {
				return {}
			}
		},
		airportCodeOnly: {
			type: Boolean,
			default: false
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
		railStationListApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || getRailStationListApi
			return fn(data)
		},
		airportListApiFn(params) {
			const { keyword } = params
			const data = {}
			if (!this.airportCodeOnly) {
				data.keyword = keyword
			} else {
				data.code = keyword
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
				name: keyword,
				keyword: keyword
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
			return this.method ? fn() : fn(data)
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
		// 海外仓渠道
		getChannelListFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || getChannelListApi
			return fn(data)
		},
		getExpressDeliveryListApiFn(params) {
			const { keyword } = params
			const data = {
				keyword: keyword
			}
			let fn = this.method || getExpressDeliveryListApi
			return fn(data)
		},
		seaGoodsApiFn(params) {
			const { keyword } = params
			const data = {
				name: keyword,
				state: 1,
				...this.requestParams
			}
			let fn = this.method || getSeaGoodsListApi
			return fn(data)
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
