<template>
	<el-cascader
		v-model="modeValue"
		placeholder="请选择仓库"
		:options="options"
		class="w-full"
		:props="multiple?provinPropsMultiple:provinProps"
		size="mini"
    filterable
		@change="warehouseChange"
    @expand-change="expandChange"
		v-bind="$attrs"
		v-on="$listeners"
	/>
</template>

<script>
import { getWarehouseListApi } from '@/api/common'
import lodash from "lodash"
export default {
	name: 'StorageWarehouseSelect',
	inheritAttrs: false,
	props: {
		value: [String, Array],
		data: Object,
		filter: Function,
		multiple: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			modeValue: this.value,
			options: [],
			optionsMap: {},
			provinProps: {
				label: 'name',
				value: 'id',
				emitPath: false
			},
			provinPropsMultiple: {
				label: 'name',
				value: 'id',
				emitPath: false,
				multiple: true
			}
		}
	},
	created() {
		this.setWarehouseOptions()
	},
	watch: {
		value(val) {
			this.modeValue = val || ''
		}
	},
	methods: {
		/**
	 * 设置入库仓库
	 */
		setWarehouseOptions() {
			let query = this.$extends({}, this.data)
			query.status = 2
			getWarehouseListApi(query).then(res => {
				let list = res.content || []
				// 存在进一步过滤方法
				if (this.filter) {
					list = this.filter(list)
				}
				let options = []
				let optionsMap = {}
				const groupObj = lodash.groupBy(list, item => item.countryCode)
				Object.keys(groupObj).forEach(key => {
					const values = groupObj[key]
					let itemData = {
						id: key,
						name: values[0].countryName,
						children: values
					}
					options.push(itemData)
				})
				this.options = options
				list.forEach(item => {
					optionsMap[item.id] = item
				})
				this.optionsMap = optionsMap
			})
		},
		// aria-owns 点击多次会卡死页面
		expandChange() {
			this.$nextTick(() => {
				// 添加这段代码
				const $el = document.querySelectorAll('.el-cascader-panel .el-cascader-node[aria-owns]');
				Array.from($el).map(item => item.removeAttribute('aria-owns'));
			})
		},
		/**
		 * 选择变更事件
		 */
		warehouseChange(val) {
			let selectItem = null
			if (this.$isNotEmpty(val)) {
				if (this.multiple) {
					selectItem = {}
					val.forEach(item => {
						selectItem[item] = this.optionsMap[item]
					})
				} else {
					selectItem = this.optionsMap[val]
				}
			}
			this.$emit('selected', selectItem)
		}
	}
}
</script>

<style scoped lang="less">
</style>
