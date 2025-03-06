<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.editFn(params.data)">
			{{$t("uexpressPriceCard.update")}}
		</el-button>
    <el-button v-if="params.data.templateState === 1 || params.data.templateState === 3" type="text" size="mini" @click="params.context.componentParent.enabledFn(params.data)">
			{{$t("uexpressPriceCard.enabled")}}
		</el-button>
    <el-button v-if="params.data.templateState === 2" type="text" size="mini" @click="params.context.componentParent.disabledFn(params.data)">
			{{$t("uexpressPriceCard.disabled")}}
		</el-button>
    <el-button type="text" size="mini" @click="params.context.componentParent.viewFn(params.data)">
			{{$t("uexpressPriceCard.view")}}
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

