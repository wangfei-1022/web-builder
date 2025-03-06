<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.viewFn(params.data)">
			{{$t('uexpressFmsCharge.view')}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "OptionBtnCharge",
	data() {
		return {};
	},
	methods: {}
};
</script>
<style lang="scss" scoped>
.option-btn-wrap {
	span {
		cursor: pointer;
	}
}
</style>

