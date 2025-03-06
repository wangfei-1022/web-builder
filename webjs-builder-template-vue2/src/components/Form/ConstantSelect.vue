<template>
	<el-select size="mini" v-bind="$attrs" v-on="$listeners">
		<el-option :label="$t('common.all')" :value="null" v-if="isHasAll" />
		<el-option v-for="(item, index) in options" :key="index" :label="item[labelKey]" :value="item[valueKey]"></el-option>
	</el-select>

</template>
<script>
import request from '@/utils/request'
export default {
	name: 'ConstantSelect',
	inheritAttrs: false,
	props: {
		url: {
			type: String,
			required: true
		},
		isHasAll: {
			type: Boolean,
			default: true
		},
		labelKey: {
			type: String,
			default: 'name'
		},
		valueKey: {
			type: String,
			default: 'code'
		}

	},
	data() {
		return {
			options: []
		}
	},
	created() {
		this.fetchList()
	},
	methods: {
		fetchList() {
			request({
				url: this.url,
				method: 'get'
			}).then(res => {
				let arr = []
				if (res.content.list === undefined) {
					arr = res.content || []
				} else {
					arr = res.content.list || []
				}
				this.options = arr
			})
		}
	}
}
</script>
<style scoped lang="scss">
</style>
