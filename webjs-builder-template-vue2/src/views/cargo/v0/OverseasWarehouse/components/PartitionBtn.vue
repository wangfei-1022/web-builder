<template>
	<div class="edi-operation-button-in-aggrid">
		<el-button
			v-if="params.data.importStatus != 1"
			type="text"
			size="mini"
			@click="params.context.componentParent.edit(params.data.id, true)"
		>
			{{$t('partition.view')}}
		</el-button>
		<el-button
			v-if="params.data.importStatus != 1 || resetEdit(params.data)"
			type="text"
			size="mini"
			@click="params.context.componentParent.edit(params.data.id, false)"
		>
      {{$t('partition.edit')}}
		</el-button>
		<el-button
			v-if="params.data.importStatus != 1 || resetEdit(params.data)"
			type="text"
			size="mini"
      class="fc-red"
			@click="params.context.componentParent.del(params.data.id, false)"
		>
      {{$t('common.deleteBtn')}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: 'PartitionBtn',
	data() {
		return {

		}
	},
	beforeMount() {
	},
	methods: {
		resetEdit(row) {
			// 状态卡在解析中 10分钟后可以重新编辑
			let time = new Date().getTime()
			let importTime = Number(row.importTime) + 10 * 60 * 1000
			return time > importTime && row.importStatus === 1
		}
	}
}
</script>
<style>
.edi-operation-button-in-aggrid .el-button {
	padding: 0;
}
</style>
