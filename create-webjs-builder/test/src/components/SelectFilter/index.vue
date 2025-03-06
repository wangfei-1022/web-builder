<template>
	<el-select
		class="w-full"
		filterable
		:disabled="disabled"
		:filter-method="selectFilter"
		v-bind="$attrs"
		@visible-change="visibleChange"
		v-on="$listeners"
	>
		<el-option
			v-for="(item, index) in filteredOptions"
			:key="item[valueKey]"
			:label="item[nameKey]"
			:value="item[valueKey]"
		>
			<slot :option="item" :index="index" />
		</el-option>
	</el-select>
</template>

<script>
import { isString } from '@/utils/validate'
export default {
	name: 'SelectFilter',
	inheritAttrs: false,
	props: {
		disabled: {
			type: Boolean,
			required: false,
			default: false
		},
		nameKey: { // 显示名称对应的key
			type: String,
			required: true,
			default: 'name'
		},
		valueKey: { // 绑定值对应的key
			type: String,
			required: true,
			default: 'value'
		},
		options: Array,
		filterKeys: Array // 过滤的属性key
	},
	data() {
		return {
			filterText: ''
		}
	},
	computed: {
		filteredOptions() {
			const arr = this.options
			let filterText = this.filterText
			if (this.$isEmpty(filterText) || this.$isEmpty(this.filterKeys)) {
				return arr
			}
			filterText = filterText.toLowerCase()
			return arr.filter(item => {
				for (const key of this.filterKeys) {
					let value = item[key] + '' // 将值转换成字符串类型
					if (isString(value) && this.$isNotEmpty(value)) {
						value = value.toLowerCase()
						if (value.indexOf(filterText) > -1) {
							return true
						}
					}
					continue
				}
				return false
			})
		}
	},
	methods: {
		selectFilter(filterText) {
			this.filterText = filterText
		},
		visibleChange(val) {
			// 如果是隐藏，还原下拉搜索的数据为全部
			if (!val) {
				this.filterText = ''
			}
			this.$emit('visibleChange', val)
		}
	}
}
</script>
