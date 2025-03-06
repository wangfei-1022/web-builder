<template>
	<div class="option-btn-wrap">
		<el-button
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.view(params.data)"
      v-permission="['fms:receive:confirmation:view']"
		>
			{{ $t("receiveFms.view") }}
		</el-button>
		<el-button
			v-if="params.data.confirmationState == 1"
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.confirmCharge(params.data)"
      v-permission="['fms:receive:confirmation:confirm']"
		>
			{{ $t("receiveFms.charge_confirm") }}
		</el-button>
    <el-button
			v-if="params.data.invoiceApplyState  === 1 &&
            params.data.instructionState  === 1 &&
            params.data.confirmationState  === 2 &&
            params.data.profitState === 1 &&
            ((params.data.businessType === 'OVERSEAS_WAREHOUSE' && params.data.entityType === 1614) || params.data.businessType !== 'OVERSEAS_WAREHOUSE')"
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.recallConfirmCharge(params.data)"
      v-permission="['fms:receive:confirmation:confirm']"
		>
			{{ $t("receiveFms.recall_charge_confirm") }}
		</el-button>
	</div>
</template>
<script>
// 1 待入账
// 2 已入账
// 3 部分入账
// 10 不再入账

export default {
	name: "OptionBtnConfirmation",
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

