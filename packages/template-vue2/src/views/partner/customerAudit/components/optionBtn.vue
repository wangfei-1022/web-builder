<template>
	<div class="option-btn-wrap">
		<el-button type="text" size="mini" class="ml-10" @click="params.context.componentParent.detail(params.data)">
			{{ $t("customerManage.view") }}
		</el-button>
		<el-button v-if="params.data.status === 1" type="text" size="mini" class="ml-10" @click="params.context.componentParent.audit(params.data)">
			<span v-if="params.data.memberAuditStatus === 2">{{ $t("customerManage.openBusiness") }}</span>
      <span v-else>{{ $t("customerManage.audit") }}</span>
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

