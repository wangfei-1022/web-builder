<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.viewFn(params.data)">
			{{$t('uexpressFmsCharge.view')}}
		</el-button>
    <el-button type="text" size="mini" v-if="params.data.billOrderState === 10" @click="params.context.componentParent.adjustFn(params.data)" >
			{{$t('uexpressFmsCharge.adjust')}}
		</el-button>
		<el-button type="text" size="mini" v-if="params.data.billOrderState === 10 && params.data.billName" @click="params.context.componentParent.confirmFn(params.data)" >
			{{$t('uexpressFmsCharge.confirm')}}
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

