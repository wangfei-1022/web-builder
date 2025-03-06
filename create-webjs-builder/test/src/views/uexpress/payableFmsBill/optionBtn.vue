<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.view(params.data)" v-if="false">
			{{$t('uexpressFmsBill.view')}}
		</el-button>
		<el-button type="text" size="mini" @click="params.context.componentParent.downloadBillFn(params.data)" >
			{{$t('uexpressFmsBill.downloadBill')}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "OptionBtnBill",
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

