<template>
  <div class="edi-operation-button-in-aggrid">
    <el-button type="text" size="mini" @click="params.context.componentParent.edit(params.data.id,2)"> {{$t('channel.edit')}} </el-button>
    <el-button type="text" size="mini" @click="params.context.componentParent.edit(params.data.id,1)"> {{$t('channel.view')}} </el-button>
    <!-- <el-button type="text" size="mini" class="fc-red" @click="params.context.componentParent.del(params.data.id,false)">{{$t('common.deleteBtn')}}</el-button> -->
  </div>
</template>
<script>
export default {
	name: 'ChannelBtn',
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
