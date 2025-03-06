
<template>
	<div class="edi-operation-button-in-aggrid">
    <el-button v-permission="['ovl:cloud:warehouse:out:out']" type="text"	size="mini" @click="params.context.componentParent.update(params.data.id)">
      {{$t('common.updateBtn')}}
    </el-button>
    <el-button v-permission="['ovl:cloud:warehouse:out:out']" type="text"	size="mini" @click="params.context.componentParent.logisticsSingleNumberEnter(params.data.id,params.data.shipmentNo)">
      {{$t('outInStorageManage.logisticsSingleNumberEnter')}}
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
