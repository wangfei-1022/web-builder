<template>
	<el-select class="w-full" filterable v-bind="$attrs" size="mini" v-on="$listeners" @change="selected">
		<el-option
			v-for="item in itemCodes"
			:key="item.code"
			:label="item.name"
			:value="item.code"
		>
		</el-option>
	</el-select>
</template>

<script>
import { getCustomItemSelectionsApi } from '@/api/codeManager'
export default {
	name: 'ItemCodeSelect',
	inheritAttrs: false,
	props: {
		parentCode: String
	},
	data() {
		return {
			itemCodes: [],
			itemCodeMap: {}
		}
	},
	methods: {
		selected(val) {
			this.$emit('selected', this.itemCodeMap[val])
		}

	},
	async created() {
		let res = await getCustomItemSelectionsApi({ parentCode: this.parentCode })
		if (res.ok) {
			this.itemCodes = res.content || []
			this.itemCodes.forEach(item => {
				this.itemCodeMap[item.code] = item
			})
		}
	}
}
</script>
