<template>
	<div class="option-btn-wrap">
		<el-button
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.view(params.data)"
		>
			{{ $t("uexpressFmsConfirmation.view") }}
		</el-button>
		<el-button
      v-if="params.data.role === 'FINANCE' && params.data.settlementMode !==1 && params.data.confirmationType === 1 && params.data.entryState === 1"
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.joinBill(params.data)"
		>
      {{$t('uexpressFmsConfirmation.joinBill')}}<!-- 加入账单 -->
		</el-button>
    <el-button
      v-if="params.data.role === 'FINANCE' && params.data.settlementMode !==1 && params.data.confirmationType === 1 && params.data.entryState === 2"
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.removeBillFn(params.data)"
		>
      {{$t('uexpressFmsConfirmation.removeBill')}}<!-- 移出账单 -->
		</el-button>
    <el-button
      v-if="params.data.role === 'FINANCE' && params.data.settlementMode !==1 && params.data.confirmationType === 1 && params.data.entryState === 1"
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.unallowBillFn(params.data)"
		>
			{{$t('uexpressFmsConfirmation.unallowBill')}}<!-- 不再入账 -->
		</el-button>
    <el-button
      v-if="params.data.role === 'FINANCE' && params.data.settlementMode !==1 && params.data.confirmationType === 1 && params.data.entryState === 10"
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.allowBillFn(params.data)"
		>
			{{$t('uexpressFmsConfirmation.allowBill')}}<!-- 恢复入账 -->
		</el-button>
    <el-button
      v-if="params.data.confirmationType === 1 && params.data.settlementMode !==1 && (params.data.role === 'PRODUCT' || params.data.role === 'OPERATOR') && ( params.data.entryState === 1)"
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.adjustChargeFn(params.data)"
		>
			{{$t('uexpressFmsConfirmation.adjustCharge')}}<!-- 调整费用 -->
		</el-button>
	</div>
</template>
<script>
// 1 待入账
// 2 已入账
// 3 部分入账
// 10 不再入账

export default {
	name: "UExpressOptionBtnConfirmation",
	data() {
		return {

		}
	},
	methods: {
		noBill() {

		},
		recoverBill() {

		}
	}
}
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

