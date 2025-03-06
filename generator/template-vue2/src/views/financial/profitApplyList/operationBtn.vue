<template>
	<div class="option-btn-wrap">
		<el-button 
      type="text" 
      size="mini" 
      v-if="!params.data.id || params.data.profitApplyState === 30"
      @click="params.context.componentParent.submitFn(params.data)">

			{{$t('fmsProfit.submit')}}
		</el-button>
		<el-button 
      type="text" 
      size="mini"
      v-if="params.data.id && params.data.profitApplyState === 10 && params.data.role === 'SETTLEMENT'"
      @click="params.context.componentParent.auditFn(params.data)"
    >
			{{$t('fmsProfit.audit')}}
		</el-button>
		<el-button 
      type="text" 
      size="mini"
      v-if="params.data.id"
      @click="params.context.componentParent.viewFn(params.data)"
    >
			{{$t('fmsProfit.view')}}
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

