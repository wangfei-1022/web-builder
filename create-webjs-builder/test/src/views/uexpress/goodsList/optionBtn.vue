<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.addOrEditFn(params.data)">
			{{$t('uexpressGoodsList.edit')}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "UExpressGoodsListOptionBtn",
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

