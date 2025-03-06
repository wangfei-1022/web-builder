<template>
  <el-select
    size="mini"
    v-model="selectValue"
    style="width: 100%"
    :filterable="filterable"
    :clearable="clearable"
    :multiple="multiple"
    :collapse-tags="collapseTags"
    :disabled="disabled"
    :placeholder="placeholder"
    @change="changeFn">
    <el-option v-for="item in optionList" :key="item[valueKey]" :label="item[labelKey]" :value="item[valueKey]" />
  </el-select>
</template>

<script>
import { getDictDataApi, getProfitAppplyStateApi, getProfitAppplyTypeApi, getLockOrderStateApi } from "@/api/financial/base";

export default {
	name: "BaseSelect",
	props: {
		placeholder: {
			type: String,
			default: '请选择'
		},
		value: {
			type: [String, Number, Array],
			default: ''
		},
		type: {
			type: String,
			default: ''
		},
		params: {
			type: Object,
			default: function () {
				return {}
			}
		},
		collapseTags: {
			type: Boolean,
			default: false
		},
		filterable: {
			type: Boolean,
			default: false
		},
		clearable: {
			type: Boolean,
			default: false
		},
		multiple: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		addAll: {
			type: Boolean,
			default: false
		}
	},
	// 重置的时候需要 监听到
	watch: {
		value: {
			handler(val) {
				this.selectValue = val
			}
		}
	},
	data() {
		return {
			dictCode: null,
			selectValue: null,
			optionList: [],
			valueKey: 'code',
			labelKey: 'name'
		}
	},
	created() {
		this.selectValue = this.value
		this.init()
	},
	methods: {
		init() {
			let fn = null
			switch (this.type) {
				// 费用-账单状态
				case 'entryState':
					fn = getDictDataApi
					this.dictCode = 1
					break;
				// 费用确认单状态
				case 'confirmationState':
					fn = getDictDataApi
					this.dictCode = 5
					break;
				// 核销状态
				case 'clearState':
					fn = getDictDataApi
					this.dictCode = 4
					break;
				// 开票状态
				case 'invoiceState':
					fn = getDictDataApi
					this.dictCode = 3
					break;
				// 账单状态
				case 'billState':
					fn = getDictDataApi
					this.dictCode = 7
					break;
				// 申请核销状态
				case 'applyClearState':
					fn = getDictDataApi
					this.dictCode = 25
					break;
				// 申请开票状态
				case 'invoiceApplyState':
					fn = getDictDataApi
					this.dictCode = 2
					break;
				// 账户流水类型
				case 'accountLogType':
					fn = getDictDataApi
					this.dictCode = 32
					break;
				// 支出类型
				case 'payType':
					fn = getDictDataApi
					this.dictCode = 33
					break;
				// 账单推送状态
				case 'pushEmailState':
					fn = getDictDataApi
					this.dictCode = 31
					break;
				// 盈亏状态
				case 'profitState':
					fn = getDictDataApi
					this.dictCode = 9
					break;
				// 税率
				case 'invoiceTaxRate':
					fn = getDictDataApi
					this.dictCode = 6
					break;
				// 付款类型
				case 'paymentType':
					fn = getDictDataApi
					this.dictCode = 36
					break;
				// 付款状态
				case 'paymentState':
					fn = getDictDataApi
					this.dictCode = 37
					break;
				// 发票材质
				case 'invoiceMedium':
					fn = getDictDataApi
					this.dictCode = 13
					break;
				// 付款申请的审批状态
				case 'paymentApprovalState':
					fn = getDictDataApi
					this.dictCode = 45
					break;
				// 付款申请的申请类型
				case 'paymentApplyType':
					fn = getDictDataApi
					this.dictCode = 46
					break;
				// 付款申请的申请类型
				case 'profitApplyState':
					fn = getProfitAppplyStateApi
					break;
				// 付款申请的申请类型
				case 'profitApplyType':
					fn = getProfitAppplyTypeApi
					break;
				// 锁单状态
				case 'lockOrderState':
					fn = getLockOrderStateApi
					break;
				case 'localServicePaymentType': 
					fn = getDictDataApi
					this.dictCode = 47
					break;
				default:
					break;
			}
			if (fn) {
				let data = this.dictCode ? this.dictCode : this.params
				fn(data).then(res => {
					if (res.ok) {
						this.optionList = res.content
						if (this.addAll) {
							this.optionList.unshift({
								[this.valueKey]: '',
								[this.labelKey]: this.$t('common.ALL')
							})
						}
					}
				})
			}
		},
		changeFn() {
			this.$emit('input', this.selectValue)
			let item = {}
			this.optionList.forEach(v => {
				if (v[this.valueKey] === this.selectValue) {
					item = v
				}
			})
			this.$emit('selected', item)
		}
	}
}
</script>
