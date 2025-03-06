<template>
	<div class="option-btn-wrap">
		<el-button 
      type="text" 
      size="mini" 
      v-if="params.data.lockOrderState === 50"
      @click="params.context.componentParent.unlockFn(params.data)">

			{{$t('fmsLock.unlock')}}
		</el-button>
		<el-button 
      type="text" 
      size="mini"
      v-if="params.data.lockOrderState === 40"
      @click="params.context.componentParent.lockFn(params.data)"
    >
			{{$t('fmsLock.lock')}}
		</el-button>
		<el-button 
      type="text" 
      size="mini"
      @click="params.context.componentParent.viewFn(params.data)"
    >
			{{$t('fmsLock.view')}}
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

