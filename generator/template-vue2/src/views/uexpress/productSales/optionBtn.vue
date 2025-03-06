<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.edit(params.data)">
			{{$t("uexpressProduct.edit")}}
		</el-button>
    <el-button v-if="params.data.productState == 1" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, true)">
			{{$t("uexpressProduct.publish")}}
		</el-button>
    <el-button v-if="params.data.productState == 2" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, false)">
			{{$t("uexpressProduct.disabled")}}
		</el-button>
    <el-button v-if="params.data.productState == 3" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, true)">
			{{$t("uexpressProduct.enabled")}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "ProductSalesOptionBtn",
	data() {
		return {};
	},
	created() {},
	beforeMount() {},
	methods: {}
};
</script>
<style lang="scss" scoped>

</style>

