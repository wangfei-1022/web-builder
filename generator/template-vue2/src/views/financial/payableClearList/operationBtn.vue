<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.viewFn(params.data)">
			{{$t('fmsPayableClear.view')}}
		</el-button>
		<el-button type="text" size="mini" @click="params.context.componentParent.downloadFn(params.data)">
			{{$t('fmsPayableClear.download')}}
		</el-button>
		<!--商务 && 未核销 && 非撤回-->
		<el-button v-if="params.data.role == 'BUSINESS' && (params.data.clearState === 1 || params.data.clearState == 2) && params.data.instructionState === 30" type="text" size="mini" @click="params.context.componentParent.clearFn(params.data)">
			{{$t('fmsPayableClear.clear')}}
		</el-button>
		<!--商务 && 未核销 && 非撤回 财务商务撤回核销申请-->
		<el-button v-if="params.data.role == 'BUSINESS' && params.data.clearState === 1 && params.data.instructionState === 30" type="text" size="mini" @click="params.context.componentParent.applyClearCancelFn(params.data)">
			{{$t('fmsPayableClear.recallApply')}}
		</el-button>
		<!--申请人撤回-->
		<el-button v-if="params.data.role == 'OPERATOR' && params.data.instructionState === 20" type="text" size="mini" @click="params.context.componentParent.recallFn(params.data)">
			{{$t('fmsPayableClear.recallApply')}}
		</el-button>
		<!--申请人催办-->
		<el-button v-if="params.data.role == 'OPERATOR' && params.data.instructionState === 20" type="text" size="mini" @click="params.context.componentParent.urgingFn(params.data)">
			{{$t('fmsPayableClear.urging')}}
		</el-button>
		<el-button v-if="params.data.role == 'BUSINESS' && params.data.clearState === 3" type="text" size="mini" @click="params.context.componentParent.clearCancelFn(params.data)">
			{{$t('fmsPayableClear.recallClear')}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "OptionBtn",
	data() {
		return {};
	},
	created() {},
	beforeMount() {},
	methods: {}
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

