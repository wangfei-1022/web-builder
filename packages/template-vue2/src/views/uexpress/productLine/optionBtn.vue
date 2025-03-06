<template>
	<div class="option-btn-wrap">
    <el-button type="text" size="mini" @click="params.context.componentParent.viewFn(params.data)">
			{{$t("uexpressProduct.view")}}
		</el-button>
		<el-button type="text" size="mini" @click="params.context.componentParent.addOrEditFn(params.data)">
			{{$t("uexpressProduct.edit")}}
		</el-button>
    <el-button v-if="params.data.productLineState == 2" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, false)">
			{{$t("uexpressProduct.disabled")}}
		</el-button>
    <el-button v-if="params.data.productLineState == 3 || params.data.productLineState == 1" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, true)">
			{{$t("uexpressProduct.enabled")}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "ProductLineOptionBtn",
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

