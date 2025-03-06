<template>
	<div class="option-btn-wrap">
    <el-button type="text" size="mini" @click="params.context.componentParent.viewFn(params.data)">
			{{$t("uexpressClaim.view")}}
		</el-button>
    <!--【已驳回】和【待客服审核】、【待产品审核】可以修改-->
    <!--params.data.claimState === 20 || params.data.claimState === 30 || -->
		<el-button type="text" size="mini"
      v-if="params.data.role !== 'FINANCE' && params.data.claimState === 90"
      @click="params.context.componentParent.editFn(params.data)">
			{{$t("uexpressClaim.edit")}}
		</el-button>
    <!--【待客服审核】【待产品审核】-->
    <el-button type="text" size="mini"
      v-if="params.data.role !== 'FINANCE' && (params.data.claimState === 20 || params.data.claimState === 30)"
      @click="params.context.componentParent.auditFn(params.data, false)">
      {{$t("uexpressClaim.audit")}}
		</el-button>
    <!--【待客服审核】、【待产品审核】且推送保险状态为【待推送】可以取消-->
    <el-button type="text" size="mini"
      v-if="params.data.role !== 'FINANCE' && (params.data.claimState === 20 || params.data.claimState === 30) && params.data.claimPushState === 10"
      @click="params.context.componentParent.cancelFn(params.data)">
      {{$t("uexpressClaim.cancel")}}
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

