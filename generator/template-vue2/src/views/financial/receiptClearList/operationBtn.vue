<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.viewFn(params.data)">
			{{$t('fmsReceiveClear.view')}}
		</el-button>
		<!--商务 && 未核销 && 非撤回-->
		<el-button v-if="params.data.role == 'BUSINESS' && (params.data.clearState == 1 || params.data.clearState == 2) && params.data.instructionState!== 3" type="text" size="mini" class="ml-10" @click="params.context.componentParent.clearFn(params.data)">
			{{$t('fmsReceiveClear.clear')}}
		</el-button>
		<!--商务 && 未核销 && 非撤回-->
		<el-button v-if="params.data.role == 'BUSINESS' && params.data.clearState == 1 && params.data.instructionState!== 3" type="text" size="mini" class="ml-10" @click="params.context.componentParent.applyClearCancelFn(params.data)">
			{{$t('fmsReceiveClear.recallApply')}}
		</el-button>
		<el-button v-if="params.data.role == 'BUSINESS' && params.data.clearState === 3" type="text" size="mini" class="ml-10" @click="params.context.componentParent.clearCancelFn(params.data)">
			{{$t('fmsReceiveClear.recallClear')}}
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

