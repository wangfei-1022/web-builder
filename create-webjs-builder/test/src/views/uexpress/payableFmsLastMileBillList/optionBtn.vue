<template>
	<div class="option-btn-wrap">
		<el-button
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.viewFn(params.data)"
		>
			{{ $t("uexpressFmsBill.view") }}
		</el-button>
    <el-button
			type="text"
			size="mini"
			class="ml-10"
      v-if="params.data.billState === 10"
			@click="params.context.componentParent.startFn(params.data)"
		>
			{{ $t("uexpressFmsBill.startFn") }}
		</el-button>
    <el-button
			type="text"
			size="mini"
			class="ml-10"
      v-if="params.data.billState === 20"
			@click="params.context.componentParent.confirmFn(params.data)"
		>
			{{ $t("uexpressFmsBill.confirmBill") }}
		</el-button>
    <el-button
			type="text"
			size="mini"
			class="ml-10"
      v-if="params.data.billState === 30"
			@click="params.context.componentParent.createBillFn(params.data)"
		>
			{{ $t("uexpressFmsBill.createBill") }}
		</el-button>
	</div>
</template>

<script>
export default {
	name: "UexpressBillLastMileImportOptionBtn",
	data() {
		return {

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

