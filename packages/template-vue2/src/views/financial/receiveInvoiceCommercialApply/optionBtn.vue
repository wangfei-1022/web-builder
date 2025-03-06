<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.view(params.data)">
			{{$t('fmsReceiveInvoice.view')}}
		</el-button>
		<el-button type="text" size="mini" class="ml-10" v-if="(params.data.applyState == 1 || (params.data.applyState == 4 && params.data.invoiceState == 2)) && params.data.invoiceType != 3 && params.data.role =='FINANCE' " @click="params.context.componentParent.invoiceMake(params.data)">
			{{$t('fmsReceiveInvoice.to_invoice')}}
		</el-button>
		<el-button type="text" size="mini" class="ml-10" v-if="params.data.applyState == 1 && params.data.invoiceType != 3 && params.data.role =='FINANCE' " @click="params.context.componentParent.recall(params.data)">
			{{$t('fmsReceiveInvoice.recall')}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "OptionBtnApplyTax",
	data() {
		return {};
	},
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

