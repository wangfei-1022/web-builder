<template>
  <div class="edi-operation-button-in-aggrid">
     <el-button type="text" size="mini" v-if="params.data.blState==1||params.data.blState==2" @click="params.context.componentParent.edit('edit',params.data.id)" >
      {{$t('common.editBtn')}}
    </el-button>
     <el-button type="text" size="mini" v-if="params.data.blState==1" @click="params.context.componentParent.exportBox(params.data)" >
      {{$t('seaBl.uploadFile')}}
    </el-button>
     <el-button type="text" size="mini" v-if="params.data.blState==1||params.data.blState==2" @click="params.context.componentParent.submitData(params.data.id)" >
      {{$t('common.submitBtn')}}
    </el-button>
    <el-button type="text" size="mini" v-if="params.data.blState!=1" @click="params.context.componentParent.edit('view',params.data.id)" >
      {{$t('common.viewBtn')}}
    </el-button>
    <el-button type="text" size="mini" class="fc-red" v-if="params.data.blState==5" @click="params.context.componentParent.revocation(params.data.id)" >
      {{$t('seaBl.revocation')}}
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
