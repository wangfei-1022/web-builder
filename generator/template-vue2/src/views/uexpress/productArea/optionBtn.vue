<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.edit(params.data)">
			{{$t("uexpressProduct.edit")}}
		</el-button>
    <el-button type="text" size="mini" @click="params.context.componentParent.importAreaDetailFn(params.data)">
			{{$t("uexpressProduct.importAreaDetail")}}
		</el-button>
    <el-button v-if="params.data.areaState == 2" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, false)">
			{{$t("uexpressProduct.disabled")}}
		</el-button>
    <el-button v-if="params.data.areaState == 3 || params.data.areaState == 1" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, true)">
			{{$t("uexpressProduct.enabled")}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "ProductAreaOptionBtn",
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

