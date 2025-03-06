<template>
	<div class="option-btn-wrap">
		<el-button v-if="params.data.auditingStatus != 0" type="text" size="mini" class="ml-10" @click="detail(params.data)" v-permission="['mem:customer:view']">
			{{ $t("customerManage.view") }}
		</el-button>
		<el-button v-if="params.data.auditingStatus != 0" type="text" size="mini" class="ml-10" @click="edit(params.data)" v-permission="['mem:customer:update']">
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
		detail(item) {
			this.$router.push({
				name: "CRMCustomerDetail",
				query: {
					id: item.id
				}
			});
		},
		edit(item) {
			this.$router.push({
				name: "CRMCustomerEdit",
				query: {
					id: item.id
				}
			});
		}
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

