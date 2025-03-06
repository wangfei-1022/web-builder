<template>
	<el-select
		class="w-full groupSelect"
		v-bind="$attrs"
		v-on="$listeners"
		:remote-method="getCountry"
		filterable
		remote
		reserve-keyword
		:loading="loading"
		:placeholder="$t('logisticsCompany.please_enter_country')"
		size="mini"
		@change="selectChange"
	>
		<el-option-group
			class="groupSelect"
			v-for="group in options"
			:key="group.label"
			:label="group.label"
		>
			<el-option
				v-for="item in group.children"
				:key="item.code2"
				:label="item[labelKey]"
				:value="item[valueKey]"
			>
			</el-option>
		</el-option-group>
	</el-select>
</template>

<script>
import { getCountryApi } from '@/api/country.js'
export default {
	name: 'NationalGroupSelect',
	inheritAttrs: false,
	props: {
		valueKey: {
			type: String,
			default: 'code2'
		},
		labelKey: {
			type: String,
			default: 'chineseName'
		}
	},
	data() {
		return {
			loading: false,
			mapObj: {},
			frequent: [],
			latest: [],
			all: [],
			options: []
		}
	},
	created() {
		this.getCountry()
	},
	computed: {

	},
	methods: {
		async getCountry(keyword) {
			let res = await getCountryApi({ keyword })
			if (res.ok) {
				this.latest = res.content.latest || []
				this.frequent = res.content.frequent || []
				this.all = res.content.all || []
				// 存储map对象
				let map = {}
				this.latest.forEach(item => {
					map[item[this.valueKey]] = item
				})
				this.frequent.forEach(item => {
					map[item[this.valueKey]] = item
				})
				this.all.forEach(item => {
					map[item[this.valueKey]] = item
				})
				this.mapObj = map
				let options = [
					{
						label: '最近使用',
						children: res.content.latest || null
					},
					{
						label: '常用国家',
						children: res.content.frequent || null
					},
					{
						label: '国家',
						children: res.content.all || null
					}
				]
				options = options.filter(item => this.$isNotEmpty(item.children))
				this.options = options
			}
		},
		selectChange(val) {
			let selected = this.mapObj[val]
			this.$emit('selected', selected)
		}
	}
}
</script>
<style lang="scss" >
.el-select-dropdown__list {
	.groupSelect:not(:last-child) {
		.el-select-group {
			display: flex;
			flex-wrap: wrap;
			width: 450px;
		}
	}
}
</style>
