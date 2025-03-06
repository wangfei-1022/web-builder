<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button type="text" size="mini" @click="params.context.componentParent.edit(params.data)"> {{$t('ovlDivisionRate.adjustRate')}} </el-button>
  </div>
</template>
<script>
export default {
	name: 'OvlDivisionRateBtn',
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
