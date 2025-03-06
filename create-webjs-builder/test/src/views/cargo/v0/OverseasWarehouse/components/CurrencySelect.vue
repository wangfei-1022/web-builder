<template>
	<el-select
		class="w-full"
		filterable
		v-bind="$attrs"
		v-on="$listeners"
    @change="change"
    size="mini"
	>
    <el-option v-if="hasAll" :label="$t('common.all')" :value="null"></el-option>
		<el-option
			v-for="item in currencyList"
			:key="item.code"
			:label="item.name"
			:value="item.code"
		>
		</el-option>
	</el-select>
</template>

<script>
import { getCurrenciesListApi } from '@/api/common.js'
export default {
	name: 'CurrencySelect',
	inheritAttrs: false,
	props: {
		hasAll: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			currencyList: [],
			currencyMap: {}
		}
	},
	computed: {
	},
	created() {
		this.init()
	},
	methods: {
		async init() {
			let res = await getCurrenciesListApi()
			if (res.ok) {
				if (res.content) {
					res.content.forEach(item => {
						this.currencyMap[item.code] = item
					})
				}
				this.currencyList = res.content || []
			} else {
				this.currencyList = []
			}
		},
		// 选中变更
		change(val) {
			let data = this.$isEmpty(val) ? {} : this.currencyMap[val]
			this.$emit('selected', data)
		}
	}
}
</script>
