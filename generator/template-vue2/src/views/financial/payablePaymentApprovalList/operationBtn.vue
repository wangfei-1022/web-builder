<template>
	<div class="option-btn-wrap">
    <el-button type="text" size="mini" v-if="params.data.approvalType === 50" @click="params.context.componentParent.approvalFn(params.data)">
			{{$t('fmsPayablePayment.approval')}}
		</el-button>
		<el-button type="text" size="mini" v-if="params.data.approvalType !== 50" @click="params.context.componentParent.viewFn(params.data)">
			{{$t('fmsPayablePayment.view')}}
		</el-button>
    <el-button type="text" size="mini" @click="params.context.componentParent.downloadFn(params.data)">
			{{$t('fmsPayablePayment.download')}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "OptionBtn",
	data() {
		return {};
	}
};
</script>
<style lang="scss" scoped>

</style>

