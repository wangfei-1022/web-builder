<template>
  <div class="edi-operation-button-in-aggrid">
    <div v-if="params.data.goodsStatus===2">
      <el-button type="text" size="mini"  @click="params.context.componentParent.edit(params.data.id,'0')">
        {{$t('common.auditBtn')}}
      </el-button>
    </div>
    <div v-else>
      <el-button type="text" size="mini" @click="params.context.componentParent.edit(params.data.id,'2')" >
        {{$t('common.editBtn')}}
      </el-button>
      <el-button type="text" size="mini" @click="params.context.componentParent.edit(params.data.id,'1')" >
        {{$t('common.viewBtn')}}
      </el-button>
      <el-button type="text" size="mini" @click="params.context.componentParent.printBarcode(params.data.id)">
       {{$t('goodsManagement.printBarcode')}}
      </el-button>
    </div>

  </div>
</template>
<script>
export default {
	name: 'GoodsBtn',
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
