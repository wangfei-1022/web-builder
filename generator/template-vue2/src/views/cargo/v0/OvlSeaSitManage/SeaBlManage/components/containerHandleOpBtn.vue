<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button type="text" size="mini" v-if="params.data.state==1" @click="params.context.componentParent.edit('edit',params.data.id)" >
      {{$t('common.editBtn')}}
    </el-button>
    <el-button type="text" size="mini" v-if="params.data.state==1" @click="params.context.componentParent.confirmData(params.data.id)" >
      {{$t('common.confirmBtns')}}
    </el-button>
    <el-button type="text" size="mini" v-if="params.data.state==2" @click="params.context.componentParent.edit('view',params.data.id)" >
      {{$t('common.viewBtn')}}
    </el-button>
    <el-button type="text" size="mini" class="fc-red" v-if="params.data.state==2" @click="params.context.componentParent.revocation(params.data.id)" >
      {{$t('seaBl.revocation')}}
    </el-button>
   <el-button type="text" size="mini" class="fc-red" v-if="params.data.state==1" @click="params.context.componentParent.deleteData(params.data.id)" >
      {{$t('common.deleteBtn')}}
    </el-button>
  </div>
</template>
<script>
export default {
	name: 'ContainerHandleOpBtn',
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
