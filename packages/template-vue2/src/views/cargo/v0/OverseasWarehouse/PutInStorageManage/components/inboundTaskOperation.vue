<template>
	<div class="edi-operation-button-in-aggrid">
		<el-button type="text" size="mini" @click="detail('view',params.data.id)">{{ $t("common.viewBtn") }}	</el-button>
		<el-button type="text" size="mini" v-if="params.data.orderStatus === 1" @click="detail('confirm',params.data.id)">{{ $t("common.confirmBtns") }}	</el-button>
		<el-button type="text" class="fc-red" size="mini"  v-if="params.data.orderStatus === 5"  @click="detail('cancel',params.data.id)">{{ $t("putInStorageManage.cancelHandler") }}</el-button>
    <el-button type="text" size="mini" v-if="params.data.abnormalFlag" @click="params.context.componentParent.recall(params.data.id)">{{ $t("putInStorageManage.recall") }}</el-button>
	</div>
</template>
<script>
export default {
	name: 'InboundTaskOperation',
	data() {
		return {
		}
	},
	beforeMount() {
	},
	methods: {
		detail(operate, id) {
			this.$router.push({ name: 'InboundTaskDetail', query: { operate, id } })
		}
	}
}
</script>
<style>
.edi-operation-button-in-aggrid .el-button {
	padding: 0;
}
</style>
