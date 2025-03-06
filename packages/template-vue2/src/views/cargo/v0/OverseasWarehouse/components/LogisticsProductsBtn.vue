<template>
	<div class="edi-operation-button-in-aggrid">
		<el-button	type="text" size="mini" @click="params.context.componentParent.edit(params.data.id, 1)">
      {{$t('logisticsProduct.view')}}
		</el-button>
		<el-button
      type="text"
      size="mini"
      @click="params.context.componentParent.edit(params.data.id,0)"
    >
      {{$t('common.editBtn')}}
    </el-button>
	</div>
</template>
<script>
export default {
	name: 'LogisticsProductsBtn',
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
