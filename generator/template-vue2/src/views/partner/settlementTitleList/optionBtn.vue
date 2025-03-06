<template>
	<div class="option-btn-wrap">

		<el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.editFn(params.data)" >
			{{ $t("customerManage.edit") }}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "OptionBtn",
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

