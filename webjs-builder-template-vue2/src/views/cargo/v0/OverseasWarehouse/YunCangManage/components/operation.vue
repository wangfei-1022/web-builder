
<template>
	<div class="edi-operation-button-in-aggrid">
			<el-button
        v-permission="['ovl:cloud:warehouse:in:grounding']"
				type="text"
				size="mini"
				@click="
					params.context.componentParent.partialShelf(params.data.id)
				"
			>
				{{$t('putInStorageManage.partialShelf')}}
			</el-button>
			<el-button
        v-if="params.data.status === 12"
        v-permission="['ovl:cloud:warehouse:in:grounding']"
				type="text"
				size="mini"
				@click="
					params.context.componentParent.shelfCompleted(params.data.id)
				"
			>
				{{$t('putInStorageManage.shelfCompleted')}}
			</el-button>
	</div>
</template>
<script>
export default {
	name: 'OperationBtn',
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
.edi-operation-button-in-aggrid .el-button {
	padding: 0;
}
</style>
