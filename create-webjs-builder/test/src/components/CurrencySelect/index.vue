<template>
	<el-select class="w-full" filterable v-bind="$attrs" v-on="$listeners" @change="currencyChange" size="mini" >
		<el-option	v-for="item in options"	:key="item.code" :label="item.name"	:value="item.code"	/>
	</el-select>
</template>
<script>
import { getCurrenciesListApi, getCurrenciesApi } from '@/api/common'
export default {
	name: 'CurrencySelect',
	inheritAttrs: false,
	props: {
		// 1 name ==code 2name!=code
		type: {
			type: Number,
			default: 1
		}

	},
	data() {
		return {
			optionMap: {},
			options: []
		}
	},
	async created() {
		let fn = this.type === 1 ? getCurrenciesListApi : getCurrenciesApi
		let res = await fn()
		if (res.ok) {
			this.options = res.content || []
			let optionMap = {}
			this.options.forEach(item => {
				optionMap[item.code] = item.name
			})
			this.optionMap = optionMap
		}
	},

	methods: {
		currencyChange(val) {
			let selected = this.optionMap[val]
			this.$emit('selected', selected)
		}
	}
}
</script>
