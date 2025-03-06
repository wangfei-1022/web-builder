<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.viewFn(params.data)">
			{{$t('fmsPayablePayment.view')}}
		</el-button>
		<el-button 
      type="text" 
      size="mini" 
      v-if="params.data.paymentState === 20 && params.data.role === 'BUSINESS'" 
      @click="params.context.componentParent.recallFn(params.data)"
    >
			{{$t('fmsPayablePayment.recall')}}
		</el-button>
    <!-- 催办 -->
		<el-button 
      type="text" 
      size="mini" 
      v-if="params.data.paymentState === 20 && params.data.role === 'BUSINESS'" 
      @click="params.context.componentParent.urgingFn(params.data)"
    >
			{{$t('fmsPayablePayment.urging')}}
		</el-button>
    <!-- 复制 -->
		<el-button 
      type="text" 
      size="mini" 
      v-if="(params.data.paymentState === 90 || params.data.paymentState === 91 || params.data.paymentState === 3) && params.data.role === 'BUSINESS'" 
      @click="params.context.componentParent.copyApplyFn(params.data)"
    >
			{{$t('fmsPayablePayment.copyApply')}}
		</el-button>
    <el-button type="text" size="mini" @click="params.context.componentParent.downloadFn(params.data)">
			{{$t('fmsPayablePayment.downloadUploadFile')}}
		</el-button>
    <!-- 待支付 -->
    <el-button
      type="text"
      size="mini"
      v-if="params.data.role === 'FINANCE' && (params.data.paymentState === 30 || params.data.paymentState === 40)"
      @click="params.context.componentParent.payFn(params.data)"
    >
			{{$t('fmsPayablePayment.pay')}}
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

