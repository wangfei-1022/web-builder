<template>
	<div>
		<el-button type="text" size="mini" @click="params.context.componentParent.edit(params.data.id)" >{{ $t("common.editBtn") }}</el-button>
		<el-button type="text" class="ml-10 fc-red" size="mini" @click="params.context.componentParent.del(params.data.id)">{{ $t("common.deleteBtn") }}</el-button>
	</div>
</template>
<script>
export default {
	name: 'CustomerOpearationBtn',
	data() {
		return {

		}
	},
	beforeMount() {
	},
	methods: {

	}
}
</script>
<style>
</style>
