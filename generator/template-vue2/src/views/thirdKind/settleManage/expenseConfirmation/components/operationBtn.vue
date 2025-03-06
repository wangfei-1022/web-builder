<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button type="text" size="mini" @click="params.context.componentParent.detail('view',params.data.id)">
      {{$t('warehouse.view')}}
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
