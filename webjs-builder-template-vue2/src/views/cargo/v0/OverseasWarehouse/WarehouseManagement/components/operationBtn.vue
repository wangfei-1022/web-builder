<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button
      type="text"
      size="mini"
      @click="params.context.componentParent.edit(params.data.id,'2')"
    >
      {{$t('warehouse.view')}}
    </el-button>
    <el-button
      type="text"
      size="mini"
      @click="params.context.componentParent.edit(params.data.id,'1')"
    >
      {{$t('warehouse.edit')}}
    </el-button>
    <el-button
      v-if="params.data.statu === 2"
      type="text"
      size="mini"
      class="fc-red"
      @click="params.context.componentParent.updateStatus(params.data.id,1)"
    >
      {{$t('warehouse.statusType.LOSE_EFFICACY')}}
    </el-button>
    <el-button
      v-if="params.data.status === 1"
      type="text"
      size="mini"
      @click="params.context.componentParent.updateStatus(params.data.id,2)"
    >
      {{$t('warehouse.statusType.EFFECTIVE')}}
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
