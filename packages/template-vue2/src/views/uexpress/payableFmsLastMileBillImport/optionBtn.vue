<template>
	<div class="option-btn-wrap">
		<el-button
			type="text"
			size="mini"
			class="ml-10"
      v-if="params.data.billImportState === 230 || params.data.billImportState === 290 || params.data.billImportState === 295"
			@click="params.context.componentParent.viewFn(params.data)"
		>
			{{ $t("uexpressFmsBill.viewDetail") }}
		</el-button>
    <el-button
			type="text"
			size="mini"
			class="ml-10"
      v-if="params.data.billImportState === 190"
			@click="params.context.componentParent.reImportFn(params.data)"
		>
			{{ $t("uexpressFmsBill.reImport") }}
		</el-button>
    <el-button
			type="text"
			size="mini"
			class="ml-10"
			@click="params.context.componentParent.downloadSourceFileFn(params.data)"
		>
			{{ $t("uexpressFmsBill.downloadSourceFile") }}
		</el-button>
    <el-button
			type="text"
			size="mini"
			class="ml-10"
      v-if="params.data.billImportState === 190"
			@click="params.context.componentParent.downloadResFileFn(params.data)"
		>
			{{ $t("uexpressFmsBill.downloadResFile") }}
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

