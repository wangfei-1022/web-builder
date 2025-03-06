<template>
<!-- 海外仓客户  -->
	<el-select
		v-model="selectVal"
		filterable
		clearable
		remote
		reserve-keyword
		placeholder="请选择客户"
		:remote-method="remoteMethod"
		:loading="loading"
		size="mini"
		@change="change"
		v-bind="$attrs"
		v-on="$listeners"
	>
		<el-option
			v-for="(item, index) in userList"
			:key="index"
			:label="item.chineseName"
			:value="item.id"
		/>
	</el-select>
</template>

<script>
import { getCustomerDropDownListApi } from '@/api/common'
export default {
	name: 'MemberList',
	inheritAttrs: false,
	props: {
		value: String,
		// 业务类型 默认海外仓
		businessType: {
			type: String,
			default: 'OVERSEAS_WAREHOUSE'
		}
	},
	data() {
		return {
			selectVal: this.value || null,
			loading: false,
			userList: []
		}
	},
	created() {

	},
	watch: {
		value(val) {
			this.selectVal = val || []
		}
	},
	methods: {
		/**
* 远程获取会员列表
*/
		async remoteMethod(query) {
			query = query.trim()
			this.loading = true
			const _params = {
				businessType: this.businessType,
				name: query
			}
			const res = await getCustomerDropDownListApi(_params)
			if (res.ok) {
				this.userList = res.content
				this.loading = false
			} else {
				this.$message({
					type: 'warning',
					message: this.$t('authorization.listEmpty')
				})
				this.loading = false
			}
		},
		change() {
			this.$emit('input', this.selectVal)
			let item = this.userList.find(item => item.id === this.selectVal)
			item = this.$isEmpty(item) ? {} : item
			this.$emit('getValueName', item.chineseName)
			this.$emit('selected', item)
		}
	}
}
</script>

<style scoped lang="scss">
</style>
