<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.editFn(params.data)">
			{{$t("uexpressProduct.edit")}}
		</el-button>
    <el-button v-if="params.data.productState == 2" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, false)">
      {{$t("uexpressProduct.disabled")}}
		</el-button>
    <el-button v-if="params.data.productState == 1 || params.data.productState == 3" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, true)">
      {{$t("uexpressProduct.enabled")}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "SupplierProductSupplyOptionBtn",
	data() {
		return {};
	},
	created() {},
	beforeMount() {},
	methods: {

	}
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

