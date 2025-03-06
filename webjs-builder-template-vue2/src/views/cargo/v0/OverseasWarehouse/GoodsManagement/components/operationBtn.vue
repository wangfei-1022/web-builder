<template>
  <div class="edi-operation-button-in-aggrid">
      <el-button type="text"  size="mini" @click="params.context.componentParent.edit(params.data.id,'1')" v-permission="['mem:goods:category:edit']">
        {{$t('common.editBtn')}}
      </el-button>
      <el-button  type="text" size="mini" class="fc-red"  @click="params.context.componentParent.del(params.data.id,params.data.level)" v-permission="['mem:goods:category:del']" >
        {{$t('common.deleteBtn')}}
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
