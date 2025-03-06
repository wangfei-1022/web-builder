<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.viewFn(params.data)">
			{{$t("uexpressClaim.view")}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "InsuranceClaimListOptionBtn",
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

