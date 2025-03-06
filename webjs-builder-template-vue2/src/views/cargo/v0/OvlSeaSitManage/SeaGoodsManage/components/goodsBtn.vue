<template>
  <div class="edi-operation-button-in-aggrid">
     <el-button type="text" size="mini" v-if="params.data.state==0" @click="params.context.componentParent.edit('edit',params.data.id)" >
      {{$t('common.editBtn')}}
    </el-button>
     <el-button type="text" size="mini" class="fc-red" v-if="params.data.state==1" @click="params.context.componentParent.updateStatus(params.data.id,0)" >
      {{$t('common.disable')}}
    </el-button>
     <el-button type="text" size="mini" v-if="params.data.state==0" @click="params.context.componentParent.updateStatus(params.data.id,1)" >
      {{$t('common.enableBtn')}}
    </el-button>
    <el-button type="text" size="mini" v-if="params.data.state==1" @click="params.context.componentParent.edit('view',params.data.id)" >
      {{$t('common.viewBtn')}}
    </el-button>
    <el-button type="text" size="mini" v-if="params.data.state==1" @click="params.context.componentParent.printBarcode(params.data.id)">
      {{$t('goodsManagement.printBarcode')}}
    </el-button>
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
