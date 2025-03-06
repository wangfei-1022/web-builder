<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" @click="params.context.componentParent.edit(params.data)">
			{{$t("uexpressProduct.edit")}}
		</el-button>
    <el-button v-if="params.data.channelState == 2" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, false)">
			{{$t("uexpressProduct.disabled")}}
		</el-button>
    <el-button v-if="params.data.channelState == 3 || params.data.channelState == 1" type="text" size="mini" @click="params.context.componentParent.ableFn(params.data, true)">
			{{$t("uexpressProduct.enabled")}}
		</el-button>
	</div>
</template>
<script>
export default {
	name: "ChannelListOptionBtn",
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

